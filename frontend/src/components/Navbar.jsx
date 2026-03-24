import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useContent } from '../context/ContentContext';
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
    const [isMobile, setIsMobile] = useState(false); // New state for mobile detection
    const [emailModalOpen, setEmailModalOpen] = useState(false);
    const location = useLocation();

    // Track scroll position for robust fallback
    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        const handleResize = () => setIsMobile(window.innerWidth <= 640); // Lowered breakpoint to cover smaller tablets/laptops

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleResize);

        handleScroll(); // Init scroll
        handleResize(); // Init mobile state

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
        };
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
    const isHomeHero = isHome && scrollY < (typeof window !== 'undefined' ? window.innerHeight : 800) - 100;
    const isPastHomeHero = isHome && scrollY >= (typeof window !== 'undefined' ? window.innerHeight : 800) - 100;

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
        if (isWork) return '#4A3426'; // Brown for Work Page using Ingrao theme

        if (isPastHomeHero) return 'var(--color-dark-choc)';

        // 1. SAFETY OVERRIDE: Enforce "Top of Page" colors
        // If we are basically at the top (< 10px), FORCE the correct color
        // This solves the issue where ScrollTriggers haven't loaded yet
        if (scrollY < 50) {
            if (location.pathname === '/about') return 'var(--color-dark-choc)'; // About starts Dark
            if (location.pathname === '/') return 'var(--color-dark-choc)';  // Home starts Dark (Hero)
            if (location.pathname.startsWith('/services')) return 'var(--color-dark-choc)'; // Services starts Dark
        }

        // 2. Normal Logic (Dynamic via events)
        if (location.pathname === '/' || location.pathname === '/about') {
            return isDarkText ? 'var(--color-dark-choc)' : 'var(--color-butter-yellow)';
        }

        if (isServices) return 'var(--color-dark-choc)'; // ALWAYS Dark Chocolate per user request
    };

    const logoColor = getColor();
    const menuColor = getColor();

    const showShadow = !isOpen && (isHome || isServices || isWork) && !isDarkText;

    const { content } = useContent();

    // Menu Items Config - Now dynamic!
    const menuItems = [
        { name: 'Home', path: '/', img: content.siteImages?.menu_home || '/images/home.png', height: '150px', tilt: -10 },
        { name: 'Our Story', path: '/about', img: content.siteImages?.menu_ourstory || '/images/ourstory.png', height: '150px', tilt: 15 },
        { name: 'Services', path: '/services', img: content.siteImages?.menu_services || '/images/services.png', height: '130px', tilt: -5 },
        { name: 'Our Work', path: '/work', img: content.siteImages?.menu_work || '/images/Ourwork.png', height: '140px', tilt: 8 },
        { name: 'Contact', path: '/contact', img: content.siteImages?.menu_contact || '/images/tele.png', height: '150px', tilt: -5 },
    ];

    return (
        <>
            {/* Always-visible Menu Button Component */}
            <div style={{
                position: 'fixed',
                top: '1.2rem',
                right: '5%',
                zIndex: 101, // Above the header
                opacity: (isHomeHero && !isOpen) ? 1 : 0, // Show ONLY when header is hidden to avoid duplicate buttons
                pointerEvents: (isHomeHero && !isOpen) ? 'auto' : 'none',
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            }}>
                <button onClick={toggleMenu} style={{
                    background: 'var(--color-white)',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.8rem 1.5rem',
                    borderRadius: '100px', // Fully rounded pill shape
                    color: 'var(--color-dark-choc)', // Dark text for contrast against white
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    fontFamily: 'var(--font-subtitle)',
                    boxShadow: 'none',
                    transition: 'all 0.3s ease'
                }}>
                    <span className="font-subtitle" style={{ textTransform: 'uppercase', fontSize: '1rem', fontWeight: 'bold' }}>Menu</span>
                    <div style={{ position: 'relative', width: '20px', height: '20px' }}>
                        <Menu size={20} strokeWidth={2.5} />
                    </div>
                </button>
            </div>

            <header style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                padding: isPastHomeHero ? '0.8rem 5%' : '1.2rem 5%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                zIndex: 100,
                backgroundColor: (isPastHomeHero && !isOpen) ? 'var(--color-white)' : 'transparent',
                boxShadow: 'none',
                pointerEvents: 'auto',
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
                <Link to="/" style={{
                    display: 'block',
                    width: isPastHomeHero ? '40px' : '160px', /* Shrink width for BB logo */
                    color: logoColor,
                    transition: 'width 0.4s ease'
                }}>
                    <div style={{
                        position: 'relative',
                        width: '100%',
                        lineHeight: 0,
                        filter: 'none',
                        transition: 'none'
                    }}>
                        {/* Ghost image to maintain aspect ratio and size */}
                        <img
                            src={isPastHomeHero ? (content.siteImages?.navbar_icon || "/images/brandmark.png") : (content.siteImages?.navbar_logo || "/images/Full-Logo.png")}
                            alt="Bloom Branding"
                            style={{ width: '100%', height: 'auto', opacity: 0 }}
                        />
                        {/* Colored mask overlay */}
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            backgroundColor: 'currentColor',
                            maskImage: `url(${isPastHomeHero ? (content.siteImages?.navbar_icon || "/images/brandmark.png") : (content.siteImages?.navbar_logo || "/images/Full-Logo.png")})`,
                            WebkitMaskImage: `url(${isPastHomeHero ? (content.siteImages?.navbar_icon || "/images/brandmark.png") : (content.siteImages?.navbar_logo || "/images/Full-Logo.png")})`,
                            maskSize: 'contain',
                            WebkitMaskSize: 'contain',
                            maskRepeat: 'no-repeat',
                            WebkitMaskRepeat: 'no-repeat',
                            maskPosition: 'left center',
                            WebkitMaskPosition: 'left center',
                            transition: 'background-color 0.3s ease'
                        }} />
                    </div>
                </Link>

                {/* Inline Desktop Links */}
                {!isMobile && (
                    <nav style={{
                        display: 'flex',
                        gap: '4rem',
                        alignItems: 'center',
                        position: 'absolute',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        opacity: (isHomeHero || isOpen) ? 0 : 1, // Hide in hero or when full menu is open
                        pointerEvents: (isHomeHero || isOpen) ? 'none' : 'auto',
                        transition: 'opacity 0.3s ease'
                    }}>
                        {menuItems.map(link => (
                            <Link key={link.name} to={link.path} style={{
                                color: menuColor,
                                textDecoration: 'none',
                                fontFamily: 'var(--font-subtitle)',
                                fontSize: '1.2rem',
                                fontWeight: '600',
                                filter: 'none',
                                transition: 'all 0.3s ease'
                            }}>
                                {link.name}
                            </Link>
                        ))}
                    </nav>
                )}

                {isMobile && (
                    <button onClick={toggleMenu} style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        color: menuColor,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        fontFamily: 'var(--font-subtitle)',
                        filter: 'none',
                        opacity: isHomeHero ? 0 : 1, // Hide standard menu button in hero
                        pointerEvents: isHomeHero ? 'none' : 'auto',
                        transition: 'all 0.3s ease'
                    }}>
                        <span className="font-subtitle" style={{ textTransform: 'uppercase', fontSize: '1.2rem', fontWeight: 'bold' }}>{isOpen ? 'Close' : 'Menu'}</span>
                        <div style={{ position: 'relative', width: '28px', height: '28px' }}>
                            <AnimatePresence mode="wait">
                                {isOpen ? (
                                    <motion.div
                                        key="close"
                                        initial={{ opacity: 0, rotate: -90 }}
                                        animate={{ opacity: 1, rotate: 0 }}
                                        exit={{ opacity: 0, rotate: 90 }}
                                        style={{ position: 'absolute' }}
                                    >
                                        <X size={28} />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="menu"
                                        initial={{ opacity: 0, rotate: 90 }}
                                        animate={{ opacity: 1, rotate: 0 }}
                                        exit={{ opacity: 0, rotate: -90 }}
                                        style={{ position: 'absolute' }}
                                    >
                                        <Menu size={28} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </button>
                )}
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
                            {menuItems.map((link) => (
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
                                                    rest: { opacity: isMobile ? 1 : 0, y: isMobile ? 10 : 30, height: isMobile ? 'auto' : 0 },
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

                        <motion.div variants={itemVariants} className="nav-contact-section" style={{ marginTop: '4rem', fontFamily: 'var(--font-subtitle)' }}>
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