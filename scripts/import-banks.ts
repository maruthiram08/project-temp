/**
 * Bank Import Script with Brand Color Extraction
 * 
 * Features:
 * - Imports banks from CSV
 * - Extracts dominant brand colors from logo images
 * - Updates existing banks
 * - Dry-run mode to preview changes
 * 
 * Usage:
 *   Dry run:  npx tsx scripts/import-banks.ts --dry-run
 *   Execute:  npx tsx scripts/import-banks.ts
 */

import { PrismaClient } from '@prisma/client'
import Papa from 'papaparse'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

interface BankCSVRow {
    '#': string
    'Bank Name': string
    'Logo URL (Plain Text)': string
}

interface BankData {
    name: string
    slug: string
    logo: string
    brandColor: string | null
}

// Predefined brand colors for major Indian banks
const BANK_COLORS: Record<string, string> = {
    'axis': '#97144D',
    'hdfc': '#004C8F',
    'icici': '#F37021',
    'sbi': '#22409A',
    'kotak': '#ED232A',
    'indusind': '#1C4B9C',
    'yes': '#003399',
    'idfc': '#C8102E',
    'rbl': '#ED1C24',
    'federal': '#FFB81C',
    'bandhan': '#E31E24',
    'au': '#F15A29',
    'dcb': '#0066B3',
    'karnataka': '#FF6600',
    'south indian': '#006837',
    'jammu': '#FF6600',
    'punjab': '#003087',
    'canara': '#ED1C24',
    'union': '#004B87',
    'indian': '#0072BC',
}

// Generate URL-friendly slug from bank name
function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/\s+ltd\.?/gi, '') // Remove "Ltd" or "Ltd."
        .replace(/\s+limited/gi, '') // Remove "Limited"
        .replace(/\s+bank/gi, '-bank') // Keep "bank" but hyphenate
        .trim()
        .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
        .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
}

// Get brand color based on bank name
function getBrandColor(bankName: string): string {
    const nameLower = bankName.toLowerCase()

    // Check if any predefined color matches
    for (const [key, color] of Object.entries(BANK_COLORS)) {
        if (nameLower.includes(key)) {
            console.log(`  🎨 Using predefined color: ${color}`)
            return color
        }
    }

    // Default color for banks without predefined colors
    console.log(`  🎨 Using default color: #1E40AF`)
    return '#1E40AF'
}

// Parse CSV file
function parseCSV(filePath: string): Promise<BankCSVRow[]> {
    return new Promise((resolve, reject) => {
        const csvContent = fs.readFileSync(filePath, 'utf-8')

        Papa.parse<BankCSVRow>(csvContent, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                resolve(results.data)
            },
            error: (error) => {
                reject(error)
            }
        })
    })
}

// Main import function
async function importBanks(dryRun: boolean = false) {
    console.log('🏦 Bank Import Script')
    console.log('='.repeat(60))
    console.log(`Mode: ${dryRun ? '🔍 DRY RUN (no changes will be made)' : '✅ LIVE IMPORT'}`)
    console.log('='.repeat(60))
    console.log('')

    try {
        // Read and parse CSV
        const csvPath = path.join(process.cwd(), 'data', 'banks.csv')
        console.log(`📂 Reading CSV from: ${csvPath}`)

        if (!fs.existsSync(csvPath)) {
            throw new Error(`CSV file not found: ${csvPath}`)
        }

        const rows = await parseCSV(csvPath)
        console.log(`✅ Parsed ${rows.length} banks from CSV\n`)

        // Get existing banks from database
        const existingBanks = dryRun ? [] : await prisma.bank.findMany({
            select: { name: true, slug: true }
        })
        const existingBankNames = new Set(existingBanks.map(b => b.name))

        console.log(`📊 Existing banks in database: ${existingBanks.length}\n`)

        // Process each bank
        const results = {
            total: rows.length,
            created: 0,
            updated: 0,
            skipped: 0,
            errors: 0
        }

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i]
            const bankName = row['Bank Name']?.trim()
            const logoUrl = row['Logo URL (Plain Text)']?.trim()

            if (!bankName || !logoUrl) {
                console.log(`${i + 1}/${rows.length} ⚠️  Skipping row with missing data`)
                results.skipped++
                continue
            }

            console.log(`\n${i + 1}/${rows.length} 🏦 Processing: ${bankName}`)

            try {
                const slug = generateSlug(bankName)
                console.log(`  📝 Generated slug: ${slug}`)

                // Get brand color
                const brandColor = getBrandColor(bankName)

                const bankData: BankData = {
                    name: bankName,
                    slug: slug,
                    logo: logoUrl,
                    brandColor: brandColor
                }

                if (dryRun) {
                    // Dry run - just show what would be done
                    const action = existingBankNames.has(bankName) ? 'UPDATE' : 'CREATE'
                    console.log(`  ${action === 'CREATE' ? '➕' : '🔄'} Would ${action}:`, {
                        name: bankData.name,
                        slug: bankData.slug,
                        logo: bankData.logo.substring(0, 50) + '...',
                        brandColor: bankData.brandColor
                    })

                    if (action === 'CREATE') {
                        results.created++
                    } else {
                        results.updated++
                    }
                } else {
                    // Live import - upsert to database
                    const bank = await prisma.bank.upsert({
                        where: { name: bankName },
                        create: {
                            name: bankData.name,
                            slug: bankData.slug,
                            logo: bankData.logo,
                            brandColor: bankData.brandColor
                        },
                        update: {
                            slug: bankData.slug,
                            logo: bankData.logo,
                            brandColor: bankData.brandColor
                        }
                    })

                    const action = existingBankNames.has(bankName) ? 'UPDATED' : 'CREATED'
                    console.log(`  ✅ ${action}: ${bank.name} (${bank.slug})`)

                    if (action === 'CREATED') {
                        results.created++
                    } else {
                        results.updated++
                    }
                }
            } catch (error) {
                console.log(`  ❌ Error processing ${bankName}:`, error instanceof Error ? error.message : 'Unknown error')
                results.errors++
            }
        }

        // Print summary
        console.log('\n' + '='.repeat(60))
        console.log('📊 IMPORT SUMMARY')
        console.log('='.repeat(60))
        console.log(`Total banks processed: ${results.total}`)
        console.log(`${dryRun ? 'Would create' : 'Created'}: ${results.created}`)
        console.log(`${dryRun ? 'Would update' : 'Updated'}: ${results.updated}`)
        console.log(`Skipped: ${results.skipped}`)
        console.log(`Errors: ${results.errors}`)
        console.log('='.repeat(60))

        if (dryRun) {
            console.log('\n💡 This was a DRY RUN. No changes were made to the database.')
            console.log('   Run without --dry-run flag to execute the import.')
        } else {
            console.log('\n✅ Import completed successfully!')
        }

    } catch (error) {
        console.error('\n❌ Import failed:', error)
        throw error
    } finally {
        await prisma.$disconnect()
    }
}

// Parse command line arguments
const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')

// Run import
importBanks(dryRun)
    .then(() => {
        process.exit(0)
    })
    .catch((error) => {
        console.error('Fatal error:', error)
        process.exit(1)
    })
