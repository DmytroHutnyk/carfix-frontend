import {Account} from "@/util/types/userTypes";
import {clientApi} from "@/util/api/clientApi";
import {LoginCredentials, RegisterData} from "@/util/types/authTypes";
import {isApiError} from "@/util/types/apiTypes";

/* Auth is role-agnostic: the backend resolves the principal's role from the session and
 * returns the matching Account variant (user core + role tail) in one response. Only
 * `register` is role-specific — registration creates a role aggregate from a role-specific
 * payload (`registerOwner` will be added when owners can self-register). */
export const authApi = {
    async getSession(): Promise<Account | null> {
        const result = await clientApi.get<Account>('/auth/me')

        //TODO if 401 user must be redirected to login, but not always! only on protected pages
        console.log("refetched")
        if (isApiError(result)) {
            //401 is expected normal behaviour when the user is not logged in, that is why null returned
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

    //maybe we will even make registration universal for customer and owner, to have one endpoint and owner wil submit other details in profile settings
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