import { Suspense } from 'react';
import ReviewQueueList from '@/components/admin/ReviewQueueList';

export default function ReviewQueuePage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Suspense fallback={<div>Loading...</div>}>
                <ReviewQueueList />
            </Suspense>
        </div>
    );
}
