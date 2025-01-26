import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Card, CardContent, CardHeader } from '@mui/material';
import { toast } from 'react-toastify';
require('dotenv').config();
export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(JSON.stringify({ name, email, password }));
      const response = await fetch('http://localhost:5001/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
        
        credentials: 'include',  // Include credentials if necessary
      });
  
      if (response.status === 201) {
        navigate('/login');
        toast.success('Registration Successful. Please log in.');
      } else {
        throw new Error(response.statusText);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <Card style={{ maxWidth: 400, margin: '2rem auto' }}>
      <CardHeader title="Register" />
      <CardContent>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <TextField
            label="Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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
            Sign Up
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
// PLitmcCArQU7eCf9
// 9iYkbIqtM4I0d6Im

// "start": "react-scripts start",
    // "build": "react-scripts build",
    // "test": "react-scripts test",