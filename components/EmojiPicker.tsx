'use client';

import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import data from '@emoji-mart/data';

// Dynamic import — hanya load di browser, hindari error SSR
const Picker = dynamic(
    () => import('@emoji-mart/react').then((mod) => mod.default),
    { ssr: false }
);

interface EmojiPickerProps {
    /** Dipanggil saat emoji dipilih, membawa karakter unicode (misal: "😀") */
    onEmojiSelect: (emoji: string) => void;
    /** Teks / label tombol trigger (default: 😊) */
    triggerLabel?: string;
    /** Posisi picker: 'top' | 'bottom' (default: 'top') */
    position?: 'top' | 'bottom';
}

export default function EmojiPicker({
    onEmojiSelect,
    triggerLabel = '😊',
    position = 'top',
}: EmojiPickerProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // Tutup picker kalau klik di luar
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const positionClass = position === 'top'
        ? 'bottom-12 left-0'
        : 'top-12 left-0';

    return (
        <div ref={ref} className="relative inline-block">
            {/* Trigger button */}
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="px-3 py-2 rounded-xl text-xl transition-all duration-200 glass-card hover:scale-110 active:scale-95"
                aria-label="Pilih emoji"
                aria-expanded={open}
            >
                {triggerLabel}
            </button>

            {/* Picker dropdown */}
            {open && (
                <div className={`absolute ${positionClass} z-50 shadow-xl rounded-2xl overflow-hidden`}>
                    <Picker
                        data={data}
                        onEmojiSelect={(emoji: { native: string }) => {
                            onEmojiSelect(emoji.native);
                            setOpen(false);
                        }}
                        locale="id"
                        theme="dark"
                        previewPosition="none"
                        skinTonePosition="none"
                    />
                </div>
            )}
        </div>
    );
}
