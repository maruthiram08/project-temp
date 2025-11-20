/**
 * List and Update All Banks
 * Run with: npx tsx prisma/list-and-update-banks.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('📋 Listing all banks...\n')

    const banks = await prisma.bank.findMany({
        orderBy: { name: 'asc' }
    })

    console.log('Current banks in database:')
    banks.forEach((bank, index) => {
        console.log(`${index + 1}. ${bank.name}`)
        console.log(`   Slug: ${bank.slug}`)
        console.log(`   Current Logo: ${bank.logo || 'None'}`)
        console.log('')
    })

    console.log('\n🔄 Updating logos based on slug matching...\n')

    const logoMap: Record<string, string> = {
        // User provided mappings
        'citibank': '/assets/Icons/citibank.png',
        'federal-bank': '/assets/Icons/federal.png',
        'idfc-first-bank': '/assets/Icons/idfcfirst.png',
        'indusind-bank': '/assets/Icons/indusind.png',
        'kotak-mahindra-bank': '/assets/Icons/kotak.png',
        'rbl-bank': '/assets/Icons/rbl.png',
        'standard-chartered': '/assets/Icons/sc.png',
        'yes-bank': '/assets/Icons/yesbank.png',
        'american-express': '/assets/Icons/amex.png', // Assuming common name
        'sbi': '/assets/Icons/sbi.png', // Assuming common name

        // Existing mappings
        'au-small-finance-bank': '/assets/Icons/au.png',
        'axis-bank': '/assets/Icons/axis-new.png',
        'hdfc-bank': '/assets/Icons/hdfc.png',
        'icici-bank': '/assets/Icons/icici.png',
        'hsbc': '/assets/Icons/hsbc.png',
    }

    // Handle Bank of Baroda specifically (create if missing)
    const bobSlug = 'bank-of-baroda'
    const bob = await prisma.bank.findUnique({ where: { slug: bobSlug } })

    if (!bob) {
        console.log(`➕ Creating Bank of Baroda...`)
        await prisma.bank.create({
            data: {
                name: 'Bank of Baroda',
                slug: bobSlug,
                logo: '/assets/Icons/bob-new.png',
                description: 'Indian state-owned international banking and financial services company'
            }
        })
        console.log(`✅ Created Bank of Baroda\n`)
    } else {
        // Update BoB logo if needed
        if (bob.logo !== '/assets/Icons/bob-new.png') {
            await prisma.bank.update({
                where: { slug: bobSlug },
                data: { logo: '/assets/Icons/bob-new.png' }
            })
            console.log(`✅ Updated Bank of Baroda logo\n`)
        }
    }

    for (const bank of banks) {
        // Skip if it's BoB as we handled it
        if (bank.slug === bobSlug) continue

        const newLogo = logoMap[bank.slug]

        if (newLogo && newLogo !== bank.logo) {
            await prisma.bank.update({
                where: { id: bank.id },
                data: { logo: newLogo }
            })
            console.log(`✅ Updated ${bank.name}`)
            console.log(`   Old: ${bank.logo || 'None'}`)
            console.log(`   New: ${newLogo}\n`)
        } else if (newLogo === bank.logo) {
            console.log(`✓ ${bank.name} already has correct logo\n`)
        } else {
            console.log(`⏭️  ${bank.name} (${bank.slug}) - no matching logo found in map\n`)
        }
    }
    console.log('🎉 Update completed!')
}

main()
    .catch((e) => {
        console.error('Error:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
