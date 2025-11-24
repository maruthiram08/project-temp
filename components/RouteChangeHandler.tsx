'use client';

import { useEffect } from 'react';
import NProgress from 'nprogress';

export default function RouteChangeHandler() {
    useEffect(() => {
        // Handle link clicks to start loading
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const anchor = target.closest('a');

            if (anchor && anchor.href) {
                const targetUrl = new URL(anchor.href);
                const currentUrl = new URL(window.location.href);

                // Only show progress if navigating to a different page
                if (
                    targetUrl.origin === currentUrl.origin &&
                    targetUrl.pathname !== currentUrl.pathname
                ) {
                    NProgress.start();
                }
            }
        };

        // Handle form submissions
        const handleFormSubmit = () => {
            NProgress.start();
        };

        // Handle browser back/forward buttons
        const handlePopState = () => {
            NProgress.start();
            // Done will be called by LoadingProvider when pathname changes
        };

        document.addEventListener('click', handleClick);
        document.addEventListener('submit', handleFormSubmit);
        window.addEventListener('popstate', handlePopState);

        return () => {
            document.removeEventListener('click', handleClick);
            document.removeEventListener('submit', handleFormSubmit);
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);

    return null;
}
