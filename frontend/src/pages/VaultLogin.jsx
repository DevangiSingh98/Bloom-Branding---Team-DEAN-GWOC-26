import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const VaultLogin = () => {
    const navigate = useNavigate();
    const [isSignUp, setIsSignUp] = useState(false);
    const [isForgotPassword, setIsForgotPassword] = useState(false);

    // Form Data
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState(''); // Only for Sign Up
    const [error, setError] = useState('');
    const [resetEmail, setResetEmail] = useState('');
    const [resetMessage, setResetMessage] = useState('');

    const handleGoogleLogin = () => {
        // Get the base URL from the api instance defaults (this points to our backend)
        const baseURL = api.defaults.baseURL || (window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://bloom-backend-pq68.onrender.com');
        window.location.href = `${baseURL}/auth/google?state=vault`;
    };

    // Check for view param (login vs signup) and Handle Auto-Redirect
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const view = params.get('view');
        if (view === 'signup') setIsSignUp(true);
        if (view === 'login') setIsSignUp(false);

        const stored = localStorage.getItem('clientInfo');
        if (stored) {
            try {
                const userInfo = JSON.parse(stored);
                if (userInfo?.token) {
                    const dashboardPath = userInfo.companyName
                        ? `/vault/${encodeURIComponent(userInfo.companyName.toLowerCase().replace(/\s+/g, '-'))}`
                        : '/vault';

                    // ONLY auto-redirect if we are at /client-login or /vault/login 
                    // AND NOT already at the dashboard. 
                    const currentPath = window.location.pathname;
                    if (currentPath === '/client-login' || currentPath === '/vault/login') {
                        navigate(dashboardPath);
                    }
                }
            } catch (e) {
                console.error("Failed to parse clientInfo", e);
                localStorage.removeItem('clientInfo');
            }
        }
    }, [navigate]);

    const submitHandler = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const payload = isSignUp
                ? { username, email, password }
                : { username: email, password }; // Use email as username for login

            const endpoint = isSignUp ? '/api/users/register' : '/api/users/login';
            const { data } = await api.post(endpoint, payload);

            // Save user info to localStorage
            localStorage.setItem('clientInfo', JSON.stringify(data));

            // Redirect to dashboard
            const dashboardPath = data.companyName
                ? `/vault/${encodeURIComponent(data.companyName.toLowerCase().replace(/\s+/g, '-'))}`
                : '/vault';
            navigate(dashboardPath);

        } catch (error) {
            setError(error.response?.data?.message || error.message);
        }
    };

    const forgotPasswordHandler = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/users/forgotpassword', { email: resetEmail });
            setResetMessage(`Reset link sent to ${resetEmail}`);
            setError('');
        } catch (error) {
            setError(error.response?.data?.message || error.message);
            setResetMessage('');
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle at center, #f8f9fa 0%, #e9ecef 100%)',
            fontFamily: 'var(--font-brand)' // Using brand font
        }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(20px)',
                    padding: '3rem',
                    borderRadius: '24px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)',
                    maxWidth: '420px',
                    width: '90%',
                    border: '1px solid rgba(255,255,255,0.6)',
                    textAlign: 'center'
                }}
            >
                <div style={{ marginBottom: '2rem' }}>
                    <img src="/images/main logo.png" alt="Bloom Branding" style={{ width: '60px', marginBottom: '1rem', opacity: 0.8 }} />
                    <h1 style={{
                        marginTop: 0,
                        fontSize: '2rem',
                        fontFamily: 'Bigilla, serif',
                        color: 'var(--color-dark-choc)'
                    }}>The Vault</h1>
                </div>

                {error && <div style={{ color: 'red', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

                <AnimatePresence mode="wait">
                    {isForgotPassword ? (
                        <motion.form
                            key="forgot"
                            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                            onSubmit={forgotPasswordHandler}
                        >
                            <h3 style={{ fontFamily: 'var(--font-subtitle)', marginBottom: '1rem' }}>Reset Password</h3>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={resetEmail}
                                    onChange={(e) => setResetEmail(e.target.value)}
                                    required
                                    style={{
                                        width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #ddd',
                                        fontSize: '1rem', outline: 'none', backgroundColor: 'rgba(255,255,255,0.5)'
                                    }}
                                />
                            </div>
                            <button type="submit" style={{
                                width: '100%', padding: '1rem', borderRadius: '50px', border: 'none',
                                backgroundColor: 'var(--color-dark-choc)', color: 'white', fontWeight: 'bold', cursor: 'pointer'
                            }}>
                                Send Reset Link
                            </button>
                            {resetMessage && <p style={{ color: 'green', marginTop: '1rem' }}>{resetMessage}</p>}
                            <div style={{ marginTop: '1.5rem' }}>
                                <button type="button" onClick={() => setIsForgotPassword(false)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', textDecoration: 'underline' }}>
                                    Back to Login
                                </button>
                            </div>
                        </motion.form>
                    ) : (
                        <motion.form
                            key="login-signup"
                            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                            onSubmit={submitHandler}
                        >
                            {/* Inputs */}
                            {isSignUp && (
                                <div style={{ marginBottom: '1rem' }}>
                                    <input
                                        type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required
                                        style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #ddd', outline: 'none' }}
                                    />
                                </div>
                            )}
                            <div style={{ marginBottom: '1rem' }}>
                                <input
                                    type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required
                                    style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #ddd', outline: 'none' }}
                                />
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <input
                                    type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required
                                    style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #ddd', outline: 'none' }}
                                />
                            </div>

                            {/* Forgot Password | Sign Up Toggle */}
                            {!isSignUp && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                                    <button type="button" onClick={() => setIsForgotPassword(true)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', textDecoration: 'underline' }}>
                                        Forgot Password?
                                    </button>
                                    <button type="button" onClick={() => setIsSignUp(true)} style={{ background: 'none', border: 'none', color: 'var(--color-electric-blue)', fontWeight: 'bold', cursor: 'pointer' }}>
                                        Sign Up
                                    </button>
                                </div>
                            )}

                            {isSignUp && (
                                <div style={{ textAlign: 'right', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                                    <span style={{ color: '#666' }}>Already have an account? </span>
                                    <button type="button" onClick={() => setIsSignUp(false)} style={{ background: 'none', border: 'none', color: 'var(--color-electric-blue)', fontWeight: 'bold', cursor: 'pointer' }}>
                                        Login
                                    </button>
                                </div>
                            )}

                            {/* Submit Button */}
                            <button type="submit" style={{
                                width: '100%', padding: '1rem', borderRadius: '50px', border: 'none',
                                backgroundColor: 'var(--color-dark-choc)', color: 'white', fontWeight: 'bold', cursor: 'pointer',
                                marginBottom: '1.5rem'
                            }}>
                                {isSignUp ? 'Create Account' : 'Login'}
                            </button>

                            {/* Google Button */}
                            <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                                <hr style={{ border: 'none', borderTop: '1px solid #eee' }} />
                                <span style={{
                                    position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)',
                                    backgroundColor: 'white', padding: '0 10px', color: '#999', fontSize: '0.8rem'
                                }}>
                                    OR
                                </span>
                            </div>

                            <button
                                type="button"
                                onClick={handleGoogleLogin}
                                style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem',
                                    width: '100%', padding: '1rem', border: '1px solid #ddd', borderRadius: '50px',
                                    backgroundColor: 'white', color: '#333', fontWeight: '600', cursor: 'pointer',
                                    transition: 'all 0.2s ease', boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
                                }}
                            >
                                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={{ width: '24px', height: '24px' }} />
                                Continue with Google
                            </button>
                        </motion.form>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default VaultLogin;
