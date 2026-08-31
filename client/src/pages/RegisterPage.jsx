import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Music2, Loader2, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm) {
      return addToast('Passwords do not match', 'error');
    }
    setLoading(true);
    try {
      await register(formData.username, formData.email, formData.password);
      addToast('Account created successfully!', 'success');
      navigate('/');
    } catch (err) {
      addToast(err.response?.data?.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="glass-card w-full max-w-md p-8 animate-scaleIn">
        
        <div className="flex flex-col items-center mb-8">
          <div className="bg-primary/20 p-3 rounded-xl mb-4">
            <Music2 className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Create Account</h2>
          <p className="text-text-secondary mt-1">Join the ultimate music guessing game</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-3 h-5 w-5 text-text-muted" />
            <input
              type="text"
              name="username"
              required
              className="input-field pl-10"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-text-muted" />
            <input
              type="email"
              name="email"
              required
              className="input-field pl-10"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-text-muted" />
            <input
              type="password"
              name="password"
              required
              className="input-field pl-10"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-text-muted" />
            <input
              type="password"
              name="confirm"
              required
              className="input-field pl-10"
              placeholder="Confirm Password"
              value={formData.confirm}
              onChange={handleChange}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary w-full py-3 mt-4 flex justify-center items-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-text-secondary">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:text-primary-hover font-bold">
            Log in
          </Link>
        </div>

      </div>
    </div>
  );
};

export default RegisterPage;
