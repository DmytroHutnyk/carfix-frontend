import {clientApi} from "@/lib/clientApi";
import {isApiError} from "@/lib/apiTypes";
import {ReviewsSort, Workshop, WorkshopReviewsPage} from "@/features/workshop/workshopTypes";

export const workshopApi = {
    async getWorkshop(branchId: string): Promise<Workshop> {
        const result = await clientApi.get<Workshop>(`/workshops/${branchId}`);
        if (isApiError(result)) throw result;
        return result;
    },

    async getReviews(branchId: string, sort: ReviewsSort, page: number): Promise<WorkshopReviewsPage> {
        const params = new URLSearchParams({sort, page: String(page)});
        const result = await clientApi.get<WorkshopReviewsPage>(
            `/workshops/${branchId}/reviews?${params.toString()}`);
        if (isApiError(result)) throw result;
        return result;
    },
}
