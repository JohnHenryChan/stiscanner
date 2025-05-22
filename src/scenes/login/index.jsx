import React, {  useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography, Paper, Alert} from "@mui/material";
import { signInWithEmailAndPassword } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebaseConfig";


const Login = ({ setAuth }) => {

  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const authnew = auth
  const [error, setError]=useState("");

  const handleLogin = () => {
    // You can add actual validation here
    try{
      if (!email && !password) {
        setError("Please enter both email and password.");
        return;
      }
      if (!email) {
        setError("Please enter your email.");
        return;
      }
      if (!password) {
        setError("Please enter your password.");
        return;
      }else{
      const userCredential= signInWithEmailAndPassword(auth, email, password).catch(err=>setError(err.message));
      console.log(userCredential); 
      }  }
    catch(error) {
      console.log(`There was an error: ${error}`)
      setError(error);
    }
    const monitorAuthState = async () => {
    onAuthStateChanged(authnew, user => {
    if (user) {
      console.log(user)
      setAuth(true);
      const uid=user.uid;
      navigate("/dashboard")
    }
    else {
      navigate("/login");
    }
  })
}
monitorAuthState();
setError("");
};

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="#f5f5f5"
    >
      <Box mb={2}>
        <img src="/stilogoo.png" alt="Logo" style={{ height: "60px" }} />
      </Box>

      <Paper
        elevation={3}
        sx={{
          padding: 4,
          width: 350,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" fontWeight="bold" mb={3}>
          Log In
        </Typography>
        {error && (
          <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
            {error}
          </Alert>
        )}
        <TextField fullWidth label="Email" variant="outlined" margin="normal" value={email} onChange={(e) => setEmail(e.target.value)}/>
        <TextField fullWidth label="Password" type="password" variant="outlined" margin="normal" value={password} onChange={(e) => setPassword(e.target.value)}/>
        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2, backgroundColor: "#0054a6" }}
          onClick={handleLogin}
        >
          LOG IN
        </Button>
        <p>Current email: {email}</p>
        <p>Current pw: {password}</p>
      </Paper>
    </Box>
  );
};


export default Login;

