import {
    ApiError,
    DisplayError,
    isClientError,
    isNetworkError,
    isProblemDetailError,
    isStandardError
} from "@/lib/apiTypes";

const FALLBACK_MESSAGE = "Unknown error. Please try again";
const FIELD_ALIASES: Record<string, string> = {
    phoneCountryCodeAndPhoneNumber: "phoneNumber",
};

export function toDisplayError(error: ApiError): DisplayError {
    if (isProblemDetailError(error)) {
        const entries = Object.entries(error.errors ?? {});

        if (entries.length === 1) {
            const [rawField, fieldMessage] = entries[0];
            return {
                message: fieldMessage,
                field: FIELD_ALIASES[rawField] ?? rawField,
                code: error.code,
                status: error.status,
            };
        }

        const message = entries.length > 1
            ? `${error.detail}\n${entries.map(([, value]) => value).join("\n")}`
            : error.detail || error.title || FALLBACK_MESSAGE;

        return { message, code: error.code, status: error.status };
    }

    if (isStandardError(error)) {
        return {
            message: error.message || error.name || FALLBACK_MESSAGE,
            status: error.status,
        };
    }

    if (isNetworkError(error)) {
        return { message: error.message || error.name || "Network error. Please try again" };
    }

    if (isClientError(error)) {
        return { message: error.description || "Client error. Please try again" };
    }

    return { message: FALLBACK_MESSAGE };
}
