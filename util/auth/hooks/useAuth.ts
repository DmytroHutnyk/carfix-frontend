import {LoginCredentials, UseAuthReturn} from "@/util/types/auth";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {useRouter} from "next/navigation";
import {authKeys} from "@/util/auth/keys";
import {authApi} from "@/util/api/authApi"
import {isApiError, isProblemDetailError, isStandardError} from "@/util/types/api";

export function useAuth(): UseAuthReturn {
    const queryClient = useQueryClient();
    const router = useRouter();

    const sessionQuery = useQuery({
        queryKey: authKeys.session(),
        queryFn: authApi.getSession,
        retry: 3,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: true,
        refetchOnMount: false,
    });

    const loginMutation = useMutation({
        mutationFn: authApi.login,
        onSuccess: (user) => {
            queryClient.setQueryData(authKeys.session(), user);
        },
    });

    const user = sessionQuery.data ?? null;
    const isAuthenticated = user !== null;

    // // Logout Mutation
    // const logoutMutation = useMutation({
    //     mutationFn: authApi.logout,
    //     onSuccess: () => {
    //         queryClient.removeQueries({ queryKey: authKeys.all });
    //         router.push('/login');
    //     },
    // });
    //
    // // Update Profile Mutation
    // const updateProfileMutation = useMutation({
    //     mutationFn: authApi.updateProfile,
    //     onSuccess: (updatedUser) => {
    //         queryClient.setQueryData(authKeys.session(), updatedUser);
    //     },
    // });

    return{
        // State
        user,
        isLoading: sessionQuery.isLoading, //initial session check
        isAuthenticated,
        isError: sessionQuery.isError,
        error: sessionQuery.error,

        // Actions
        login: async (credentials: LoginCredentials) => {
            return loginMutation.mutateAsync(credentials);
        },
        // logout: async () => {
        //     return logoutMutation.mutateAsync();
        // },
        // updateProfile: async (data: UpdateProfilePayload) => {
        //     return updateProfileMutation.mutateAsync(data);
        // },
        // refetchSession: sessionQuery.refetch,
    }
}