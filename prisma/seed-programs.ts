/**
 * Seed Script: Initial Programs (Airlines & Hotels)
 * Run with: npx tsx prisma/seed-programs.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting Programs seed...')

    const programs = [
        // Airlines
        {
            name: 'American Airlines AAdvantage',
            slug: 'american-airlines-aadvantage',
            type: 'airline',
            logo: '/assets/Icons/aadvantage.jpg',
            brandColor: '#0078D2',
            description: 'Earn and redeem miles on American Airlines and partner airlines'
        },
        {
            name: 'American Airlines',
            slug: 'american-airlines',
            type: 'airline',
            logo: '/assets/Icons/americanairlines.png',
            brandColor: '#C8102E',
            description: 'Major U.S. airline operating domestic and international flights'
        },
        {
            name: 'Singapore Airlines KrisFlyer',
            slug: 'singapore-airlines',
            type: 'airline',
            logo: '/assets/Icons/singaporeairlines.png',
            brandColor: '#003087',
            description: 'Singapore Airlines loyalty program with extensive partner network'
        },
        {
            name: 'British Airways Avios',
            slug: 'british-airways-avios',
            type: 'airline',
            logo: '/assets/Icons/avios.png',
            brandColor: '#075AAA',
            description: 'Collect Avios points for British Airways and partner flights'
        },
        // Hotels
        {
            name: 'Marriott Bonvoy',
            slug: 'marriott-bonvoy',
            type: 'hotel',
            logo: '/assets/Icons/marriot.png',
            brandColor: '#8B2A51',
            description: 'Global hotel loyalty program with 30+ brands under Marriott'
        },
        {
            name: 'ITC Hotels',
            slug: 'itc-hotels',
            type: 'hotel',
            logo: '/assets/Icons/itc.webp',
            brandColor: '#A17A2B',
            description: 'Premium luxury hotel chain in India'
        },
        {
            name: 'Taj Hotels',
            slug: 'taj-hotels',
            type: 'hotel',
            logo: '/assets/Icons/taj.png',
            brandColor: '#8B4513',
            description: 'Iconic Indian luxury hotel brand by Tata Group'
        }
    ]

    for (const program of programs) {
        const created = await prisma.program.upsert({
            where: { slug: program.slug },
            update: {},
            create: program
        })
        console.log(`✅ ${program.type === 'airline' ? '✈️' : '🏨'} ${created.name}`)
    }

    console.log('\\n🎉 Programs seed completed successfully!')
    console.log(`\\nSummary:`)
    console.log(`  • ${programs.filter(p => p.type === 'airline').length} Airlines added`)
    console.log(`  • ${programs.filter(p => p.type === 'hotel').length} Hotels added`)
}

main()
    .catch((e) => {
        console.error('Error seeding programs:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
