/**
 * Bank Name Matching Utility
 * Fuzzy matching to link extracted bank names to existing Bank records
 */

import { prisma } from '@/lib/prisma';

// Common bank name variations and normalizations
const BANK_ALIASES: Record<string, string[]> = {
    'HDFC Bank': ['HDFC', 'hdfc bank', 'HDFC BANK', 'hdfcbank'],
    'ICICI Bank': ['ICICI', 'icici bank', 'ICICI BANK', 'icicibank'],
    'SBI Card': ['SBI', 'sbi', 'SBI Cards', 'State Bank', 'SBI CARD'],
    'Axis Bank': ['Axis', 'axis bank', 'AXIS BANK', 'axisbank'],
    'American Express': ['AMEX', 'Amex', 'amex', 'American Express', 'AmericanExpress'],
    'IDFC First Bank': ['IDFC', 'IDFC First', 'idfc first bank', 'IDFCFirst'],
    'Kotak Mahindra Bank': ['Kotak', 'kotak bank', 'Kotak Mahindra', 'KotakMahindra'],
    'IndusInd Bank': ['IndusInd', 'indusind', 'indusind bank'],
    'Yes Bank': ['Yes', 'yes bank', 'YES BANK'],
    'RBL Bank': ['RBL', 'rbl bank', 'RBL BANK'],
    'Standard Chartered': ['SC', 'StanChart', 'Standard Chartered', 'standard chartered'],
    'Citibank': ['Citi', 'citi bank', 'CITI', 'Citibank India'],
    'HSBC': ['HSBC', 'hsbc', 'HSBC India'],
    'AU Small Finance Bank': ['AU', 'AU Bank', 'au small finance', 'AUBank'],
};

export interface BankMatchResult {
    bankId?: string;
    bankName?: string;
    confidence: number;
    matchType: 'exact' | 'alias' | 'fuzzy' | 'none';
    alternatives?: Array<{ id: string; name: string; similarity: number }>;
}

/**
 * Find matching bank in database
 */
export async function matchBank(extractedBankName: string | undefined): Promise<BankMatchResult> {
    if (!extractedBankName || extractedBankName.trim() === '') {
        return {
            confidence: 0,
            matchType: 'none',
        };
    }

    const normalizedInput = extractedBankName.trim().toLowerCase();

    // Fetch all banks from database
    const allBanks = await prisma.bank.findMany({
        select: { id: true, name: true, slug: true },
    });

    // Try exact match first
    const exactMatch = allBanks.find(
        bank => bank.name.toLowerCase() === normalizedInput
    );
    if (exactMatch) {
        return {
            bankId: exactMatch.id,
            bankName: exactMatch.name,
            confidence: 100,
            matchType: 'exact',
        };
    }

    // Try alias matching
    for (const [officialName, aliases] of Object.entries(BANK_ALIASES)) {
        if (aliases.some(alias => alias.toLowerCase() === normalizedInput)) {
            const bank = allBanks.find(b => b.name === officialName);
            if (bank) {
                return {
                    bankId: bank.id,
                    bankName: bank.name,
                    confidence: 95,
                    matchType: 'alias',
                };
            }
        }
    }

    // Try fuzzy/partial matching
    const fuzzyMatches = allBanks
        .map(bank => ({
            ...bank,
            similarity: calculateSimilarity(normalizedInput, bank.name.toLowerCase()),
        }))
        .filter(match => match.similarity > 0.6)
        .sort((a, b) => b.similarity - a.similarity);

    if (fuzzyMatches.length > 0) {
        const topMatch = fuzzyMatches[0];
        return {
            bankId: topMatch.id,
            bankName: topMatch.name,
            confidence: Math.round(topMatch.similarity * 100),
            matchType: 'fuzzy',
            alternatives: fuzzyMatches.slice(1, 4).map(m => ({
                id: m.id,
                name: m.name,
                similarity: Math.round(m.similarity * 100),
            })),
        };
    }

    // No match found
    return {
        confidence: 0,
        matchType: 'none',
    };
}

/**
 * Calculate string similarity (Jaro-Winkler inspired)
 */
function calculateSimilarity(str1: string, str2: string): number {
    // Simple similarity based on:
    // 1. Substring matching
    // 2. Levenshtein distance

    if (str1 === str2) return 1.0;

    // Check if one is substring of other
    if (str1.includes(str2) || str2.includes(str1)) {
        const longer = Math.max(str1.length, str2.length);
        const shorter = Math.min(str1.length, str2.length);
        return 0.7 + (shorter / longer) * 0.3;
    }

    // Levenshtein distance
    const distance = levenshteinDistance(str1, str2);
    const maxLength = Math.max(str1.length, str2.length);
    return 1 - distance / maxLength;
}

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(str1: string, str2: string): number {
    const matrix: number[][] = [];

    for (let i = 0; i <= str2.length; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
        for (let j = 1; j <= str1.length; j++) {
            if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    matrix[i][j - 1] + 1,     // insertion
                    matrix[i - 1][j] + 1      // deletion
                );
            }
        }
    }

    return matrix[str2.length][str1.length];
}

/**
 * Suggest creating a new bank if no match found
 */
export function suggestNewBank(bankName: string): {
    name: string;
    slug: string;
} {
    return {
        name: bankName,
        slug: bankName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    };
}
