/**
 * Seed script for Bank data
 * Run with: npx tsx prisma/seed-banks.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const banks = [
  {
    name: 'HDFC Bank',
    slug: 'hdfc-bank',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/HDFC_Bank_Logo.svg/200px-HDFC_Bank_Logo.svg.png',
    brandColor: '#004C8F',
    description: 'India\'s largest private sector bank by assets'
  },
  {
    name: 'ICICI Bank',
    slug: 'icici-bank',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/ICICI_Bank_Logo.svg/200px-ICICI_Bank_Logo.svg.png',
    brandColor: '#F37021',
    description: 'Leading private sector bank in India'
  },
  {
    name: 'Axis Bank',
    slug: 'axis-bank',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Axis_Bank_logo.svg/200px-Axis_Bank_logo.svg.png',
    brandColor: '#97144D',
    description: 'Third-largest private sector bank in India'
  },
  {
    name: 'State Bank of India',
    slug: 'sbi',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/SBI-logo.svg/200px-SBI-logo.svg.png',
    brandColor: '#22409A',
    description: 'Largest public sector bank in India'
  },
  {
    name: 'Kotak Mahindra Bank',
    slug: 'kotak-mahindra-bank',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Kotak_Mahindra_Bank_logo.svg/200px-Kotak_Mahindra_Bank_logo.svg.png',
    brandColor: '#ED232A',
    description: 'Leading private sector bank offering innovative banking solutions'
  },
  {
    name: 'IndusInd Bank',
    slug: 'indusind-bank',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/IndusInd_Bank_Logo.svg/200px-IndusInd_Bank_Logo.svg.png',
    brandColor: '#FF6600',
    description: 'New generation private sector bank'
  },
  {
    name: 'Yes Bank',
    slug: 'yes-bank',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Yes_Bank_SVG_Logo.svg/200px-Yes_Bank_SVG_Logo.svg.png',
    brandColor: '#003DA5',
    description: 'Full-service commercial bank'
  },
  {
    name: 'Standard Chartered Bank',
    slug: 'standard-chartered',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Standard_Chartered_Logo.svg/200px-Standard_Chartered_Logo.svg.png',
    brandColor: '#007F3D',
    description: 'Leading international banking group'
  },
  {
    name: 'American Express',
    slug: 'american-express',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/200px-American_Express_logo_%282018%29.svg.png',
    brandColor: '#006FCF',
    description: 'Premium credit card and travel services provider'
  },
  {
    name: 'Citibank',
    slug: 'citibank',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Citi.svg/200px-Citi.svg.png',
    brandColor: '#003DA5',
    description: 'Global financial services corporation'
  },
  {
    name: 'HSBC Bank',
    slug: 'hsbc',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/HSBC_logo_%282018%29.svg/200px-HSBC_logo_%282018%29.svg.png',
    brandColor: '#DB0011',
    description: 'World\'s largest international bank'
  },
  {
    name: 'AU Small Finance Bank',
    slug: 'au-small-finance-bank',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/AU_Small_Finance_Bank_Logo.svg/200px-AU_Small_Finance_Bank_Logo.svg.png',
    brandColor: '#FF6600',
    description: 'Small finance bank offering retail banking services'
  },
  {
    name: 'RBL Bank',
    slug: 'rbl-bank',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/RBL_Bank_logo.svg/200px-RBL_Bank_logo.svg.png',
    brandColor: '#009540',
    description: 'Scheduled commercial bank'
  },
  {
    name: 'IDFC First Bank',
    slug: 'idfc-first-bank',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/IDFC_First_Bank_logo.svg/200px-IDFC_First_Bank_logo.svg.png',
    brandColor: '#C8102E',
    description: 'Universal banking services provider'
  },
  {
    name: 'Federal Bank',
    slug: 'federal-bank',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Federal_Bank_logo.svg/200px-Federal_Bank_logo.svg.png',
    brandColor: '#FFB612',
    description: 'Major private sector bank based in Kerala'
  }
]

async function seedBanks() {
  console.log('🏦 Starting Bank seed...\n')

  let createdCount = 0
  let updatedCount = 0

  for (const bankData of banks) {
    try {
      const bank = await prisma.bank.upsert({
        where: { slug: bankData.slug },
        create: bankData,
        update: {
          name: bankData.name,
          logo: bankData.logo,
          brandColor: bankData.brandColor,
          description: bankData.description
        }
      })

      // Check if it was created or updated
      const existing = await prisma.bank.findUnique({
        where: { slug: bankData.slug }
      })

      if (existing?.createdAt.getTime() === existing?.updatedAt.getTime()) {
        createdCount++
        console.log(`✅ Created: ${bank.name}`)
      } else {
        updatedCount++
        console.log(`🔄 Updated: ${bank.name}`)
      }
    } catch (error) {
      console.error(`❌ Error with ${bankData.name}:`, error)
    }
  }

  console.log(`\n📊 Summary:`)
  console.log(`   Created: ${createdCount} banks`)
  console.log(`   Updated: ${updatedCount} banks`)
  console.log(`   Total: ${banks.length} banks`)
  console.log(`\n✅ Bank seed completed!`)
}

async function main() {
  try {
    await seedBanks()
  } catch (error) {
    console.error('❌ Error during seeding:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
