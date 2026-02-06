"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

interface CalendarEvent {
    id: string;
    title: string;
    event_type: string;
    start_time: string;
}

interface CalendarProps {
    events: CalendarEvent[];
    onDateSelect: (date: Date) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
    party: "bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]",
    workshop: "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]",
    sports: "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]",
    meetup: "bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.8)]",
    other: "bg-campus-accent shadow-[0_0_8px_rgba(198,183,255,0.8)]",
};

export function Calendar({ events, onDateSelect }: CalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const days = [];
    const totalDays = daysInMonth(year, month);
    const startDay = firstDayOfMonth(year, month);

    // Add empty slots for the first week
    for (let i = 0; i < startDay; i++) {
        days.push(null);
    }

    // Add actual days
    for (let i = 1; i <= totalDays; i++) {
        days.push(new Date(year, month, i));
    }

    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));

    const isToday = (date: Date) => {
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    const isSelected = (date: Date) => {
        return date.getDate() === selectedDate.getDate() &&
            date.getMonth() === selectedDate.getMonth() &&
            date.getFullYear() === selectedDate.getFullYear();
    };

    const getEventsForDate = (date: Date) => {
        return events.filter(e => {
            const eventDate = new Date(e.start_time);
            return eventDate.getDate() === date.getDate() &&
                eventDate.getMonth() === date.getMonth() &&
                eventDate.getFullYear() === date.getFullYear();
        });
    };

    return (
        <GlassCard className="p-8 border-campus-accent/20 shadow-[0_0_40px_rgba(198,183,255,0.1)] overflow-visible">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-white flex items-center gap-3">
                    {currentDate.toLocaleString('default', { month: 'long' })}
                    <span className="text-campus-accent/40 font-bold">{year}</span>
                </h2>
                <div className="flex gap-2">
                    <button onClick={prevMonth} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
                        <ChevronLeft className="w-5 h-5 text-campus-secondary" />
                    </button>
                    <button onClick={nextMonth} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
                        <ChevronRight className="w-5 h-5 text-campus-secondary" />
                    </button>
                </div>
            </div>

            {/* Weekdays */}
            <div className="grid grid-cols-7 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                    <div key={d} className="text-center text-[10px] font-black uppercase tracking-widest text-campus-secondary/40">
                        {d}
                    </div>
                ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-2">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={month}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="contents"
                    >
                        {days.map((date, i) => (
                            <div key={i} className="aspect-square flex flex-col items-center justify-center relative">
                                {date && (
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => {
                                            setSelectedDate(date);
                                            onDateSelect(date);
                                        }}
                                        className={`
                                            w-full h-full rounded-2xl flex flex-col items-center justify-center transition-all relative
                                            ${isSelected(date)
                                                ? 'bg-campus-accent text-campus-dark shadow-[0_0_20px_rgba(198,183,255,0.4)] scale-110 z-10'
                                                : isToday(date)
                                                    ? 'bg-white/5 text-white border border-campus-accent/40 ring-2 ring-campus-accent/20'
                                                    : 'hover:bg-white/10 text-campus-secondary'
                                            }
                                        `}
                                    >
                                        <span className={`text-sm font-black ${isSelected(date) ? '' : 'opacity-80'}`}>
                                            {date.getDate()}
                                        </span>

                                        {/* Event Dots */}
                                        <div className="flex gap-0.5 mt-1 absolute bottom-2">
                                            {getEventsForDate(date).slice(0, 3).map((e, idx) => (
                                                <div
                                                    key={idx}
                                                    className={`w-1 h-1 rounded-full ${CATEGORY_COLORS[e.event_type] || CATEGORY_COLORS.other}`}
                                                />
                                            ))}
                                        </div>
                                    </motion.button>
                                )}
                            </div>
                        ))}
                    </motion.div>
                </AnimatePresence>
            </div>
        </GlassCard>
    );
}
