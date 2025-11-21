import { prisma } from "@/lib/prisma";
import Link from "next/link";

async function getSourceStats() {
    const totalTweets = await prisma.rawTweet.count();
    const processedTweets = await prisma.rawTweet.count({
        where: { processed: true },
    });
    const pendingReview = await prisma.pendingPost.count({
        where: { status: "pending_review" },
    });
    const approved = await prisma.pendingPost.count({
        where: { status: "approved" },
    });

    return {
        totalTweets,
        processedTweets,
        pendingReview,
        approved,
    };
}

export default async function SourcesDashboard() {
    const stats = await getSourceStats();

    return (
        <div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">
                            Total Tweets Imported
                        </dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">
                            {stats.totalTweets}
                        </dd>
                    </div>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">
                            Processed by AI
                        </dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">
                            {stats.processedTweets}
                        </dd>
                    </div>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">
                            Pending Review
                        </dt>
                        <dd className="mt-1 text-3xl font-semibold text-indigo-600">
                            {stats.pendingReview}
                        </dd>
                    </div>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">
                            Approved & Published
                        </dt>
                        <dd className="mt-1 text-3xl font-semibold text-green-600">
                            {stats.approved}
                        </dd>
                    </div>
                </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                    <div className="flex flex-col gap-4">
                        <Link
                            href="/admin/sources/tweets/import"
                            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                            Import New Tweets
                        </Link>
                        <Link
                            href="/admin/sources/tweets"
                            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                            Manage Tweets
                        </Link>
                        <Link
                            href="/admin/review-queue"
                            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                            Go to Review Queue
                        </Link>
                    </div>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">System Status</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">AI Service</span>
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Active
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Database</span>
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Connected
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Last Import</span>
                            <span className="text-sm text-gray-900">
                                {/* Placeholder for last import time */}
                                Checking...
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
