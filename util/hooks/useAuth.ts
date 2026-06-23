import {LoginCredentials, RegisterData, UseAuthReturn} from "@/util/types/authTypes";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {authKeys} from "@/util/api/auth/keys";
import {authApi} from "@/util/api/auth/authApi"

export function useAuth(): UseAuthReturn {
    const queryClient = useQueryClient();

    const sessionQuery = useQuery({
        queryKey: authKeys.session(),
        queryFn: authApi.getSession,
        retry: 3, //TODO, found a bug where it retires forever for some reason, when backend is not running
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
    });

    const loginMutation = useMutation({
        mutationFn: authApi.login,
        onSuccess: (account) => {
            queryClient.setQueryData(authKeys.session(), account);
        },
    });

    const registerMutation = useMutation({
        mutationFn: authApi.registerCustomer,
        onSuccess: (account) => {
            queryClient.setQueryData(authKeys.session(), account);
        }
    })

    const logoutMutation = useMutation({
        mutationFn: authApi.logout,
        onSuccess: () => {
            queryClient.removeQueries({ queryKey: authKeys.all });
        },
    });

    const account = sessionQuery.data ?? null;
    const isAuthenticated = account !== null;

    return {
        // State
        account,
        isAuthenticated,

        //initial session check
        isLoading: sessionQuery.isLoading,
        isError: sessionQuery.isError,
        error: sessionQuery.error,

        // Actions
        login: (credentials: LoginCredentials) => loginMutation.mutateAsync(credentials),
        //TODO rename RegisterData to RegisterCustomerData
        register: (registerData: RegisterData) => registerMutation.mutateAsync(registerData),
        logout: () => logoutMutation.mutateAsync(),
    }
}