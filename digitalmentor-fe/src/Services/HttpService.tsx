import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

// Define base URL for the API
const BASE_URL = 'http://localhost:8080'; // Change this to your actual API base URL

class HttpService {
    // Create an Axios instance with default config
    private axiosInstance = axios.create({
        baseURL: BASE_URL,
        timeout: 10000, // Timeout after 10 seconds
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // Optional: Add interceptors to handle request/response globally
    constructor() {
        this.axiosInstance.interceptors.request.use(
            (config) => {
                // You can add a token here if needed for authorization
                const token = localStorage.getItem('token'); // Example: getting token from localStorage
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                // Handle request errors
                return Promise.reject(error);
            }
        );

        this.axiosInstance.interceptors.response.use(
            (response: AxiosResponse) => {
                // Handle global response logic (like logging)
                return response;
            },
            (error) => {
                // Handle errors globally (like unauthorized access)
                if (error.response && error.response.status === 401) {
                    console.log("Unauthorized, redirecting to login...");
                    // You can perform a redirect to login here
                }
                return Promise.reject(error);
            }
        );
    }

    // GET request
    get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.axiosInstance.get<T>(url, config);
    }

    // POST request
    post<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.axiosInstance.post<T>(url, data, config);
    }

    // PUT request
    put<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.axiosInstance.put<T>(url, data, config);
    }

    // DELETE request
    delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.axiosInstance.delete<T>(url, config);
    }
}

const httpService = new HttpService();
export default httpService;
