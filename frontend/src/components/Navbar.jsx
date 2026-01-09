import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isDarkText, setIsDarkText] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const ctx = gsap.context(() => {
            const sections = gsap.utils.toArray('.light-section');
            sections.forEach(section => {
                ScrollTrigger.create({
                    trigger: section,
                    start: "top 80px",
                    end: "bottom 80px",
                    onEnter: () => setIsDarkText(true),
                    onLeave: () => setIsDarkText(false),
                    onEnterBack: () => setIsDarkText(true),
                    onLeaveBack: () => setIsDarkText(false)
                });
            });
        });

        setTimeout(() => ScrollTrigger.refresh(), 100);
        return () => ctx.revert();
    }, [location]);

    const isHome = location.pathname === '/';
    const isServices = location.pathname === '/services';

    const getColor = () => {
        if (isOpen) return 'var(--color-butter-yellow)';
        if (!isHome && !isServices) return 'var(--color-dark-choc)';
        return isDarkText ? 'var(--color-dark-choc)' : 'var(--color-butter-yellow)';
    };

    const logoColor = getColor();
    const showShadow = !isOpen && (isHome || isServices) && !isDarkText;

    const navLinks = [
        { name: 'Home', path: '/', img: '/images/f1.png', height: '100px', tilt: -10 },
        { name: 'About', path: '/about', img: '/images/f2.png', height: '120px', tilt: 15 },
        { name: 'Services', path: '/services', img: '/images/service_lifestyle.png', height: '140px', tilt: -5 },
        { name: 'Work', path: '/work', img: '/images/Ourwork.png', height: '140px', tilt: 8 },
        { name: 'Contact', path: '/contact', img: '/images/tele.png', height: '130px', tilt: -5 },
        { name: 'Admin', path: '/admin', img: '/images/f1.png', height: '100px', tilt: 5 }
    ];

    return (
        <>
            <header style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                padding: '1.5rem 5%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                zIndex: 100,
                transition: 'all 0.4s ease'
            }}>
                <Link to="/" style={{ display: 'block', width: '180px', color: logoColor }}>
                    <div style={{
                        position: 'relative',
                        width: '100%',
                        lineHeight: 0,
                        filter: showShadow ? 'drop-shadow(0 2px 5px rgba(0,0,0,0.5))' : 'none',
                        transition: 'filter 0.3s ease'
                    }}>
                        <img src="/images/Full-Logo.png" alt="Bloom Branding" style={{ width: '100%', height: 'auto', opacity: 0 }} />
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            backgroundColor: 'currentColor',
                            maskImage: 'url(/images/Full-Logo.png)',
                            WebkitMaskImage: 'url(/images/Full-Logo.png)',
                            maskSize: 'contain',
                            WebkitMaskSize: 'contain',
                            maskRepeat: 'no-repeat',
                            WebkitMaskRepeat: 'no-repeat',
                            maskPosition: 'center',
                            WebkitMaskPosition: 'center',
                            transition: 'background-color 0.3s ease'
                        }} />
                    </div>
                </Link>

                <button
                    onClick={() => setIsOpen(!isOpen)}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        padding: '10px',
                        zIndex: 101,
                        filter: showShadow ? 'drop-shadow(0 2px 5px rgba(0,0,0,0.5))' : 'none'
                    }}
                >
                    <div style={{
                        width: '30px',
                        height: '2px',
                        backgroundColor: isOpen ? 'var(--color-dark-choc)' : logoColor,
                        transform: isOpen ? 'rotate(45deg) translate(6px, 6px)' : 'none',
                        transition: 'all 0.3s ease'
                    }} />
                    <div style={{
                        width: '30px',
                        height: '2px',
                        backgroundColor: isOpen ? 'var(--color-dark-choc)' : logoColor,
                        opacity: isOpen ? 0 : 1,
                        transition: 'all 0.3s ease'
                    }} />
                    <div style={{
                        width: '30px',
                        height: '2px',
                        backgroundColor: isOpen ? 'var(--color-dark-choc)' : logoColor,
                        transform: isOpen ? 'rotate(-45deg) translate(5px, -6px)' : 'none',
                        transition: 'all 0.3s ease'
                    }} />
                </button>
            </header>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ clipPath: 'circle(0% at 95% 5%)' }}
                        animate={{ clipPath: 'circle(150% at 95% 5%)' }}
                        exit={{ clipPath: 'circle(0% at 95% 5%)' }}
                        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100vh',
                            backgroundColor: 'var(--color-butter-yellow)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 100
                        }}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', textAlign: 'center' }}>
                            {navLinks.map((link, i) => (
                                <motion.div
                                    key={link.name}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 + (i * 0.1) }}
                                >
                                    <Link
                                        to={link.path}
                                        onClick={() => setIsOpen(false)}
                                        style={{
                                            color: 'var(--color-dark-choc)',
                                            textDecoration: 'none',
                                            fontSize: 'clamp(3rem, 8vw, 6rem)',
                                            fontFamily: 'var(--font-brand)',
                                            lineHeight: 1,
                                            display: 'block',
                                            transition: 'transform 0.3s ease',
                                            position: 'relative'
                                        }}
                                        className="nav-link-item"
                                    >
                                        {link.name.toUpperCase()}
                                        <div className="nav-hover-img" style={{
                                            position: 'absolute',
                                            left: '105%',
                                            top: '50%',
                                            transform: 'translateY(-50%) rotate(' + link.tilt + 'deg)',
                                            width: '150px',
                                            height: 'auto',
                                            backgroundColor: '#fff',
                                            padding: '8px',
                                            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                                            display: 'none',
                                            pointerEvents: 'none'
                                        }}>
                                            <img src={link.img} style={{ width: '100%', height: 'auto' }} alt="" />
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                        <div style={{ position: 'absolute', bottom: '40px', display: 'flex', gap: '40px', fontFamily: 'var(--font-subtitle)', color: 'var(--color-dark-choc)', opacity: 0.6 }}>
                            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>INSTAGRAM</a>
                            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>LINKEDIN</a>
                            <a href="mailto:hello@bloombranding.com" style={{ color: 'inherit', textDecoration: 'none' }}>EMAIL</a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>
                {`
                .nav-link-item:hover .nav-hover-img { display: block !important; }
                @media (max-width: 768px) {
                    .nav-hover-img { display: none !important; }
                }
                `}
            </style>
        </>
    );
};

export default Navbar;
