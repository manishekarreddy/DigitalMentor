import { AuthResponse, LoginFormData } from '../../Interface/Interfaces';
import httpService from '../../Services/HttpService';
import LSS from '../../Services/LSS';
import ValidationService from '../../Services/ValidationService';

import { useNavigate } from 'react-router-dom';

class AuthService {
    // Validate form data before making API requests

    navigate = useNavigate();

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
            // Clear existing user data
            LSS.removeItem('user');

            // Send login request
            const response = await httpService.post<AuthResponse>('/login', formData, false);
            console.log("Authentication Response: ", response.data)
            const { jwt, roles, id, username, internationalStudent }: AuthResponse = response.data;


            // Construct user object
            const user = {
                token: jwt,
                roles: roles,
                email: formData.email,
                user_id: id,
                username: username,
                internationalStudent: internationalStudent
            };

            const hasAdminRole = user.roles.some(role => role.toLowerCase().includes("admin"));

            if (hasAdminRole) {
                LSS.setItem("mode", "admin")
            } else {
                LSS.setItem("mode", "user")
            }

            // Store user object in localStorage
            localStorage.setItem('user', JSON.stringify(user));

            return { success: true, message: "Login successful.", data: response.data };
        } catch (error) {
            // Handle errors
            console.error('Error during login:', error);
            return { success: false, message: "Login failed. Please try again." };
        }

    }

    logout() {
        LSS.removeItem('user')
        this.navigate("/")
    }

    // Helper function to check if error is an Axios error
    private isAxiosError(error: unknown): error is { response: { data: { message: string } } } {
        return typeof error === 'object' && error !== null && 'response' in error;
    }
}

export default AuthService;
