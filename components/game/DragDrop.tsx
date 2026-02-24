'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
    DndContext,
    closestCenter,
    useSensor,
    useSensors,
    PointerSensor,
    TouchSensor,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
    useSortable,
    arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface DragDropProps {
    pairs: { left: string; right: string }[];
    onSubmit: (answer: string[]) => void;
    disabled: boolean;
    checked: boolean;
    correctAnswer: string[];
    subject: 'math' | 'pkn';
}

function SortableItem({ id, children, disabled }: { id: string; children: React.ReactNode; disabled: boolean }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id, disabled });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 'auto' as string | number,
        opacity: isDragging ? 0.8 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {children}
        </div>
    );
}

export default function DragDrop({
    pairs,
    onSubmit,
    disabled,
    checked,
    correctAnswer,
    subject,
}: DragDropProps) {
    const [rightItems, setRightItems] = useState(() => {
        const items = pairs.map((p) => p.right);
        for (let i = items.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [items[i], items[j]] = [items[j], items[i]];
        }
        return items;
    });

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
    );

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setRightItems((items) => {
                const oldIndex = items.indexOf(active.id as string);
                const newIndex = items.indexOf(over.id as string);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    }, []);

    const handleSubmit = () => {
        const answer = pairs.map((p, i) => `${p.left}::${rightItems[i]}`);
        onSubmit(answer);
    };

    const accentColor = subject === 'math' ? '#6366f1' : '#10b981';

    return (
        <div className="space-y-4">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <div className="space-y-3">
                    {pairs.map((pair, idx) => {
                        const currentRight = rightItems[idx];
                        const expectedPair = `${pair.left}::${currentRight}`;
                        const isCorrectPair = checked && correctAnswer.includes(expectedPair);
                        const isWrongPair = checked && !correctAnswer.includes(expectedPair);

                        let rightStyle: React.CSSProperties = {
                            background: 'rgba(255,255,255,0.05)',
                            border: '2px solid rgba(255,255,255,0.1)',
                        };
                        let rightTextClass = 'text-white/80';

                        if (isCorrectPair) {
                            rightStyle = {
                                background: 'rgba(16,185,129,0.15)',
                                border: '2px solid rgba(16,185,129,0.4)',
                            };
                            rightTextClass = 'text-emerald-300';
                        } else if (isWrongPair) {
                            rightStyle = {
                                background: 'rgba(239,68,68,0.15)',
                                border: '2px solid rgba(239,68,68,0.4)',
                            };
                            rightTextClass = 'text-red-300';
                        }

                        return (
                            <motion.div
                                key={pair.left}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1, duration: 0.3 }}
                                className="flex items-center gap-3"
                            >
                                {/* Left side - fixed */}
                                <div className="flex-1 rounded-xl p-3 text-sm font-semibold text-white/80"
                                    style={{
                                        background: `${accentColor}15`,
                                        border: `2px solid ${accentColor}30`,
                                    }}
                                >
                                    {pair.left}
                                </div>

                                {/* Arrow */}
                                <span className="text-white/20 text-lg">→</span>

                                {/* Right side - sortable */}
                                <SortableContext items={rightItems} strategy={verticalListSortingStrategy}>
                                    <div className="flex-1">
                                        <SortableItem id={currentRight} disabled={disabled}>
                                            <div
                                                className={`rounded-xl p-3 text-sm font-semibold transition-colors duration-200
                                                    ${disabled ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'}
                                                    ${rightTextClass}
                                                `}
                                                style={rightStyle}
                                            >
                                                <span className="flex items-center gap-2">
                                                    {!disabled && <span className="text-white/25">⠿</span>}
                                                    {currentRight}
                                                    {isCorrectPair && <span className="ml-auto">✓</span>}
                                                    {isWrongPair && <span className="ml-auto">✕</span>}
                                                </span>
                                            </div>
                                        </SortableItem>
                                    </div>
                                </SortableContext>
                            </motion.div>
                        );
                    })}
                </div>
            </DndContext>

            {!checked && !disabled && (
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    onClick={handleSubmit}
                    className="w-full mt-4 py-3.5 rounded-2xl font-bold text-white transition-all duration-200"
                    style={{
                        background: `linear-gradient(135deg, ${accentColor}, ${subject === 'math' ? '#818cf8' : '#34d399'})`,
                        boxShadow: `0 4px 24px ${accentColor}33`,
                    }}
                >
                    PASANGKAN
                </motion.button>
            )}
        </div>
    );
}
