import {MapPin} from "lucide-react";
import {Badge} from "@/_components/shadcn/badge";
import StarRating from "@/(main)/(withFooter)/search/_components/starRating";
import {Workshop} from "@/features/workshop/workshopTypes";
import {fullAddress} from "@/features/workshop/workshopList";

export default function WorkshopHeading({workshop}: { workshop: Workshop }) {
    return (
        <div className="flex flex-col gap-1 lg:gap-2">
            <h1 className="text-lg font-semibold tracking-tight lg:text-3xl lg:font-bold">{workshop.name}</h1>
            <div className="flex items-center gap-1.5 text-xs lg:gap-2 lg:text-sm">
                {workshop.rating != null && workshop.reviewCount != null ? (
                    <>
                        <StarRating rating={workshop.rating} className="h-3 w-3 lg:h-4 lg:w-4"/>
                        <span className="font-medium">({workshop.rating})</span>
                    </>
                ) : (
                    <Badge variant="secondary">New</Badge>
                )}
            </div>
            <p className="flex items-center gap-1 text-xs text-muted-foreground lg:text-base">
                <MapPin className="h-3.5 w-3.5 shrink-0 lg:h-4 lg:w-4"/>
                {fullAddress(workshop)}
            </p>
        </div>
    );
}
