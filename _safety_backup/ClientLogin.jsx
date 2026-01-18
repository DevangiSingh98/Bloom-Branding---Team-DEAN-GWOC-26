import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const ClientLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isForgotPassword, setIsForgotPassword] = useState(false); // Toggle state
    const [resetEmail, setResetEmail] = useState('');
    const [resetMessage, setResetMessage] = useState('');
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { 'Content-Type': 'application/json' } };
            const { data } = await axios.post('/api/users/login', { email, password }, config);
            localStorage.setItem('clientInfo', JSON.stringify(data));
            if (data.role === 'client' || data.isAdmin) {
                navigate('/vault');
            } else {
                setError('Access denied. Not a client account.');
            }
        } catch (error) {
            setError(error.response?.data?.message || error.message);
        }
    };

    const forgotPasswordHandler = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { 'Content-Type': 'application/json' } };
            await axios.post('/api/users/forgotpassword', { email: resetEmail }, config);
            setResetMessage(`Reset link sent to ${resetEmail}`);
        } catch (error) {
            setError(error.response?.data?.message || error.message);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: 'var(--color-earl-gray)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontFamily: 'var(--font-brand)'
        }}>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                style={{
                    backgroundColor: '#fff',
                    padding: '3rem',
                    borderRadius: '0', // Sharp corners for editorial look
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    width: '100%',
                    maxWidth: '450px',
                    border: '1px solid #ccc'
                }}
            >
                <h1 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--color-dark-choc)' }}>THE VAULT</h1>
                <p style={{ textAlign: 'center', fontFamily: 'var(--font-subtitle)', marginBottom: '2rem', color: '#666' }}>Client Access Portal</p>

                {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: '1rem', fontFamily: 'var(--font-subtitle)' }}>{error}</div>}

                {isForgotPassword ? (
                    <form onSubmit={forgotPasswordHandler}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <input
                                type="email"
                                placeholder="ENTER YOUR EMAIL"
                                value={resetEmail}
                                onChange={(e) => setResetEmail(e.target.value)}
                                style={{ width: '100%', padding: '1rem', border: '1px solid #000', fontFamily: 'var(--font-subtitle)', fontSize: '1rem', outline: 'none' }}
                            />
                        </div>
                        <button type="submit" style={{ width: '100%', padding: '1rem', backgroundColor: 'var(--color-dark-choc)', color: '#fff', border: 'none', fontFamily: 'var(--font-subtitle)', fontSize: '1.2rem', cursor: 'pointer', textTransform: 'uppercase' }}>
                            Send Reset Link
                        </button>
                        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                            <button type="button" onClick={() => setIsForgotPassword(false)} style={{ background: 'none', border: 'none', color: '#999', fontSize: '0.9rem', fontFamily: 'var(--font-subtitle)', cursor: 'pointer', textDecoration: 'underline' }}>
                                Back to Login
                            </button>
                        </div>
                        {resetMessage && <div style={{ color: 'green', textAlign: 'center', marginTop: '1rem', fontFamily: 'var(--font-subtitle)' }}>{resetMessage}</div>}
                    </form>
                ) : (
                    <form onSubmit={submitHandler}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <input
                                type="email"
                                placeholder="EMAIL"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    border: '1px solid #000',
                                    backgroundColor: 'transparent',
                                    fontFamily: 'var(--font-subtitle)',
                                    fontSize: '1rem',
                                    outline: 'none'
                                }}
                            />
                        </div>
                        <div style={{ marginBottom: '2rem' }}>
                            <input
                                type="password"
                                placeholder="PASSWORD"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    border: '1px solid #000',
                                    backgroundColor: 'transparent',
                                    fontFamily: 'var(--font-subtitle)',
                                    fontSize: '1rem',
                                    outline: 'none'
                                }}
                            />
                            <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
                                <button type="button" onClick={() => setIsForgotPassword(true)} style={{ background: 'none', border: 'none', color: '#666', fontSize: '0.8rem', fontFamily: 'var(--font-subtitle)', cursor: 'pointer', textDecoration: 'underline' }}>
                                    Forgot Password?
                                </button>
                            </div>
                        </div>
                        <button
                            type="submit"
                            style={{
                                width: '100%',
                                padding: '1rem',
                                backgroundColor: 'var(--color-dark-choc)',
                                color: '#fff',
                                border: 'none',
                                fontFamily: 'var(--font-subtitle)',
                                fontSize: '1.2rem',
                                cursor: 'pointer',
                                textTransform: 'uppercase',
                                letterSpacing: '2px'
                            }}
                        >
                            Enter
                        </button>
                        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                            <a href="/" style={{ color: '#999', fontSize: '0.9rem', fontFamily: 'var(--font-subtitle)', textDecoration: 'none' }}>Return to Studio</a>
                        </div>
                    </form>
                )}
            </motion.div>
        </div>
    );
};

export default ClientLogin;
