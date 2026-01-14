import {User} from "@/util/types/app";
import {clientApi} from "@/util/api/clientApi";
import {ApiError} from "next/dist/server/api-utils";
import {LoginCredentials, RegisterRequest} from "@/util/types/auth";
import {isApiError} from "@/util/types/api";

export const authApi = {
    async getSession() : Promise<User>{
        const result  = await clientApi.get<User>('/customer/auth/me')

        if(isApiError(result)){
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

    async register(registerData: RegisterRequest): Promise<User>{
        const result  = await clientApi.post<User, RegisterRequest>('/customer/auth/register', registerData);

        if(isApiError(result)){
            throw result;
        }

        return result as User;
    }
}