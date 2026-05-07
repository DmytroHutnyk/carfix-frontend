import {LoginCredentials, RegisterData, UseAuthReturn} from "@/util/types/authTypes";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {authKeys} from "@/util/auth/keys";
import {authApi} from "@/util/api/authApi"
import {UpdateProfile} from "@/util/types/profileTypes";

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
        onSuccess: (user) => {
            queryClient.setQueryData(authKeys.session(), user);
        },
    });

    const registerMutation = useMutation({
        mutationFn: authApi.register,
        onSuccess: (user) => {
            queryClient.setQueryData(authKeys.session(), user);
        }
    })

    const user = sessionQuery.data ?? null;
    const isAuthenticated = user !== null;

    const logoutMutation = useMutation({
        mutationFn: authApi.logout,
        onSuccess: () => {
            queryClient.removeQueries({ queryKey: authKeys.all });
        },
    });

    return{
        // State
        user,
        isAuthenticated,

        //initial session check
        isLoading: sessionQuery.isLoading,
        isError: sessionQuery.isError,
        error: sessionQuery.error,

        // Actions
        login: async (credentials: LoginCredentials) => {
            return loginMutation.mutateAsync(credentials);
        },

        register: async (registerData: RegisterData) => {
            return registerMutation.mutateAsync(registerData);
        },

        logout: async () => {
            return logoutMutation.mutateAsync();
        },
    }
}