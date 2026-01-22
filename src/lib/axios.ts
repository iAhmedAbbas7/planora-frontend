// <== IMPORTS ==>
import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";

// <== API BASE URL ==>
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:7000/api/v1";
// <== API ERROR RESPONSE INTERFACE ==>
interface ApiErrorResponse {
  // <== CODE ==>
  code?: string;
  // <== MESSAGE ==>
  message?: string;
  // <== SUCCESS ==>
  success?: boolean;
}
// <== TOKEN REFRESH CALLBACK TYPE ==>
type TokenRefreshCallback = (error?: AxiosError) => void;

// <== CREATING AXIOS INSTANCE ==>
export const apiClient = axios.create({
  // <== BASE URL ==>
  baseURL: API_BASE_URL,
  // <== WITH CREDENTIALS ==>
  withCredentials: true,
  // <== HEADERS ==>
  headers: {
    // <== CONTENT TYPE ==>
    "Content-Type": "application/json",
  },
});
// <== TOKEN REFRESH STATE ==>
let isRefreshing = false;
// <== REFRESH SUBSCRIBERS ==>
let refreshSubscribers: TokenRefreshCallback[] = [];
// <== SUBSCRIBE TO TOKEN REFRESH ==>
const subscribeTokenRefresh = (cb: TokenRefreshCallback): void => {
  // ADD CALLBACK TO SUBSCRIBERS
  refreshSubscribers.push(cb);
};
// <== ON TOKEN REFRESHED ==>
const onTokenRefreshed = (): void => {
  // CALL ALL SUBSCRIBERS
  refreshSubscribers.forEach((cb) => cb());
  // CLEAR SUBSCRIBERS
  refreshSubscribers = [];
};
// <== REQUEST INTERCEPTOR ==>
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // REQUEST WILL BE SENT WITH CREDENTIALS (COOKIES)
    return config;
  },
  (error) => {
    // RETURN ERROR
    return Promise.reject(error);
  }
);
// <== RESPONSE INTERCEPTOR ==>
apiClient.interceptors.response.use(
  (response) => {
    // RETURN SUCCESSFUL RESPONSE
    return response;
  },
  async (error: AxiosError<ApiErrorResponse>) => {
    // GET ORIGINAL REQUEST CONFIG
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
      skipTokenRefresh?: boolean;
    };
    // CHECK IF ERROR IS 401 AND NOT A RETRY AND NOT REFRESH ENDPOINT
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      // CHECK ERROR CODE AND MESSAGE FROM BACKEND FIRST
      const errorCode = error.response.data?.code;
      // GET ERROR MESSAGE
      const errorMessage = error.response.data?.message || "";
      // CHECK IF REQUEST HAS SKIP REFRESH FLAG (FOR AUTH CHECK REQUESTS)
      if (originalRequest.skipTokenRefresh) {
        // DON'T TRY TO REFRESH - JUST RETURN THE ERROR
        return Promise.reject(error);
      }
      // CHECK ERROR MESSAGE (CASE-INSENSITIVE) AND ERROR CODE
      const lowerErrorMessage = errorMessage.toLowerCase();
      if (
        lowerErrorMessage.includes("refresh token not found") ||
        lowerErrorMessage.includes("refresh token not found or expired") ||
        lowerErrorMessage.includes("no refresh token") ||
        lowerErrorMessage.includes("session has been revoked or expired") ||
        errorCode === "REFRESH_TOKEN_NOT_FOUND" ||
        errorCode === "NO_REFRESH_TOKEN" ||
        errorCode === "SESSION_REVOKED"
      ) {
        // DISPATCH SESSION EXPIRED EVENT
        const event = new CustomEvent("session-expired");
        // DISPATCH EVENT
        window.dispatchEvent(event);
        // RETURN ERROR
        return Promise.reject(error);
      }
      // IF ACCESS TOKEN EXPIRED, TRY TO REFRESH
      if (
        errorCode === "ACCESS_TOKEN_EXPIRED" ||
        errorCode === "NO_ACCESS_TOKEN"
      ) {
        // IF ALREADY REFRESHING, QUEUE THIS REQUEST
        if (isRefreshing) {
          // QUEUE REQUEST
          return new Promise<AxiosResponse>((resolve, reject) => {
            // SUBSCRIBE TO TOKEN REFRESH
            subscribeTokenRefresh((refreshError?: AxiosError) => {
              // IF REFRESH ERROR, REJECT PROMISE
              if (refreshError) {
                // REJECT PROMISE WITH REFRESH ERROR
                reject(refreshError);
              } else {
                // RESOLVE PROMISE WITH ORIGINAL REQUEST
                resolve(apiClient(originalRequest));
              }
            });
          });
        }
        // SET REFRESHING FLAG
        originalRequest._retry = true;
        // SET IS REFRESHING FLAG TO TRUE
        isRefreshing = true;
        try {
          // CALL REFRESH TOKEN ENDPOINT (SILENT)
          await apiClient.post("/auth/refresh");
          // TOKEN REFRESHED SUCCESSFULLY
          onTokenRefreshed();
          // SET IS REFRESHING FLAG TO FALSE
          isRefreshing = false;
          // RETRY ORIGINAL REQUEST
          return apiClient(originalRequest);
        } catch (refreshError) {
          // REFRESH TOKEN FAILED - SESSION EXPIRED
          isRefreshing = false;
          // NOTIFY ALL QUEUED REQUESTS OF FAILURE
          const axiosError = refreshError as AxiosError;
          // CALL ALL SUBSCRIBERS WITH THE ERROR
          refreshSubscribers.forEach((cb) => cb(axiosError));
          // CLEAR SUBSCRIBERS
          refreshSubscribers = [];
          // DISPATCH SESSION EXPIRED EVENT
          const event = new CustomEvent("session-expired");
          // DISPATCH EVENT
          window.dispatchEvent(event);
          // RETURN ERROR
          return Promise.reject(refreshError);
        }
      }
    }
    // RETURN ERROR FOR OTHER CASES
    return Promise.reject(error);
  }
);
// <== EXPORT DEFAULT ==>
export default apiClient;
