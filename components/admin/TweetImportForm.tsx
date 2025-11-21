'use client';

import { useState } from 'react';
import { csvUtils } from '@/lib/utils/csv-parser';

export default function TweetImportForm() {
    const [url, setUrl] = useState('');
    const [content, setContent] = useState('');
    const [author, setAuthor] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus(null);

        try {
            // Validate URL
            const tweetId = csvUtils.extractTweetId(url);
            if (!tweetId) {
                throw new Error('Invalid Tweet URL');
            }

            const tweet = {
                tweetUrl: url,
                tweetId,
                content,
                authorHandle: author.replace(/^@/, ''),
                authorName: author.replace(/^@/, ''),
                postedAt: new Date(),
            };

            const response = await fetch('/api/admin/sources/tweets/import', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tweets: [tweet] }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Import failed');
            }

            setStatus({ type: 'success', message: 'Tweet imported successfully!' });
            // Reset form
            setUrl('');
            setContent('');
            setAuthor('');

        } catch (error) {
            setStatus({
                type: 'error',
                message: error instanceof Error ? error.message : 'Import failed'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white shadow sm:rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Manual Entry</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                        Tweet URL
                    </label>
                    <input
                        type="url"
                        id="url"
                        required
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://twitter.com/user/status/123..."
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                    />
                </div>

                <div>
                    <label htmlFor="author" className="block text-sm font-medium text-gray-700">
                        Author Handle
                    </label>
                    <input
                        type="text"
                        id="author"
                        required
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        placeholder="@username"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                    />
                </div>

                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                        Tweet Content
                    </label>
                    <textarea
                        id="content"
                        required
                        rows={4}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Paste full tweet text here..."
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                    />
                </div>

                {status && (
                    <div className={`p-4 rounded-md ${status.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                        }`}>
                        {status.message}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isLoading
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                        }`}
                >
                    {isLoading ? 'Importing...' : 'Import Tweet'}
                </button>
            </form>
        </div>
    );
}
