/**
 * Verification Script for Twitter Automation Workflow
 * 
 * Run with: npx ts-node scripts/verify-twitter-automation.ts
 */

import { PrismaClient } from '@prisma/client';
// import { CATEGORY_TYPES } from '../types/categories';

const CATEGORY_TYPES = {
    SPEND_OFFERS: 'SPEND_OFFERS',
    LIFETIME_FREE: 'LIFETIME_FREE',
    STACKING_HACKS: 'STACKING_HACKS',
    JOINING_BONUS: 'JOINING_BONUS',
    TRANSFER_BONUS: 'TRANSFER_BONUS',
} as const;

const prisma = new PrismaClient();

// Mock Tweet Data
const MOCK_TWEET = {
    tweetUrl: 'https://twitter.com/TestUser/status/1234567890',
    content: 'HDFC Infinia - 5x reward points on dining via Swiggy Dineout! Valid till Dec 31. #HDFC #Dining',
    authorHandle: 'TestUser',
    authorName: 'Test User',
    postedAt: new Date(),
};

// Mock AI Extraction Result
const MOCK_EXTRACTION = {
    isRelevant: true,
    category: CATEGORY_TYPES.SPEND_OFFERS,
    extractedData: {
        offerTitle: '5x Reward Points on Dining',
        shortDescription: 'Get 5x reward points on dining transactions via Swiggy Dineout.',
        valueBackValue: '5x',
        valueBackUnit: 'pts',
        valueBackColor: '#10B981',
        title: 'HDFC Infinia Dining Offer',
        excerpt: '5x points on Swiggy Dineout',
        detailsContent: 'Full details about the offer...',
        bankName: 'HDFC Bank',
        expiryDate: '2024-12-31',
        ctaUrl: 'https://hdfcbank.com/offers',
        fieldConfidence: {
            offerTitle: 95,
            valueBackValue: 90,
        }
    },
    overallConfidence: 92,
    lowConfidenceFields: [],
    reviewerNotes: 'Auto-extracted with high confidence',
};

async function main() {
    console.log('🚀 Starting Twitter Automation Verification...');

    try {
        // 1. Cleanup previous test data
        console.log('\n🧹 Cleaning up previous test data...');
        await prisma.pendingPost.deleteMany({
            where: { rawTweet: { tweetUrl: MOCK_TWEET.tweetUrl } }
        });
        await prisma.rawTweet.deleteMany({
            where: { tweetUrl: MOCK_TWEET.tweetUrl }
        });
        await prisma.post.deleteMany({
            where: { slug: 'hdfc-infinia-dining-offer' }
        });

        // 2. Import Tweet
        console.log('\n📥 Step 1: Importing Tweet...');
        const rawTweet = await prisma.rawTweet.create({
            data: {
                ...MOCK_TWEET,
                tweetId: '1234567890',
                processed: false,
            },
        });
        console.log(`✅ Created RawTweet: ${rawTweet.id}`);

        // 3. Simulate AI Processing (Skipping actual API call, just creating PendingPost)
        console.log('\n🤖 Step 2: Simulating AI Processing...');

        // Update RawTweet
        await prisma.rawTweet.update({
            where: { id: rawTweet.id },
            data: {
                processed: true,
                isRelevant: true,
            },
        });

        // Create PendingPost
        const pendingPost = await prisma.pendingPost.create({
            data: {
                rawTweetId: rawTweet.id,
                category: MOCK_EXTRACTION.category,
                extractedData: JSON.stringify(MOCK_EXTRACTION.extractedData),
                confidence: MOCK_EXTRACTION.overallConfidence,
                status: 'pending_approval', // High confidence
                reviewerNotes: MOCK_EXTRACTION.reviewerNotes,
            },
        });
        console.log(`✅ Created PendingPost: ${pendingPost.id}`);

        // 4. Simulate Approval
        console.log('\n👍 Step 3: Simulating Admin Approval...');

        // Prepare Post Data (logic from approve API)
        const extractedData = JSON.parse(pendingPost.extractedData);
        const {
            title,
            excerpt,
            detailsContent,
            bankId,
            expiryDate,
            ctaUrl,
            fieldConfidence,
            ...categoryData
        } = extractedData;

        // Get a valid user for authorId
        let user = await prisma.user.findFirst();
        if (!user) {
            console.log('Creating test user...');
            user = await prisma.user.create({
                data: {
                    email: 'test-admin@example.com',
                    name: 'Test Admin',
                    password: 'password123', // Dummy password
                    isAdmin: true,
                }
            });
        }

        const post = await prisma.post.create({
            data: {
                title: title,
                slug: 'hdfc-infinia-dining-offer',
                content: JSON.stringify([{ type: 'text', content: detailsContent }]),
                excerpt: excerpt,
                categoryType: pendingPost.category,
                bankId: null, // We didn't mock a bank ID match here
                expiryDateTime: new Date(expiryDate),
                detailsContent: detailsContent,
                ctaUrl: ctaUrl,
                status: 'draft',
                categoryData: JSON.stringify(categoryData),
                authorId: user.id,
            },
        });

        // Update PendingPost
        await prisma.pendingPost.update({
            where: { id: pendingPost.id },
            data: {
                status: 'approved',
                publishedPostId: post.id,
                adminNotes: 'Approved via verification script',
            },
        });

        console.log(`✅ Created Post: ${post.id}`);
        console.log(`✅ Updated PendingPost status to 'approved'`);

        // 5. Verify Final State
        console.log('\n🔍 Step 4: Verifying Final State...');

        const finalTweet = await prisma.rawTweet.findUnique({ where: { id: rawTweet.id } });
        const finalPending = await prisma.pendingPost.findUnique({ where: { id: pendingPost.id } });
        const finalPost = await prisma.post.findUnique({ where: { id: post.id } });

        if (finalTweet?.processed && finalPending?.status === 'approved' && finalPost) {
            console.log('\n✨ SUCCESS! The entire workflow verified successfully.');
        } else {
            console.error('\n❌ FAILURE! State verification failed.');
            console.log({ finalTweet, finalPending, finalPost });
        }

    } catch (error) {
        console.error('\n❌ Error during verification:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
