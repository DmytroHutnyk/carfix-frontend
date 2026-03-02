import {UpdateProfile, UseProfileReturn} from "@/util/types/profileTypes";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {authApi} from "@/util/api/authApi";
import {authKeys} from "@/util/auth/keys";

export function useProfile(): UseProfileReturn{
    const queryClient = useQueryClient();

    const updateProfileMutation = useMutation({
        mutationFn: authApi.updateProfile,
        onSuccess: (updatedUser) => {
            queryClient.setQueryData(authKeys.session(), updatedUser);
        }
    })

    return {
        updateProfile: async (params: { id: string; data: UpdateProfile }) => {
            return updateProfileMutation.mutateAsync(params);
        },
    }
}