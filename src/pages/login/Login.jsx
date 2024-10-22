import React, { useState } from 'react';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
} from '@mui/material';
 import { makeStyles } from '@mui/styles';

import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: '100px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  formBox: {
    width: '100%', 
    marginTop: '20px',
    maxWidth: '400px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  submitButton: {
    marginTop: '10px',
  },
}));

const Login = () => {
  const classes = useStyles();
 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Basic Validation
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

     try {
      const response = await axios.post('http://localhost:8081/login', {
       email,
        password,
      });

      // Assuming the response contains a token
      const { token } = response.data;

      // Store token in localStorage or any other storage mechanism
      localStorage.setItem('token', token);

      setSuccessMsg('Login successful! Redirecting...');
      
      // Redirect after a short delay (e.g., 2 seconds)
      setTimeout(() => {
        window.location.href = '/'; // Change to your dashboard route
      }, 2000);

    } catch (error) {
      console.error(error);
      setErrorMsg(
        error.response && error.response.data && error.response.data.msg
          ? error.response.data.msg
          : 'An error occurred during login.'
      );
    }
  };

  return (
    <Container component="main" maxWidth="xs" className={classes.container}>
      <Typography component="h1" variant="h5">
        Login
      </Typography>
      <Box component="form" onSubmit={handleSubmit} className={classes.formBox}>
        {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
        {successMsg && <Alert severity="success">{successMsg}</Alert>}
        <TextField
          variant="outlined"
          required
          fullWidth
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          variant="outlined"
          required
          fullWidth
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submitButton}
        >
          Sign In
        </Button>
      </Box>
    </Container>
  );
};

export default Login;
