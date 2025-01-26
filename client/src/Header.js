import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Avatar } from '@mui/material';

export default function Header({ user, onLogout }) {
  const navigate = useNavigate();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" style={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
          Todo List App
        </Typography>
        <nav>
          {user ? (
            <>
              <Typography variant="subtitle1" style={{ marginRight: '1rem' }}>
                {user.email}
              </Typography>
              {/*
              <Avatar style={{ marginRight: '1rem' }}>
                {user.name.charAt(0).toUpperCase()}
              </Avatar> */}
              <Button color="inherit" onClick={onLogout}>Logout</Button>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>
              <Button color="inherit" onClick={() => navigate('/register')}>Register</Button>
            </>
          )}
        </nav>
      </Toolbar>
    </AppBar>
  );
}