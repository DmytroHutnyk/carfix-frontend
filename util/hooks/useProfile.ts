import {UpdateProfile, UseProfileReturn} from "@/util/types/profileManagementTypes";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {profileApi} from "@/util/api/profile/profileApi";
import {authKeys} from "@/util/api/auth/keys";

export function useProfile(): UseProfileReturn{
    const queryClient = useQueryClient();

    const updateProfileMutation = useMutation({
        mutationFn: profileApi.updateProfile,
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