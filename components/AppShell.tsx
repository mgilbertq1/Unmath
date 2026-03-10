'use client';

import { usePathname } from 'next/navigation';
import { DesktopSidebar, MobileTabBar } from '@/components/Sidebar';
import GlobalAudio from '@/components/GlobalAudio';

// Routes where the sidebar should NOT be shown
const NO_SIDEBAR_ROUTES = ['/welcome', '/login', '/register', '/welcome-done', '/game'];

export default function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const showSidebar = !NO_SIDEBAR_ROUTES.some((r) => pathname.startsWith(r));

    if (!showSidebar) {
        return <>{children}</>;
    }

    return (
        <>
            {/* Batik dot pattern overlay — shows on all inner pages */}
            <div
                className="fixed inset-0 pointer-events-none opacity-60"
                style={{ backgroundImage: 'var(--batik-pattern)', backgroundSize: '24px 24px', zIndex: 0 }}
            />
            
            <GlobalAudio />

            <div className="flex min-h-screen relative" style={{ zIndex: 1 }}>
                <DesktopSidebar />
                <main className="flex-1 min-w-0 pb-20 lg:pb-0">
                    {children}
                </main>
            </div>
            <MobileTabBar />
        </>
    );
}
