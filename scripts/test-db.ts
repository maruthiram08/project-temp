
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    try {
        console.log('Testing RawTweet query...')
        const tweets = await prisma.rawTweet.findMany({ take: 1 })
        console.log('Success!', tweets)
    } catch (e) {
        console.error('Error querying RawTweet:', e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
