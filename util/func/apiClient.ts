const API_BASE = "http://localhost:8080/api";

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
  onUnauthorized?: () => void,
): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (response.status === 401 || response.status === 403) {
      if(onUnauthorized){
          onUnauthorized();
      }else{
          const result = await response.json();
          let errorMessage = result?.detail || result?.title || "Not Authorized";

          if (result?.errors) {
              errorMessage = Object.values(result.errors).join("\n");
          }
          throw new Error(errorMessage);
      }
  }

  if (!response.ok) {
    const result = await response.json();
    const message = result?.detail || result?.title || "Something went wrong";

    throw new Error(message);
  }

  return response.json();
}

