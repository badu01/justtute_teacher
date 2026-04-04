// Login.jsx (Updated with viewport fix to prevent zoom on mobile)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, Shield, AlertTriangle } from 'lucide-react';
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
    const [contactEmail, setContactEmail] = useState('');
    const [contactReason, setContactReason] = useState('');
    const [contactSubmitted, setContactSubmitted] = useState(false);

    // Prevent zoom on mobile devices
    useEffect(() => {
        // Set viewport meta to prevent zoom
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
        } else {
            const meta = document.createElement('meta');
            meta.name = 'viewport';
            meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
            document.head.appendChild(meta);
        }

        // For iOS, also prevent zoom on input focus via CSS
        const handleFocus = (e) => {
            if (window.innerWidth <= 768 && e.target.tagName === 'INPUT') {
                document.documentElement.style.fontSize = '16px';
            }
        };

        const handleBlur = () => {
            if (window.innerWidth <= 768) {
                document.documentElement.style.fontSize = '';
            }
        };

        document.addEventListener('focus', handleFocus, true);
        document.addEventListener('blur', handleBlur, true);

        return () => {
            document.removeEventListener('focus', handleFocus, true);
            document.removeEventListener('blur', handleBlur, true);
        };
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            console.log('Attempting login with:', { email });

            if (!email || !password) {
                throw new Error('Please fill in all fields');
            }

            const response = await authAPI.login(email, password);
            console.log('Login API response:', response);

            if (response.status === 'success' && response.token) {
                console.log('Login successful, storing token...');
                setToken(response.token, rememberMe);
                
                const token = rememberMe ? localStorage.getItem('token') : sessionStorage.getItem('token');
                console.log('Token after storage:', token ? 'Present' : 'Missing');

                if (response.data) {
                    localStorage.setItem('user', JSON.stringify(response.data));
                }

                setTimeout(() => {
                    navigate('/dashboard', { replace: true });
                }, 100);

            } else {
                throw new Error(response.message || 'Login failed - no token received');
            }
        } catch (error) {
            console.error('Login error details:', error);
            let errorMessage = 'Invalid email or password';
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }
            setError(errorMessage);
            localStorage.removeItem('token');
            sessionStorage.removeItem('token');
        } finally {
            setLoading(false);
        }
    };

    const handleContactSubmit = (e) => {
        e.preventDefault();
        console.log('Contact request:', { contactEmail, contactReason, contactMessage });
        setContactSubmitted(true);
        setTimeout(() => {
            setShowContactForm(false);
            setContactSubmitted(false);
            setContactEmail('');
            setContactReason('');
            setContactMessage('');
        }, 2000);
    };

    // Input classes matching the tutor form
    const inputCls = "w-full bg-black border-2 border-zinc-800 text-white text-sm p-3 focus:border-yellow-400 focus:outline-none transition-colors duration-150 placeholder-zinc-600 font-light";
    const labelCls = "flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-yellow-400 uppercase";

    return (
        <div 
            className="min-h-screen bg-black flex items-center justify-end p-4"
            style={{
                backgroundImage: `url('/login_bg.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            {/* Overlay for better form readability */}
            <div className="absolute inset-0 bg-black/50 md:bg-black/40"></div>
            
            {/* Login Form Container - Aligned to Right */}
            <div className="relative w-full max-w-md mr-0 md:mr-12 lg:mr-24 xl:mr-32">
                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 border-2 border-red-500 bg-red-500/10 backdrop-blur-sm">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                            <p className="text-red-400 text-sm font-light">{error}</p>
                        </div>
                    </div>
                )}

                {/* Main Login Card */}
                <div className="bg-black/95 backdrop-blur-sm w-full p-3">
                    {!showContactForm ? (
                        <>
                            {/* Header */}
                            <div className="mb-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-px bg-yellow-400" />
                                    <p className="text-[9px] tracking-[0.3em] text-zinc-700 uppercase">Welcome back</p>
                                </div>
                                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Login</h2>
                                <p className="text-zinc-600 text-xs font-light mt-2">Access your tutor dashboard</p>
                            </div>

                            <form className="space-y-6" onSubmit={handleLogin}>
                                {/* Email */}
                                <div className="flex flex-col gap-1.5">
                                    <label className={labelCls}>
                                        EMAIL ADDRESS
                                        <span className="text-yellow-400">✦</span>
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
                                            className={inputCls + " pl-10 bg-black"}
                                        />
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                                    </div>
                                </div>

                                {/* Password */}
                                <div className="flex flex-col gap-1.5">
                                    <label className={labelCls}>
                                        PASSWORD
                                        <span className="text-yellow-400">✦</span>
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
                                            className={inputCls + " pl-10 pr-10 bg-black"}
                                        />
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            disabled={loading}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-yellow-400 transition-colors disabled:opacity-50"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Remember & Forgot */}
                                <div className="flex items-center justify-between text-xs">
                                    <label className="flex items-center gap-2 cursor-pointer group select-none">
                                        <span className={`w-4 h-4 border-2 flex items-center justify-center shrink-0 transition-all duration-150 ${rememberMe ? "border-yellow-400 bg-yellow-400" : "border-zinc-700 group-hover:border-yellow-400/60"}`}>
                                            {rememberMe && <span className="w-1.5 h-1.5 bg-black block" />}
                                        </span>
                                        <input
                                            type="checkbox"
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                            disabled={loading}
                                            className="sr-only"
                                        />
                                        <span className="text-zinc-500 group-hover:text-zinc-300 transition-colors">Remember me</span>
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => {/* Add forgot password logic */}}
                                        disabled={loading}
                                        className="text-yellow-400 hover:text-yellow-300 transition-colors text-[10px] font-bold tracking-widest uppercase disabled:opacity-50"
                                    >
                                        Forgot password?
                                    </button>
                                </div>

                                {/* Login Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full px-8 py-3 bg-yellow-400 text-black text-[10px] font-black tracking-widest hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <span className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                            LOGGING IN...
                                        </>
                                    ) : 'LOGIN →'}
                                </button>
                            </form>

                            {/* Divider */}
                            <div className="relative my-8">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-zinc-800"></div>
                                </div>
                                <div className="relative flex justify-center text-xs">
                                    <span className="px-3 bg-black/95 text-zinc-700 text-[9px] tracking-widest uppercase">New here?</span>
                                </div>
                            </div>

                            {/* Contact Admin Option */}
                            <button
                                type="button"
                                onClick={() => setShowContactForm(true)}
                                disabled={loading}
                                className="w-full px-8 py-3 border-2 border-zinc-800 text-zinc-500 text-[10px] font-bold tracking-widest hover:border-yellow-400 hover:text-yellow-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 bg-black"
                            >
                                <Mail className="w-3 h-3" />
                                CONTACT ADMIN FOR ACCESS
                            </button>
                        </>
                    ) : (
                        /* Contact Admin Form */
                        <>
                            <div className="mb-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-px bg-yellow-400" />
                                    <p className="text-[9px] tracking-[0.3em] text-zinc-700 uppercase">Request Access</p>
                                </div>
                                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Contact Admin</h2>
                                <p className="text-zinc-600 text-xs font-light mt-2">Request credentials for tutor access</p>
                            </div>

                            {contactSubmitted ? (
                                <div className="p-6 border-2 border-green-500 bg-green-500/10 text-center">
                                    <div className="w-12 h-12 bg-green-500 flex items-center justify-center mx-auto mb-4">
                                        <span className="text-black text-xl font-black">✓</span>
                                    </div>
                                    <p className="text-green-400 text-sm font-light">Request sent successfully!</p>
                                    <p className="text-zinc-600 text-xs mt-2">Our team will reach out shortly.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleContactSubmit} className="space-y-6">
                                    <div className="flex flex-col gap-1.5">
                                        <label className={labelCls}>
                                            YOUR EMAIL
                                            <span className="text-yellow-400">✦</span>
                                        </label>
                                        <input
                                            type="email"
                                            placeholder="you@example.com"
                                            value={contactEmail}
                                            onChange={(e) => setContactEmail(e.target.value)}
                                            required
                                            className={inputCls + " bg-black"}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className={labelCls}>
                                            REASON FOR ACCESS
                                        </label>
                                        <select
                                            value={contactReason}
                                            onChange={(e) => setContactReason(e.target.value)}
                                            className={inputCls + " appearance-none bg-black"}
                                            required
                                        >
                                            <option value="">Select reason</option>
                                            <option>New tutor registration</option>
                                            <option>Forgot password</option>
                                            <option>Account not activated</option>
                                            <option>Other</option>
                                        </select>
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className={labelCls}>MESSAGE</label>
                                        <textarea
                                            rows={3}
                                            placeholder="Tell us about yourself and your teaching experience..."
                                            value={contactMessage}
                                            onChange={(e) => setContactMessage(e.target.value)}
                                            className={inputCls + " resize-none bg-black"}
                                        />
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowContactForm(false);
                                                setContactEmail('');
                                                setContactReason('');
                                                setContactMessage('');
                                            }}
                                            className="flex-1 px-6 py-3 border-2 border-zinc-800 text-zinc-500 text-[10px] font-bold tracking-widest hover:border-zinc-600 hover:text-white transition-all bg-black"
                                        >
                                            BACK
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 px-6 py-3 bg-yellow-400 text-black text-[10px] font-black tracking-widest hover:bg-yellow-300 transition-all"
                                        >
                                            SEND REQUEST ✦
                                        </button>
                                    </div>
                                </form>
                            )}
                        </>
                    )}
                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-zinc-800">
                        <p className="text-center text-zinc-700 text-[9px] tracking-widest uppercase">
                            By accessing this system, you agree to our{' '}
                            <a href="#" className="text-yellow-400 hover:text-yellow-300 transition-colors">Terms of Service</a>
                            {' '}and{' '}
                            <a href="#" className="text-yellow-400 hover:text-yellow-300 transition-colors">Privacy Policy</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;