'use client'

import {useMemo, useState} from "react";
import {OrbitProgress} from "react-loading-indicators";
import {CalendarX2} from "lucide-react";

import {useAuth} from "@/features/auth/useAuth";
import {isCustomer} from "@/features/user/userTypes";
import {useBookings} from "@/features/booking/useBookings";
import {Booking} from "@/features/booking/bookingTypes";
import {
    BookingFilterState,
    EMPTY_FILTERS,
    filterBookings,
    sortBookings,
} from "@/features/booking/bookingList";
import {useCarProfiles} from "@/features/carProfile/useCarProfiles";
import {toDisplayError} from "@/lib/errorHandler";
import {ApiError} from "@/lib/apiTypes";

import {Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle} from "@/_components/shadcn/empty";
import FormErrorAlert from "@/_components/formErrorAlert";
import BookingFilters from "@/(main)/(withFooter)/(myAccount)/bookings/_components/bookingFilters";
import BookingCard from "@/(main)/(withFooter)/(myAccount)/bookings/_components/bookingCard";
import CancelBookingDialog from "@/(main)/(withFooter)/(myAccount)/bookings/_components/cancelBookingDialog";
import ReviewDialog from "@/(main)/(withFooter)/(myAccount)/bookings/_components/reviewDialog";

export default function Page() {
    // Login redirect is handled upstream: proxy.ts cookie pre-filter + RequireAuth in the
    // (myAccount) layout. Role gating comes later — until then a non-customer just holds the spinner.
    const {account, isLoading: isAuthLoading} = useAuth();
    const isAuthorized = account !== null && isCustomer(account);

    const {bookings, isLoading, isError, error} = useBookings({enabled: isAuthorized});
    const {carProfiles, isLoading: isCarProfilesLoading} = useCarProfiles({enabled: isAuthorized});

    const [filters, setFilters] = useState<BookingFilterState>(EMPTY_FILTERS);
    const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);
    const [reviewTarget, setReviewTarget] = useState<Booking | null>(null);
    const [reviewedIds, setReviewedIds] = useState<Set<string>>(new Set());

    const vehicles = useMemo(
        () => [...carProfiles]
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((c) => ({value: c.id, label: c.name})),
        [carProfiles]
    );

    const visibleBookings = useMemo(
        () => sortBookings(filterBookings(bookings, filters)),
        [bookings, filters]
    );

    if (isAuthLoading || !isAuthorized || isLoading || isCarProfilesLoading) {
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
                <h1 className="text-lg font-semibold tracking-tight lg:text-3xl lg:font-bold">My Bookings</h1>
            </section>

            {/*-==-==-=-=-=-=--==-=-=-=-Filters-==-==-=-=-=-=-=-=-=---==*/}
            <section className="pt-4 lg:pt-6">
                <BookingFilters
                    filters={filters}
                    onChange={setFilters}
                    vehicles={vehicles}
                />
            </section>

            {/*-==-==-=-=-=-=--==-=-=-=-List-==-==-=-=-=-=-=-=-=---==*/}
            <section className="flex flex-col gap-3 pt-4 lg:gap-y-4 lg:pt-6">
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
                    <p className="pt-6 text-center text-sm text-muted-foreground lg:text-base">
                        No bookings match your filters.
                    </p>
                )}

                {visibleBookings.map((booking) => (
                    <BookingCard
                        key={booking.bookingId}
                        booking={booking}
                        onCancel={() => setCancelTarget(booking)}
                        onReview={() => setReviewTarget(booking)}
                        isReviewed={reviewedIds.has(booking.bookingId)}
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

            {/*-==-==-=-=-=-=--==-=-=-=-Review dialog-==-==-=-=-=-=-=-=-=---==*/}
            {reviewTarget && (
                <ReviewDialog
                    open={true}
                    onOpenChange={(open) => !open && setReviewTarget(null)}
                    booking={reviewTarget}
                    onReviewed={(bookingId) => {
                        setReviewedIds((prev) => new Set(prev).add(bookingId));
                        setReviewTarget(null);
                    }}
                />
            )}
        </div>
    )
}
