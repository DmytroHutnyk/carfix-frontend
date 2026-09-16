'use client'

import {ChevronLeft, ChevronRight, ListFilter, Search} from "lucide-react";

import {ServiceCategoryCount} from "@/features/ownerService/ownerServiceList";
import {Card, CardContent} from "@/_components/shadcn/card";
import {Input} from "@/_components/shadcn/input";
import {Button} from "@/_components/shadcn/button";
import {Badge} from "@/_components/shadcn/badge";
import {cn} from "@/lib/utils";

interface ServiceCategorySidebarProps {
    counts: ServiceCategoryCount[];
    totalCount: number;
    selectedCategoryId: number | null;
    onSelectCategory: (id: number | null) => void;
    query: string;
    onQueryChange: (query: string) => void;
    onExpandAll: () => void;
    onCollapseAll: () => void;
    collapsed: boolean;
    onToggleCollapsed: () => void;
}

export default function ServiceCategorySidebar({
                                                   counts, totalCount, selectedCategoryId, onSelectCategory,
                                                   query, onQueryChange, onExpandAll, onCollapseAll,
                                                   collapsed, onToggleCollapsed,
                                               }: ServiceCategorySidebarProps) {
    const q = query.trim().toLowerCase();
    const activeCount = selectedCategoryId === null
        ? totalCount
        : counts.find((c) => c.categoryId === selectedCategoryId)?.count ?? 0;
    const visible = q ? counts.filter((c) => c.categoryName.toLowerCase().includes(q)) : counts;

    const rowClass = (selected: boolean) => cn(
        "flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors",
        selected ? "border-primary bg-accent/20" : "border-transparent hover:bg-accent/15"
    );

    return (
        <Card className={cn("self-start transition-[width] lg:w-[380px]", collapsed && "lg:w-16")}>
            <CardContent className="flex flex-col gap-3 p-4 lg:p-6">
                <div className={cn("flex items-center gap-2", collapsed ? "justify-between lg:justify-center" : "justify-between")}>
                    <h2 className={cn("text-lg font-semibold tracking-tight", collapsed && "lg:hidden")}>Categories</h2>
                    <Button type="button" variant="ghost" size="icon" className="hidden lg:inline-flex"
                            aria-label={collapsed ? "Expand categories" : "Collapse categories"} onClick={onToggleCollapsed}>
                        {collapsed ? <ChevronRight/> : <ChevronLeft/>}
                    </Button>
                </div>

                {collapsed && (
                    <div className="hidden flex-col items-center gap-2 lg:flex">
                        <ListFilter className="h-5 w-5 text-muted-foreground"/>
                        <Badge variant="secondary">{activeCount}</Badge>
                    </div>
                )}

                <div className={cn("flex flex-col gap-3", collapsed && "lg:hidden")}>
                    <div className="relative">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
                        <Input value={query} onChange={(e) => onQueryChange(e.target.value)} placeholder="Search categories" className="pl-9"/>
                    </div>

                    <button type="button" onClick={() => onSelectCategory(null)} className={rowClass(selectedCategoryId === null)}>
                        <span className="min-w-0 truncate font-medium">All categories</span>
                        <Badge variant="secondary">{totalCount}</Badge>
                    </button>

                    <div className="flex flex-col gap-1">
                        {visible.length === 0 ? (
                            <p className="py-4 text-center text-sm text-muted-foreground">No categories yet.</p>
                        ) : (
                            visible.map((category) => (
                                <button
                                    key={category.categoryId}
                                    type="button"
                                    onClick={() => onSelectCategory(category.categoryId)}
                                    className={rowClass(selectedCategoryId === category.categoryId)}
                                >
                                    <span className="min-w-0 truncate">{category.categoryName}</span>
                                    <Badge variant="secondary">{category.count}</Badge>
                                </button>
                            ))
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <Button type="button" variant="outline" size="sm" className="flex-1" onClick={onExpandAll}>Expand all</Button>
                        <Button type="button" variant="outline" size="sm" className="flex-1" onClick={onCollapseAll}>Collapse all</Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
