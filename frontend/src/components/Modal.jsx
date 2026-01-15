import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Modal = ({ isOpen, onClose, title, content }) => {
    // Close on Escape key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    // Prevent background scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1rem',
                }}>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            inset: 0,
                            backgroundColor: 'rgba(0,0,0,0.6)',
                            backdropFilter: 'blur(5px)',
                            cursor: 'pointer'
                        }}
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.95 }}
                        style={{
                            position: 'relative',
                            backgroundColor: 'var(--color-butter-yellow)', // User requested Butter Yellow BG
                            color: 'var(--color-electric-blue)', // User requested Blue text
                            width: '100%',
                            maxWidth: '800px',
                            maxHeight: '90vh',
                            borderRadius: '20px',
                            border: '2px solid var(--color-electric-blue)', // Made border slightly thicker for contrast
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden'
                        }}
                    >
                        {/* Header */}
                        <div style={{
                            padding: '1.5rem 2rem',
                            borderBottom: '1px solid var(--color-electric-blue)', // Matching border
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            backgroundColor: 'rgba(255,255,255,0.1)' // Subtle highlight
                        }}>
                            <h2 style={{
                                fontFamily: 'var(--font-title)',
                                fontSize: '2rem',
                                color: 'var(--color-electric-blue)',
                                margin: 0
                            }}>
                                {title}
                            </h2>
                            <button
                                onClick={onClose}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--color-electric-blue)',
                                    fontSize: '2rem',
                                    cursor: 'pointer',
                                    lineHeight: 1,
                                    padding: '0 0.5rem',
                                    transition: 'transform 0.2s ease',
                                    fontFamily: 'monospace'
                                }}
                                onMouseEnter={(e) => e.target.style.transform = 'scale(1.2) rotate(90deg)'}
                                onMouseLeave={(e) => e.target.style.transform = 'scale(1) rotate(0deg)'}
                            >
                                &times;
                            </button>
                        </div>

                        {/* Scrollable Body */}
                        <div
                            style={{
                                padding: '2rem',
                                overflowY: 'auto',
                                fontFamily: 'var(--font-body)',
                                fontSize: '1rem',
                                lineHeight: '1.6'
                            }}
                            className="modal-body custom-scrollbar"
                            dangerouslySetInnerHTML={{ __html: content }}
                        />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default Modal;
