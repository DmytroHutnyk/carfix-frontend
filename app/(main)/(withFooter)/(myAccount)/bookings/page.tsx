'use client'

import {useMemo, useState} from "react";
import {OrbitProgress} from "react-loading-indicators";
import {CalendarX2} from "lucide-react";

import {useAuth} from "@/util/hooks/useAuth";
import {isCustomer} from "@/util/types/userTypes";
import {useBookings} from "@/util/hooks/useBookings";
import {Booking} from "@/util/types/bookingTypes";
import {
    BookingFilterState,
    BookingTab,
    EMPTY_FILTERS,
    TAB_STATUSES,
    bookingsForTab,
    filterBookings,
    sortBookings,
    vehicleOptions,
} from "@/util/func/bookingList";
import {toDisplayError} from "@/util/func/errorHandler";
import {ApiError} from "@/util/types/apiTypes";

import {Tabs, TabsList, TabsTrigger} from "@/_components/shadcn/tabs";
import {Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle} from "@/_components/shadcn/empty";
import FormErrorAlert from "@/_components/formErrorAlert";
import BookingFilters from "@/(main)/(withFooter)/(myAccount)/bookings/_components/bookingFilters";
import BookingCard from "@/(main)/(withFooter)/(myAccount)/bookings/_components/bookingCard";
import CancelBookingDialog from "@/(main)/(withFooter)/(myAccount)/bookings/_components/cancelBookingDialog";

export default function Page() {
    const {account, isLoading: isAuthLoading} = useAuth();
    const isAuthorized = account !== null && isCustomer(account);

    const {bookings, isLoading, isError, error} = useBookings({enabled: isAuthorized});

    const [tab, setTab] = useState<BookingTab>("upcoming");
    const [filters, setFilters] = useState<BookingFilterState>(EMPTY_FILTERS);
    const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);

    const tabBookings = useMemo(() => bookingsForTab(bookings, tab), [bookings, tab]);
    const visibleBookings = useMemo(
        () => sortBookings(filterBookings(tabBookings, filters), tab),
        [tabBookings, filters, tab]
    );

    const onTabChange = (next: string) => {
        const nextTab = next as BookingTab;
        setTab(nextTab);
        // Status options are tab-scoped — drop a pick that doesn't exist in the new tab.
        setFilters((f) =>
            f.status === "all" || TAB_STATUSES[nextTab].includes(f.status) ? f : {...f, status: "all"}
        );
    };

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
            <section>
                <h1 className="text-3xl font-bold tracking-tight">My Bookings</h1>
            </section>

            {/*-==-==-=-=-=-=--==-=-=-=-Filters-==-==-=-=-=-=-=-=-=---==*/}
            <section className="pt-6">
                <BookingFilters
                    filters={filters}
                    onChange={setFilters}
                    vehicles={vehicleOptions(bookings)}
                    statuses={TAB_STATUSES[tab]}
                />
            </section>

            {/*-==-==-=-=-=-=--==-=-=-=-Tabs-==-==-=-=-=-=-=-=-=---==*/}
            <section className="pt-4">
                <Tabs value={tab} onValueChange={onTabChange}>
                    <TabsList className="grid w-full max-w-md grid-cols-2">
                        <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                        <TabsTrigger value="past">Past</TabsTrigger>
                    </TabsList>
                </Tabs>
            </section>

            {/*-==-==-=-=-=-=--==-=-=-=-List-==-==-=-=-=-=-=-=-=---==*/}
            <section className="flex flex-col gap-y-4 pt-6">
                {isError && (
                    <FormErrorAlert message={toDisplayError(error as ApiError).message}/>
                )}

                {!isError && tabBookings.length === 0 && (
                    <Empty>
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <CalendarX2/>
                            </EmptyMedia>
                            <EmptyTitle>
                                {tab === "upcoming" ? "No upcoming bookings" : "No past bookings"}
                            </EmptyTitle>
                            <EmptyDescription>
                                {tab === "upcoming"
                                    ? "Book a service to see it here."
                                    : "Completed and cancelled bookings will show up here."}
                            </EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                )}

                {!isError && tabBookings.length > 0 && visibleBookings.length === 0 && (
                    <p className="pt-6 text-center text-muted-foreground">
                        No bookings match your filters.
                    </p>
                )}

                {visibleBookings.map((booking) => (
                    <BookingCard
                        key={booking.bookingId}
                        booking={booking}
                        onCancel={() => setCancelTarget(booking)}
                    />
                ))}
            </section>

            {/*-==-==-=-=-=-=--==-=-=-=-Cancel dialog-==-==-=-=-=-=-=-=-=---==*/}
            {cancelTarget && (
                <CancelBookingDialog
                    open={true}
                    onOpenChange={(open) => !open && setCancelTarget(null)}
                    booking={cancelTarget}
                />
            )}
        </div>
    )
}
