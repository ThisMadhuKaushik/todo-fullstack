import "./Login.css"
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (user === 'admin' && pass === '1234') {
      navigate('/home');
    } else {
      alert('Invalid credentials!');
    }
  };

  return (
    <div id={"lg"} style={{ textAlign: 'center', paddingTop: '100px' }}>
      <h2>Login Page</h2>
      
      <form onSubmit={handleSubmit} >
        <input 
          type="text" 
          placeholder="Username" 
          value={user}
          onChange={(e) => setUser(e.target.value)}
        /><br /><br />
        <input 
          type="password" 
          placeholder="Password" 
          value={pass}
          onChange={(e) => setPass(e.target.value)}
        /><br /><br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}