import {ImageIcon} from "lucide-react";
import {cn} from "@/lib/utils";

export default function WorkshopGallery() {
    return (
        <div className="flex flex-col gap-2 lg:gap-3">
            <div className="flex h-36 w-full items-center justify-center rounded-xl bg-muted lg:aspect-[16/9] lg:h-auto">
                <ImageIcon className="h-8 w-8 text-muted-foreground lg:h-12 lg:w-12"/>
            </div>
            <div className="flex gap-2 lg:gap-3">
                {[0, 1, 2].map((i) => (
                    <div
                        key={i}
                        className={cn(
                            "flex h-11 w-14 shrink-0 items-center justify-center rounded-lg bg-muted lg:h-16 lg:w-24",
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
