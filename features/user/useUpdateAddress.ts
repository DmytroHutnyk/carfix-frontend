import {useMutation, useQueryClient} from "@tanstack/react-query";
import {UpdateAddress, UseUpdateAddressReturn} from "@/features/user/profileManagementTypes";
import {userApi} from "@/features/user/userApi";
import {authKeys} from "@/features/auth/keys";
import {Account, Address} from "@/features/user/userTypes";

export function useUpdateAddress(): UseUpdateAddressReturn {
    const queryClient = useQueryClient();

    const spliceAddress = (address: Address | null) =>
        queryClient.setQueryData<Account | null>(authKeys.session(), (account) =>
            account ? {...account, user: {...account.user, address}} : account
        );

    const updateMutation = useMutation({
        mutationFn: userApi.updateAddress,
        onSuccess: (address) => spliceAddress(address),
    });

    const deleteMutation = useMutation({
        mutationFn: userApi.deleteAddress,
        onSuccess: () => spliceAddress(null),
    });

    return {
        updateAddress: (data: UpdateAddress) => updateMutation.mutateAsync(data),
        deleteAddress: () => deleteMutation.mutateAsync(),
    }
}
