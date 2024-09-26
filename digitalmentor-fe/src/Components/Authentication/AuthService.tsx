import ValidationService from '../../Services/ValidationService';
import LocalStorageService from '../../Services/LocalStorageService';

class AuthService {
    validateForm(mode: string, formData: Record<string, any>): object {
        const nameErr = mode === "signUp" && (!formData.name || formData.name.trim() === ""); // Name required for signup
        const emailErr = !formData.email || !ValidationService.validateEmail(formData.email); // Basic email validation
        const passErr = !formData.password || !ValidationService.validatePassword(formData.password); // Password must be at least 4 characters

        console.log("in Auth Service", formData);
        const hasErr = !!(nameErr || passErr || emailErr);

        if (!hasErr && mode === "signUp") {
            if (!this.emailExists(formData.email)) {
                // Store the user data if the email doesn't exist
                LocalStorageService.setItem("user", { email: formData.email, name: formData.name, password: formData.password });
                return { success: true, message: "User registered successfully." };
            } else {
                return { emailErr: "Email is already in use." };
            }
        }

        return {
            nameErr: nameErr ? "Name is required." : null,
            emailErr: emailErr ? "Email is invalid." : null,
            passErr: passErr ? "Password must be at least 4 characters." : null,
        };
    };

    emailExists(email: string): boolean {
        const user = LocalStorageService.getItem("user");
        // Assuming LocalStorageService.getItem returns null or an object
        return user && user.email === email;
    }

    // Additional method to handle login
    login(email: string, password: string): object {
        // Validate email and password formats before checking the user
        const emailErr = !ValidationService.validateEmail(email); // Check if email is valid
        const passErr = !ValidationService.validatePassword(password); // Check if password is valid

        if (emailErr) {
            return { success: false, message: "Email is invalid." };
        }
        if (passErr) {
            return { success: false, message: "Password must be at least 4 characters." };
        }

        const user = LocalStorageService.getItem("user");
        if (user) {
            if (user.email === email) {
                if (user.password === password) {
                    return { success: true, message: "Login successful." };
                } else {
                    return { success: false, message: "Invalid password." };
                }
            } else {
                return { success: false, message: "Email not found." };
            }
        }
        return { success: false, message: "No user registered." };
    }
}

export default AuthService;
