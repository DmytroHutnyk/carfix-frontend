"use client"

import {useState} from "react";
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
import {useWorkshop} from "@/features/workshop/useWorkshop";
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

export default function WorkshopPageContent({branchId}: { branchId: string }) {
    const {workshop, isLoading, isError, error} = useWorkshop(branchId);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

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
    const selectedServices = allServices.filter((service) => selectedIds.includes(service.serviceId));

    const toggleService = (serviceId: number) =>
        setSelectedIds((prev) =>
            prev.includes(serviceId)
                ? prev.filter((id) => id !== serviceId)
                : [...prev, serviceId]);

    return (
        <div className="mx-auto w-full max-w-[1475px] px-6 py-6">
            <Breadcrumb className="mb-4">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/search">Search results</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator/>
                    <BreadcrumbItem>
                        <BreadcrumbPage>{workshop.name}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
                <div className="flex min-w-0 flex-col gap-6">
                    <WorkshopGallery/>
                    <WorkshopHeading workshop={workshop}/>
                    {(workshop.description || workshop.cancellationPolicy) && (
                        <div className="grid gap-6 sm:grid-cols-2">
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
                                        <p className="text-sm text-muted-foreground">{workshop.cancellationPolicy}</p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    )}
                    <ServicesSection
                        categories={workshop.serviceCategories}
                        selectedIds={selectedIds}
                        onToggle={toggleService}
                    />
                    <ReviewsCard
                        branchId={branchId}
                        rating={workshop.rating}
                        reviewCount={workshop.reviewCount}
                    />
                </div>

                <div className="flex flex-col gap-6">
                    <MapCard workshop={workshop}/>
                    <BrandsCard brands={workshop.brands}/>
                    <OpeningHoursCard openingHours={workshop.openingHours} tz={workshop.tz}/>
                    <ContactCard phoneNumber={workshop.phoneNumber} email={workshop.email}/>
                    <SummaryCard
                        workshop={workshop}
                        selectedServices={selectedServices}
                        onToggle={toggleService}
                        onBookingComplete={() => setSelectedIds([])}
                    />
                </div>
            </div>
        </div>
    );
}

function EmptyState({title, message}: { title: string; message: string }) {
    return (
        <div className="mx-auto flex min-h-[50vh] w-full max-w-[1475px] flex-col items-center justify-center gap-4 px-6 py-16 text-center">
            <Store className="h-12 w-12 text-muted-foreground"/>
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            <p className="text-muted-foreground">{message}</p>
            <Button asChild>
                <Link href="/search">Back to search</Link>
            </Button>
        </div>
    );
}
