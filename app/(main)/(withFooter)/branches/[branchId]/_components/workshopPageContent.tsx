"use client"

import {useState, useSyncExternalStore} from "react";
import Link from "next/link";
import {Store} from "lucide-react";
import {Button} from "@/_components/shadcn/button";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/_components/shadcn/breadcrumb";
import {Card, CardContent, CardHeader, CardTitle} from "@/_components/shadcn/card";
import {isProblemDetailError} from "@/lib/apiTypes";
import {VisitRange} from "@/features/slots/slotTypes";
import {formatPrice} from "@/features/booking/bookingList";
import {useWorkshop} from "@/features/workshop/useWorkshop";
import {buildSearchUrl} from "@/features/search/searchUrl";
import {useSearchLocation} from "@/lib/store";
import BookingFlowPopover from "./booking/bookingFlowPopover";
import {CANCELLATION_POLICY_CONTENT} from "@/features/ownerBranch/cancellationPolicyContent";
import WorkshopPageSkeleton from "./workshopPageSkeleton";
import WorkshopGallery from "./workshopGallery";
import WorkshopHeading from "./workshopHeading";
import ServicesSection from "./servicesSection";
import SummaryCard from "./summaryCard";
import MapCard from "./mapCard";
import BrandsCard from "./brandsCard";
import OpeningHoursCard from "./openingHoursCard";
import ContactCard from "./contactCard";
import ReviewsCard from "./reviewsCard";

const subscribeToNothing = () => () => {};

function useSearchHref() {
    const searchLocation = useSearchLocation((s) => s.searchLocation);
    const hydrated = useSyncExternalStore(subscribeToNothing, () => true, () => false);
    return hydrated ? buildSearchUrl({kind: "browse"}, searchLocation) : "/search";
}

export default function WorkshopPageContent({branchId, initialServiceName, initialRange}: {
    branchId: string;
    initialServiceName: string | null;
    initialRange: VisitRange | null;
}) {
    const {workshop, isLoading, isError, error} = useWorkshop(branchId);
    const searchHref = useSearchHref();
    /* null = the user has not touched the basket yet, so the deep-linked service stays preselected */
    const [selectedIds, setSelectedIds] = useState<number[] | null>(null);

    if (isLoading) return <WorkshopPageSkeleton/>;
    if (isError && isProblemDetailError(error) && error.status === 404) {
        return (
            <EmptyState
                title="Workshop not found"
                message="This workshop does not exist or is no longer available."
            />
        );
    }
    if (isError || !workshop) {
        return (
            <EmptyState
                title="Something went wrong"
                message="We could not load this workshop. Please try again."
            />
        );
    }

    const allServices = workshop.serviceCategories.flatMap((category) => category.services);
    const preselectedIds = initialServiceName
        ? allServices
            .filter((service) => service.name.toLowerCase() === initialServiceName.toLowerCase())
            .slice(0, 1)
            .map((service) => service.serviceId)
        : [];
    const effectiveIds = selectedIds ?? preselectedIds;
    const selectedServices = allServices.filter((service) => effectiveIds.includes(service.serviceId));

    const toggleService = (serviceId: number) =>
        setSelectedIds((prev) => {
            const current = prev ?? preselectedIds;
            return current.includes(serviceId)
                ? current.filter((id) => id !== serviceId)
                : [...current, serviceId];
        });

    const selectedTotal = selectedServices.reduce((sum, service) => sum + service.price, 0);

    return (
        <div className="mx-auto w-full max-w-[1475px] px-4 py-4 lg:px-6 lg:py-6">
            <Breadcrumb className="mb-3 lg:mb-4">
                <BreadcrumbList className="text-xs lg:text-sm">
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href={searchHref}>Search results</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator/>
                    <BreadcrumbItem>
                        <BreadcrumbPage>{workshop.name}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-6">
                <div className="flex min-w-0 flex-col gap-4 lg:gap-6">
                    <WorkshopGallery/>
                    <WorkshopHeading workshop={workshop}/>
                    {(workshop.description || workshop.cancellationPolicy) && (
                        <div className="grid gap-4 sm:grid-cols-2 lg:gap-6">
                            {workshop.description && (
                                <Card>
                                    <CardHeader><CardTitle>Description</CardTitle></CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">{workshop.description}</p>
                                    </CardContent>
                                </Card>
                            )}
                            {workshop.cancellationPolicy && (
                                <Card>
                                    <CardHeader><CardTitle>Cancellation Policy</CardTitle></CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">
                                            {CANCELLATION_POLICY_CONTENT[workshop.cancellationPolicy].details}
                                        </p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    )}
                    <ServicesSection
                        categories={workshop.serviceCategories}
                        selectedIds={effectiveIds}
                        onToggle={toggleService}
                    />
                    <ReviewsCard
                        branchId={branchId}
                        rating={workshop.rating}
                        reviewCount={workshop.reviewCount}
                    />
                </div>

                <div className="flex flex-col gap-4 lg:gap-6">
                    <MapCard workshop={workshop}/>
                    <BrandsCard brands={workshop.brands}/>
                    <OpeningHoursCard openingHours={workshop.openingHours} tz={workshop.tz}/>
                    <ContactCard phoneNumber={workshop.phoneNumber} email={workshop.email}/>
                    <SummaryCard
                        workshop={workshop}
                        selectedServices={selectedServices}
                        onToggle={toggleService}
                        initialRange={initialRange}
                        onBookingComplete={() => setSelectedIds([])}
                    />
                </div>
            </div>

            {selectedServices.length > 0 && (
                <div className="sticky bottom-0 z-30 -mx-4 mt-6 flex items-center gap-3 border-t bg-background px-4 py-2.5 lg:hidden">
                    <div className="min-w-0 flex-1">
                        <p className="text-xs text-muted-foreground">
                            {selectedServices.length} {selectedServices.length === 1 ? "service" : "services"} selected
                        </p>
                        <p className="text-sm font-semibold tabular-nums">{formatPrice(selectedTotal)}</p>
                    </div>
                    <div className="w-32 shrink-0">
                        <BookingFlowPopover
                            workshop={workshop}
                            selectedServices={selectedServices}
                            onToggleService={toggleService}
                            initialRange={initialRange}
                            onBookingComplete={() => setSelectedIds([])}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

function EmptyState({title, message}: { title: string; message: string }) {
    const searchHref = useSearchHref();
    return (
        <div className="mx-auto flex min-h-[50vh] w-full max-w-[1475px] flex-col items-center justify-center gap-4 px-4 py-16 text-center lg:px-6">
            <Store className="h-10 w-10 text-muted-foreground lg:h-12 lg:w-12"/>
            <h1 className="text-lg font-semibold tracking-tight lg:text-3xl lg:font-bold">{title}</h1>
            <p className="text-sm text-muted-foreground">{message}</p>
            <Button asChild size="sm" className="lg:h-9 lg:px-4 lg:py-2 lg:text-sm">
                <Link href={searchHref}>Back to search</Link>
            </Button>
        </div>
    );
}
