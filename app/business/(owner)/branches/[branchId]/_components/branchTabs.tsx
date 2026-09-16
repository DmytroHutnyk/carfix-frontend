'use client'

import {useEffect, useLayoutEffect, useRef, useState} from "react";
import Link from "next/link";
import {cn} from "@/lib/utils";

const BRANCH_TABS = [
    {key: "overview", label: "Overview"},
    {key: "bookings", label: "Bookings"},
    {key: "employees", label: "Employees"},
    {key: "equipment", label: "Equipment"},
    {key: "carBays", label: "Car Bays"},
    {key: "reviews", label: "Reviews"},
    {key: "services", label: "Services"},
] as const;

export type BranchTabKey = (typeof BRANCH_TABS)[number]["key"];

const NAVIGABLE_TABS = new Set<BranchTabKey>(["overview", "bookings", "employees", "equipment", "reviews", "carBays", "services"]);

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

let lastActiveKey: BranchTabKey | null = null;

export default function BranchTabs({active}: { active: BranchTabKey }) {
    const listRef = useRef<HTMLDivElement>(null);
    const [pill, setPill] = useState<{ left: number; width: number } | null>(null);

    const measure = (key: BranchTabKey) => {
        const el = listRef.current?.querySelector<HTMLElement>(`[data-tab="${key}"]`);
        return el ? {left: el.offsetLeft, width: el.offsetWidth} : null;
    };

    useIsoLayoutEffect(() => {
        const target = measure(active);
        if (!target) return;

        const from = lastActiveKey && lastActiveKey !== active ? measure(lastActiveKey) : null;
        lastActiveKey = active;

        if (from) {
            setPill(from);
            const id = requestAnimationFrame(() => setPill(target));
            return () => cancelAnimationFrame(id);
        }
        setPill(target);
    }, [active]);

    useEffect(() => {
        const list = listRef.current;
        if (!list) return;
        const observer = new ResizeObserver(() => setPill(measure(active)));
        observer.observe(list);
        return () => observer.disconnect();
    }, [active]);

    return (
        <div ref={listRef} role="tablist" className="relative flex w-full gap-1 overflow-x-auto rounded-lg bg-muted p-1">
            {pill && (
                <span
                    aria-hidden
                    className="absolute top-1 bottom-1 rounded-md bg-accent shadow-sm transition-[left,width] duration-300 ease-out"
                    style={{left: pill.left, width: pill.width}}
                />
            )}

            {BRANCH_TABS.map((tab) => {
                const selected = tab.key === active;
                const base = "relative z-10 flex-1 rounded-md px-3 py-1.5 text-center text-sm font-medium whitespace-nowrap";

                if (selected) {
                    return (
                        <span
                            key={tab.key}
                            data-tab={tab.key}
                            role="tab"
                            aria-selected="true"
                            className={cn(base, "text-accent-foreground")}
                        >
                            {tab.label}
                        </span>
                    );
                }

                if (NAVIGABLE_TABS.has(tab.key)) {
                    return (
                        <Link
                            key={tab.key}
                            data-tab={tab.key}
                            role="tab"
                            aria-selected="false"
                            href={`?tab=${tab.key}`}
                            className={cn(base, "text-muted-foreground hover:text-foreground")}
                        >
                            {tab.label}
                        </Link>
                    );
                }

                return (
                    <button
                        key={tab.key}
                        data-tab={tab.key}
                        type="button"
                        role="tab"
                        aria-selected="false"
                        disabled
                        className={cn(base, "cursor-not-allowed text-muted-foreground opacity-50")}
                    >
                        {tab.label}
                    </button>
                );
            })}
        </div>
    );
}
