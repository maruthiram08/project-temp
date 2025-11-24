/**
 * Script to fix existing PendingPosts with "Extraction Failed" titles
 * Updates them with meaningful titles extracted from tweet content
 */

const { PrismaClient } = require('@prisma/client');
const { extractTitleFromTweet } = require('../lib/utils/tweet-title-extractor');

const prisma = new PrismaClient();

async function fixExtractionFailedTitles() {
    try {
        console.log('🔍 Finding pending posts with "Extraction Failed" titles...\n');

        // Find all pending posts with "Extraction Failed" in the title
        const postsToFix = await prisma.pendingPost.findMany({
            where: {
                status: 'needs_manual_entry',
            },
            include: {
                rawTweet: true,
            },
        });

        console.log(`Found ${postsToFix.length} pending posts needing review\n`);

        let fixedCount = 0;

        for (const post of postsToFix) {
            try {
                const extractedData = JSON.parse(post.extractedData);

                // Check if title is "Extraction Failed" or similar
                if (
                    extractedData.title === 'Extraction Failed' ||
                    extractedData.title === 'Untitled' ||
                    !extractedData.title
                ) {
                    // Extract a better title from tweet content
                    const newTitle = extractTitleFromTweet(post.rawTweet.content);

                    console.log(`📝 Fixing post ${post.id}`);
                    console.log(`   Old title: "${extractedData.title || 'None'}"`);
                    console.log(`   New title: "${newTitle}"`);
                    console.log(`   Content: ${post.rawTweet.content.substring(0, 80)}...\n`);

                    // Update extracted data with new title and excerpt
                    const updatedData = {
                        ...extractedData,
                        title: newTitle,
                        excerpt: extractedData.excerpt || post.rawTweet.content.substring(0, 150),
                    };

                    // Update the pending post
                    await prisma.pendingPost.update({
                        where: { id: post.id },
                        data: {
                            extractedData: JSON.stringify(updatedData),
                        },
                    });

                    fixedCount++;
                }
            } catch (error) {
                console.error(`❌ Error fixing post ${post.id}:`, error.message);
            }
        }

        console.log(`\n✅ Fixed ${fixedCount} posts with better titles!`);

    } catch (error) {
        console.error('❌ Script error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

fixExtractionFailedTitles();
