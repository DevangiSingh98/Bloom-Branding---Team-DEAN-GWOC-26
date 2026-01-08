import React from 'react';
import { Link } from 'react-router-dom';
import AnimatedButton from './AnimatedButton';

export default function Footer() {
    return (
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

                    <div style={{ flex: 1, display: 'flex', gap: '4rem', fontFamily: 'var(--font-subtitle)', paddingTop: '1rem' }}>
                        <div>
                            <h4 style={{ color: 'var(--color-butter-yellow)', marginBottom: '1.5rem', textTransform: 'uppercase' }}>Explore</h4>
                            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <li><Link to="/">Home</Link></li>
                                <li><Link to="/about">Story</Link></li>

                                <li><Link to="/contact">Contact</Link></li>
                                <li><Link to="/admin" target="_blank" rel="noopener noreferrer">Admin</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 style={{ color: 'var(--color-butter-yellow)', marginBottom: '1.5rem', textTransform: 'uppercase' }}>Connect</h4>
                            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <li><a href="https://www.instagram.com/bloom.branding_/?hl=en" target="_blank" rel="noopener noreferrer">Instagram</a></li>
                                <li><a href="https://www.linkedin.com/company/bloombranding-digital-media-marketing-branding-agency/" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>

                            </ul>
                        </div>
                    </div>
                </div>

                <div style={{ borderTop: '1px solid rgba(232, 230, 216, 0.2)', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', fontFamily: 'var(--font-subtitle)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    <p>&copy; {new Date().getFullYear()} Bloom Branding. All rights reserved.</p>
                    <div style={{ display: 'flex', gap: '2rem' }}>
                        <span>Privacy Policy</span>
                        <span>Terms</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
