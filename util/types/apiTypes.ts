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
    body?: JSON | null;
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

/** Pattern matching for error types. */
export function isApiError(obj: unknown): obj is ApiError {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        '_tag' in obj &&
        typeof (obj as ApiError)._tag === 'string'
    );
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

/**
 * Checks all fields of the raw Java `ProblemDetail` object as it arrives in JSON —
 * before `_tag` is assigned. Used inside `clientApi` to detect the error type from the server response.
 */
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

export function isNetworkError(obj: any): obj is NetworkError {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        obj._tag === 'NetworkError' &&
        typeof obj.name === 'string' &&
        typeof obj.message === 'string' &&
        typeof obj.description === 'string'
    );
}

export function isClientError(obj: any): obj is ClientError {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        obj._tag === 'ClientError' &&
        typeof obj.description === 'string'
    );
}