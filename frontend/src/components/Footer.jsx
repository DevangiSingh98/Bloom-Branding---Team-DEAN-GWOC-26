
import React from 'react';
import { Link } from 'react-router-dom';
import AnimatedButton from './AnimatedButton';
import Modal from './Modal';
import { useContent } from '../context/ContentContext';
import { useState } from 'react';

export default function Footer() {
    const { content, updateLegalContent } = useContent();
    const [modal, setModal] = useState({ isOpen: false, title: '', content: '' });

    const openLegal = (type) => {
        const title = type === 'privacy' ? 'Privacy Policy' : 'Terms of Service';
        const modalContent = content.legal ? content.legal[type] : '<p>Loading...</p>';
        setModal({ isOpen: true, title, content: modalContent || '<p>Content coming soon.</p>' });
    };

    return (
        <>
            <Modal
                isOpen={modal.isOpen}
                onClose={() => setModal(prev => ({ ...prev, isOpen: false }))}
                title={modal.title}
                content={modal.content}
            />
            <footer style={{ backgroundColor: 'var(--color-electric-blue)', color: 'var(--color-earl-gray)', padding: '6rem 5% 2rem' }}>
                <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '3rem' }}>
                        <div style={{ flex: 2, minWidth: '300px' }}>
                            <img src="/images/brandmark.png" alt="Bloom Branding Mark" style={{ width: '80px', height: 'auto', marginBottom: '1rem' }} />
                            <h2 style={{ fontSize: 'clamp(3rem, 5vw, 5rem)', lineHeight: 0.9, marginBottom: '2rem' }}>Let's Bloom<br />Together</h2>
                            <AnimatedButton to="/contact" className="btn-primary" style={{ backgroundColor: 'var(--color-butter-yellow)', color: 'var(--color-dark-choc)' }}>
                                Start a Project
                            </AnimatedButton>
                        </div>

                        <div style={{ flex: 1, display: 'flex', gap: window.innerWidth < 768 ? '1.5rem' : '4rem', fontFamily: 'var(--font-subtitle)', paddingTop: '1rem', justifyContent: window.innerWidth < 768 ? 'space-between' : 'flex-start' }}>
                            <div>
                                <h4 style={{ color: 'var(--color-butter-yellow)', marginBottom: '1.5rem', textTransform: 'uppercase', fontSize: '1.4rem' }}>Explore</h4>
                                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '1.2rem' }}>
                                    <li><Link to="/">Home</Link></li>
                                    <li><Link to="/about">Story</Link></li>
                                    <li><Link to="/work">Work</Link></li>
                                    <li><Link to="/contact">Contact</Link></li>
                                </ul>
                            </div>
                            <div>
                                <h4 style={{ color: 'var(--color-butter-yellow)', marginBottom: '1.5rem', textTransform: 'uppercase', fontSize: '1.4rem' }}>Connect</h4>
                                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '1.2rem' }}>
                                    <li><a href="https://www.instagram.com/bloom.branding_/?hl=en" target="_blank" rel="noopener noreferrer">Instagram</a></li>
                                    <li><a href="https://www.linkedin.com/company/bloombranding-digital-media-marketing-branding-agency/" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>

                                </ul>
                            </div>
                        </div>
                    </div>

                    <div style={{ borderTop: '1px solid rgba(232, 230, 216, 0.2)', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', fontFamily: 'var(--font-subtitle)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        <p>&copy; {new Date().getFullYear()} Bloom Branding. All rights reserved.</p>
                        <div style={{ display: 'flex', gap: '2rem' }}>
                            <span onClick={() => openLegal('privacy')} style={{ cursor: 'pointer', transition: 'color 0.3s' }} onMouseEnter={e => e.target.style.color = 'var(--color-butter-yellow)'} onMouseLeave={e => e.target.style.color = 'inherit'}>Privacy Policy</span>
                            <span onClick={() => openLegal('terms')} style={{ cursor: 'pointer', transition: 'color 0.3s' }} onMouseEnter={e => e.target.style.color = 'var(--color-butter-yellow)'} onMouseLeave={e => e.target.style.color = 'inherit'}>Terms</span>
                            <div style={{ marginLeft: '1rem', borderLeft: '1px solid rgba(255,255,255,0.3)', paddingLeft: '1rem' }}>
                                <a href="/client-login" style={{ textDecoration: 'none', color: 'var(--color-butter-yellow)', fontWeight: 'bold', textTransform: 'uppercase' }}>Client Access</a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}
