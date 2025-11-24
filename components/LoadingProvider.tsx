'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import NProgress from 'nprogress';

NProgress.configure({
    showSpinner: false,
    trickleSpeed: 200,
    minimum: 0.08,
    easing: 'ease',
    speed: 500,
});

function LoadingHandler() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        NProgress.done();
    }, [pathname, searchParams]);

    return null;
}

export default function LoadingProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Suspense fallback={null}>
                <LoadingHandler />
            </Suspense>
            {children}
        </>
    );
}
