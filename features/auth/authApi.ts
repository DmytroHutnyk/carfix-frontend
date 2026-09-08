import {Account} from "@/features/user/userTypes";
import {clientApi} from "@/lib/clientApi";
import {LoginCredentials, RegisterData} from "@/features/auth/authTypes";
import {isApiError} from "@/lib/apiTypes";

export const authApi = {
    async getSession(): Promise<Account | null> {
        const result = await clientApi.get<Account>('/auth/me')

        console.log("refetched")
        if (isApiError(result)) {
            // An anonymous session is expected, not an error state.
            if ('status' in result && result.status === 401) {
                return null;
            }
            throw result;
        }

        return result;
    },

    async login(credentials: LoginCredentials): Promise<Account> {
        const result = await clientApi.post<Account, LoginCredentials>('/auth/login', credentials);

        if (isApiError(result)) {
            throw result;
        }

        return result;
    },

    async registerCustomer(registerData: RegisterData): Promise<Account> {
        const result = await clientApi.post<Account, RegisterData>('/customer/auth/register', registerData);

        if (isApiError(result)) {
            throw result;
        }

        return result;
    },

    async logout(): Promise<void> {
        const result = await clientApi.post('/auth/logout');

        if (isApiError(result)) {
            throw result;
        }
    },
}
