import {User} from "@/util/types/userTypes";
import {clientApi} from "@/util/api/clientApi";
import {LoginCredentials, RegisterData} from "@/util/types/authTypes";
import {isApiError} from "@/util/types/apiTypes";

export const authApi = {
    async getSession() : Promise<User | null>{
        const result  = await clientApi.get<User>('/customer/auth/me')

        //TODO if 401 user must be redirected to login, but not always! only on protected pages
        console.log("refetched")
        if(isApiError(result)){
            //401 is considered as expected normal behaviour when the user is not logged in, that is why null returned
            if('status' in result && result.status === 401){
                return null;
            }
            throw result;
        }

        return result as User;
    },

    async login(credentials: LoginCredentials): Promise<User>{
        const result  = await clientApi.post<User, LoginCredentials>('/customer/auth/login', credentials);

        if(isApiError(result)){
            throw result;
        }

        return result as User;
    },

    async register(registerData: RegisterData): Promise<User>{
        const result  = await clientApi.post<User, RegisterData>('/customer/auth/register', registerData);

        if(isApiError(result)){
            throw result;
        }

        return result as User;
    },

    async logout(): Promise<void> {
        const result = await clientApi.post('/customer/auth/logout');

        if (isApiError(result)) {
            throw result;
        }
    },
}