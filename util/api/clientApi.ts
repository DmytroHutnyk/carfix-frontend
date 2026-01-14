import {ApiError, ClientError, isProblemDetailError, NetworkError, ProblemDetailError, StandardError} from "@/util/types/api";

export const clientApi = {
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    defaultHeaders: {
        'Content-Type': 'application/json',
    },

    async get<T>(url: string) : Promise<T | ApiError> {
        try{
            const response = await fetch(`${this.baseUrl}${url}`,{
                method: 'GET',
                headers: this.defaultHeaders,
                credentials: 'include',
            });

            const data = await response.json();

            if(!response.ok){
                if(isProblemDetailError(data)){
                    const problemDetailError: ProblemDetailError = {
                        _tag: 'ProblemDetailError',
                        type: data.type,
                        title: data.title,
                        status: data.status,
                        detail: data.detail,
                        instance: data.instance,
                        errors: data.errors,
                    };
                    return problemDetailError;
                }else{
                    const standardError: StandardError = {
                        _tag: 'StandardError',
                        name: data.name,
                        message: data.message,
                        status: data.status,
                        body: data.body,
                    }
                    return standardError;
                }
            }

            return data as T;

        }catch(err){
            if(err instanceof TypeError){ //TODO move out to separate function
                const networkError: NetworkError = {
                    _tag: 'NetworkError',
                    name: err.name,
                    message: err.message,
                    description: "Network error."
                }
                return networkError;
            }

            const clientError: ClientError = {
                _tag: 'ClientError',
                description: "Unknown error occurred."
            }
            return clientError;
        }
    },

    async post<TResponse, TRequest>(url: string, dataToSend: TRequest): Promise<TResponse | ApiError> {
        try{
            const response = await fetch(`${this.baseUrl}${url}`,{
                method: 'POST',
                headers: this.defaultHeaders,
                body: JSON.stringify(dataToSend),
                credentials: 'include',
            });

            const data = await response.json();

            if(!response.ok){
                if(isProblemDetailError(data)){
                    const problemDetailError: ProblemDetailError = {
                        _tag: 'ProblemDetailError',
                        type: data.type,
                        title: data.title,
                        status: data.status,
                        detail: data.detail,
                        instance: data.instance,
                        errors: data.errors,
                    };
                    return problemDetailError;
                }else{
                    const standardError: StandardError = {
                        _tag: 'StandardError',
                        name: data.name,
                        message: data.message,
                        status: data.status,
                        body: data.body,
                    }
                    return standardError;
                }
            }

            return data as TResponse;
        }catch(err){
            if(err instanceof TypeError){
                const networkError: NetworkError = {
                    _tag: 'NetworkError',
                    name: err.name,
                    message: err.message,
                    description: "Network error."
                }
                return networkError;
            }

            const clientError: ClientError = {
                _tag: 'ClientError',
                description: "Unknown error occurred."
            }
            return clientError;
        }
    },

    async put<T>(url: string, dataToSend: T): Promise<T | ApiError> {
        try{
            const response = await fetch(`${this.baseUrl}${url}`,{
                method: 'PUT',
                headers: this.defaultHeaders,
                body: JSON.stringify(dataToSend),
                credentials: 'include',
            });

            const data = await response.json();

            if(!response.ok){
                if(isProblemDetailError(data)){
                    const problemDetailError: ProblemDetailError = {
                        _tag: 'ProblemDetailError',
                        type: data.type,
                        title: data.title,
                        status: data.status,
                        detail: data.detail,
                        instance: data.instance,
                        errors: data.errors,
                    };
                    return problemDetailError;
                }else{
                    const standardError: StandardError = {
                        _tag: 'StandardError',
                        name: data.name,
                        message: data.message,
                        status: data.status,
                        body: data.body,
                    }
                    return standardError;
                }
            }

            return data as T;
        }catch(err){
            if(err instanceof TypeError){
                const networkError: NetworkError = {
                    _tag: 'NetworkError',
                    name: err.name,
                    message: err.message,
                    description: "Network error."
                }
                return networkError;
            }

            const clientError: ClientError = {
                _tag: 'ClientError',
                description: "Unknown error occurred."
            }
            return clientError;
        }
    },

    async patch<TResponse, TRequest>(url: string, dataToSend: TRequest): Promise<TResponse | ApiError> {
        try{
            const response = await fetch(`${this.baseUrl}${url}`,{
                method: 'PATCH',
                headers: this.defaultHeaders,
                body: JSON.stringify(dataToSend),
                credentials: 'include',
            });

            const data = await response.json();

            if(!response.ok){
                if(isProblemDetailError(data)){
                    const problemDetailError: ProblemDetailError = {
                        _tag: 'ProblemDetailError',
                        type: data.type,
                        title: data.title,
                        status: data.status,
                        detail: data.detail,
                        instance: data.instance,
                        errors: data.errors,
                    };
                    return problemDetailError;
                }else{
                    const standardError: StandardError = {
                        _tag: 'StandardError',
                        name: data.name,
                        message: data.message,
                        status: data.status,
                        body: data.body,
                    }
                    return standardError;
                }
            }

            return data as TResponse;
        }catch(err){
            if(err instanceof TypeError){
                const networkError: NetworkError = {
                    _tag: 'NetworkError',
                    name: err.name,
                    message: err.message,
                    description: "Network error."
                }
                return networkError;
            }

            const clientError: ClientError = {
                _tag: 'ClientError',
                description: "Unknown error occurred."
            }
            return clientError;
        }
    },

    async delete(url: string): Promise<void | ApiError> {
        try {
            const response = await fetch(`${this.baseUrl}${url}`,{
                method: 'DELETE',
                headers: this.defaultHeaders,
                credentials: 'include',
            });

            if(response.ok){
                return;
            }

            const data = await response.json();

            if(!response.ok){
                if(isProblemDetailError(data)){
                    const problemDetailError: ProblemDetailError = {
                        _tag: 'ProblemDetailError',
                        type: data.type,
                        title: data.title,
                        status: data.status,
                        detail: data.detail,
                        instance: data.instance,
                        errors: data.errors,
                    };
                    return problemDetailError;
                }else{
                    const standardError: StandardError = {
                        _tag: 'StandardError',
                        name: data.name,
                        message: data.message,
                        status: data.status,
                        body: data.body,
                    }
                    return standardError;
                }
            }

            return;
        }catch(err){
            if(err instanceof TypeError){
                const networkError: NetworkError = {
                    _tag: 'NetworkError',
                    name: err.name,
                    message: err.message,
                    description: "Network error."
                }
                return networkError;
            }

            const clientError: ClientError = {
                _tag: 'ClientError',
                description: "Unknown error occurred."
            }
            return clientError;
        }
    },
}