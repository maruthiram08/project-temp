'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Tweet {
    id: string;
    tweetUrl: string;
    content: string;
    authorHandle: string;
    postedAt: string;
    processed: boolean;
    isRelevant: boolean | null;
    processedPost?: {
        id: string;
        status: string;
        category: string;
        confidence: number;
    } | null;
}

interface TweetListProps {
    initialTweets: Tweet[];
}

export default function TweetList({ initialTweets }: TweetListProps) {
    const [tweets, setTweets] = useState<Tweet[]>(initialTweets);
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const handleProcess = async (ids: string[]) => {
        if (ids.length === 0) return;

        setIsProcessing(true);
        try {
            const response = await fetch('/api/admin/sources/tweets/process', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tweetIds: ids }),
            });

            if (!response.ok) throw new Error('Processing failed');

            const result = await response.json();

            // Refresh data (in a real app, we might re-fetch or update state more smartly)
            window.location.reload();
        } catch (error) {
            console.error('Processing error:', error);
            alert('Failed to process tweets');
        } finally {
            setIsProcessing(false);
        }
    };

    const toggleSelect = (id: string) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedIds(newSelected);
    };

    const toggleSelectAll = () => {
        if (selectedIds.size === tweets.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(tweets.map(t => t.id)));
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <h2 className="text-xl font-semibold text-gray-900">Imported Tweets</h2>
                    <span className="bg-gray-100 text-gray-600 py-0.5 px-2.5 rounded-full text-xs font-medium">
                        {tweets.length}
                    </span>
                </div>
                <div className="space-x-2">
                    <button
                        onClick={() => handleProcess(Array.from(selectedIds))}
                        disabled={isProcessing || selectedIds.size === 0}
                        className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${isProcessing || selectedIds.size === 0
                                ? 'bg-indigo-400 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-700'
                            }`}
                    >
                        {isProcessing ? 'Processing...' : `Process Selected (${selectedIds.size})`}
                    </button>
                </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-4">
                                    <input
                                        type="checkbox"
                                        checked={tweets.length > 0 && selectedIds.size === tweets.length}
                                        onChange={toggleSelectAll}
                                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                    />
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Content
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Author
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {tweets.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        No tweets found. Import some tweets to get started.
                                    </td>
                                </tr>
                            ) : (
                                tweets.map((tweet) => (
                                    <tr key={tweet.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.has(tweet.id)}
                                                onChange={() => toggleSelect(tweet.id)}
                                                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="max-w-lg">
                                                <p className="text-sm text-gray-900 truncate">{tweet.content}</p>
                                                <a
                                                    href={tweet.tweetUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-indigo-600 hover:text-indigo-900 mt-1 inline-block"
                                                >
                                                    View Original
                                                </a>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            @{tweet.authorHandle}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {tweet.processed ? (
                                                tweet.processedPost ? (
                                                    <div className="flex flex-col">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${tweet.processedPost.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                                tweet.processedPost.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                                    'bg-yellow-100 text-yellow-800'
                                                            }`}>
                                                            {tweet.processedPost.status.replace('_', ' ')}
                                                        </span>
                                                        <span className="text-xs text-gray-500 mt-1">
                                                            {tweet.processedPost.category} ({Math.round(tweet.processedPost.confidence)}%)
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                                        {tweet.isRelevant === false ? 'Irrelevant' : 'Processed (No Post)'}
                                                    </span>
                                                )
                                            ) : (
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                    New
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            {!tweet.processed && (
                                                <button
                                                    onClick={() => handleProcess([tweet.id])}
                                                    disabled={isProcessing}
                                                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                >
                                                    Process
                                                </button>
                                            )}
                                            {tweet.processedPost && (
                                                <Link
                                                    href={`/admin/review-queue?id=${tweet.processedPost.id}`}
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                >
                                                    Review
                                                </Link>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
