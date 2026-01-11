import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Chrome, ExternalLink } from 'lucide-react';

const EmailServiceSelector = ({ isOpen, onClose, recipient = 'hello.bloombranding@gmail.com', subject = 'Enquiry from Website', body = 'Hi Bloom Team,' }) => {

    const providers = [
        {
            name: 'Gmail',
            icon: '/icons/gmail.png',
            lucideIcon: <Chrome size={24} />,
            color: '#EA4335',
            getUrl: () => `https://mail.google.com/mail/?view=cm&fs=1&to=${recipient}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
        },
        {
            name: 'Outlook / Hotmail',
            icon: '/icons/outlook.png',
            lucideIcon: <ExternalLink size={24} />,
            color: '#0078D4',
            getUrl: () => `https://outlook.office.com/mail/deeplink/compose?to=${recipient}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
        },
        {
            name: 'Yahoo Mail',
            icon: '/icons/yahoo.png',
            lucideIcon: <Mail size={24} />,
            color: '#6001d2',
            getUrl: () => `https://compose.mail.yahoo.com/?to=${recipient}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
        }
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10000,
                    pointerEvents: 'auto'
                }}>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(0,0,0,0.6)',
                            backdropFilter: 'blur(5px)',
                            cursor: 'pointer'
                        }}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 30 }}
                        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                        style={{
                            position: 'relative', // Relative to the flex container
                            width: '90%',
                            maxWidth: '450px',
                            backgroundColor: '#3b2f2f', // Dark Chocolate theme
                            padding: '2.5rem',
                            borderRadius: '30px',
                            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                            textAlign: 'center',
                            border: '1px solid rgba(253, 253, 150, 0.2)',
                            zIndex: 10001
                        }}
                    >
                        <h2 style={{
                            fontFamily: 'var(--font-brand)',
                            fontSize: '2rem',
                            color: '#fdfd96',
                            marginBottom: '1rem'
                        }}>
                            Choose Mail Service
                        </h2>
                        <p style={{
                            fontFamily: 'var(--font-subtitle)',
                            color: '#fdfd96',
                            opacity: 0.8,
                            marginBottom: '2rem'
                        }}>
                            How would you like to email us?
                        </p>

                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {providers.map((provider) => (
                                <motion.a
                                    key={provider.name}
                                    href={provider.getUrl()}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={onClose}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '1.5rem',
                                        padding: '1.2rem 2rem',
                                        backgroundColor: 'rgba(253, 253, 150, 0.05)',
                                        border: '1px solid rgba(253, 253, 150, 0.1)',
                                        borderRadius: '15px',
                                        textDecoration: 'none',
                                        color: '#fdfd96',
                                        transition: 'background-color 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(253, 253, 150, 0.1)'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(253, 253, 150, 0.05)'}
                                >
                                    <div style={{ color: provider.name === 'Default Mail App' ? '#fdfd96' : provider.color, display: 'flex' }}>
                                        {provider.lucideIcon}
                                    </div>
                                    <span style={{ fontFamily: 'var(--font-subtitle)', fontWeight: 'bold', fontSize: '1.1rem' }}>
                                        {provider.name}
                                    </span>
                                </motion.a>
                            ))}
                        </div>

                        <button
                            onClick={onClose}
                            style={{
                                marginTop: '2rem',
                                backgroundColor: 'transparent',
                                border: 'none',
                                color: '#fdfd96',
                                opacity: 0.6,
                                cursor: 'pointer',
                                textDecoration: 'underline',
                                fontFamily: 'var(--font-subtitle)'
                            }}
                        >
                            Cancel
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default EmailServiceSelector;
