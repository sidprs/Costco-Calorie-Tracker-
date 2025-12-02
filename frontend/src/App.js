import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SearchPage from './SearchPage';
import AuthPage from './auth/AuthPage';
import Header from './components/Header';
import CartPage from './CartPage';
import CalendarPage from './CalendarPage';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const addToCart = (item) => {
    setCart([...cart, item]);
    console.log(`Added ${item.name} to cart`);
  };

  const removeFromCart = (indexToRemove) => {
    setCart(cart.filter((_, index) => index !== indexToRemove));
  };

  const clearCart = () => {
    setCart([]);
  };

  if (loading) {
    return (
      <div className="App loading-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        {user && <Header user={user} onLogout={handleLogout} />}

        <Routes>
          <Route 
            path="/login" 
            element={!user ? <AuthPage onLogin={handleLogin} /> : <Navigate to="/" />} 
          />
          <Route 
            path="/" 
            element={user ? <SearchPage user={user} addToCart={addToCart} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/cart" 
            element={user ? <CartPage cart={cart} user={user} removeFromCart={removeFromCart} clearCart={clearCart}/> : <Navigate to="/login" />} 
          />
          <Route 
            path="/calendar" 
            element={user ? <CalendarPage user={user} /> : <Navigate to="/login" />} 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
