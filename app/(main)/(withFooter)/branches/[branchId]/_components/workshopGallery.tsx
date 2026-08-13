import {ImageIcon} from "lucide-react";
import {cn} from "@/lib/utils";

export default function WorkshopGallery() {
    return (
        <div className="flex flex-col gap-3">
            <div className="flex aspect-[16/9] w-full items-center justify-center rounded-xl bg-muted">
                <ImageIcon className="h-12 w-12 text-muted-foreground"/>
            </div>
            <div className="flex gap-3">
                {[0, 1, 2].map((i) => (
                    <div
                        key={i}
                        className={cn(
                            "flex h-16 w-24 items-center justify-center rounded-lg bg-muted",
                            i === 0 && "ring-2 ring-ring",
                        )}
                    >
                        <ImageIcon className="h-4 w-4 text-muted-foreground"/>
                    </div>
                ))}
            </div>
        </div>
    );
}
