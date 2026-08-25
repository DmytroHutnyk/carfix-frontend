import {ImageIcon} from "lucide-react";
import {Card} from "@/_components/shadcn/card";
import {cn} from "@/lib/utils";

export default function ImagePlaceholder({className}: { className?: string }) {
    return (
        <Card aria-hidden="true" className={cn("flex items-center justify-center", className)}>
            <ImageIcon className="h-10 w-10 text-muted-foreground lg:h-14 lg:w-14" strokeWidth={1.5}/>
        </Card>
    );
}
