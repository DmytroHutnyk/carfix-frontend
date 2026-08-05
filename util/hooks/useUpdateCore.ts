import {UpdateUserCore, UseUpdateCoreReturn} from "@/util/types/profileManagementTypes";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {userApi} from "@/util/api/user/userApi";
import {authKeys} from "@/features/auth/keys";
import {Account} from "@/util/types/userTypes";

export function useUpdateCore(): UseUpdateCoreReturn {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: userApi.updateCore,
        /* Splice only the user core into the cached account — never overwrite the whole
         * account, which carries the role tail (customerStatus / owner business). */
        onSuccess: (user) => {
            queryClient.setQueryData<Account | null>(authKeys.session(), (account) =>
                account ? {...account, user} : account
            );
        }
    })

    return {
        updateCore: (data: UpdateUserCore) => mutation.mutateAsync(data),
    }
}