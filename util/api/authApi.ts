import {User} from "@/util/types/app";
import {clientApi} from "@/util/api/clientApi";
import {ApiError} from "next/dist/server/api-utils";
import {LoginCredentials, RegisterRequest} from "@/util/types/auth";
import {isApiError} from "@/util/types/api";

export const authApi = {
    async getSession() : Promise<User | null>{
        const result  = await clientApi.get<User>('/customer/auth/me')

        //TODO if 401 user must be redirected to login, but not always! only on protected pages

        if(isApiError(result)){
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

    async register(registerData: RegisterRequest): Promise<User>{
        const result  = await clientApi.post<User, RegisterRequest>('/customer/auth/register', registerData);

        if(isApiError(result)){
            throw result;
        }

        return result as User;
    }
}