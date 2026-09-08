'use client'

import {useWorkshopReviews} from "@/features/workshop/useWorkshopReviews";
import {formatReviewDate, reviewerName} from "@/features/workshop/workshopList";

import {Card, CardContent} from "@/_components/shadcn/card";
import {Button} from "@/_components/shadcn/button";
import {Skeleton} from "@/_components/shadcn/skeleton";
import StarRating from "@/(main)/(withFooter)/search/_components/starRating";
import BranchTabShell from "@/business/(owner)/branches/[branchId]/_components/branchTabShell";

export default function BranchReviewsContent({branchId}: { branchId: string }) {
    const {reviews, total, isLoading, isError, hasNextPage, isFetchingNextPage, fetchNextPage} =
        useWorkshopReviews(branchId, "newest");

    return (
        <BranchTabShell branchId={branchId} active="reviews">
            <Card>
                <CardContent className="flex flex-col gap-4 p-6">
                    <div className="flex items-center justify-between gap-2">
                        <h2 className="text-lg font-semibold tracking-tight">Reviews</h2>
                        {total != null && <span className="text-sm text-muted-foreground">{total} total</span>}
                    </div>

                    {isLoading && (
                        <div className="flex flex-col gap-3">
                            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 w-full"/>)}
                        </div>
                    )}

                    {isError && <p className="text-sm text-destructive">Could not load reviews.</p>}

                    {!isLoading && !isError && reviews.length === 0 && (
                        <p className="text-sm text-muted-foreground">No reviews yet.</p>
                    )}

                    {reviews.length > 0 && (
                        <ul className="flex flex-col divide-y">
                            {reviews.map((review) => (
                                <li key={review.reviewId} className="flex flex-col gap-1 py-4 first:pt-0 last:pb-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <StarRating rating={review.starsNumber} className="h-4 w-4"/>
                                        <span className="text-sm font-semibold">{reviewerName(review)}</span>
                                        <span className="text-sm text-muted-foreground">{formatReviewDate(review.createdAt)}</span>
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
                            className="self-center"
                            onClick={() => fetchNextPage()}
                            disabled={isFetchingNextPage}
                        >
                            {isFetchingNextPage ? "Loading…" : "Load more"}
                        </Button>
                    )}
                </CardContent>
            </Card>
        </BranchTabShell>
    );
}
