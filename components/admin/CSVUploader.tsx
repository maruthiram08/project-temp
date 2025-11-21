'use client';

import { useState, useRef } from 'react';
import { csvUtils } from '@/lib/utils/csv-parser';

export default function CSVUploader() {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && (droppedFile.type === 'text/csv' || droppedFile.name.endsWith('.csv'))) {
            handleFileSelect(droppedFile);
        } else {
            setStatus({ type: 'error', message: 'Please upload a valid CSV file.' });
        }
    };

    const handleFileSelect = async (selectedFile: File) => {
        setFile(selectedFile);
        setStatus(null);

        const text = await selectedFile.text();
        const result = await csvUtils.parseCSV(text);

        if (result.success) {
            setPreview(result.tweets.slice(0, 5)); // Preview first 5
        } else {
            setStatus({ type: 'error', message: result.errors.join(', ') });
            setFile(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setIsLoading(true);
        setStatus(null);

        try {
            const text = await file.text();
            const result = await csvUtils.parseCSV(text);

            if (!result.success) {
                throw new Error(result.errors.join(', '));
            }

            const response = await fetch('/api/admin/sources/tweets/import', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tweets: result.tweets }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Upload failed');
            }

            setStatus({
                type: 'success',
                message: `Successfully imported ${data.count} tweets!`
            });
            setFile(null);
            setPreview([]);
            if (fileInputRef.current) fileInputRef.current.value = '';

        } catch (error) {
            setStatus({
                type: 'error',
                message: error instanceof Error ? error.message : 'Upload failed'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const downloadTemplate = () => {
        const csv = csvUtils.generateSampleCSV();
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'tweets_template.csv';
        a.click();
    };

    return (
        <div className="bg-white shadow sm:rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Bulk Import via CSV</h3>
                <button
                    onClick={downloadTemplate}
                    className="text-sm text-indigo-600 hover:text-indigo-900"
                >
                    Download Template
                </button>
            </div>

            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
                    }`}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    accept=".csv"
                    onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                    className="hidden"
                />

                {file ? (
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                        <button
                            onClick={() => {
                                setFile(null);
                                setPreview([]);
                                if (fileInputRef.current) fileInputRef.current.value = '';
                            }}
                            className="text-sm text-red-600 hover:text-red-800"
                        >
                            Remove
                        </button>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <p className="text-gray-500">Drag and drop your CSV file here, or</p>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                            Browse files
                        </button>
                    </div>
                )}
            </div>

            {status && (
                <div className={`mt-4 p-4 rounded-md ${status.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                    }`}>
                    {status.message}
                </div>
            )}

            {preview.length > 0 && (
                <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Preview (First 5 rows)</h4>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">URL</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Content</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Author</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {preview.map((tweet, idx) => (
                                    <tr key={idx}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs">
                                            {tweet.tweetUrl}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 truncate max-w-md">
                                            {tweet.content}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {tweet.authorHandle}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <div className="mt-6">
                <button
                    onClick={handleUpload}
                    disabled={!file || isLoading}
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${!file || isLoading
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                        }`}
                >
                    {isLoading ? 'Importing...' : 'Import Tweets'}
                </button>
            </div>
        </div>
    );
}
