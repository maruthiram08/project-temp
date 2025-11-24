'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

interface PendingPost {
    id: string;
    category: string;
    confidence: number;
    status: string;
    createdAt: string;
    rawTweet: {
        content: string;
        authorHandle: string;
        tweetUrl: string;
    };
    extractedData: string;
}

export default function ReviewQueueList() {
    const [posts, setPosts] = useState<PendingPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('pending_review');
    const [counts, setCounts] = useState<Record<string, number>>({
        pending_review: 0,
        pending_approval: 0,
        needs_manual_entry: 0,
        approved: 0,
        rejected: 0,
    });
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        fetchPosts();
        fetchCounts();
    }, [filterStatus]);

    const fetchPosts = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/admin/review-queue?status=${filterStatus}`);
            const data = await res.json();
            if (data.success) {
                setPosts(data.posts);
            }
        } catch (error) {
            console.error('Failed to fetch review queue:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCounts = async () => {
        try {
            const res = await fetch('/api/admin/review-queue?counts=true');
            const data = await res.json();
            if (data.success && data.counts) {
                setCounts(data.counts);
            }
        } catch (error) {
            console.error('Failed to fetch counts:', error);
        }
    };

    const getTitle = (post: PendingPost) => {
        try {
            const data = JSON.parse(post.extractedData);
            return data.title || data.offerTitle || data.cardName || 'Untitled';
        } catch {
            return 'Invalid Data';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Review Queue</h1>
            </div>

            <div className="flex space-x-2 overflow-x-auto pb-2 no-scrollbar">
                {[
                    { id: 'pending_review', label: 'Pending Review' },
                    { id: 'pending_approval', label: 'Pending Approval' },
                    { id: 'needs_manual_entry', label: 'Needs Manual Entry' },
                    { id: 'approved', label: 'Approved' },
                    { id: 'rejected', label: 'Rejected' },
                ].map((status) => (
                    <button
                        key={status.id}
                        onClick={() => setFilterStatus(status.id)}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filterStatus === status.id
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                            }`}
                    >
                        {status.label} ({counts[status.id] || 0})
                    </button>
                ))}
            </div>


            {
                isLoading ? (
                    <div className="text-center py-12">Loading...</div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <p className="text-gray-500">No posts found for this status.</p>
                    </div>
                ) : (
                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                        <ul className="divide-y divide-gray-200">
                            {posts.map((post) => (
                                <li key={post.id}>
                                    <Link href={`/admin/review-queue/${post.id}`} className="block hover:bg-gray-50">
                                        <div className="px-4 py-4 sm:px-6">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-medium text-indigo-600 truncate">
                                                    {getTitle(post)}
                                                </p>
                                                <div className="ml-2 flex-shrink-0 flex">
                                                    <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${post.confidence > 80 ? 'bg-green-100 text-green-800' :
                                                        post.confidence > 60 ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-red-100 text-red-800'
                                                        }`}>
                                                        {Math.round(post.confidence)}% Confidence
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="mt-2 sm:flex sm:justify-between">
                                                <div className="sm:flex">
                                                    <p className="flex items-center text-sm text-gray-500">
                                                        {post.category}
                                                    </p>
                                                    <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                                        @{post.rawTweet.authorHandle}
                                                    </p>
                                                </div>
                                                <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                                    <p>
                                                        Created {new Date(post.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-400 line-clamp-2">
                                                    {post.rawTweet.content}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                )
            }
        </div >
    );
}
