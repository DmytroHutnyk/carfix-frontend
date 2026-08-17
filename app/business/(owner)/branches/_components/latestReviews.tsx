import {Badge} from "@/_components/shadcn/badge";
import StarRating from "@/(main)/(withFooter)/search/_components/starRating";
import {WorkshopReview} from "@/features/workshop/workshopTypes";
import {formatReviewDate, reviewerName} from "@/features/workshop/workshopList";

export default function LatestReviews({reviews, total}: { reviews: WorkshopReview[]; total: number }) {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold">Latest reviews</h3>
                <Badge variant="secondary">{total}</Badge>
            </div>
            {reviews.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">No reviews yet</p>
            ) : (
                <ul className="flex flex-col divide-y">
                    {reviews.map((review) => (
                        <li key={review.reviewId} className="py-2">
                            <div className="flex items-center justify-between gap-2">
                                <StarRating rating={review.starsNumber}/>
                                <span className="text-xs text-muted-foreground">
                                    {reviewerName(review)} • {formatReviewDate(review.createdAt)}
                                </span>
                            </div>
                            {review.contents && <p className="mt-1 line-clamp-2 text-sm">{review.contents}</p>}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
