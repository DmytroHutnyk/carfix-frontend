/** General error type occurred within API scope. */
export interface ApiError {
    readonly _tag: string;
}

/**
 * Returned when the backend responds with a non-OK status AND either the body IS empty,
 * or the body is present but DOES NOT match {@link ProblemDetailError}.
 */
export interface StandardError extends ApiError {
    readonly _tag: 'StandardError';
    name: string;
    message: string;
    status: number;
    // only for debugging
    body?: unknown;
}

/**
 * Returned when the backend responds with a non-OK status and the body matches
 * Spring's `ProblemDetail` format — i.e. errors handled by `@ControllerAdvice`.
 */
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

/** Produced when `fetch()` throws a `TypeError` before the request ever reaches the server. */
export interface NetworkError extends ApiError {
    readonly _tag: 'NetworkError';
    name: string;
    message: string;
    description: string;
}

/**
 * Catch-all for unexpected JS errors thrown inside `clientApi` —
 * e.g. a `SyntaxError` from `JSON.parse()` if the response is not valid JSON.
 */
export interface ClientError extends ApiError {
    readonly _tag: 'ClientError';
    description: string;
}

type Errors = {
    [key: string]: string;
}

/**
 * An ApiError reduced to what the UI needs
 */
export type DisplayError = {
    message: string;
    field?: string;
    code?: string;
    status?: number;
};

/** Pattern matching for error types. */
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

/**
 * Checks all fields of the raw Java `ProblemDetail` object as it arrives in JSON —
 * before `_tag` is assigned. Used inside `clientApi` to detect the error type from the server response.
 */
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