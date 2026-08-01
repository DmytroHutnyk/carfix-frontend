import {
    ApiError,
    ClientError,
    isProblemDetailError,
    NetworkError,
    ProblemDetailError,
    StandardError
} from "@/util/types/apiTypes";

async function parseResponse<T>(response: Response): Promise<T | ApiError> {
    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    if (response.ok) {
        return data as T;
    }

    return toApiError(response, data);
}

function toApiError(response: Response, data: unknown): ApiError {
    if (!data) {
        const standardError: StandardError = {
            _tag: 'StandardError',
            name: 'HttpError',
            message: response.statusText || 'Request failed',
            status: response.status,
            body: null,
        };
        return standardError;
    }

    if (isProblemDetailError(data)) {
        const problemDetailError: ProblemDetailError = {
            _tag: 'ProblemDetailError',
            type: data.type,
            title: data.title,
            status: data.status,
            detail: data.detail,
            instance: data.instance,
            errors: data.errors,
            code: data.code,
        };
        return problemDetailError;
    }

    const body = data as { name?: string; message?: string; status?: number; body?: unknown };
    const standardError: StandardError = {
        _tag: 'StandardError',
        name: body.name ?? 'HttpError',
        message: body.message ?? (response.statusText || 'Request failed'),
        status: body.status ?? response.status,
        body: body.body ?? null,
    };
    return standardError;
}

function toClientSideError(err: unknown): ApiError {
    if (err instanceof TypeError) {
        const networkError: NetworkError = {
            _tag: 'NetworkError',
            name: err.name,
            message: err.message,
            description: "Network error."
        };
        return networkError;
    }

    if (err instanceof SyntaxError) {
        const clientError: ClientError = {
            _tag: 'ClientError',
            description: "Invalid JSON response from server."
        };
        return clientError;
    }

    const clientError: ClientError = {
        _tag: 'ClientError',
        description: "Unknown error occurred."
    };
    return clientError;
}

export const clientApi = {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE,
    defaultHeaders: {
        'Content-Type': 'application/json',
    },

    async get<T>(url: string): Promise<T | ApiError> {
        try {
            const response = await fetch(`${this.baseUrl}${url}`, {
                method: 'GET',
                headers: this.defaultHeaders,
                credentials: 'include',
            });

            await new Promise(resolve => setTimeout(resolve, 1000));

            return await parseResponse<T>(response);
        } catch (err) {
            return toClientSideError(err);
        }
    },

    async post<TResponse, TRequest>(url: string, dataToSend?: TRequest): Promise<TResponse | ApiError> {
        try {
            const response = await fetch(`${this.baseUrl}${url}`, {
                method: 'POST',
                headers: this.defaultHeaders,
                body: dataToSend !== undefined ? JSON.stringify(dataToSend) : undefined,
                credentials: 'include',
            });

            await new Promise(resolve => setTimeout(resolve, 1000));

            return await parseResponse<TResponse>(response);
        } catch (err) {
            return toClientSideError(err);
        }
    },

    async put<TResponse, TRequest>(url: string, dataToSend: TRequest): Promise<TResponse | ApiError> {
        try {
            const response = await fetch(`${this.baseUrl}${url}`, {
                method: 'PUT',
                headers: this.defaultHeaders,
                body: JSON.stringify(dataToSend),
                credentials: 'include',
            });

            await new Promise(resolve => setTimeout(resolve, 1000));

            return await parseResponse<TResponse>(response);
        } catch (err) {
            return toClientSideError(err);
        }
    },

    async patch<TResponse, TRequest>(url: string, dataToSend: TRequest): Promise<TResponse | ApiError> {
        try {
            const response = await fetch(`${this.baseUrl}${url}`, {
                method: 'PATCH',
                headers: this.defaultHeaders,
                body: JSON.stringify(dataToSend),
                credentials: 'include',
            });

            await new Promise(resolve => setTimeout(resolve, 10000));

            return await parseResponse<TResponse>(response);
        } catch (err) {
            return toClientSideError(err);
        }
    },

    async delete(url: string): Promise<void | ApiError> {
        try {
            const response = await fetch(`${this.baseUrl}${url}`, {
                method: 'DELETE',
                headers: this.defaultHeaders,
                credentials: 'include',
            });

            await new Promise(resolve => setTimeout(resolve, 1000));

            if (response.ok) {
                return;
            }

            return await parseResponse<void>(response);
        } catch (err) {
            return toClientSideError(err);
        }
    },
}
