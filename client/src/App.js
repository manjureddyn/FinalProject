import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Header from './Header';
import LoginPage from './login';
import RegisterPage from './register';
import TodoListPage from './todo-list';

const theme = createTheme();

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('http://localhost:5001/api/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => response.json())
      .then(data => setUser(data))
      .catch(error => console.error('Error fetching user data:', error));
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <div className="App">
          <Header user={user} onLogout={handleLogout} />
          <main>
            <Routes>
              <Route path="/login" element={<LoginPage setUser={setUser} />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/" element={
                <PrivateRoute>
                  <TodoListPage user={user} />
                </PrivateRoute>
              } />
            </Routes>
          </main>
          <ToastContainer />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}