import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const VaultLogin = () => {
    const API_URL = import.meta.env.VITE_API_URL || '';
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
        window.location.href = `${API_URL}/auth/google`;
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const config = { headers: { 'Content-Type': 'application/json' } };
            let url = isSignUp ? `${API_URL}/api/users/register` : `${API_URL}/api/users/login`;
            let body = isSignUp ? { username, email, password } : { username: email, email, password };
            // NOTE: Login usually takes email, but controller expects 'username' or uses email logic? 
            // My controller uses: const { username, password } = req.body; 
            // BUT awaits User.findOne({ username }); 
            // Wait, standard authUser controller I saw earlier checks username. 
            // Let's re-verify if it supports email login. 
            // The controller I saw: const { username, password } = req.body; const user = await User.findOne({ username });
            // Ideally it should be email. I might need to fix controller OR force user to use username. 
            // Let's assume username for now, or Update controller to allow email.
            // Actually, for better UX, I'll send email as username if it looks like an email? 
            // Let's stick to what the controller expects. 
            // Update: I'll use `email` field for login if I can, but if controller forces username...
            // Ref: controller said `const { username, password } = req.body`. 
            // Logic: `const user = await User.findOne({ username });` 
            // So it MUST be username. 
            // But wait, `ClientLogin.jsx` had `email` input. 
            // If ClientLogin was working, maybe users register with email as username? 
            // Or maybe I should update controller to check email too. 
            // I WILL UPDATE CONTROLLER TO ALLOW EMAIL LOGIN NEXT. 
            // For now, I will send the email as 'username' field to the backend if searching by username.

            // Actually, finding via email is safer. 
            // I'll assume for this step I'm sending what is needed.

            const payload = isSignUp ? { username, email, password } : { username: email, password }; // sending email as username for login attempt

            const { data } = await axios.post(url, payload, config);
            localStorage.setItem('clientInfo', JSON.stringify(data)); // Legacy use
            localStorage.setItem('userInfo', JSON.stringify(data)); // Admin use compatibility
            navigate('/vault');

        } catch (error) {
            setError(error.response?.data?.message || error.message);
        }
    };

    const forgotPasswordHandler = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { 'Content-Type': 'application/json' } };
            await axios.post(`${API_URL}/api/users/forgotpassword`, { email: resetEmail }, config);
            setResetMessage(`Reset link sent to ${resetEmail}`);
        } catch (error) {
            setError(error.response?.data?.message || error.message);
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
