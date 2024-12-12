import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import LSS from './LSS';

const BASE_URL = 'http://localhost:8080';

class HttpService {
    // Create an Axios instance with default config
    private axiosInstance = axios.create({
        baseURL: BASE_URL,
        timeout: 1000000,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    constructor() {
        this.axiosInstance.interceptors.response.use(
            (response: AxiosResponse) => {
                // Handle global response logic (like logging)
                return response;
            },
            (error) => {
                // Handle errors globally (like unauthorized access)
                if (error.response && error.response.status === 401) {
                    console.log('Unauthorized, redirecting to login...');
                    // You can perform a redirect to login here
                }
                return Promise.reject(error);
            }
        );
    }

    private createConfig(
        config?: AxiosRequestConfig,
        useToken: boolean = true
    ): AxiosRequestConfig {
        const user = LSS.getItem('user');
        const token = user?.token || null; // Safely access token

        const updatedConfig = { ...config };

        if (useToken && token) {
            updatedConfig.headers = {
                ...updatedConfig.headers,
                Authorization: `Bearer ${token}`,
            };
        }

        return updatedConfig;
    }

    // GET request
    post<T>(
        url: string,
        data: any,
        useToken: boolean = true,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<T>> {
        return this.axiosInstance.post<T>(url, data, this.createConfig(config, useToken));
    }

    // GET request
    get<T>(
        url: string,
        useToken: boolean = true,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<T>> {
        return this.axiosInstance.get<T>(url, this.createConfig(config, useToken));
    }

    // PUT request
    put<T>(
        url: string,
        data: any,
        useToken: boolean = true,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<T>> {
        return this.axiosInstance.put<T>(url, data, this.createConfig(config, useToken));
    }

    // DELETE request
    delete<T>(
        url: string,
        useToken: boolean = true,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<T>> {
        return this.axiosInstance.delete<T>(url, this.createConfig(config, useToken));
    }
}

const httpService = new HttpService();
export default httpService;
