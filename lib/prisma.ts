import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

/**
 * Retry wrapper for Prisma operations to handle Neon database sleep/wake cycles
 * Automatically retries failed database operations with exponential backoff
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  let lastError: Error | undefined

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error: any) {
      lastError = error

      // Check if this is a connection error that should be retried
      const isConnectionError =
        error?.code === 'P1001' || // Can't reach database server
        error?.message?.includes("Can't reach database server") ||
        error?.message?.includes('timed out') ||
        error?.message?.includes('ECONNREFUSED')

      // Don't retry non-connection errors
      if (!isConnectionError) {
        throw error
      }

      // Don't retry if this was the last attempt
      if (attempt === maxRetries - 1) {
        break
      }

      // Calculate delay with exponential backoff
      const delay = baseDelay * Math.pow(2, attempt)
      console.warn(
        `Database connection failed (attempt ${attempt + 1}/${maxRetries}). ` +
        `Retrying in ${delay}ms... Error: ${error.message}`
      )

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  // All retries failed
  throw new Error(
    `Database operation failed after ${maxRetries} attempts. ` +
    `This may be due to the Neon free tier database sleeping. ` +
    `Last error: ${lastError?.message || 'Unknown error'}`
  )
}
