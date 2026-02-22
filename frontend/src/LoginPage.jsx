import React, { useState } from 'react';

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Hardcoded Users for SecureVault
  // Admin: username: "admin", password: "password123"
  // User:  username: "user",  password: "user123"
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (username === 'admin' && password === 'password123') {
      onLogin({ username: 'Admin', role: 'admin' });
    } else if (username === 'user' && password === 'user123') {
      onLogin({ username: 'Standard User', role: 'user' });
    } else {
      setError('Invalid username or password. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-slate-800 rounded-xl shadow-2xl border border-slate-700">
        <h2 className="text-3xl font-bold text-center text-white">SecureVault Login</h2>
        <p className="text-center text-slate-400">Enter your credentials to access the vault</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-slate-300">Username</label>
            <input
              type="text"
              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              placeholder="admin or user"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium text-slate-300">Password</label>
            <input
              type="password"
              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-sm text-red-500 mt-2 font-semibold text-center">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 mt-4 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 active:scale-95 transition-transform"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;