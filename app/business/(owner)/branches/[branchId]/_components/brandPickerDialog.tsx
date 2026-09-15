'use client'

import {useMemo, useState} from "react";
import {Plus} from "lucide-react";

import {useCarCatalog} from "@/features/carCatalog/useCarCatalog";

import {Button} from "@/_components/shadcn/button";
import {Checkbox} from "@/_components/shadcn/checkbox";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/_components/shadcn/dialog";
import {Input} from "@/_components/shadcn/input";
import {Label} from "@/_components/shadcn/label";
import {ScrollArea} from "@/_components/shadcn/scroll-area";
import {Separator} from "@/_components/shadcn/separator";

export default function BrandPickerDialog({selected, onConfirm}: {
    selected: number[];
    onConfirm: (ids: number[]) => void;
}) {
    const {brands, isBrandsLoading, isBrandsError} = useCarCatalog(null, null);
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [draft, setDraft] = useState<number[]>(selected);

    const visible = useMemo(
        () => brands.filter((b) => b.name.toLowerCase().includes(query.trim().toLowerCase())),
        [brands, query]
    );
    const allVisibleSelected = visible.length > 0 && visible.every((b) => draft.includes(b.id));
    const someVisibleSelected = visible.some((b) => draft.includes(b.id));

    const toggleAll = (checked: boolean) => {
        const visibleIds = visible.map((b) => b.id);
        setDraft(checked
            ? Array.from(new Set([...draft, ...visibleIds]))
            : draft.filter((id) => !visibleIds.includes(id)));
    };

    const toggle = (id: number, checked: boolean) =>
        setDraft(checked ? [...draft, id] : draft.filter((v) => v !== id));

    const onOpenChange = (next: boolean) => {
        if (next) {
            setDraft(selected);
            setQuery("");
        }
        setOpen(next);
    };

    const apply = () => {
        onConfirm(draft);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button type="button" size="sm"><Plus/> Add Brand</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Car brands we work with</DialogTitle>
                    <DialogDescription>Pick every brand this service point accepts.</DialogDescription>
                </DialogHeader>

                <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search brands…"/>
                <div className="rounded-xl border border-border p-4">
                    <div className="flex items-center gap-3">
                        <Checkbox
                            id="branch-brands-select-all"
                            checked={allVisibleSelected ? true : someVisibleSelected ? "indeterminate" : false}
                            onCheckedChange={(checked) => toggleAll(checked === true)}
                        />
                        <Label htmlFor="branch-brands-select-all" className="font-semibold">Select all</Label>
                    </div>
                    <Separator className="my-3"/>
                    <ScrollArea className="h-72">
                        <div className="space-y-3 pr-3">
                            {isBrandsLoading && <p className="text-sm text-muted-foreground">Loading brands…</p>}
                            {isBrandsError && (
                                <p className="text-sm text-destructive">Couldn&apos;t load brands — reload the page and try again</p>
                            )}
                            {!isBrandsLoading && !isBrandsError && visible.length === 0 && (
                                <p className="text-sm text-muted-foreground">No brands match “{query}”</p>
                            )}
                            {visible.map((brand) => (
                                <div key={brand.id} className="flex items-center gap-3">
                                    <Checkbox
                                        id={`branch-brand-${brand.id}`}
                                        checked={draft.includes(brand.id)}
                                        onCheckedChange={(checked) => toggle(brand.id, checked === true)}
                                    />
                                    <Label htmlFor={`branch-brand-${brand.id}`} className="font-normal">{brand.name}</Label>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
                <p className="text-sm text-muted-foreground">{draft.length} selected</p>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button type="button" onClick={apply}>Apply</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
