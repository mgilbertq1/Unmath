'use client';

import { usePathname } from 'next/navigation';
import { DesktopSidebar, MobileTabBar } from '@/components/Sidebar';

// Routes where the sidebar should NOT be shown
const NO_SIDEBAR_ROUTES = ['/welcome', '/login', '/register', '/welcome-done'];

export default function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const showSidebar = !NO_SIDEBAR_ROUTES.some((r) => pathname.startsWith(r));

    if (!showSidebar) {
        return <>{children}</>;
    }

    return (
        <>
            <div className="flex min-h-screen">
                <DesktopSidebar />
                <main className="flex-1 min-w-0 pb-20 lg:pb-0">
                    {children}
                </main>
            </div>
            <MobileTabBar />
        </>
    );
}
