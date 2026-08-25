"use client"

import {useState} from "react";
import {Button} from "@/_components/shadcn/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/_components/shadcn/card";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/_components/shadcn/select";
import {Skeleton} from "@/_components/shadcn/skeleton";
import StarRating from "@/(main)/(withFooter)/search/_components/starRating";
import {ReviewsSort} from "@/features/workshop/workshopTypes";
import {useWorkshopReviews} from "@/features/workshop/useWorkshopReviews";
import {formatReviewDate, reviewerName} from "@/features/workshop/workshopList";

export default function ReviewsCard({branchId, rating, reviewCount}: {
    branchId: string;
    rating: number | null;
    reviewCount: number | null;
}) {
    const [sort, setSort] = useState<ReviewsSort>("newest");
    const {
        reviews, isLoading, isError, hasNextPage, isFetchingNextPage, fetchNextPage,
    } = useWorkshopReviews(branchId, sort);

    return (
        <Card>
            <CardHeader className="flex flex-row items-start justify-between gap-2 lg:gap-4">
                <div className="flex min-w-0 flex-col gap-1">
                    <CardTitle>Reviews</CardTitle>
                    {rating != null && reviewCount != null && (
                        <span className="flex items-center gap-1.5 text-xs lg:gap-2 lg:text-sm">
                            <StarRating rating={rating} className="h-3 w-3 lg:h-4 lg:w-4"/>
                            <span className="font-medium">{rating}</span>
                            <span className="text-muted-foreground">· {reviewCount} reviews</span>
                        </span>
                    )}
                </div>
                <Select value={sort} onValueChange={(value) => setSort(value as ReviewsSort)}>
                    <SelectTrigger className="w-28 shrink-0 lg:w-32">
                        <SelectValue/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="newest">Newest</SelectItem>
                        <SelectItem value="highest">Highest</SelectItem>
                        <SelectItem value="lowest">Lowest</SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 lg:gap-4">
                {isLoading && (
                    <div className="flex flex-col gap-2 lg:gap-3">
                        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-14 w-full lg:h-16"/>)}
                    </div>
                )}
                {isError && (
                    <p className="text-sm text-destructive">Could not load reviews.</p>
                )}
                {!isLoading && !isError && reviews.length === 0 && (
                    <p className="text-sm text-muted-foreground">No reviews yet.</p>
                )}
                {reviews.length > 0 && (
                    <ul className="flex flex-col divide-y">
                        {reviews.map((review) => (
                            <li key={review.reviewId} className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0 lg:py-4">
                                <div className="flex flex-wrap items-center gap-1.5 lg:gap-2">
                                    <StarRating rating={review.starsNumber} className="h-3 w-3 lg:h-4 lg:w-4"/>
                                    <span className="text-sm font-semibold">{reviewerName(review)}</span>
                                    <span className="text-xs text-muted-foreground lg:text-sm">
                                        {formatReviewDate(review.createdAt)}
                                    </span>
                                </div>
                                {review.contents && <p className="text-sm">{review.contents}</p>}
                            </li>
                        ))}
                    </ul>
                )}
                {hasNextPage && (
                    <Button
                        variant="secondary"
                        size="sm"
                        className="self-center lg:h-9 lg:px-4 lg:py-2 lg:text-sm"
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                    >
                        {isFetchingNextPage ? "Loading…" : "Load more"}
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}
