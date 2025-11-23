'use client';

import { useState, useMemo } from 'react';
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

type FilterStatus = 'all' | 'new' | 'processed' | 'approved' | 'rejected' | 'irrelevant';

export default function TweetList({ initialTweets }: TweetListProps) {
    const [tweets, setTweets] = useState<Tweet[]>(initialTweets);
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Filter and search logic
    const filteredTweets = useMemo(() => {
        let filtered = tweets;

        // Apply status filter
        if (filterStatus !== 'all') {
            filtered = filtered.filter(tweet => {
                if (filterStatus === 'new') return !tweet.processed;
                if (filterStatus === 'processed') return tweet.processed && !tweet.processedPost;
                if (filterStatus === 'approved') return tweet.processedPost?.status === 'approved';
                if (filterStatus === 'rejected') return tweet.processedPost?.status === 'rejected';
                if (filterStatus === 'irrelevant') return tweet.isRelevant === false;
                return true;
            });
        }

        // Apply search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(tweet =>
                tweet.content.toLowerCase().includes(query) ||
                tweet.authorHandle.toLowerCase().includes(query)
            );
        }

        return filtered;
    }, [tweets, filterStatus, searchQuery]);

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

            // Update tweets state instead of reloading
            setTweets(prevTweets =>
                prevTweets.map(tweet =>
                    ids.includes(tweet.id)
                        ? { ...tweet, processed: true }
                        : tweet
                )
            );

            // Clear selection
            setSelectedIds(new Set());

            alert(`Successfully processed ${ids.length} tweet(s)`);
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
        if (selectedIds.size === filteredTweets.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(filteredTweets.map(t => t.id)));
        }
    };

    const clearSelection = () => {
        setSelectedIds(new Set());
    };

    const getStatusBadge = (tweet: Tweet) => {
        if (!tweet.processed) {
            return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">New</span>;
        }

        if (tweet.isRelevant === false) {
            return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">Irrelevant</span>;
        }

        if (tweet.processedPost) {
            const status = tweet.processedPost.status;
            const colors = {
                approved: 'bg-green-100 text-green-800',
                rejected: 'bg-red-100 text-red-800',
                pending: 'bg-yellow-100 text-yellow-800',
            };
            return (
                <div className="flex flex-col gap-1">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                    <span className="text-xs text-gray-500">
                        {tweet.processedPost.category} ({Math.round(tweet.processedPost.confidence)}%)
                    </span>
                </div>
            );
        }

        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">Processed</span>;
    };

    const stats = {
        total: tweets.length,
        new: tweets.filter(t => !t.processed).length,
        processed: tweets.filter(t => t.processed).length,
        approved: tweets.filter(t => t.processedPost?.status === 'approved').length,
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold text-gray-900">Imported Tweets</h2>
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                        {filteredTweets.length} of {tweets.length}
                    </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    {selectedIds.size > 0 && (
                        <button
                            onClick={clearSelection}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Clear Selection
                        </button>
                    )}
                    <button
                        onClick={() => handleProcess(Array.from(selectedIds))}
                        disabled={isProcessing || selectedIds.size === 0}
                        className={`px-4 py-2 text-sm font-medium rounded-lg shadow-sm ${isProcessing || selectedIds.size === 0
                                ? 'bg-indigo-300 text-white cursor-not-allowed'
                                : 'bg-indigo-600 text-white hover:bg-indigo-700'
                            }`}
                    >
                        {isProcessing ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Processing...
                            </span>
                        ) : (
                            `Process Selected (${selectedIds.size})`
                        )}
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                    <div className="text-sm text-gray-600">Total Tweets</div>
                </div>
                <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
                    <div className="text-2xl font-bold text-blue-900">{stats.new}</div>
                    <div className="text-sm text-blue-700">New</div>
                </div>
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                    <div className="text-2xl font-bold text-gray-900">{stats.processed}</div>
                    <div className="text-sm text-gray-600">Processed</div>
                </div>
                <div className="bg-green-50 rounded-lg border border-green-200 p-4">
                    <div className="text-2xl font-bold text-green-900">{stats.approved}</div>
                    <div className="text-sm text-green-700">Approved</div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Search by content or author..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                {/* Status Filter */}
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                    <option value="all">All Status</option>
                    <option value="new">New</option>
                    <option value="processed">Processed</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="irrelevant">Irrelevant</option>
                </select>
            </div>

            {/* Table */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="w-12 px-4 py-3">
                                    <input
                                        type="checkbox"
                                        checked={filteredTweets.length > 0 && selectedIds.size === filteredTweets.length}
                                        onChange={toggleSelectAll}
                                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                    />
                                </th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Content
                                </th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Author
                                </th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredTweets.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-12 text-center text-gray-500">
                                        {searchQuery || filterStatus !== 'all'
                                            ? 'No tweets match your filters.'
                                            : 'No tweets found. Import some tweets to get started.'}
                                    </td>
                                </tr>
                            ) : (
                                filteredTweets.map((tweet) => (
                                    <tr key={tweet.id} className={`hover:bg-gray-50 ${selectedIds.has(tweet.id) ? 'bg-indigo-50' : ''}`}>
                                        <td className="px-4 py-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.has(tweet.id)}
                                                onChange={() => toggleSelect(tweet.id)}
                                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="max-w-md">
                                                <p className="text-sm text-gray-900 line-clamp-2">{tweet.content}</p>
                                                <a
                                                    href={tweet.tweetUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-indigo-600 hover:text-indigo-800 mt-1 inline-flex items-center gap-1"
                                                >
                                                    View Original
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                    </svg>
                                                </a>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className="text-sm text-gray-600">@{tweet.authorHandle}</span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            {getStatusBadge(tweet)}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                                            <div className="flex gap-3">
                                                {!tweet.processed && (
                                                    <button
                                                        onClick={() => handleProcess([tweet.id])}
                                                        disabled={isProcessing}
                                                        className="text-indigo-600 hover:text-indigo-900 disabled:text-gray-400"
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
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Selection Info */}
            {selectedIds.size > 0 && (
                <div className="fixed bottom-4 right-4 bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-lg">
                    <span className="font-medium">{selectedIds.size} tweet(s) selected</span>
                </div>
            )}
        </div>
    );
}
