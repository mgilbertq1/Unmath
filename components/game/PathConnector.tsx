'use client';

interface PathConnectorProps {
    completed: boolean;
    subject: 'math' | 'pkn';
}

export default function PathConnector({ completed, subject }: PathConnectorProps) {
    const solidColor = subject === 'math' ? '#3b82f6' : '#10b981';
    const dashedColor = subject === 'math' ? '#1d4ed8' : '#065f46';

    return (
        <div className="flex items-center justify-center w-8 h-16 mx-auto">
            {completed ? (
                // Solid line — level done
                <div
                    className="w-1 h-full rounded-full"
                    style={{ background: `linear-gradient(to bottom, ${solidColor}, ${solidColor}aa)` }}
                />
            ) : (
                // Dashed line — not yet unlocked
                <div className="w-1 h-full flex flex-col justify-between items-center">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div
                            key={i}
                            className="w-1 rounded-full"
                            style={{
                                height: '18%',
                                background: dashedColor,
                                opacity: 0.35,
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
