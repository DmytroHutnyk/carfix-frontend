import {useMutation, useQueryClient} from "@tanstack/react-query";
import {userApi} from "@/features/user/userApi";
import {authKeys} from "@/features/auth/keys";
import {Account} from "@/features/user/userTypes";
import {UseEmailVerificationReturn, VerificationCodeForm} from "@/features/user/emailVerificationTypes";

export function useEmailVerification(): UseEmailVerificationReturn {
    const queryClient = useQueryClient();

    const requestMutation = useMutation({
        mutationFn: userApi.requestEmailVerification,
    });

    const confirmMutation = useMutation({
        mutationFn: userApi.confirmEmailVerification,
        /* Same splice as useUpdateCore: only the user core changes, the role tail stays. */
        onSuccess: (user) => {
            queryClient.setQueryData<Account | null>(authKeys.session(), (account) =>
                account ? {...account, user} : account
            );
        },
    });

    return {
        requestCode: () => requestMutation.mutateAsync(),
        confirmCode: (data: VerificationCodeForm) => confirmMutation.mutateAsync(data),
        isRequesting: requestMutation.isPending,
        isConfirming: confirmMutation.isPending,
    };
}
