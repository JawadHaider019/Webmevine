// src/app/admin/page.jsx
"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiLock, FiMail, FiLogIn, FiAlertCircle, FiEye, FiEyeOff } from 'react-icons/fi';
import { LuSparkles } from 'react-icons/lu';
import BlogManager from '@/components/BlogManager';

const AdminLogin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Check if already authenticated on mount
  useEffect(() => {
    const auth = localStorage.getItem('admin-auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

const handleLogin = (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError('');

  setTimeout(() => {
    // Use environment variables
    if (formData.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && 
        formData.password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      localStorage.setItem('admin-auth', 'true');
      setIsAuthenticated(true);
    } else {
      setError('Invalid email or password');
    }
    setIsLoading(false);
  }, 1000);
};
  const handleLogout = () => {
    localStorage.removeItem('admin-auth');
    setIsAuthenticated(false);
    setFormData({ email: '', password: '' });
  };

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-white">
        {/* Admin Header */}
        <div className="bg-gradient-to-r from-red-600 to-black text-white">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <LuSparkles className="text-2xl" />
                <span className="font-['Marcellus'] text-xl">Admin Dashboard</span>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm flex items-center"
              >
                <FiLock className="mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Blog Manager */}
        <BlogManager />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #ef4444 1px, transparent 0)`,
          backgroundSize: '30px 30px'
        }}
      />

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 border border-gray-200"
      >
        {/* Decorative Elements */}
        <div className="absolute -top-3 -right-3 w-20 h-20 bg-red-600/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-3 -left-3 w-20 h-20 bg-black/10 rounded-full blur-2xl" />

        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-gradient-to-br from-red-600/10 to-black/10 rounded-2xl mb-4">
            <LuSparkles className="text-3xl text-red-600" />
          </div>
          <h1 className="font-['Marcellus'] text-3xl text-gray-900 mb-2">
            Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-black">Access</span>
          </h1>
          <p className="text-gray-500 text-sm">
            Enter your credentials to manage blog posts
          </p>
        </div>

        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700 text-sm"
            >
              <FiAlertCircle className="mr-2 flex-shrink-0" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="admin@yourbrand.com"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          {/* Remember me & Forgot password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-600" />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <button
              type="button"
              onClick={() => alert('Please contact admin to reset password')}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Forgot password?
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 font-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              />
            ) : (
              <>
                <FiLogIn className="mr-2" />
                Sign In
              </>
            )}
          </button>
        </form>
  </motion.div>
    </div>
  );
};

export default AdminLogin;