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

const NAVIGABLE_TABS = new Set<BranchTabKey>(["overview", "bookings", "employees", "equipment", "reviews", "carBays"]);

export default function BranchTabs({active}: { active: BranchTabKey }) {
    return (
        <div role="tablist" className="flex w-full gap-1 overflow-x-auto rounded-lg bg-muted p-1">
            {BRANCH_TABS.map((tab) => {
                const selected = tab.key === active;
                const base = "shrink-0 rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap";

                if (selected) {
                    return (
                        <span
                            key={tab.key}
                            role="tab"
                            aria-selected="true"
                            className={cn(base, "bg-secondary text-secondary-foreground shadow-sm")}
                        >
                            {tab.label}
                        </span>
                    );
                }

                if (NAVIGABLE_TABS.has(tab.key)) {
                    return (
                        <Link
                            key={tab.key}
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
