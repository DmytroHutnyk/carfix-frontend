'use client'

import {ChevronRight, GripVertical, ImageIcon, Star, Trash2, Upload} from "lucide-react";

import {Badge} from "@/_components/shadcn/badge";
import {Button} from "@/_components/shadcn/button";

const THUMBNAILS: { id: number; label: string | null }[] = [
    {id: 1, label: "Cover"},
    {id: 2, label: null},
    {id: 3, label: null},
];

export default function BranchPhotosPlaceholder() {
    return (
        <div className="space-y-3">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-border bg-muted">
                <div className="flex h-full w-full items-center justify-center">
                    <ImageIcon className="h-10 w-10 text-muted-foreground"/>
                </div>
                <Badge className="absolute left-3 top-3">Cover Photo</Badge>
                <div className="absolute right-3 top-3 flex gap-2">
                    <Button type="button" variant="white" size="icon" aria-label="Set as cover photo">
                        <Star/>
                    </Button>
                    <Button type="button" variant="white" size="icon" aria-label="Remove photo">
                        <Trash2/>
                    </Button>
                </div>
                <Button
                    type="button"
                    variant="white"
                    size="icon"
                    aria-label="Next photo"
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full"
                >
                    <ChevronRight/>
                </Button>
            </div>

            <div className="grid grid-cols-3 gap-3">
                {THUMBNAILS.map((thumb) => (
                    <div
                        key={thumb.id}
                        className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-muted"
                    >
                        <div className="flex h-full w-full items-center justify-center">
                            <ImageIcon className="h-6 w-6 text-muted-foreground"/>
                        </div>
                        {thumb.label && (
                            <span className="absolute left-1.5 top-1.5 rounded bg-foreground/80 px-1.5 py-0.5 text-xs font-medium text-background">
                                {thumb.label}
                            </span>
                        )}
                        <span className="absolute right-1.5 top-1.5 rounded bg-background/80 p-0.5 text-muted-foreground">
                            <GripVertical className="h-3 w-3"/>
                        </span>
                    </div>
                ))}
            </div>

            <Button type="button" className="w-full">
                <Upload/> Upload more photos (3/20)
            </Button>
        </div>
    );
}
