'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useUserStore } from '@/lib/store/user-store';

/* --- Helper for Audio Fading --- */
function fadeAudio(audio: HTMLAudioElement, targetVolume: number, durationMs: number = 1000): Promise<void> {
    return new Promise((resolve) => {
        const startVolume = audio.volume;
        const volumeDiff = targetVolume - startVolume;
        const startTime = performance.now();

        function animate(currentTime: number) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / durationMs, 1);
            
            // Linear fade
            audio.volume = Math.max(0, Math.min(1, startVolume + (volumeDiff * progress)));
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                resolve();
            }
        }
        
        requestAnimationFrame(animate);
    });
}

export default function GlobalAudio() {
    const pathname = usePathname();
    const { soundEnabled } = useUserStore();
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Initialize Audio Object Once
    useEffect(() => {
        const audio = new Audio('/sounds/backsound 01.mp3');
        audio.loop = true;
        audio.volume = 0;
        audioRef.current = audio;

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
                audioRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (!audioRef.current) return;
        const audio = audioRef.current;

        // Determine if we should play music on current route
        // Play everywhere EXCPET if currently playing the quiz
        // e.g. /game/math?level=1 -> pause
        // e.g. /game/math/levels -> play
        const isGameActive = pathname.startsWith('/game/') && !pathname.includes('/levels');
        
        const shouldPlay = soundEnabled && !isGameActive;

        if (shouldPlay) {
            if (audio.paused) {
                audio.play().then(() => {
                    fadeAudio(audio, 0.4, 1500); // Fade in to 0.4 volume
                }).catch((err) => console.warn('Global audio play prevented', err));
            } else if (audio.volume !== 0.4) {
                 // Adjust volume back up if it was fading out previously but interrupted
                 fadeAudio(audio, 0.4, 1000);
            }
        } else {
            // Fade out and pause if entering game or sound disabled
            if (!audio.paused) {
                fadeAudio(audio, 0, 800).then(() => {
                     // VERY IMPORTANT: Check states again AFTER fade finishes
                     // user might have navigated back to home while it was fading!
                     const isStillGameActive = window.location.pathname.startsWith('/game/') && !window.location.pathname.includes('/levels');
                     if (!useUserStore.getState().soundEnabled || isStillGameActive) {
                          audio.pause();
                     }
                });
            }
        }

    }, [pathname, soundEnabled]);

    return null; // This component has no UI
}
