import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Seeding test data...')

    // 1. Create a RawTweet first
    const rawTweet = await prisma.rawTweet.create({
        data: {
            tweetUrl: `https://twitter.com/test_user/status/${Date.now()}`,
            tweetId: 'test-tweet-' + Date.now(),
            content: 'Test Tweet: Get 10% cashback on Amazon with HDFC Millennia card! #HDFC #Cashback',
            authorHandle: '@test_user',
            authorName: 'Test User',
            postedAt: new Date(),
            processed: true,
            isRelevant: true
        }
    })
    console.log(`✅ Created RawTweet: ${rawTweet.id}`)

    // 2. Create a Pending Post linked to the RawTweet
    const pendingPost = await prisma.pendingPost.create({
        data: {
            rawTweetId: rawTweet.id,
            category: 'SPEND_OFFERS',
            status: 'pending_review',
            confidence: 95.0,
            extractedData: JSON.stringify({
                bankName: 'HDFC Bank',
                cardName: 'Millennia',
                offerTitle: '10% Cashback on Amazon',
                shortDescription: 'Get 10% cashback on Amazon purchases with HDFC Millennia Credit Card.',
                expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
                expiryDisplayFormat: 'date',
                valueBack: '10%',
                minSpend: '2000',
                cardVisual: 'https://placehold.co/600x400/png' // Placeholder image
            })
        }
    })
    console.log(`✅ Created Pending Post: ${pendingPost.id}`)

    // 3. Create a Draft Post for Edit Test
    // First ensure we have a bank
    let bank = await prisma.bank.findFirst({ where: { slug: 'hdfc-bank' } })
    if (!bank) {
        bank = await prisma.bank.create({
            data: {
                name: 'HDFC Bank',
                slug: 'hdfc-bank',
                logo: '/logos/hdfc.png', // Placeholder
                brandColor: '#004c8f'
            }
        })
    }

    // Ensure we have an author
    let author = await prisma.user.findFirst()
    if (!author) {
        // Create a dummy admin user if none exists
        author = await prisma.user.create({
            data: {
                email: 'admin@example.com',
                name: 'Admin User',
                password: 'hashed_password_placeholder', // Won't work for login but fine for relation
                isAdmin: true
            }
        })
        console.log(`✅ Created Dummy Admin: ${author.id}`)
    }

    const finalAuthor = author

    if (finalAuthor) {
        const draftPost = await prisma.post.create({
            data: {
                title: 'Test Draft Post',
                slug: 'test-draft-post-' + Date.now(),
                excerpt: 'This is a test draft post for editing.',
                content: JSON.stringify([{ type: 'text', content: 'This is the content of the draft post.' }]),
                status: 'draft',
                categoryType: 'SPEND_OFFERS',
                authorId: finalAuthor.id,
                bankId: bank.id,
                categoryData: JSON.stringify({
                    offerTitle: 'Test Draft Post',
                    shortDescription: 'This is a test draft post for editing.',
                    valueBack: '5%',
                    minSpend: '1000'
                })
            }
        })
        console.log(`✅ Created Draft Post: ${draftPost.id}`)
    }

    console.log('✨ Seeding complete!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
