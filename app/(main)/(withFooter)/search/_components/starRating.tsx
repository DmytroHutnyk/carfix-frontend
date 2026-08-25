import {Star} from "lucide-react";
import {cn} from "@/lib/utils";

/* Fractional fill: a full muted star row with a width-clipped filled row on top. */
export default function StarRating({rating, className}: { rating: number; className?: string }) {
    const star = cn("h-4 w-4", className);
    return (
        <span className="relative inline-flex" role="img" aria-label={`${rating} out of 5`}>
            <span className="flex text-muted-foreground/40">
                {Array.from({length: 5}, (_, i) => <Star key={i} className={star}/>)}
            </span>
            <span
                className="absolute inset-0 flex overflow-hidden text-primary"
                style={{width: `${(rating / 5) * 100}%`}}
            >
                {Array.from({length: 5}, (_, i) => <Star key={i} className={cn(star, "shrink-0 fill-current")}/>)}
            </span>
        </span>
    );
}
