import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const ClientResetPassword = () => {
    const API_URL = import.meta.env.VITE_API_URL || '';
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const submitHandler = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            // Assuming backend route is /api/users/resetpassword/:resetToken
            await axios.put(`${API_URL}/api/users/resetpassword/${token}`, { password }, config);
            setMessage('Password Reset Successful! Redirecting to login...');

            setTimeout(() => {
                navigate('/client-login');
            }, 3000);

        } catch (err) {
            setError(err.response?.data?.message || err.message);
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
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    width: '100%',
                    maxWidth: '450px'
                }}
            >
                <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--color-dark-choc)' }}>RESET PASSWORD</h2>

                {message && <div style={{ color: 'green', textAlign: 'center', marginBottom: '1rem', fontFamily: 'var(--font-subtitle)' }}>{message}</div>}
                {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: '1rem', fontFamily: 'var(--font-subtitle)' }}>{error}</div>}

                <form onSubmit={submitHandler}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <input
                            type="password"
                            placeholder="NEW PASSWORD"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '1rem',
                                border: '1px solid #000',
                                fontFamily: 'var(--font-subtitle)',
                                fontSize: '1rem',
                                outline: 'none'
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: '2rem' }}>
                        <input
                            type="password"
                            placeholder="CONFIRM NEW PASSWORD"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '1rem',
                                border: '1px solid #000',
                                fontFamily: 'var(--font-subtitle)',
                                fontSize: '1rem',
                                outline: 'none'
                            }}
                        />
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
                            textTransform: 'uppercase'
                        }}
                    >
                        Reset Password
                    </button>
                    <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                        <a href="/client-login" style={{ color: '#999', fontSize: '0.9rem', fontFamily: 'var(--font-subtitle)', textDecoration: 'none' }}>Cancel</a>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default ClientResetPassword;
