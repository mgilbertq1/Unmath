'use client';

import { ReactNode } from 'react';

interface WayangGameShellProps {
    children: ReactNode;
    subject: 'math' | 'pkn';
}

/* Wayang puppet SVG using the user-uploaded image */
function WayangFigure({ align }: { align: 'left' | 'right' }) {
    const isRight = align === 'right';
    return (
        <div
            className={`fixed bottom-0 z-[2] pointer-events-none hidden sm:block ${isRight ? 'right-[-40px]' : 'left-[-40px]'}`}
            style={{
                opacity: 0.18,
                filter: 'drop-shadow(0 0 20px rgba(198,167,94,0.3))',
                transform: isRight ? 'scaleX(-1)' : 'none',
                width: 320,
                height: 320,
                backgroundColor: '#C6A75E',
                maskImage: 'url(/wayang.svg)',
                maskSize: 'contain',
                maskRepeat: 'no-repeat',
                maskPosition: 'bottom',
                WebkitMaskImage: 'url(/wayang.svg)',
                WebkitMaskSize: 'contain',
                WebkitMaskRepeat: 'no-repeat',
                WebkitMaskPosition: 'bottom',
            }}
        />
    );
}

export default function WayangGameShell({ children, subject }: WayangGameShellProps) {
    return (
        <div
            className="min-h-screen w-full relative overflow-x-hidden flex flex-col"
            style={{ background: '#120A03' }}
        >
            {/* Batik tile */}
            <div
                className="fixed inset-0 pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cg fill='none' stroke='%23C6A75E' stroke-width='0.5' opacity='0.14'%3E%3Cellipse cx='60' cy='30' rx='30' ry='18'/%3E%3Cellipse cx='60' cy='90' rx='30' ry='18'/%3E%3Cellipse cx='20' cy='60' rx='18' ry='30'/%3E%3Cellipse cx='100' cy='60' rx='18' ry='30'/%3E%3Ccircle cx='60' cy='60' r='12'/%3E%3Cpath d='M60 12 Q80 30 60 48 Q40 30 60 12'/%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundSize: '120px 120px',
                    zIndex: 0,
                }}
            />
            {/* Radial dark overlay */}
            <div
                className="fixed inset-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse at 50% 40%, rgba(164,117,81,0.11) 0%, rgba(12,6,2,0.82) 70%)',
                    zIndex: 1,
                }}
            />

            {/* Wayang silhouettes — only on ≥ sm screens */}
            <WayangFigure align="left" />
            <WayangFigure align="right" />

            {/* Content */}
            <div
                className="relative flex-1 flex flex-col"
                style={{ zIndex: 10 }}
            >
                <div className="w-full max-w-[600px] mx-auto px-4 py-5 sm:py-8 flex flex-col gap-4">
                    {children}
                </div>
            </div>
        </div>
    );
}
