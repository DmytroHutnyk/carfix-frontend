import {Badge} from "@/_components/shadcn/badge";
import StarRating from "@/(main)/(withFooter)/search/_components/starRating";
import {WorkshopReview} from "@/features/workshop/workshopTypes";
import {formatReviewDate, reviewerName} from "@/features/workshop/workshopList";

export default function LatestReviews({reviews, total}: { reviews: WorkshopReview[]; total: number }) {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold lg:text-base">Latest reviews</h3>
                <Badge variant="secondary">{total}</Badge>
            </div>
            {reviews.length === 0 ? (
                <p className="py-4 text-center text-xs text-muted-foreground lg:py-6 lg:text-sm">No reviews yet</p>
            ) : (
                <ul className="flex flex-col divide-y">
                    {reviews.map((review) => (
                        <li key={review.reviewId} className="py-2">
                            <div className="flex items-center justify-between gap-2">
                                <StarRating rating={review.starsNumber}/>
                                <span className="text-[11px] text-muted-foreground lg:text-xs">
                                    {reviewerName(review)} • {formatReviewDate(review.createdAt)}
                                </span>
                            </div>
                            {review.contents && <p className="mt-1 line-clamp-2 text-xs lg:text-sm">{review.contents}</p>}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
