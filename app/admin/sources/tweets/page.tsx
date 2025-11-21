import { prisma } from "@/lib/prisma";
import TweetList from "@/components/admin/TweetList";

export default async function TweetsPage() {
    const tweets = await prisma.rawTweet.findMany({
        orderBy: {
            fetchedAt: 'desc',
        },
        include: {
            processedPost: {
                select: {
                    id: true,
                    status: true,
                    category: true,
                    confidence: true,
                },
            },
        },
        take: 100, // Limit for now
    });

    // Serialize dates for client component
    const serializedTweets = tweets.map(tweet => ({
        ...tweet,
        postedAt: tweet.postedAt.toISOString(),
        // createdAt: tweet.createdAt.toISOString(), // Field does not exist
        fetchedAt: tweet.fetchedAt.toISOString(),
    }));

    return (
        <div>
            <TweetList initialTweets={serializedTweets} />
        </div>
    );
}
