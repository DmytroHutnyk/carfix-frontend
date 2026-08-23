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
            <CardHeader className="flex flex-col items-start gap-3 sm:flex-row sm:justify-between sm:gap-4">
                <div className="flex flex-col gap-1">
                    <CardTitle>Reviews</CardTitle>
                    {rating != null && reviewCount != null && (
                        <span className="flex items-center gap-2 text-sm">
                            <StarRating rating={rating}/>
                            <span className="font-medium">{rating}</span>
                            <span className="text-muted-foreground">· {reviewCount} reviews</span>
                        </span>
                    )}
                </div>
                <Select value={sort} onValueChange={(value) => setSort(value as ReviewsSort)}>
                    <SelectTrigger className="w-32">
                        <SelectValue/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="newest">Newest</SelectItem>
                        <SelectItem value="highest">Highest</SelectItem>
                        <SelectItem value="lowest">Lowest</SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                {isLoading && (
                    <div className="flex flex-col gap-3">
                        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 w-full"/>)}
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
                            <li key={review.reviewId} className="flex flex-col gap-1 py-4 first:pt-0 last:pb-0">
                                <div className="flex flex-wrap items-center gap-2">
                                    <StarRating rating={review.starsNumber}/>
                                    <span className="font-semibold">{reviewerName(review)}</span>
                                    <span className="text-sm text-muted-foreground">
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
                        className="self-center"
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
