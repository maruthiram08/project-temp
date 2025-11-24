const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log('🔍 Checking production database...\n');

    // Check users
    const userCount = await prisma.user.count();
    console.log(`👤 Users: ${userCount}`);

    // Check tweets
    const tweetCount = await prisma.rawTweet.count();
    console.log(`🐦 Raw Tweets: ${tweetCount}`);

    // Check pending posts
    const pendingCount = await prisma.pendingPost.count();
    console.log(`📋 Pending Posts: ${pendingCount}`);

    // Check banks
    const bankCount = await prisma.bank.count();
    console.log(`🏦 Banks: ${bankCount}`);

    // Check posts
    const postCount = await prisma.post.count();
    console.log(`📝 Posts: ${postCount}`);

    console.log('\n✅ Database connection successful!');

    if (tweetCount > 0) {
      console.log('\n🐦 Sample tweets:');
      const tweets = await prisma.rawTweet.findMany({ take: 3 });
      tweets.forEach(t => console.log(`  - ${t.authorHandle}: ${t.content.substring(0, 50)}...`));
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
