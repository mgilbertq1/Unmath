// Custom SVG Logo for Unmath — geometric book stack with gradient text
// Not emoji — a clean, modern mark

interface LogoProps {
    size?: number;
    showText?: boolean;
    className?: string;
}

export default function Logo({ size = 32, showText = true, className = '' }: LogoProps) {
    const id = `logo-grad-${size}`;
    return (
        <div className={`flex items-center gap-2.5 select-none ${className}`}>
            {/* Icon: stacked books / open pages mark */}
            <svg
                width={size}
                height={size}
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="Unmath ikon"
            >
                <defs>
                    <linearGradient id={`${id}-a`} x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#818cf8" />
                        <stop offset="100%" stopColor="#6366f1" />
                    </linearGradient>
                    <linearGradient id={`${id}-b`} x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#a78bfa" />
                        <stop offset="100%" stopColor="#818cf8" />
                    </linearGradient>
                    <linearGradient id={`${id}-c`} x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#c4b5fd" />
                        <stop offset="100%" stopColor="#a78bfa" />
                    </linearGradient>
                </defs>

                {/* Bottom book */}
                <rect x="4" y="21" width="24" height="7" rx="2" fill={`url(#${id}-a)`} opacity="0.8" />

                {/* Middle book */}
                <rect x="6" y="14" width="20" height="8" rx="2" fill={`url(#${id}-b)`} />

                {/* Top book — open/diamond shape */}
                <path
                    d="M16 4 L27 11 L16 13.5 L5 11 Z"
                    fill={`url(#${id}-c)`}
                />

                {/* Spine line on top book */}
                <line x1="16" y1="4" x2="16" y2="13.5" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />

                {/* Highlight dot */}
                <circle cx="16" cy="4" r="2" fill="white" opacity="0.9" />
            </svg>

            {showText && (
                <span
                    className="font-extrabold tracking-tight leading-none"
                    style={{
                        fontSize: size * 0.72,
                        background: 'linear-gradient(135deg, #c4b5fd 0%, #818cf8 50%, #6366f1 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}
                >
                    Unmath
                </span>
            )}
        </div>
    );
}
