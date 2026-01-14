export interface ApiError {
    readonly _tag: string;
}

export interface ClientError extends ApiError {
    readonly _tag: 'ClientError';
    description: string;
}

export interface StandardError extends ApiError {
    readonly _tag: 'StandardError';
    name: string;
    message: string;
    status: number;
    body?: JSON;
}

export interface ProblemDetailError extends ApiError {
    readonly _tag: 'ProblemDetailError';
    type: string;
    title: string;
    status: number;
    detail: string;
    instance: string;
    errors?: Errors;
}

export interface NetworkError extends ApiError {
    readonly _tag: 'NetworkError';
    name: string;
    message: string;
    description: string;
}

type Errors = {
    [key: string]: string;
}

export function isStandardError(obj: any): obj is StandardError {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        obj._tag === 'StandardError' &&
        typeof obj.name === 'string' &&
        typeof obj.message === 'string' &&
        typeof obj.status === 'number' &&
        (obj.body === undefined || typeof obj.body === 'object')
    );
}

export function isProblemDetailError(obj: any): obj is ProblemDetailError {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        typeof obj.type === 'string' &&
        typeof obj.title === 'string' &&
        typeof obj.status === 'number' &&
        typeof obj.detail === 'string' &&
        typeof obj.instance === 'string' &&
        (obj.errors === undefined ||
            typeof obj.errors === 'object' ||
            obj.errors === '')
    );
}

export function isApiError(obj: unknown): obj is ApiError {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        '_tag' in obj &&
        typeof (obj as ApiError)._tag === 'string'
    );
}
