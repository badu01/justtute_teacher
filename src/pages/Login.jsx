// Login.jsx (Updated with API integration)
// Login.jsx (Updated with better debugging)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, Shield, AlertCircle, AlertTriangle } from 'lucide-react';
import { authAPI, setToken } from '../services/apiService';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showContactForm, setShowContactForm] = useState(false);
    const [contactMessage, setContactMessage] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            console.log('Attempting login with:', { email });

            // Validate inputs
            if (!email || !password) {
                throw new Error('Please fill in all fields');
            }

            // Call login API
            const response = await authAPI.login(email, password);
            console.log('Login API response:', response);

            if (response.status === 'success' && response.token) {
                console.log('Login successful, storing token...');

                // Store token
                setToken(response.token, rememberMe);
                console.log('Token stored, checking authentication...');

                // Verify token was stored
                const token = rememberMe ? localStorage.getItem('token') : sessionStorage.getItem('token');
                console.log('Token after storage:', token ? 'Present' : 'Missing');

                // Store user data if available
                if (response.data) {
                    localStorage.setItem('user', JSON.stringify(response.data));
                }

                // Show success message
                console.log('Redirecting to dashboard...');

                // Force a small delay to ensure state updates
                setTimeout(() => {
                    navigate('/sessions', { replace: true });
                }, 100);

            } else {
                throw new Error(response.message || 'Login failed - no token received');
            }
        } catch (error) {
            console.error('Login error details:', error);
            console.error('Error response:', error.response);

            // Extract error message
            let errorMessage = 'Invalid email or password';
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }

            setError(errorMessage);

            // Clear token on error
            localStorage.removeItem('token');
            sessionStorage.removeItem('token');
        } finally {
            setLoading(false);
        }
    };

    // ... rest of your Login component code remains the same

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo/Header */}
                {/* <div className="text-center ">
                    <div className="flex items-center justify-center mb-4">
                        <div className="w-12 h-12 bg-amber-300 rounded-full flex items-center justify-center mr-3">
                            <Shield className="w-6 h-6 text-black" />
                        </div>
                        <h1 className="text-3xl font-bold text-amber-300">Tutor<span className="text-white">Dashboard</span></h1>
                    </div>
                </div> */}

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg">
                        <div className="flex items-center">
                            <AlertTriangle className="w-5 h-5 text-red-400 mr-3 shrink-0" />
                            <p className="text-red-300">{error}</p>
                        </div>
                    </div>
                )}

                {/* Main Login Card */}
                <div className=" rounded-2xl p-3 ">
                    {!showContactForm ? (
                        <>
                            <h2 className="text-6xl font-normal text-white mb-10">Login</h2>

                            <form className="space-y-5" onSubmit={handleLogin}>
                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        <div className="flex items-center">
                                            <Mail className="w-4 h-4 mr-2 text-amber-300" />
                                            Email Address
                                        </div>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            placeholder="teacher@institute.edu"
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                setError('');
                                            }}
                                            required
                                            disabled={loading}
                                            className="w-full px-4 py-3 pl-10 bg-gray-950/50 border border-gray-700 rounded-lg 
                                                     text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent
                                                     disabled:opacity-50 disabled:cursor-not-allowed"
                                        />
                                        <User className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
                                    </div>
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        <div className="flex items-center">
                                            <Lock className="w-4 h-4 mr-2 text-amber-300" />
                                            Password
                                        </div>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => {
                                                setPassword(e.target.value);
                                                setError('');
                                            }}
                                            required
                                            disabled={loading}
                                            className="w-full px-4 py-3 pl-10 pr-10 bg-gray-950/50 border border-gray-700 rounded-lg 
                                                     text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent
                                                     disabled:opacity-50 disabled:cursor-not-allowed"
                                        />
                                        <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            disabled={loading}
                                            className="absolute right-3 top-3.5 text-gray-500 hover:text-amber-300 disabled:opacity-50"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Remember & Forgot */}
                                <div className="flex items-center justify-between text-sm">
                                    <label
                                        for="hr"
                                        class="flex flex-row items-center gap-2.5 dark:text-white light:text-black"
                                    >
                                        <input id="hr" type="checkbox"
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                            disabled={loading} class="peer hidden" />
                                        <div
                                            for="hr"
                                            class="h-5 w-5 flex rounded-md border border-[#a2a1a833] light:bg-[#e8e8e8] dark:bg-[#212121] peer-checked:bg-amber-300 transition"
                                        >
                                            <svg
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                class="w-5 h-5 light:stroke-[#e8e8e8] dark:stroke-[#212121]"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M4 12.6111L8.92308 17.5L20 6.5"
                                                    stroke-width="2"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                ></path>
                                            </svg>
                                        </div>
                                        Remember me
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => {/* Add forgot password logic */ }}
                                        disabled={loading}
                                        className="text-amber-300 hover:text-amber-200 transition-colors disabled:opacity-50"
                                    >
                                        Forgot password?
                                    </button>
                                </div>

                                {/* Login Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-amber-300 text-black font-semibold py-3 rounded-lg 
                                             hover:bg-amber-400 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                                             focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-gray-800"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center">
                                            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                                            Logging in...
                                        </span>
                                    ) : 'Login'}
                                </button>
                            </form>

                            {/* Contact Admin Option */}
                            <div className="mt-6 pt-6 border-t border-gray-700">
                                <div className="text-center">
                                    <p className="text-gray-400 text-sm mb-3">Don't have credentials?</p>
                                    <button
                                        type="button"
                                        onClick={() => setShowContactForm(true)}
                                        disabled={loading}
                                        className="w-full bg-gray-950/50 text-amber-300 font-medium py-3 rounded-lg 
                                                 border border-gray-700 hover:bg-gray-800/50 hover:border-amber-300 transition duration-200
                                                 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-gray-800
                                                 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <span className="flex items-center justify-center">
                                            <Mail className="w-4 h-4 mr-2" />
                                            Contact Admin for Access
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        /* Contact Admin Form */
                        <>
                        <div>
                            <h2 className="text-4xl font-normal text-white mb-6">Contact Admin</h2>
                            <button onClick={() => setShowContactForm(false)} className="text-amber-300 hover:text-amber-200 transition-colors">
                                back
                            </button>
                        </div>
                        </>
                    )}

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-gray-700">
                        <p className="text-center text-gray-500 text-sm">
                            By accessing this system, you agree to our{' '}
                            <a href="#" className="text-amber-300 hover:text-amber-200">Terms of Service</a>
                            {' '}and{' '}
                            <a href="#" className="text-amber-300 hover:text-amber-200">Privacy Policy</a>
                        </p>
                    </div>
                </div>

                {/* Version/Info */}
                {/* <div className="mt-6 text-center">
                    <p className="text-gray-600 text-sm">
                        Tutor Dashboard v1.0 • For authorized personnel only
                    </p>
                </div> */}
            </div>
        </div>
    );
};

export default Login;