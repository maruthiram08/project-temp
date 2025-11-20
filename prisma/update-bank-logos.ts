/**
 * Update Bank Logos
 * Run with: npx tsx prisma/update-bank-logos.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🔄 Updating bank logos...\n')

    const updates = [
        // AU Small Finance Bank
        {
            slug: 'au-small-finance-bank',
            logo: '/assets/Icons/au.png'
        },
        // Axis Bank
        {
            slug: 'axis-bank',
            logo: '/assets/Icons/axis-new.png'
        },
        // Bank of Baroda
        {
            slug: 'bank-of-baroda',
            logo: '/assets/Icons/bob-new.png'
        },
        // HDFC Bank
        {
            slug: 'hdfc-bank',
            logo: '/assets/Icons/hdfc.png'
        },
        // ICICI Bank
        {
            slug: 'icici-bank',
            logo: '/assets/Icons/icici.png'
        },
        // HSBC
        {
            slug: 'hsbc',
            logo: '/assets/Icons/hsbc.png'
        },
        // Axis Bank (alternative slug)
        {
            slug: 'axis',
            logo: '/assets/Icons/axis-new.png'
        }
    ]

    for (const update of updates) {
        try {
            const bank = await prisma.bank.findUnique({
                where: { slug: update.slug }
            })

            if (bank) {
                await prisma.bank.update({
                    where: { slug: update.slug },
                    data: { logo: update.logo }
                })
                console.log(`✅ Updated ${bank.name}: ${update.logo}`)
            } else {
                console.log(`⏭️  Skipped ${update.slug} (not found)`)
            }
        } catch (error) {
            console.error(`❌ Error updating ${update.slug}:`, error)
        }
    }

    console.log('\n🎉 Bank logos update completed!')
}

main()
    .catch((e) => {
        console.error('Error updating bank logos:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
