import {LoginCredentials, RegisterData, UseAuthReturn} from "@/features/auth/authTypes";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {authKeys} from "@/features/auth/keys";
import {privateScope} from "@/lib/scopes";
import {authApi} from "@/features/auth/authApi"
import {applyPreferredLocation} from "@/features/user/preferredLocation";

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
        onSuccess: (account) => { // TODO setQueryData is not type checked
            queryClient.setQueryData(authKeys.session(), account);
            applyPreferredLocation(account.user.preferredLocation);
        },
    });

    // for now that is actually registerCustomerMutation, but it is a subject to change
    const registerMutation = useMutation({
        mutationFn: authApi.registerCustomer,
        onSuccess: (account) => {
            queryClient.setQueryData(authKeys.session(), account);
            applyPreferredLocation(account.user.preferredLocation);
        }
    })

    const logoutMutation = useMutation({
        mutationFn: authApi.logout,
        /* Wipe every private-scoped cache (session, cars, bookings, …) */
        onSuccess: () => {
            queryClient.removeQueries({ queryKey: privateScope });
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