'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FormGenerator } from './FormGenerator';

interface ReviewPostEditorProps {
    post: {
        id: string;
        category: string;
        extractedData: string;
        status: string;
        rawTweet: {
            content: string;
            tweetUrl: string;
            authorHandle: string;
            postedAt: string;
        };
    };
}

export default function ReviewPostEditor({ post }: ReviewPostEditorProps) {
    const router = useRouter();
    const [isRejecting, setIsRejecting] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [isSaved, setIsSaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(post.category);

    // Transform flat extracted data to nested form data
    const getInitialData = () => {
        try {
            const flatData = JSON.parse(post.extractedData);
            const {
                title,
                excerpt,
                detailsContent,
                bankId,
                expiryDate,
                ctaUrl,
                fieldConfidence,
                ...categoryFields
            } = flatData;

            return {
                title,
                excerpt,
                detailsContent,
                bankId,
                expiryDateTime: expiryDate, // Map expiryDate to expiryDateTime
                ctaUrl,
                categoryType: selectedCategory, // Use selectedCategory instead of post.category
                categoryData: categoryFields,
            };
        } catch (e) {
            console.error('Error parsing extracted data:', e);
            return { categoryType: selectedCategory }; // Use selectedCategory
        }
    };

    const handleSave = async (formData: Record<string, any>) => {
        // Transform nested form data back to flat extracted data
        const {
            title,
            excerpt,
            detailsContent,
            bankId,
            expiryDateTime,
            ctaUrl,
            categoryData,
        } = formData;

        const extractedData = {
            title,
            excerpt,
            detailsContent,
            bankId,
            expiryDate: expiryDateTime, // Map back
            ctaUrl,
            ...categoryData,
            // Preserve field confidence if possible, or just drop it as it's edited
        };

        setIsSaving(true);
        try {
            const res = await fetch(`/api/admin/review-queue/${post.id}/update`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    extractedData,
                    category: selectedCategory, // Use selectedCategory state
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Failed to save');
            }

            setIsSaved(true);
            router.refresh();
            alert('Saved successfully!');
        } catch (error) {
            console.error('Save error:', error);
            alert('Failed to save changes: ' + (error instanceof Error ? error.message : 'Unknown error'));
            throw error; // Re-throw so FormGenerator can reset submitting state
        } finally {
            setIsSaving(false);
        }
    };

    const handleApprove = async () => {
        if (!confirm('Are you sure you want to approve this post? It will be created as a draft.')) return;

        try {
            const res = await fetch(`/api/admin/review-queue/${post.id}/approve`, {
                method: 'POST',
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to approve');
            }

            router.push('/admin/review-queue');
            router.refresh();
        } catch (error) {
            console.error('Approve error:', error);
            alert(error instanceof Error ? error.message : 'Failed to approve');
        }
    };

    const handleReject = async () => {
        try {
            const res = await fetch(`/api/admin/review-queue/${post.id}/reject`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reason: rejectReason }),
            });

            if (!res.ok) throw new Error('Failed to reject');

            router.push('/admin/review-queue');
            router.refresh();
        } catch (error) {
            console.error('Reject error:', error);
            alert('Failed to reject');
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Original Tweet & Actions */}
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Original Tweet</h3>
                    <div className="prose prose-sm max-w-none text-gray-500">
                        <p className="whitespace-pre-wrap">{post.rawTweet.content}</p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between text-sm text-gray-500">
                        <span>@{post.rawTweet.authorHandle}</span>
                        <span>{new Date(post.rawTweet.postedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="mt-4">
                        <a
                            href={post.rawTweet.tweetUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-900 text-sm"
                        >
                            View on Twitter &rarr;
                        </a>
                    </div>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Actions</h3>

                    {/* Workflow Guide */}
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                        <p className="text-xs text-blue-800 font-medium mb-1">Workflow:</p>
                        <ol className="text-xs text-blue-700 space-y-1 ml-4 list-decimal">
                            <li>Make your edits in the form</li>
                            <li>Click "Save Changes" to save</li>
                            <li>Then click "Approve & Create Post"</li>
                        </ol>
                    </div>

                    <div className="space-y-3">
                        {/* Save Changes Button */}
                        <button
                            onClick={() => {
                                // Trigger form submission
                                const form = document.querySelector('form');
                                if (form) {
                                    form.requestSubmit();
                                }
                            }}
                            disabled={isSaving}
                            className={`w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isSaved
                                    ? 'bg-blue-500 hover:bg-blue-600'
                                    : 'bg-blue-600 hover:bg-blue-700'
                                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {isSaving ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Saving...
                                </>
                            ) : isSaved ? (
                                <>
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Saved Successfully
                                </>
                            ) : (
                                'Save Changes'
                            )}
                        </button>

                        {/* Approve Button */}
                        <button
                            onClick={handleApprove}
                            disabled={!isSaved}
                            className={`w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isSaved
                                    ? 'bg-green-600 hover:bg-green-700'
                                    : 'bg-gray-400 cursor-not-allowed'
                                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                        >
                            {!isSaved && (
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                            )}
                            Approve & Create Post
                        </button>

                        {!isSaved && (
                            <p className="text-xs text-gray-500 text-center">
                                ⚠️ Save your changes first before approving
                            </p>
                        )}

                        {!isRejecting ? (
                            <button
                                onClick={() => setIsRejecting(true)}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                Reject
                            </button>
                        ) : (
                            <div className="space-y-3">
                                <textarea
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                    placeholder="Reason for rejection..."
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm border p-2"
                                    rows={3}
                                />
                                <div className="flex space-x-2">
                                    <button
                                        onClick={handleReject}
                                        className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                                    >
                                        Confirm Reject
                                    </button>
                                    <button
                                        onClick={() => setIsRejecting(false)}
                                        className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="pt-4 border-t border-gray-200">
                            <button
                                onClick={async () => {
                                    if (!confirm('This will overwrite current data with new AI extraction. Continue?')) return;
                                    try {
                                        const res = await fetch(`/api/admin/review-queue/${post.id}/reprocess`, { method: 'POST' });
                                        if (!res.ok) throw new Error('Failed to reprocess');
                                        router.refresh();
                                        alert('Reprocessed successfully!');
                                    } catch (e) {
                                        console.error(e);
                                        alert('Failed to reprocess');
                                    }
                                }}
                                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Re-process with AI
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Edit Form */}
            <div className="lg:col-span-2">
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-6">Edit Extracted Data</h3>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category
                        </label>
                        <select
                            value={selectedCategory}
                            onChange={(e) => {
                                if (confirm('Changing category will reset the form. Continue?')) {
                                    setSelectedCategory(e.target.value);
                                }
                            }}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                        >
                            <option value="OTHER" disabled>Select a Category</option>
                            <option value="SPEND_OFFERS">Spend Offer</option>
                            <option value="LIFETIME_FREE">Lifetime Free</option>
                            <option value="STACKING_HACKS">Stacking Hack</option>
                            <option value="JOINING_BONUS">Joining Bonus</option>
                            <option value="TRANSFER_BONUS">Transfer Bonus</option>
                            <option value="NEWS">News</option>
                            <option value="DEVALUATION">Devaluation</option>
                        </select>
                        {selectedCategory === 'OTHER' && (
                            <p className="mt-2 text-sm text-red-600">
                                Please select a valid category to edit this post.
                            </p>
                        )}
                    </div>

                    {selectedCategory !== 'OTHER' && (
                        <FormGenerator
                            key={selectedCategory} // Force re-mount when category changes
                            categoryType={selectedCategory}
                            initialData={getInitialData()}
                            onSubmit={handleSave}
                            onCancel={() => router.back()}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
