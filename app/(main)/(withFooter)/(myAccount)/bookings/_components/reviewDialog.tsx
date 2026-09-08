'use client'

import {useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Star} from "lucide-react";

import {Booking, CreateReviewForm, createReviewSchema, REVIEW_MAX_RATING} from "@/features/booking/bookingTypes";
import {useCreateReview} from "@/features/booking/useCreateReview";
import {formatBookingDate} from "@/features/booking/bookingList";
import {toDisplayError} from "@/lib/errorHandler";
import {ApiError} from "@/lib/apiTypes";
import {cn} from "@/lib/utils";

import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/_components/shadcn/dialog";
import {Button} from "@/_components/shadcn/button";
import {Textarea} from "@/_components/shadcn/textarea";
import {Label} from "@/_components/shadcn/label";
import {Separator} from "@/_components/shadcn/separator";
import FormErrorAlert from "@/_components/formErrorAlert";

export default function ReviewDialog({open, onOpenChange, booking, onReviewed}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    booking: Booking;
    onReviewed: (bookingId: string) => void;
}) {
    const [error, setError] = useState<string | null>(null);
    const [hovered, setHovered] = useState(0);
    const {createReview} = useCreateReview();

    const {control, register, handleSubmit, formState: {errors, isSubmitting}} = useForm<CreateReviewForm>({
        resolver: zodResolver(createReviewSchema),
        mode: "onSubmit",
        defaultValues: {rating: 0, comment: ""},
    });

    const onSubmit = async (form: CreateReviewForm) => {
        setError(null);
        try {
            await createReview(booking.bookingId, form);
            onReviewed(booking.bookingId);
        } catch (err) {
            setError(toDisplayError(err as ApiError).message);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[calc(100%-2rem)] rounded-lg">
                <DialogHeader>
                    <DialogTitle>Leave a review</DialogTitle>
                </DialogHeader>

                <p className="text-xs text-muted-foreground lg:text-base">
                    {booking.branch.name} · {formatBookingDate(booking.date)}
                </p>

                <Separator/>

                <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
                    <Controller
                        name="rating"
                        control={control}
                        render={({field}) => (
                            <div className="flex flex-col gap-1.5">
                                <Label>Rating</Label>
                                <div className="flex items-center gap-1" onMouseLeave={() => setHovered(0)}>
                                    {Array.from({length: REVIEW_MAX_RATING}, (_, i) => {
                                        const value = i + 1;
                                        const active = (hovered || field.value) >= value;
                                        return (
                                            <button
                                                key={value}
                                                type="button"
                                                aria-label={`${value} star${value === 1 ? "" : "s"}`}
                                                onMouseEnter={() => setHovered(value)}
                                                onClick={() => field.onChange(value)}
                                                className="rounded-md p-0.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                            >
                                                <Star className={cn("h-6 w-6", active ? "fill-primary text-primary" : "text-muted-foreground/40")}/>
                                            </button>
                                        );
                                    })}
                                </div>
                                {errors.rating && (
                                    <p className="text-xs text-destructive lg:text-sm">{errors.rating.message}</p>
                                )}
                            </div>
                        )}
                    />

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="review-comment">Comment (optional)</Label>
                        <Textarea
                            id="review-comment"
                            rows={4}
                            placeholder="Share your experience"
                            className={cn("resize-none", errors.comment && "border-destructive focus-visible:ring-destructive")}
                            {...register("comment")}
                        />
                        {errors.comment && (
                            <p className="text-xs text-destructive lg:text-sm">{errors.comment.message}</p>
                        )}
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="secondary" size="sm" className="lg:h-9 lg:px-4 lg:py-2 lg:text-sm" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button type="submit" size="sm" className="lg:h-9 lg:px-4 lg:py-2 lg:text-sm" disabled={isSubmitting}>
                            {isSubmitting ? "Submitting..." : "Submit review"}
                        </Button>
                    </div>

                    <FormErrorAlert message={error}/>
                </form>
            </DialogContent>
        </Dialog>
    )
}
