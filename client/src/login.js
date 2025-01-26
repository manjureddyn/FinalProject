import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Card, CardContent, CardHeader } from '@mui/material';
import { toast } from 'react-toastify';

export default function LoginPage({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5001/api/login', {
  
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        // console.log(data.token)
        setUser(data.user);
        navigate('/');
        toast.success('Login Successful');
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <Card style={{ maxWidth: 400, margin: '2rem auto' }}>
      <CardHeader title="Login" />
      <CardContent>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="primary">
            Sign In
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}