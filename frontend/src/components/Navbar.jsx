import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isDarkText, setIsDarkText] = useState(false);
    const location = useLocation();

    const toggleMenu = () => setIsOpen(!isOpen);

    useEffect(() => {
        // Refresh ScrollTrigger and set up triggers for light sections
        const ctx = gsap.context(() => {
            const sections = gsap.utils.toArray('.light-section');
            sections.forEach(section => {
                ScrollTrigger.create({
                    trigger: section,
                    start: "top 80px", // Trigger when section hits top (navbar area)
                    end: "bottom 80px",
                    onEnter: () => setIsDarkText(true),
                    onLeave: () => setIsDarkText(false),
                    onEnterBack: () => setIsDarkText(true),
                    onLeaveBack: () => setIsDarkText(false)
                });
            });
        });

        // Force a check/refresh slightly after render to ensure elements are present
        setTimeout(() => ScrollTrigger.refresh(), 100);

        return () => ctx.revert();
    }, [location]);

    const menuVariants = {
        closed: {
            opacity: 0,
            y: "-100%",
            transition: {
                duration: 0.5,
                ease: [0.76, 0, 0.24, 1]
            }
        },
        open: {
            opacity: 1,
            y: "0%",
            transition: {
                duration: 0.5,
                ease: [0.76, 0, 0.24, 1]
            }
        }
    };

    const listVariants = {
        closed: { opacity: 0 },
        open: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        closed: { opacity: 0, y: 50 },
        open: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    const isHome = location.pathname === '/';
    const isServices = location.pathname === '/services';

    // Unified Logic:
    // 1. Menu Open -> Butter Yellow (on Blue Overlay)
    // 2. Not Home/Services -> Dark Choc (Static)
    // 3. Home/Services -> Dynamic

    const getColor = () => {
        if (isOpen) return 'var(--color-butter-yellow)';
        if (!isHome && !isServices) return 'var(--color-dark-choc)';
        // Default is Butter Yellow for dark backgrounds (default state for Home/Services)
        // isDarkText true means we are on a light section -> switch to Dark Choc
        return isDarkText ? 'var(--color-dark-choc)' : 'var(--color-butter-yellow)';
    };

    const logoColor = getColor();
    const menuColor = getColor();

    const showShadow = !isOpen && (isHome || isServices) && !isDarkText;

    return (
        <>
            <header style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                padding: '2rem 5%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                zIndex: 100,
                // Removed mixBlendMode and color (handled individually)
                transition: 'color 0.3s ease'
            }}>
                <Link to="/" style={{ display: 'block', width: '200px', color: logoColor }}>
                    <div style={{
                        position: 'relative',
                        width: '100%',
                        lineHeight: 0,
                        filter: showShadow ? 'drop-shadow(0 2px 5px rgba(0,0,0,0.5))' : 'none',
                        transition: 'filter 0.3s ease'
                    }}>
                        {/* Ghost image to maintain aspect ratio and size */}
                        <img
                            src="/images/Full-Logo.png"
                            alt="Bloom Branding"
                            style={{ width: '100%', height: 'auto', opacity: 0 }}
                        />
                        {/* Colored mask overlay */}
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

                <button onClick={toggleMenu} style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    color: menuColor,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontFamily: 'var(--font-subtitle)',
                    filter: showShadow ? 'drop-shadow(0 2px 5px rgba(0,0,0,0.5))' : 'none',
                    transition: 'filter 0.3s ease, color 0.3s ease'
                }}>
                    <span className="font-subtitle" style={{ textTransform: 'uppercase', fontSize: '1.2rem', fontWeight: 'bold' }}>{isOpen ? 'Close' : 'Menu'}</span>
                    <div style={{ position: 'relative', width: '24px', height: '24px' }}>
                        <AnimatePresence mode="wait">
                            {isOpen ? (
                                <motion.div
                                    key="close"
                                    initial={{ opacity: 0, rotate: -90 }}
                                    animate={{ opacity: 1, rotate: 0 }}
                                    exit={{ opacity: 0, rotate: 90 }}
                                    style={{ position: 'absolute' }}
                                >
                                    <X size={24} />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="menu"
                                    initial={{ opacity: 0, rotate: 90 }}
                                    animate={{ opacity: 1, rotate: 0 }}
                                    exit={{ opacity: 0, rotate: -90 }}
                                    style={{ position: 'absolute' }}
                                >
                                    <Menu size={24} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </button>
            </header>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={menuVariants}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100vw',
                            height: '100vh',
                            backgroundColor: 'var(--color-electric-blue)',
                            color: 'var(--color-earl-gray)',
                            zIndex: 90,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            overflow: 'hidden'
                        }}
                    >
                        <motion.ul variants={listVariants} style={{
                            listStyle: 'none',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '2vw',
                            flexWrap: 'nowrap',
                            width: '100%',
                            padding: '0 2rem'
                        }}>
                            {[
                                { name: 'Home', path: '/', img: '/images/home.png', height: '250px', tilt: -10 },
                                { name: 'Our Story', path: '/about', img: '/images/ourstory.png', height: '220px', tilt: 15 },
                                { name: 'Services', path: '/services', img: '/images/services.png', height: '130px', tilt: -5 },
                                { name: 'Our Work', path: '/work', img: '/images/Ourwork.png', height: '140px', tilt: 8 },
                                { name: 'Contact', path: '/contact', img: '/images/tele.png', height: '200px', tilt: -5 },
                            ].map((link) => (
                                <motion.li key={link.name} variants={itemVariants} style={{ margin: 0, position: 'relative' }}>
                                    <Link
                                        to={link.path}
                                        onClick={() => {
                                            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                                            setIsOpen(false);
                                        }}
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            textDecoration: 'none',
                                            color: 'inherit',
                                            padding: '10px'
                                        }}
                                    >
                                        <motion.div
                                            initial="rest"
                                            whileHover="hover"
                                            animate="rest"
                                            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                                        >
                                            <motion.img
                                                src={link.img}
                                                alt={link.name}
                                                variants={{
                                                    rest: { y: 0, scale: 1, rotate: 0 },
                                                    hover: {
                                                        y: -30,
                                                        scale: 1.1,
                                                        rotate: link.tilt,
                                                        transition: { type: "spring", stiffness: 300, damping: 10 }
                                                    }
                                                }}
                                                style={{ height: link.height, width: 'auto', objectFit: 'contain', maxHeight: '300px', zIndex: 2 }}
                                            />
                                            <motion.span
                                                variants={{
                                                    rest: { opacity: 0, y: 30, height: 0 },
                                                    hover: { opacity: 1, y: 10, height: 'auto' }
                                                }}
                                                style={{
                                                    fontFamily: 'var(--font-brand)',
                                                    fontSize: '2.5rem',
                                                    textTransform: 'uppercase',
                                                    whiteSpace: 'nowrap',
                                                    color: 'var(--color-butter-yellow)',
                                                    marginTop: '1rem',
                                                    marginLeft: '-20px'
                                                }}
                                            >
                                                {link.name}
                                            </motion.span>
                                        </motion.div>
                                    </Link>
                                </motion.li>
                            ))}
                        </motion.ul>

                        <motion.div variants={itemVariants} style={{ marginTop: '4rem', fontFamily: 'var(--font-subtitle)' }}>
                            <p>Get in touch</p>
                            <a href="mailto:hello.bloombranding@gmail.com">hello.bloombranding@gmail.com</a>
                        </motion.div>

                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
