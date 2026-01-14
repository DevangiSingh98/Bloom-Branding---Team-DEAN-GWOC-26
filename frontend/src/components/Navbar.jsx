import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import EmailServiceSelector from "./EmailServiceSelector";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isDarkText, setIsDarkText] = useState(false);
    const [scrollY, setScrollY] = useState(0); // New state to track exact scroll position
    const [emailModalOpen, setEmailModalOpen] = useState(false);
    const location = useLocation();

    // Track scroll position for robust fallback
    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Init
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => setIsOpen(!isOpen);

    useEffect(() => {
        // 1. IMMEDIATE STATE RESET based on Route
        // This ensures the color is correct momentarily before any scrolling happens
        if (location.pathname === '/about' || location.pathname === '/') {
            setIsDarkText(true); // About & Home start Dark (Brown)
        } else {
            setIsDarkText(false); // Services, Work start Yellow
        }

        // 2. HARD RESET of ScrollTrigger
        // Kill ALL triggers to prevent ghosts from previous pages
        // ScrollTrigger.getAll().forEach(t => t.kill()); // REMOVED: This causes race conditions with new page mounting

        const ctx = gsap.context(() => {
            if (location.pathname.startsWith('/services')) {
                ScrollTrigger.create({
                    start: 0,
                    end: "max",
                    onUpdate: (self) => {
                        const isPastHero = self.scroll() > window.innerHeight - 50;
                        setIsDarkText(isPastHero);
                    }
                });
            } else {
                // Class-based logic for other simple pages (if any use .light-section)
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
            }
        });

        // 3. REFRESH AFTER RENDER
        const timer = setTimeout(() => {
            ScrollTrigger.refresh();
            window.dispatchEvent(new Event('scroll'));
        }, 500);

        return () => {
            ctx.revert(); // Revert local context
            clearTimeout(timer);
        };
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
    const isWork = location.pathname === '/work';

    // Unified Logic:
    // 1. Menu Open -> Butter Yellow
    // 2. Work Page -> Butter Yellow
    // 3. Home Page -> ALWAYS Butter Yellow (User Request)
    // 4. Services -> Dynamic (Hero Yellow, Content Dark)
    // 5. About -> Dynamic via Events (Starts Dark, becomes Yellow, then Dark)
    // 6. Others -> Dark

    useEffect(() => {
        const handleColorChange = (e) => {
            if (location.pathname === '/about' || location.pathname === '/') {
                setIsDarkText(e.detail.isDark);
            }
        };

        window.addEventListener('bloom-navbar-change', handleColorChange);
        return () => window.removeEventListener('bloom-navbar-change', handleColorChange);
    }, [location.pathname]);

    const getColor = () => {
        if (isOpen) return 'var(--color-butter-yellow)';
        if (isWork) return 'var(--color-butter-yellow)';

        // 1. SAFETY OVERRIDE: Enforce "Top of Page" colors
        // If we are basically at the top (< 10px), FORCE the correct color
        // This solves the issue where ScrollTriggers haven't loaded yet
        if (scrollY < 50) {
            if (location.pathname === '/about') return 'var(--color-dark-choc)'; // About starts Dark
            if (location.pathname === '/') return 'var(--color-dark-choc)';  // Home starts Dark (Hero)
            if (location.pathname.startsWith('/services')) return 'var(--color-butter-yellow)'; // Services starts Yellow
        }

        // 2. Normal Logic (Dynamic via events)
        if (location.pathname === '/' || location.pathname === '/about') {
            return isDarkText ? 'var(--color-dark-choc)' : 'var(--color-butter-yellow)';
        }

        if (!isServices) return 'var(--color-dark-choc)';

        // Services Page Logic
        return isDarkText ? 'var(--color-dark-choc)' : 'var(--color-butter-yellow)';
    };

    const logoColor = getColor();
    const menuColor = getColor();

    const showShadow = !isOpen && (isHome || isServices || isWork) && !isDarkText;

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
                    gap: '0.8rem',
                    fontFamily: 'var(--font-subtitle)',
                    filter: showShadow ? 'drop-shadow(0 2px 5px rgba(0,0,0,0.5))' : 'none',
                    transition: 'filter 0.3s ease, color 0.3s ease'
                }}>
                    <span className="font-subtitle" style={{ textTransform: 'uppercase', fontSize: '1.5rem', fontWeight: 'bold' }}>{isOpen ? 'Close' : 'Menu'}</span>
                    <div style={{ position: 'relative', width: '32px', height: '32px' }}>
                        <AnimatePresence mode="wait">
                            {isOpen ? (
                                <motion.div
                                    key="close"
                                    initial={{ opacity: 0, rotate: -90 }}
                                    animate={{ opacity: 1, rotate: 0 }}
                                    exit={{ opacity: 0, rotate: 90 }}
                                    style={{ position: 'absolute' }}
                                >
                                    <X size={32} />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="menu"
                                    initial={{ opacity: 0, rotate: 90 }}
                                    animate={{ opacity: 1, rotate: 0 }}
                                    exit={{ opacity: 0, rotate: -90 }}
                                    style={{ position: 'absolute' }}
                                >
                                    <Menu size={32} />
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
                        className="nav-menu-wrapper"
                    >
                        <motion.ul variants={listVariants} className="nav-menu-list">
                            {[
                                { name: 'Home', path: '/', img: '/images/home.png', height: '150px', tilt: -10 },
                                { name: 'Our Story', path: '/about', img: '/images/ourstory.png', height: '150px', tilt: 15 },
                                { name: 'Services', path: '/services', img: '/images/services.png', height: '130px', tilt: -5 },
                                { name: 'Our Work', path: '/work', img: '/images/Ourwork.png', height: '140px', tilt: 8 },
                                { name: 'Contact', path: '/contact', img: '/images/tele.png', height: '150px', tilt: -5 },
                            ].map((link) => (
                                <motion.li key={link.name} variants={itemVariants} className="nav-menu-item">
                                    <Link
                                        to={link.path}
                                        onClick={() => {
                                            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                                            setIsOpen(false);
                                        }}
                                        className="nav-menu-link"
                                    >
                                        <motion.div
                                            initial="rest"
                                            whileHover="hover"
                                            animate="rest"
                                            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}
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
                                                className="nav-menu-img"
                                                style={{ height: link.height }}
                                            />
                                            <motion.span
                                                variants={{
                                                    rest: { opacity: 0, y: 30, height: 0 },
                                                    hover: { opacity: 1, y: 10, height: 'auto' }
                                                }}
                                                className="nav-menu-text"
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
                            <button
                                onClick={() => setEmailModalOpen(true)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'inherit',
                                    padding: 0,
                                    cursor: 'pointer',
                                    textDecoration: 'underline'
                                }}
                            >
                                hello.bloombranding@gmail.com
                            </button>
                        </motion.div>
                    </motion.div>
                )}            </AnimatePresence>

            <EmailServiceSelector
                isOpen={emailModalOpen}
                onClose={() => setEmailModalOpen(false)}
                recipient="hello.bloombranding@gmail.com"
            />
        </>
    );
}