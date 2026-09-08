import Link from "next/link";
import {CalendarClock, MapPin, Store, Wrench} from "lucide-react";
import {Badge} from "@/_components/shadcn/badge";
import {Card} from "@/_components/shadcn/card";
import StarRating from "@/(main)/(withFooter)/search/_components/starRating";
import {WorkshopResult} from "@/features/search/searchTypes";
import {formatPrice} from "@/features/booking/bookingList";
import {formatDistance, formatDuration, formatStartLabel} from "@/features/search/searchList";
import {cn} from "@/lib/utils";

export default function WorkshopResultCard({workshop, href, singleDay, pinned = false}: {
    workshop: WorkshopResult;
    href: string;
    singleDay: boolean;
    pinned?: boolean;
}) {
    return (
        <Link href={href} className="block">
            <Card className={cn(
                "flex flex-col gap-2 p-3 transition-shadow hover:shadow-md lg:gap-4 lg:p-4",
                pinned && "border-primary ring-1 ring-primary"
            )}>
                {pinned && (
                    <Badge className="w-fit">The workshop you picked</Badge>
                )}

                <div className="flex gap-3 lg:gap-4">
                    <div className="flex h-18 w-18 shrink-0 items-center justify-center rounded-md bg-muted lg:aspect-[16/10] lg:h-auto lg:w-72 lg:rounded-lg">
                        <Store className="h-6 w-6 text-muted-foreground lg:h-10 lg:w-10"/>
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col gap-1 lg:gap-2">
                        <h2 className="line-clamp-2 text-sm font-semibold lg:line-clamp-none lg:text-lg lg:font-bold">
                            {workshop.name}
                        </h2>

                        <p className="flex items-center gap-1 text-xs text-muted-foreground lg:text-sm">
                            <MapPin className="h-3.5 w-3.5 shrink-0 lg:h-4 lg:w-4"/>
                            <span className="truncate">
                                ul. {workshop.streetName} {workshop.buildingNumber}, {workshop.city}
                            </span>
                        </p>

                        <div className="flex items-center gap-1.5 text-xs lg:gap-2 lg:text-sm">
                            {workshop.rating != null && workshop.reviewCount != null ? (
                                <>
                                    <StarRating rating={workshop.rating} className="h-3 w-3 lg:h-4 lg:w-4"/>
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

                        {workshop.nextAvailableStarts && workshop.nextAvailableStarts.length > 0 && (
                            <div
                                className="flex flex-wrap items-center gap-1.5 text-xs lg:gap-2 lg:text-sm"
                                title={`Workshop local time (${workshop.tz})`}
                            >
                                <CalendarClock className="h-3.5 w-3.5 shrink-0 text-muted-foreground lg:h-4 lg:w-4"/>
                                <span className="text-muted-foreground">Next available:</span>
                                {workshop.nextAvailableStarts.map((start) => (
                                    <Badge key={`${start.date}T${start.startTime}`} variant="outline" className="tabular-nums">
                                        {formatStartLabel(start, singleDay)}
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {workshop.matchedServices.length > 0 && (
                    <ul className="flex flex-col gap-1.5 border-t pt-2 lg:gap-2 lg:pt-3">
                        {workshop.matchedServices.map((service) => (
                            <li key={service.serviceId} className="flex items-center gap-2 lg:gap-3">
                                <span className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted lg:flex">
                                    <Wrench className="h-4 w-4 text-muted-foreground"/>
                                </span>
                                <span className="min-w-0 flex-1">
                                    <span className="block truncate text-xs font-medium lg:text-base">{service.name}</span>
                                    <span className="block truncate text-xs text-muted-foreground">
                                        {formatDuration(service.durationMinutes)} · {service.categoryName}
                                    </span>
                                </span>
                                <Badge variant="outline" className="shrink-0 tabular-nums">
                                    {formatPrice(service.price)}
                                </Badge>
                            </li>
                        ))}
                        {/* Same destination as the card link, so a plain styled row — no nested anchor */}
                        <li className="text-xs font-medium text-primary lg:text-sm">See all services →</li>
                    </ul>
                )}
            </Card>
        </Link>
    );
}
