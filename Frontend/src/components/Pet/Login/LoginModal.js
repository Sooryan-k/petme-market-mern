import React, { useState } from "react";
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalBody,
  MDBModalFooter,
  MDBIcon,
} from "mdb-react-ui-kit";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

export default function LoginModal({ onSignupSuccess }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errormessage, setErrormessage] = useState("");
  const [username, setUsername] = useState("");
  const [loginmodal, setLoginmodal] = useState(false);
  const [signupmodal, setSignupmodal] = useState(false);

  const navigate = useNavigate();

  //signup

  const { signup } = useAuth();

  //login context
  const { login } = useAuth();

  // firebase signup
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const user = await signup(email, password, username);
      setEmail("");
      setPassword("");
      setSignupmodal(false);
      setErrormessage("");

      // callback to update navbar with the new username
      onSignupSuccess(username);
      console.log("User signup:", user);
      navigate("/");
    } catch (error) {
      setErrormessage(error.message);
      console.error("User signup error:", error.message);
    }
  };

  // firebase signin

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await login(email, password);
      setEmail("");
      setPassword("");
      setLoginmodal(false);
      setErrormessage("");

      console.log("User login:", user);
      navigate("/"); 
    } catch (error) {
      setErrormessage(error.message);
      console.error("User signin error:", error.message);
    }
  };

  return (
    <>
      <MDBBtn
        style={{
          width: "115px",
          height: "35px",
          fontSize: "16px",
          backgroundColor: "#09ab44",
          border: "none",
        }}
        onClick={() => setLoginmodal(!loginmodal)}
      >
        LOGIN
      </MDBBtn>
      {/* Login modal  */}

      <MDBModal
        open={loginmodal}
        onClose={() => setLoginmodal(false)}
        tabIndex="-1"
      >
        <MDBModalDialog centered>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBBtn
                className="btn-close bg-light"
                style={{ border: "none", color: "dark" }}
                onClick={() => setLoginmodal(!loginmodal)}
              >
                <MDBIcon icon="times" />
              </MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                  sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                    <LockOutlinedIcon />
                  </Avatar>
                  <Typography
                    component="h1"
                    variant="h5"
                    sx={{ color: "black" }}
                  >
                    Sign in
                  </Typography>
                  <Box component="form" noValidate sx={{ mt: 1 }}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                      autoFocus
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type="password"
                      id="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    {errormessage && (
                      <Typography color="error">{errormessage} </Typography>
                    )}
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{ mt: 3, mb: 2 }}
                      onClick={handleLogin}
                    >
                      Sign In
                    </Button>
                  </Box>
                </Box>
              </Container>
            </MDBModalBody>
            <MDBModalFooter>
              <Grid container justifyContent="flex-end" alignItems="center">
                <Grid item>
                  <Typography
                    variant="body2"
                    sx={{
                      marginRight: "10px",
                      color: "black",
                    }}
                  >
                    Don't have an account?
                  </Typography>
                </Grid>

                <MDBBtn
                  style={{
                    width: "130px",
                    height: "35px",
                    fontSize: "14px",
                    backgroundColor: "#09ab44",
                    border: "none",
                  }}
                  onClick={() => {
                    setLoginmodal(!loginmodal);
                    setTimeout(() => {
                      setSignupmodal(!signupmodal);
                    }, 400);
                  }}
                >
                  SIGNUP
                </MDBBtn>
              </Grid>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>

      {/* Signup Modal */}
      <MDBModal
        open={signupmodal}
        onClose={() => setSignupmodal(false)}
        tabIndex="-1"
      >
        <MDBModalDialog centered>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBBtn
                className="btn-close bg-light"
                onClick={() => setSignupmodal(!signupmodal)}
              >
                <MDBIcon icon="times" />
              </MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                  sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                    <LockOutlinedIcon />
                  </Avatar>
                  <Typography
                    component="h1"
                    variant="h5"
                    sx={{ color: "black" }}
                  >
                    Sign up
                  </Typography>
                  <Box component="form" noValidate sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          autoComplete="username"
                          name="username"
                          required
                          fullWidth
                          id="username"
                          label="Username"
                          autoFocus
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          required
                          fullWidth
                          id="email"
                          label="Email Address"
                          name="email"
                          autoComplete="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          required
                          fullWidth
                          name="password"
                          label="Password"
                          type="password"
                          id="password"
                          autoComplete="current-password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </Grid>
                    </Grid>
                    {errormessage && (
                      <Typography color="error">{errormessage}</Typography>
                    )}
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{ mt: 3, mb: 2 }}
                      onClick={handleSignup}
                    >
                      Sign Up
                    </Button>
                  </Box>
                </Box>
              </Container>
            </MDBModalBody>
            <MDBModalFooter>
              <Grid container justifyContent="flex-end" alignItems="center">
                <Grid item>
                  <Typography
                    variant="body2"
                    sx={{ marginRight: "10px", color: "black" }}
                  >
                    Already have an account?
                  </Typography>
                </Grid>

                <MDBBtn
                  style={{
                    width: "130px",
                    height: "35px",
                    fontSize: "14px",
                    backgroundColor: "#09ab44",
                    border: "none",
                  }}
                  onClick={() => {
                    setSignupmodal(!signupmodal);
                    setTimeout(() => {
                      setLoginmodal(!loginmodal);
                    }, 400);
                  }}
                >
                  BACK TO LOGIN
                </MDBBtn>
              </Grid>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
}
