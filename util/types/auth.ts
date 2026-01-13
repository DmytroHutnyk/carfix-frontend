/* auth request response */
import {User} from "@/util/types/app";
import {UseMutationResult} from "@tanstack/react-query";
import {ApiError} from "@/util/types/api";

export interface LoginRequest{
    email: string;
    password: string;
}

export interface RegisterRequest{
    name: string;
    surname: string;
    phoneCountryCode: string;
    phoneNumber: string;
    email: string;
    password: string;
}

export interface LoginCredentials{
    email: string;
    password: string;
}

/* hooks */
export interface AuthState {
    /* currently authenticated user, or null if not */
    user: User | null;

    /* True during initial session validity check */
    isLoading: boolean;

    /* True if is user is authenticated (authenticated means that user property is not null) */
    isAuthenticated: boolean;

    /* True if session check is failed with an error 401 */
    isError: boolean;

    /* Object error if session check is failed, null otherwise */
    error: Error | null;
}

export interface AuthActions {
    login: (credentials: LoginCredentials) => Promise<User>
    logout: () => Promise<void>;
    refetchSession: () => Promise<void>;
    /* updateProfile: (data: UpdateProfilePayload) => Promise<User>;*/
}

export interface UseAuthReturn extends AuthState, AuthActions {
    loginMutation: UseMutationResult<User, ApiError, LoginCredentials>;
    logoutMutation: UseMutationResult<void, ApiError, void>;
    /*   updateProfileMutation: UseMutationResult<User, ApiError, UpdateProfilePayload>; */
}