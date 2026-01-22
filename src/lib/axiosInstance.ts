import axios from "axios";
import { getCookie } from "./utils";
import Cookies from "js-cookie";
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 60000, // 10 sec
});

const getAuthToken = () => {
  const token = getCookie("access_token");
  return token;
};

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (!token) {
      return Promise.reject("Token not found");
    } else {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status===403) {
      console.error("Unauthorized! Redirect to login...");
      // Optionally handle logout or redirection logic here
      Cookies.remove("access_token")
      Cookies.remove("refresh_token")
      // localStorage.removeItem("access_token")
      window.location.href="/signin"
    }
    return Promise.reject(error);
  },
);

/**
 * Function to perform an Axios request with optional scope
 * @param {Object} config - Axios request configuration
 * @param {Object} [scope] - Optional scope object for POST requests
 * @returns {Promise} - Axios response promise
 */
//@ts-nocheck
const axiosRequest = (config: {
    method: string
    data?: object
    url: string
}, scope: Record<string, string> = {}) => {
  if (
    config.method?.toLowerCase() === "post" ||
    config.method?.toLowerCase() === "patch"
  ) {
    if (!(config.data instanceof FormData)) {
      config.data = {
        ...config.data,
        ...scope,
      };
    }
  }
  return axiosInstance.request(config);
};

export default axiosRequest;









// import axios from "axios";
// // import { toast } from "react-toastify";
// // import { logout } from "./slice/authSlice";
// import { AppDispatch } from "./store";
// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// let store: { dispatch: AppDispatch } | null = null;

// export const configureApiClient = (reduxStore: { dispatch: AppDispatch }) => {
//   store = reduxStore;
// };

// const apiClient = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
// });

// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response && error.response.status === 403) {
//     //   toast.error("Session expired. Please log in again.");
//     //   store?.dispatch(logout());
//     }
//     return Promise.reject(error);
//   }
// );

// export default apiClient;