import {User} from "@/util/types/appTypes";
import {clientApi} from "@/util/api/clientApi";
import {isApiError} from "@/util/types/apiTypes";
import {UpdateProfile} from "@/util/types/profileTypes";

export const profileApi = {
    async updateProfile({ id, data }: { id: string; data: UpdateProfile }): Promise<User> {
        const result = await clientApi.patch(`/users/${id}`, data);

        if (isApiError(result)) {
            throw result;
        }

        return result as User;
    }
}
