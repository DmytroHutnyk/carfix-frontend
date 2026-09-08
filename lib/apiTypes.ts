export interface ApiError {
    readonly _tag: string;
}

export interface StandardError extends ApiError {
    readonly _tag: 'StandardError';
    name: string;
    message: string;
    status: number;
    body?: unknown;
}

export interface ProblemDetailError extends ApiError {
    readonly _tag: 'ProblemDetailError';
    type: string;
    title: string;
    status: number;
    detail: string;
    instance: string;
    errors?: Errors;
    code?: string;
}

export interface NetworkError extends ApiError {
    readonly _tag: 'NetworkError';
    name: string;
    message: string;
    description: string;
}

export interface ClientError extends ApiError {
    readonly _tag: 'ClientError';
    description: string;
}

type Errors = {
    [key: string]: string;
}

export type DisplayError = {
    message: string;
    field?: string;
    code?: string;
    status?: number;
};

export function isApiError(obj: unknown): obj is ApiError {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        '_tag' in obj &&
        typeof (obj as ApiError)._tag === 'string'
    );
}

export function isStandardError(obj: unknown): obj is StandardError {
    if (typeof obj !== 'object' || obj === null) {
        return false;
    }
    const candidate = obj as Record<string, unknown>;
    return (
        candidate._tag === 'StandardError' &&
        typeof candidate.name === 'string' &&
        typeof candidate.message === 'string' &&
        typeof candidate.status === 'number'
    );
}

// Raw problem details have no `_tag` yet, so narrow on their wire fields.
export function isProblemDetailError(obj: unknown): obj is ProblemDetailError {
    if (typeof obj !== 'object' || obj === null) {
        return false;
    }
    const candidate = obj as Record<string, unknown>;
    return (
        typeof candidate.type === 'string' &&
        typeof candidate.title === 'string' &&
        typeof candidate.status === 'number' &&
        typeof candidate.detail === 'string' &&
        typeof candidate.instance === 'string' &&
        (candidate.errors === undefined || typeof candidate.errors === 'object')
    );
}

export function isNetworkError(obj: unknown): obj is NetworkError {
    if (typeof obj !== 'object' || obj === null) {
        return false;
    }
    const candidate = obj as Record<string, unknown>;
    return (
        candidate._tag === 'NetworkError' &&
        typeof candidate.name === 'string' &&
        typeof candidate.message === 'string' &&
        typeof candidate.description === 'string'
    );
}

export function isClientError(obj: unknown): obj is ClientError {
    if (typeof obj !== 'object' || obj === null) {
        return false;
    }
    const candidate = obj as Record<string, unknown>;
    return (
        candidate._tag === 'ClientError' &&
        typeof candidate.description === 'string'
    );
}
