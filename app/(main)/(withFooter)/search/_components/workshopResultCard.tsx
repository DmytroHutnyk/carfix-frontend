import Link from "next/link";
import {MapPin, Store, Wrench} from "lucide-react";
import {Badge} from "@/_components/shadcn/badge";
import {Card} from "@/_components/shadcn/card";
import StarRating from "@/(main)/(withFooter)/search/_components/starRating";
import {WorkshopResult} from "@/features/search/searchTypes";
import {formatPrice} from "@/features/booking/bookingList";
import {formatDistance, formatDuration} from "@/features/search/searchList";
import {cn} from "@/lib/utils";

export default function WorkshopResultCard({workshop, pinned = false}: {
    workshop: WorkshopResult;
    pinned?: boolean;
}) {
    return (
        <Link href={`/branches/${workshop.branchId}`} className="block">
            <Card className={cn(
                "flex flex-col gap-4 p-4 transition-shadow hover:shadow-md",
                pinned && "border-primary ring-1 ring-primary"
            )}>
                {pinned && (
                    <Badge className="w-fit">The workshop you picked</Badge>
                )}

                {/* Identity row: picture on the left, everything that names the branch on the right */}
                <div className="flex flex-col gap-4 sm:flex-row">
                    {/* Static placeholder until file upload/serving lands. 16:10, not square. */}
                    <div className="flex aspect-[16/10] w-full shrink-0 items-center justify-center rounded-lg bg-muted sm:w-72">
                        <Store className="h-10 w-10 text-muted-foreground"/>
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                        <h2 className="text-lg font-bold">{workshop.name}</h2>

                        <p className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4 shrink-0"/>
                            ul. {workshop.streetName} {workshop.buildingNumber}, {workshop.city}
                        </p>

                        <div className="flex items-center gap-2 text-sm">
                            {workshop.rating != null && workshop.reviewCount != null ? (
                                <>
                                    <StarRating rating={workshop.rating}/>
                                    <span className="font-medium">{workshop.rating}</span>
                                    <span className="text-muted-foreground">· {workshop.reviewCount} reviews</span>
                                </>
                            ) : (
                                <Badge variant="secondary">New</Badge>
                            )}
                            {workshop.distanceKm != null && (
                                <span className="text-muted-foreground">· {formatDistance(workshop.distanceKm)}</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Matched services run the full width, below the picture */}
                {workshop.matchedServices.length > 0 && (
                    <ul className="flex flex-col gap-2 border-t pt-3">
                        {workshop.matchedServices.map((service) => (
                            <li key={service.serviceId} className="flex items-center gap-3">
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                                    <Wrench className="h-4 w-4 text-muted-foreground"/>
                                </span>
                                <span className="min-w-0 flex-1">
                                    <span className="block truncate font-medium">{service.name}</span>
                                    <span className="block text-xs text-muted-foreground">
                                        {formatDuration(service.durationMinutes)} · {service.categoryName}
                                    </span>
                                </span>
                                <Badge variant="outline" className="shrink-0 tabular-nums">
                                    {formatPrice(service.price)}
                                </Badge>
                            </li>
                        ))}
                        {/* Same destination as the card link, so a plain styled row — no nested anchor */}
                        <li className="text-sm font-medium text-primary">See all services →</li>
                    </ul>
                )}
            </Card>
        </Link>
    );
}
