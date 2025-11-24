'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

type TabType = 'post-management' | 'data-management' | 'source-data';

interface SubTab {
    label: string;
    href: string;
}

interface MainTab {
    id: TabType;
    label: string;
    subTabs?: SubTab[];
    directLink?: string;
}

export function AdminHeader() {
    const pathname = usePathname();
    const [activeTab, setActiveTab] = useState<TabType>('post-management');

    const mainTabs: MainTab[] = [
        {
            id: 'post-management',
            label: 'Post Management',
            subTabs: [
                { label: 'Posts Dashboard', href: '/admin' },
                { label: 'Create New Post', href: '/admin/posts/new' },
                { label: 'Manage Post Categories', href: '/admin/card-configs' },
            ],
        },
        {
            id: 'data-management',
            label: 'Data Management',
            subTabs: [
                { label: 'Manage Categories', href: '/admin/categories' },
                { label: 'Manage Banks', href: '/admin/banks' },
                { label: 'Manage Programs', href: '/admin/programs' },
            ],
        },
        {
            id: 'source-data',
            label: 'Source Data',
            subTabs: [
                { label: 'Overview', href: '/admin/sources' },
                { label: 'Tweets', href: '/admin/sources/tweets' },
                { label: 'Import', href: '/admin/sources/tweets/import' },
                { label: 'Review Queue', href: '/admin/review-queue' },
            ],
        },
    ];

    // Determine active tab based on current pathname
    useEffect(() => {
        if (pathname === '/admin' || pathname?.startsWith('/admin/posts') || pathname?.startsWith('/admin/card-configs')) {
            setActiveTab('post-management');
        } else if (pathname?.startsWith('/admin/categories') || pathname?.startsWith('/admin/banks') || pathname?.startsWith('/admin/programs')) {
            setActiveTab('data-management');
        } else if (pathname?.startsWith('/admin/sources') || pathname?.startsWith('/admin/review-queue')) {
            setActiveTab('source-data');
        }
    }, [pathname]);

    const isSubTabActive = (href: string) => {
        if (href === '/admin') {
            return pathname === '/admin';
        }
        // Exact match or pathname starts with href followed by /
        return pathname === href || pathname?.startsWith(href + '/');
    };

    return (
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

            {/* Main Tabs */}
            <div className="border-b border-gray-200">
                <nav className="flex space-x-8" aria-label="Main tabs">
                    {mainTabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => {
                                if (tab.directLink) {
                                    window.location.href = tab.directLink;
                                } else if (tab.subTabs && tab.subTabs.length > 0) {
                                    // Navigate to first sub-tab
                                    window.location.href = tab.subTabs[0].href;
                                } else {
                                    setActiveTab(tab.id);
                                }
                            }}
                            className={`
                                py-4 px-1 border-b-2 font-medium text-sm transition-colors
                                ${activeTab === tab.id
                                    ? 'border-orange-500 text-orange-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }
                            `}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Sub Tabs */}
            {mainTabs.find(tab => tab.id === activeTab)?.subTabs && (
                <div className="mt-4">
                    <nav className="flex space-x-4" aria-label="Sub tabs">
                        {mainTabs.find(tab => tab.id === activeTab)?.subTabs?.map((subTab) => (
                            <Link
                                key={subTab.href}
                                href={subTab.href}
                                className={`
                                    px-4 py-2 rounded-md text-sm font-medium transition-colors
                                    ${isSubTabActive(subTab.href)
                                        ? 'bg-orange-100 text-orange-700'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                    }
                                `}
                            >
                                {subTab.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            )}
        </div>
    );
}
