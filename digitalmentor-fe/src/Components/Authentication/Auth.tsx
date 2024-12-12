import { Button, Container, Paper, Card, TextField, Typography, CardContent } from "@mui/material";
import Grid from '@mui/material/Grid';
import loginIllustration from '../../assets/login_illustration.png';
import { useState, useCallback } from "react";
import AuthService from "./AuthService";
import { useSnackbar } from '../../Services/SnackbarContext';
import { useNavigate, useLocation } from 'react-router-dom';
import LSS from "../../Services/LSS";

const Auth = () => {
  const authService = new AuthService();
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const location = useLocation(); // Use useLocation to access query parameters

  // Extract the "redirect" query parameter from the URL
  const queryParams = new URLSearchParams(location.search);
  const redirect = queryParams.get("redirect");

  // Define mode-related states
  const [mode, setMode] = useState("Login");
  const [submitBtnText, setSubmitBtnText] = useState("SIGN IN");
  const [switchModesText, setSwitchModesText] = useState("CREATE ACCOUNT ?");
  const [panelHeading, setPanelHeading] = useState("Login");

  // Define form error states
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  // Form fields state
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");

  // Reset all error states
  const resetErrors = useCallback(() => {
    setPasswordError(false);
    setEmailError(false);
    setNameError(false);
  }, []);

  // Switch between login/signup modes
  const swapModes = useCallback(() => {
    setMode(prevMode => (prevMode === "Login" ? "signUp" : "Login"));
    setSubmitBtnText(prevText => (prevText === "SIGN IN" ? "SIGN UP" : "SIGN IN"));
    setSwitchModesText(prevText => (prevText === "CREATE ACCOUNT ?" ? "SWITCH TO LOGIN" : "CREATE ACCOUNT ?"));
    setPanelHeading(prevHeading => (prevHeading === "Login" ? "Sign Up" : "Login"));
    resetErrors();
  }, [resetErrors]);

  const continueAsGuest = () => {
    LSS.removeItem("user");
    LSS.setItem("mode", "guest");
    navigate("/dashboard");
  };

  // Handle form submission
  const handleFormSubmit = useCallback(async () => {
    resetErrors();

    const formData = {
      mode,
      email,
      password,
      ...(mode === "signUp" && { name: name || "" }),
    };

    // Validate form data
    const resp: Record<string, any> = authService.validateForm(mode, formData);

    if (mode === "signUp") {
      if (resp.nameErr) {
        setNameError(true);
        showSnackbar(resp.nameErr, 'error');
      }

      if (resp.emailErr) {
        setEmailError(true);
        showSnackbar(resp.emailErr, 'error');
      }

      if (resp.passErr) {
        setPasswordError(true);
        showSnackbar(resp.passErr, 'error');
      }

      if (!resp.nameErr && !resp.emailErr && !resp.passErr) {
        const response: Record<string, any> = await authService.register({
          name: name!,
          email,
          password,
        });
        if (response.success) {
          showSnackbar(response.message, 'success');
          swapModes();
        } else {
          showSnackbar(response.message, 'error');
        }
      }
    } else if (mode === "Login") {
      try {
        const loginResp = await authService.login(formData);
        if (loginResp.success) {
          showSnackbar(loginResp.message, 'success');

          // If there is a redirect URL, navigate to it
          if (redirect) {
            let r = "/" + redirect
            navigate(r); // Redirect to the value of the "redirect" query parameter
          } else {
            navigate("/dashboard");
          }
        } else {
          showSnackbar(loginResp.message, 'error');
          setEmailError(true);
          setPasswordError(true);
        }
      } catch (error) {
        console.error("Error during login:", error);
        showSnackbar("An unexpected error occurred during login.", 'error');
      }
    }
  }, [email, password, name, mode, authService, showSnackbar, resetErrors, redirect, navigate]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleFormSubmit();
    }
  };

  return (
    <Container
      style={{
        height: "90vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "20"
      }}
    >
      <Card
        style={{
          width: "80%",
          maxWidth: "700px",
          boxShadow: "0px 4px 30px rgba(0, 0, 0, 0.7)"
        }}>
        <Grid container>
          {/* Left side: Image */}
          <Grid item xs={12} md={6}>
            <Paper
              style={{
                height: "100%",
                backgroundImage: `url(${loginIllustration})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          </Grid>

          {/* Right side: Login form */}
          <Grid
            item
            xs={12}
            md={6}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "16px",
            }}
          >
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {panelHeading}
              </Typography>

              {mode === "signUp" && (
                <TextField
                  error={nameError}
                  label="Name"
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  onChange={(e) => setName(e.target.value)}
                />
              )}

              <TextField
                error={emailError}
                label="Email"
                variant="outlined"
                margin="normal"
                fullWidth
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
              />

              <TextField
                error={passwordError}
                label="Password"
                type="password"
                variant="outlined"
                margin="normal"
                fullWidth
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
              />

              <Button
                variant="contained"
                color="primary"
                fullWidth
                style={{ marginTop: "16px" }}
                onClick={handleFormSubmit}
              >
                {submitBtnText}
              </Button>

              <Button
                id="swapMethodBtn"
                color="secondary"
                fullWidth
                style={{ marginTop: "25px" }}
                onClick={swapModes}
              >
                {switchModesText}
              </Button>

              <Button
                id="swapMethodBtn"
                color="secondary"
                fullWidth
                style={{ marginTop: "25px" }}
                onClick={continueAsGuest}
              >
                Continue as Guest?
              </Button>
            </CardContent>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
};

export default Auth;
