import { AuthResponse, LoginFormData } from '../../Interface/Interfaces';
import httpService from '../../Services/HttpService';
import ValidationService from '../../Services/ValidationService';

class AuthService {
    // Validate form data before making API requests
    validateForm(mode: string, formData: Record<string, any>): object {
        const nameErr = mode === "signUp" && (!formData.name || formData.name.trim() === ""); // Name required for signup
        const emailErr = !formData.email || !ValidationService.validateEmail(formData.email); // Basic email validation
        const passErr = !formData.password || !ValidationService.validatePassword(formData.password); // Password must be at least 4 characters

        return {
            nameErr: nameErr ? "Name is required." : null,
            emailErr: emailErr ? "Email is invalid." : null,
            passErr: passErr ? "Password must be at least 4 characters." : null,
        };
    };

    // Registration API call
    async register(formData: { email: string, password: string, name: string }): Promise<object> {
        try {
            // Make POST request to /register endpoint
            const response = await httpService.post('/register', {
                email: formData.email,
                password: formData.password,
                username: formData.name, // Assuming backend expects 'username' for name
            });
            return { success: true, message: "User registered successfully.", data: response.data };
        } catch (error) {
            // Handle unknown error type safely
            if (this.isAxiosError(error)) {
                return { success: false, message: error.response?.data?.message || "Registration failed." };
            }
            return { success: false, message: "Registration failed due to network or server error." };
        }
    }

    // Login API call
    async login(formData: LoginFormData): Promise<any> {
        try {
            const response = await httpService.post<AuthResponse>('/login', formData);
            const { jwt, roles }: AuthResponse = response.data;

            localStorage.setItem('token', jwt);
            localStorage.setItem('email', formData.email);
            localStorage.setItem('roles', JSON.stringify(roles));

            return { success: true, message: "Login successful.", data: response.data };
        } catch (error) {
            // Handle unknown error type safely
            if (this.isAxiosError(error)) {
                return { success: false, message: error.response?.data?.message || "Registration failed." };
            }
            return { success: false, message: "Registration failed due to network or server error." };
        }
    }

    // Helper function to check if error is an Axios error
    private isAxiosError(error: unknown): error is { response: { data: { message: string } } } {
        return typeof error === 'object' && error !== null && 'response' in error;
    }
}

export default AuthService;
