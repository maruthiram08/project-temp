/**
 * Utility to extract a meaningful title from tweet content
 * Used when AI extraction fails
 */

interface BankPattern {
    pattern: RegExp;
    name: string;
}

const BANK_PATTERNS: BankPattern[] = [
    { pattern: /\bHDFC\b/i, name: 'HDFC' },
    { pattern: /\bICICI\b/i, name: 'ICICI' },
    { pattern: /\bSBI\b/i, name: 'SBI' },
    { pattern: /\bAxis\b/i, name: 'Axis' },
    { pattern: /\bAmex\b|\bAmerican Express\b/i, name: 'Amex' },
    { pattern: /\bIDFC\b/i, name: 'IDFC' },
    { pattern: /\bKotak\b/i, name: 'Kotak' },
    { pattern: /\bIndusInd\b/i, name: 'IndusInd' },
    { pattern: /\bYes Bank\b/i, name: 'Yes Bank' },
    { pattern: /\bRBL\b/i, name: 'RBL' },
    { pattern: /\bAU\b/i, name: 'AU' },
    { pattern: /\bStandard Chartered\b|\bSCB\b/i, name: 'Standard Chartered' },
    { pattern: /\bCiti\b|\bCitibank\b/i, name: 'Citi' },
    { pattern: /\bHSBC\b/i, name: 'HSBC' },
];

const OFFER_TYPE_PATTERNS = [
    { pattern: /\bspend\s+\d+[kK]?\b.*?\bget\b/i, type: 'Spend Offer' },
    { pattern: /\blifetime\s+free\b|\bLTF\b/i, type: 'Lifetime Free' },
    { pattern: /\bjoining\s+bonus\b|\bwelcome\s+bonus\b/i, type: 'Joining Bonus' },
    { pattern: /\btransfer\s+bonus\b/i, type: 'Transfer Bonus' },
    { pattern: /\bstack\b|\bcombine\b/i, type: 'Stacking Hack' },
    { pattern: /\bdevaluation\b/i, type: 'Devaluation' },
];

const CARD_NAME_PATTERNS = [
    /\b(Magnus|Regalia|Diners|Platinum|Signature|Reserve|Sapphire|Privilege|Odyssey|Coral|Rubyx|Infinia|Vistara|Ace|Apay|Amazon Pay)\b/i,
];

/**
 * Extract a meaningful title from tweet content
 * Priority: Bank + Card + Offer Type > Bank + Offer Type > First N chars
 */
export function extractTitleFromTweet(content: string): string {
    // Detect bank
    let bank = '';
    for (const { pattern, name } of BANK_PATTERNS) {
        if (pattern.test(content)) {
            bank = name;
            break;
        }
    }

    // Detect card name
    let cardName = '';
    for (const pattern of CARD_NAME_PATTERNS) {
        const match = content.match(pattern);
        if (match) {
            cardName = match[1];
            break;
        }
    }

    // Detect offer type
    let offerType = '';
    for (const { pattern, type } of OFFER_TYPE_PATTERNS) {
        if (pattern.test(content)) {
            offerType = type;
            break;
        }
    }

    // Build title from detected components
    if (bank && cardName && offerType) {
        return `${bank} ${cardName} - ${offerType}`;
    } else if (bank && offerType) {
        return `${bank} ${offerType}`;
    } else if (bank && cardName) {
        return `${bank} ${cardName} Offer`;
    } else if (bank) {
        return `${bank} Credit Card Offer`;
    } else if (offerType) {
        return `${offerType} Alert`;
    }

    // Fallback: First 60 characters
    const cleanContent = content
        .replace(/https?:\/\/\S+/g, '') // Remove URLs
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();

    if (cleanContent.length <= 60) {
        return cleanContent;
    }

    return cleanContent.substring(0, 60) + '...';
}
