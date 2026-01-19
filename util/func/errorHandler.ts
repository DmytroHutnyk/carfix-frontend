import {ApiError, isClientError, isNetworkError, isProblemDetailError, isStandardError} from "@/util/types/apiTypes";

export const handleError = (error: ApiError, setError: (message: string) => void) => {
    let errorMessage = "Unknown error. Please try again";
    if(isProblemDetailError(error)){
        errorMessage = error.detail || error.title || "Request failed. Please try again"
    }else if (isStandardError(error)){
        errorMessage = error.message || error.name || "Request failed. Please try again"
    }else if(isNetworkError(error)){
        errorMessage = error.message || error.name || "Network error. Please try again"
    }else if(isClientError(error)){
        errorMessage = error.description || "Client error. Please try again"
    }
    setError(errorMessage);
}