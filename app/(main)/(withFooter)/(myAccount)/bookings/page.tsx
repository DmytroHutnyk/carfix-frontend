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
    EMPTY_FILTERS,
    filterBookings,
    sortBookings,
    vehicleOptions,
} from "@/util/func/bookingList";
import {toDisplayError} from "@/util/func/errorHandler";
import {ApiError} from "@/util/types/apiTypes";

import {Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle} from "@/_components/shadcn/empty";
import FormErrorAlert from "@/_components/formErrorAlert";
import BookingFilters from "@/(main)/(withFooter)/(myAccount)/bookings/_components/bookingFilters";
import BookingCard from "@/(main)/(withFooter)/(myAccount)/bookings/_components/bookingCard";
import CancelBookingDialog from "@/(main)/(withFooter)/(myAccount)/bookings/_components/cancelBookingDialog";

export default function Page() {
    // Login redirect is handled upstream: proxy.ts cookie pre-filter + RequireAuth in the
    // (myAccount) layout. Role gating comes later — until then a non-customer just holds the spinner.
    const {account, isLoading: isAuthLoading} = useAuth();
    const isAuthorized = account !== null && isCustomer(account);

    const {bookings, isLoading, isError, error} = useBookings({enabled: isAuthorized});

    const [filters, setFilters] = useState<BookingFilterState>(EMPTY_FILTERS);
    const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);

    const visibleBookings = useMemo(
        () => sortBookings(filterBookings(bookings, filters)),
        [bookings, filters]
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
            <section>
                <h1 className="text-3xl font-bold tracking-tight">My Bookings</h1>
            </section>

            {/*-==-==-=-=-=-=--==-=-=-=-Filters-==-==-=-=-=-=-=-=-=---==*/}
            <section className="pt-6">
                <BookingFilters
                    filters={filters}
                    onChange={setFilters}
                    vehicles={vehicleOptions(bookings)}
                />
            </section>

            {/*-==-==-=-=-=-=--==-=-=-=-List-==-==-=-=-=-=-=-=-=---==*/}
            <section className="flex flex-col gap-y-4 pt-6">
                {isError && (
                    <FormErrorAlert message={toDisplayError(error as ApiError).message}/>
                )}

                {!isError && bookings.length === 0 && (
                    <Empty>
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <CalendarX2/>
                            </EmptyMedia>
                            <EmptyTitle>No bookings yet</EmptyTitle>
                            <EmptyDescription>Book a service to see it here.</EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                )}

                {!isError && bookings.length > 0 && visibleBookings.length === 0 && (
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
