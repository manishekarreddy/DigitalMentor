import { Button, Container, Paper, Card, TextField, Typography, CardContent } from "@mui/material";
import Grid from '@mui/material/Grid';
import loginIllustration from '../../assets/login_illustration.png';
import { useState, useCallback } from "react";
import AuthService from "./AuthService";
import { useSnackbar } from '../../Services/SnackbarContext';

const Auth = () => {
  const authService = new AuthService();
  const { showSnackbar } = useSnackbar();

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

  // Handle form submission
  const handleFormSubmit = useCallback(async () => {
    resetErrors();

    // Ensure that 'name' is defined when in sign-up mode
    const formData = {
      mode,
      email,
      password,
      ...(mode === "signUp" && { name: name || "" }), // Provide an empty string if name is undefined
    };

    // Validate form data
    const resp: Record<string, any> = authService.validateForm(mode, formData);

    // Handle validation errors for signup
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

      // Proceed if no errors
      if (!resp.nameErr && !resp.emailErr && !resp.passErr) {
        // Ensure formData.name is defined when calling register
        const response: Record<string, any> = await authService.register({
          name: name!, // Using non-null assertion
          email,
          password,
        });
        if (response.success) {
          showSnackbar(response.message, 'success');
          swapModes(); // Switch to login mode after successful signup
        } else {
          showSnackbar(response.message, 'error');
        }
      }
    } else if (mode === "Login") {
      // Handle login logic
      const loginResp: Record<string, any> = authService.login(formData);
      if (loginResp.success) {
        showSnackbar(loginResp.message, 'success');
      } else {
        showSnackbar(loginResp.message, 'error');
        setEmailError(true); // Adjust as needed based on the login response
        setPasswordError(true); // Adjust as needed based on the login response
      }
    }
  }, [email, password, name, mode, authService, showSnackbar, resetErrors]);


  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleFormSubmit(); // Trigger form submission
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
                onKeyDown={handleKeyDown} // Trigger form submission on Enter
              />

              <TextField
                error={passwordError}
                label="Password"
                type="password"
                variant="outlined"
                margin="normal"
                fullWidth
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown} // Trigger form submission on Enter
              />

              <Button
                variant="contained"
                color="primary"
                fullWidth
                style={{ marginTop: "16px" }}
                onClick={handleFormSubmit} // Submit on button click
              >
                {submitBtnText}
              </Button>

              <Button
                id="swapMethodBtn"
                color="secondary"
                fullWidth
                style={{ marginTop: "25px" }}
                onClick={swapModes} // Swap modes on button click
              >
                {switchModesText}
              </Button>
            </CardContent>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
}

export default Auth;
