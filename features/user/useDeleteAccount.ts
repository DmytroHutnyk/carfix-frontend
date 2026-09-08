import {useMutation, useQueryClient} from "@tanstack/react-query";
import {userApi} from "@/features/user/userApi";
import {privateScope} from "@/lib/scopes";
import {UseDeleteAccountReturn} from "@/features/user/profileManagementTypes";

export function useDeleteAccount(): UseDeleteAccountReturn {
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: userApi.deleteAccount,
        onSuccess: () => {
            queryClient.removeQueries({queryKey: privateScope});
        },
    });

    return {
        deleteAccount: () => deleteMutation.mutateAsync(),
    };
}
