import {MapPin} from "lucide-react";
import {Badge} from "@/_components/shadcn/badge";
import StarRating from "@/(main)/(withFooter)/search/_components/starRating";
import {Workshop} from "@/features/workshop/workshopTypes";
import {fullAddress} from "@/features/workshop/workshopList";

export default function WorkshopHeading({workshop}: { workshop: Workshop }) {
    return (
        <div className="flex flex-col gap-1.5 lg:gap-2">
            <h1 className="text-xl font-bold tracking-tight lg:text-3xl">{workshop.name}</h1>
            <div className="flex items-center gap-2 text-sm">
                {workshop.rating != null && workshop.reviewCount != null ? (
                    <>
                        <StarRating rating={workshop.rating}/>
                        <span className="font-medium">({workshop.rating})</span>
                    </>
                ) : (
                    <Badge variant="secondary">New</Badge>
                )}
            </div>
            <p className="flex items-center gap-1 text-sm text-muted-foreground lg:text-base">
                <MapPin className="h-4 w-4 shrink-0"/>
                {fullAddress(workshop)}
            </p>
        </div>
    );
}
