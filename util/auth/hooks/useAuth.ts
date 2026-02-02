import {LoginCredentials, RegisterData, UseAuthReturn} from "@/util/types/authTypes";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {useRouter} from "next/navigation";
import {authKeys} from "@/util/auth/keys";
import {authApi} from "@/util/api/authApi"
import {isApiError, isProblemDetailError, isStandardError} from "@/util/types/apiTypes";

export function useAuth(): UseAuthReturn {
    const queryClient = useQueryClient();
    const router = useRouter();

    const sessionQuery = useQuery({
        queryKey: authKeys.session(),
        queryFn: authApi.getSession,
        retry: 3,
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
        }

        // logout: async () => {
        //     return logoutMutation.mutateAsync();
        // },
        // updateProfile: async (data: UpdateProfilePayload) => {
        //     return updateProfileMutation.mutateAsync(data);
        // },
        // refetchSession: sessionQuery.refetch,
    }
}