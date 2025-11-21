import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ReviewPostEditor from '@/components/admin/ReviewPostEditor';
import Link from 'next/link';

export default async function ReviewPostPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const post = await prisma.pendingPost.findUnique({
        where: { id },
        include: {
            rawTweet: true,
        },
    });

    if (!post) {
        notFound();
    }

    // Serialize dates
    const serializedPost = {
        ...post,
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString(),
        rawTweet: {
            ...post.rawTweet,
            postedAt: post.rawTweet.postedAt.toISOString(),
            fetchedAt: post.rawTweet.fetchedAt.toISOString(),
        },
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6">
                <Link
                    href="/admin/review-queue"
                    className="text-sm text-indigo-600 hover:text-indigo-900 font-medium"
                >
                    &larr; Back to Queue
                </Link>
                <h1 className="mt-2 text-2xl font-bold text-gray-900">
                    Review Post
                </h1>
            </div>

            <ReviewPostEditor post={serializedPost} />
        </div>
    );
}
