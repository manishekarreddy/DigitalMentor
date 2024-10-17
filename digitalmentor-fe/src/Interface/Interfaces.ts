export interface AuthResponse {
    jwt: string,
    email: string,
    roles: [string]
}

export interface LoginFormData {
    email: string;
    password: string;
}
