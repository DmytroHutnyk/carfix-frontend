'use client'

import {useMemo, useState} from "react";
import {OrbitProgress} from "react-loading-indicators";
import {Car, Plus} from "lucide-react";

import {useAuth} from "@/features/auth/useAuth";
import {isCustomer} from "@/features/user/userTypes";
import {useCarProfiles} from "@/features/carProfile/useCarProfiles";
import {CAR_SORT_OPTIONS, CarSortKey, filterCarProfiles, sortCarProfiles} from "@/features/carProfile/carProfileList";
import {CarProfile} from "@/features/carProfile/carProfileTypes";
import {toDisplayError} from "@/lib/errorHandler";
import {ApiError} from "@/lib/apiTypes";

import {Button} from "@/_components/shadcn/button";
import {Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle} from "@/_components/shadcn/empty";
import FormErrorAlert from "@/_components/formErrorAlert";
import CarFilters from "@/(main)/(withFooter)/(myAccount)/cars/_components/carFilters";
import CarCard from "@/(main)/(withFooter)/(myAccount)/cars/_components/carCard";
import CarFormDialog from "@/(main)/(withFooter)/(myAccount)/cars/_components/carFormDialog";
import DeleteCarDialog from "@/(main)/(withFooter)/(myAccount)/cars/_components/deleteCarDialog";

export default function Page() {
    // Login redirect is handled upstream: proxy.ts cookie pre-filter + RequireAuth in the
    // (myAccount) layout. Role gating comes later, until then a non-customer just holds the spinner.
    const {account, isLoading: isAuthLoading} = useAuth();
    const isAuthorized = account !== null && isCustomer(account);

    const {carProfiles, isLoading, isError, error} = useCarProfiles({enabled: isAuthorized});

    const [searchQuery, setSearchQuery] = useState("");
    const [sortKey, setSortKey] = useState<CarSortKey>("nameAsc");
    const [addOpen, setAddOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<CarProfile | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<CarProfile | null>(null);

    const visibleCars = useMemo(
        () => sortCarProfiles(filterCarProfiles(carProfiles, searchQuery), sortKey),
        [carProfiles, searchQuery, sortKey]
    );

    if (isAuthLoading || !isAuthorized || isLoading) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <OrbitProgress color="var(--primary)" size="large" text="" textColor="" dense/>
            </div>
        );
    }

    return (
        <div className="py-3">
            {/*-==-==-=-=-=-=--==-=-=-=-Header-==-==-=-=-=-=-=-=-=---==*/}
            <section className="flex flex-wrap items-center gap-3 lg:gap-4">
                <h1 className="text-lg font-semibold tracking-tight lg:text-3xl lg:font-bold">My Cars</h1>

                <Button
                    size="sm"
                    className="ml-auto lg:h-9 lg:px-4 lg:py-2 lg:text-sm"
                    onClick={() => setAddOpen(true)}
                >
                    <Plus/> Add vehicle
                </Button>
            </section>

            {/*-==-==-=-=-=-=--==-=-=-=-Filters-==-==-=-=-=-=-=-=-=---==*/}
            <section className="pt-4 lg:pt-6">
                <CarFilters
                    query={searchQuery}
                    sortKey={sortKey}
                    onQueryChange={setSearchQuery}
                    onSortChange={setSortKey}
                    onClear={() => {
                        setSearchQuery("");
                        setSortKey("nameAsc");
                    }}
                />
            </section>

            {/*-==-==-=-=-=-=--==-=-=-=-List-==-==-=-=-=-=-=-=-=---==*/}
            <section className="flex flex-col gap-3 pt-4 lg:gap-y-4 lg:pt-6">
                {isError && (
                    <FormErrorAlert message={toDisplayError(error as ApiError).message}/>
                )}

                {!isError && carProfiles.length === 0 && (
                    <Empty>
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <Car/>
                            </EmptyMedia>
                            <EmptyTitle>No cars yet</EmptyTitle>
                            <EmptyDescription>Add your first vehicle to book services faster.</EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent>
                            <Button onClick={() => setAddOpen(true)}>
                                <Plus/> Add vehicle
                            </Button>
                        </EmptyContent>
                    </Empty>
                )}

                {!isError && carProfiles.length > 0 && visibleCars.length === 0 && (
                    <p className="pt-6 text-center text-sm text-muted-foreground lg:text-base">No cars match your search.</p>
                )}

                {visibleCars.map((carProfile) => (
                    <CarCard
                        key={carProfile.id}
                        carProfile={carProfile}
                        onEdit={() => setEditTarget(carProfile)}
                        onDelete={() => setDeleteTarget(carProfile)}
                    />
                ))}
            </section>

            {/*-==-==-=-=-=-=--==-=-=-=-Dialogs-==-==-=-=-=-=-=-=-=---==*/}
            {addOpen && (
                <CarFormDialog open={addOpen} onOpenChange={setAddOpen}/>
            )}
            {editTarget && (
                <CarFormDialog
                    open={true}
                    onOpenChange={(open) => !open && setEditTarget(null)}
                    carProfile={editTarget}
                />
            )}
            {deleteTarget && (
                <DeleteCarDialog
                    open={true}
                    onOpenChange={(open) => !open && setDeleteTarget(null)}
                    carProfile={deleteTarget}
                />
            )}
        </div>
    )
}
