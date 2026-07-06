import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldAlert, KeyRound, User, Loader2 } from 'lucide-react';
import PageBackground from '../components/PageBackground';
import { API_BASE_URL } from '../config';

export default function AdminLogin({ onShowToast }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid credentials');
      }

      localStorage.setItem('asst_admin_token', data.token);
      localStorage.setItem('asst_admin_user', data.username);
      
      if (onShowToast) {
        onShowToast('Successfully authenticated as administrator');
      }
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Server connection failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center pt-36 pb-12 px-6">
      <PageBackground />

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[400px] bg-white border border-blue-50 p-8 rounded-2xl shadow-xl shadow-blue-900/5 relative z-10"
      >
        <div className="flex flex-col items-center gap-3 text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#123E87]">
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-[#0d2d6b] font-black text-xl">Admin Portal</h2>
            <p className="text-gray-400 text-xs mt-0.5">Spine Surgeons of Telangana</p>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 border border-red-100 text-red-700 p-3 rounded-lg flex items-start gap-2.5 text-xs mb-5"
          >
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="admin-username" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Username</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                id="admin-username"
                name="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autocomplete="username"
                className="premium-input pl-10"
                placeholder="admin"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="admin-password" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Password</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <KeyRound className="w-4 h-4" />
              </span>
              <input
                type="password"
                id="admin-password"
                name="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autocomplete="current-password"
                className="premium-input pl-10"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-premium-navy w-full mt-2 cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Authenticating...
              </>
            ) : (
              'Login to Portal'
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
