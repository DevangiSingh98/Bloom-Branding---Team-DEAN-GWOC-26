import React, { useRef, useState, useEffect } from 'react';
import { useContent } from '../context/ContentContext';
import { motion, useScroll, useTransform, useSpring, animate, useInView, AnimatePresence } from 'framer-motion';
import { ArrowRight, Star, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import AnimatedButton from '../components/AnimatedButton';
import ParallaxContent from '../components/ParallaxContent';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
    animate: { transition: { staggerChildren: 0.2 } }
};

const Counter = ({ to, label }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });
    const [count, setCount] = useState(0);
    const [showLabel, setShowLabel] = useState(false);

    useEffect(() => {
        if (isInView) {
            const controls = animate(0, to, {
                duration: 0.5,
                ease: "circOut",
                onUpdate: (value) => setCount(Math.floor(value)),
                onComplete: () => setShowLabel(true)
            });
            return () => controls.stop();
        }
    }, [isInView, to]);

    return (
        <div ref={ref}>
            <h3 style={{ fontSize: '5rem', color: 'var(--color-butter-yellow)', lineHeight: 1.2, paddingTop: '10px' }}>{count}+</h3>
            <motion.p
                className="font-subtitle"
                initial={{ opacity: 0, y: 20 }}
                animate={showLabel ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5 }}
                style={{ color: 'var(--color-earl-gray)' }}
            >
                {label}
            </motion.p>
        </div>
    );
};

const BrandRotator = ({ brands }) => {
    const [index, setIndex] = useState(0);
    const BATCH_SIZE = 15;

    useEffect(() => {
        if (!brands || brands.length <= BATCH_SIZE) return;

        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % Math.ceil(brands.length / BATCH_SIZE));
        }, 4000);

        return () => clearInterval(interval);
    }, [brands]);

    const visibleBrands = brands ? brands.slice(index * BATCH_SIZE, (index + 1) * BATCH_SIZE) : [];

    return (
        <div style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AnimatePresence mode="wait">
                <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="brands-grid"
                    style={{ width: '100%' }}
                >
                    {visibleBrands.map((brand, idx) => (
                        <motion.div
                            key={brand.id || (index * BATCH_SIZE + idx)}
                            className="brand-logo-item"
                            whileHover={{ opacity: 1, scale: 1.05 }}
                        >
                            {brand.logo && (
                                <img
                                    src={brand.logo}
                                    alt="Brand Logo"
                                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                />
                            )}
                        </motion.div>
                    ))}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

const ViscousWrapper = ({ children, className, style, intensity = 100 }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });
    const smoothProgress = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });
    const y = useTransform(smoothProgress, [0, 1], [intensity, -intensity]);

    return (
        <div ref={ref} className={className} style={{ position: 'relative', ...style }}>
            <motion.div style={{ y, width: '100%' }}>
                {children}
            </motion.div>
        </div>
    );
};



const ServiceList = ({ screenSize }) => {
    const containerRef = useRef(null);
    // Use "start start" to "end end" to track the full scroll of the 300vh container
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 800, // Very high stiffness for "immediate" feel
        damping: 60,    // Critical damping to stay "smooth" (no bounce)
        mass: 1,
        restDelta: 0.001
    });

    const services = [
        { title: "Branding", link: "/services#branding", img: "branding.png", imgSize: "60%" },
        { title: "Social Media", link: "/services#social-media", img: "socialmedia.png", imgSize: "60%" },
        { title: "Production", link: "/services#production", img: "production.png", imgSize: "60%" },
        { title: "Influencer", link: "/services#influencer-marketing", img: "influencer.png" },
        { title: "Creative Design", link: "/services#creative-design", img: "creativedesign.png" }
    ];

    return (
        <div ref={containerRef} style={{
            height: '500vh', // Increased height for more resistance
            position: 'relative'
        }}>
            <div style={{
                position: 'sticky',
                top: 0,
                height: '100vh',
                backgroundColor: 'var(--color-electric-blue)',
                display: 'flex',
                flexDirection: 'column',
                padding: screenSize === 'mobile' ? '15vh 5vw 2vh 5vw' : '2vh 5vw', // Added top padding on mobile
                overflow: 'hidden'
            }}>
                <h2 style={{
                    color: 'var(--color-butter-yellow)',
                    fontSize: screenSize === 'mobile' ? '3.5rem' : 'clamp(5rem, 10vw, 10rem)', // Smaller font on mobile
                    fontFamily: 'var(--font-brand)',
                    marginBottom: '1rem',
                    flexShrink: 0,
                    textTransform: 'uppercase',
                    textAlign: 'center',
                    width: '100%'
                }}>
                    Our Expertise
                </h2>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'row', alignItems: 'stretch' }}>
                    {/* Left Side: Services List */}
                    <div style={{ flex: 1.5, display: 'flex', flexDirection: 'column' }}>
                        {services.map((service, i) => (
                            <div key={i} style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', marginTop: i === 0 ? 0 : '-8vh' }}>
                                <ServiceItem
                                    service={service}
                                    i={i}
                                    total={services.length}
                                    scrollYProgress={smoothProgress}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Right Side: Images (Moving Band) */}
                    <div style={{
                        flex: 1,
                        position: 'relative',
                        overflow: 'hidden',
                        display: screenSize === 'mobile' ? 'none' : 'flex', // Hidden on mobile
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <motion.div style={{
                            display: 'flex',
                            flexDirection: 'column-reverse',
                            height: '100%',
                            width: '100%',
                            y: useTransform(smoothProgress, [0, 1], ['0%', '400%']) // Adjusted range
                        }}>
                            {services.map((service, i) => (
                                <div key={i} style={{
                                    height: '100%',
                                    width: '100%',
                                    flexShrink: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {/* Butter Yellow Masked Image */}
                                    <div style={{
                                        width: service.imgSize || '80%',
                                        height: '60%',
                                        backgroundColor: 'var(--color-butter-yellow)',
                                        maskImage: `url(/images/${service.img})`,
                                        WebkitMaskImage: `url(/images/${service.img})`,
                                        maskSize: 'contain',
                                        WebkitMaskSize: 'contain',
                                        maskRepeat: 'no-repeat',
                                        WebkitMaskRepeat: 'no-repeat',
                                        maskPosition: 'center',
                                        WebkitMaskPosition: 'center',
                                    }} />
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Scroll Snap Points */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
            }}>
                {services.map((_, i) => (
                    <div key={i} style={{
                        position: 'absolute',
                        top: `${i * 100}vh`, // 100vh intervals
                        height: '100vh',
                        width: '100%',
                        scrollSnapAlign: 'start',
                        scrollSnapStop: 'always'
                    }} />
                ))}
            </div>
        </div >
    );
};



const ServiceItem = ({ service, i, total, scrollYProgress }) => {
    // 5 items mapped to 0, 0.25, 0.5, 0.75, 1.0
    const steps = [0, 0.25, 0.5, 0.75, 1];

    // Flex Grow: Active = 30, Inactive = 1
    const flexValues = steps.map((_, idx) => idx === i ? 30 : 1);
    const flexGrow = useTransform(scrollYProgress, steps, flexValues);

    // Opacity: Active = 1, Inactive = 0.3
    const opacityValues = steps.map((_, idx) => idx === i ? 1 : 0.3);
    const opacity = useTransform(scrollYProgress, steps, opacityValues);

    // Scale Y (Stretch): Active = 1.5, Inactive = 0.5
    const scaleYValues = steps.map((_, idx) => idx === i ? 1.5 : 0.5);
    const textScaleY = useTransform(scrollYProgress, steps, scaleYValues);

    // Scale (Zoom): Active = 1.2, Inactive = 0.8
    const scaleValues = steps.map((_, idx) => idx === i ? 1.2 : 0.8);
    const textScale = useTransform(scrollYProgress, steps, scaleValues);

    return (
        <motion.div style={{
            flexGrow,
            display: 'flex',
            alignItems: 'center', // Vertically center the text in the expanded/squished box
            overflow: 'hidden',
            position: 'relative',
            originX: 0
        }}>
            <Link to={service.link} style={{ display: 'block', width: '100%' }}>
                <motion.h3 style={{
                    margin: 0,
                    fontFamily: 'var(--font-subtitle)', // Lekton
                    fontWeight: 'bold',
                    color: 'var(--color-butter-yellow)',
                    opacity,
                    scaleY: textScaleY,
                    scale: textScale,
                    transformOrigin: 'left center',
                    fontSize: 'clamp(3rem, 6vw, 6rem)',
                    whiteSpace: 'nowrap',
                    lineHeight: 0.8
                }}>
                    {service.title}
                </motion.h3>
            </Link>
        </motion.div>
    );
};

export default function Home() {
    const { content } = useContent();
    const containerRef = useRef(null);
    const { scrollYProgress, scrollY } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const springConfig = { stiffness: 100, damping: 30, mass: 1 };
    const smoothScrollY = useSpring(scrollY, springConfig);
    const smoothProgress = useSpring(scrollYProgress, springConfig);

    // Exit animations for all pages
    // Page 1 (Top Left) -> Move Up-Left
    const p1ExitX = useTransform(smoothScrollY, [0, 400], [0, -600]);
    const p1ExitY = useTransform(smoothScrollY, [0, 400], [0, -600]);

    // Page 2 (Top Right) -> Move Up-Right
    const p2ExitX = useTransform(smoothScrollY, [0, 400], [0, 600]);
    const p2ExitY = useTransform(smoothScrollY, [0, 400], [0, -600]);

    // Page 3 (Bottom Left) -> Move Down-Left
    const p3ExitX = useTransform(smoothScrollY, [0, 400], [0, -600]);
    const p3ExitY = useTransform(smoothScrollY, [0, 400], [0, 600]);

    // Page 4 (Bottom Right) -> Move Down-Right
    const p4ExitX = useTransform(smoothScrollY, [0, 400], [0, 600]);
    const p4ExitY = useTransform(smoothScrollY, [0, 400], [0, 600]);

    // Extras Exit Animations
    const megaExitX = useTransform(smoothScrollY, [0, 400], [0, -800]); // Move Left
    const megaExitY = useTransform(smoothScrollY, [0, 400], [0, 100]);  // Slight Down

    const camExitX = useTransform(smoothScrollY, [0, 400], [0, 800]);   // Move Right
    const camExitY = useTransform(smoothScrollY, [0, 400], [0, -800]);  // Move Up

    const starExitY = useTransform(smoothScrollY, [0, 400], [0, -800]); // Move Up

    // Text Parallax Shift
    const textExitY = useTransform(smoothScrollY, [0, 1000], [0, -1500]);

    const heroY = useTransform(smoothProgress, [0, 0.2], [0, 200]);

    // Selected Work Scroll Logic
    const selectedWorkRef = useRef(null);
    const { scrollYProgress: swProgress } = useScroll({
        target: selectedWorkRef,
        offset: ["start end", "center center"]
    });
    const smoothSwProgress = useSpring(swProgress, { stiffness: 60, damping: 20 });
    const titleY = useTransform(smoothSwProgress, [0, 1], ["-60vh", "0vh"]);
    const titleOpacity = useTransform(swProgress, [0, 0.8], [0, 1]);

    // Lifted state for responsiveness
    const [screenSize, setScreenSize] = useState('desktop');

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width < 768) setScreenSize('mobile');
            else if (width < 1200) setScreenSize('tablet');
            else setScreenSize('desktop');
        };

        handleResize(); // Initial check
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Independent Navbar Color Triggers for Home Page
    useEffect(() => {
        // 1. Initial State: Dark (Hero) - Dispatch immediately
        window.dispatchEvent(new CustomEvent('bloom-navbar-change', { detail: { isDark: true } }));

        // 2. Refresh Triggers after mount/transition
        const timer = setTimeout(() => {
            ScrollTrigger.refresh();
            // Re-dispatch to be safe after layout settles
            window.dispatchEvent(new CustomEvent('bloom-navbar-change', { detail: { isDark: true } }));
        }, 100);

        const ctx = gsap.context(() => {
            // "Blooming the Brand" -> Dark
            ScrollTrigger.create({
                trigger: "#blooming-section",
                start: "top 100px",
                onEnter: () => window.dispatchEvent(new CustomEvent('bloom-navbar-change', { detail: { isDark: true } })),
                onLeaveBack: () => window.dispatchEvent(new CustomEvent('bloom-navbar-change', { detail: { isDark: true } })) // Hero is also Dark
            });

            // "Our Expertise" & "Selected Work" -> Yellow
            ScrollTrigger.create({
                trigger: "#expertise-section",
                start: "top 100px",
                onEnter: () => window.dispatchEvent(new CustomEvent('bloom-navbar-change', { detail: { isDark: false } })),
                onLeaveBack: () => window.dispatchEvent(new CustomEvent('bloom-navbar-change', { detail: { isDark: true } }))
            });

            // "Our Journey" / Rest of Page -> Dark
            ScrollTrigger.create({
                trigger: "#journey-stats",
                start: "top 100px",
                onEnter: () => window.dispatchEvent(new CustomEvent('bloom-navbar-change', { detail: { isDark: true } })),
                onLeaveBack: () => window.dispatchEvent(new CustomEvent('bloom-navbar-change', { detail: { isDark: false } }))
            });

            // "Client Love" -> Dark (Reinforcement)
            ScrollTrigger.create({
                trigger: "#client-love-section",
                start: "top 100px",
                onEnter: () => window.dispatchEvent(new CustomEvent('bloom-navbar-change', { detail: { isDark: true } })),
                onLeaveBack: () => window.dispatchEvent(new CustomEvent('bloom-navbar-change', { detail: { isDark: true } }))
            });

            // "Brands" -> Dark
            ScrollTrigger.create({
                trigger: "#brands-content",
                start: "top 100px",
                onEnter: () => window.dispatchEvent(new CustomEvent('bloom-navbar-change', { detail: { isDark: true } })),
                onLeaveBack: () => window.dispatchEvent(new CustomEvent('bloom-navbar-change', { detail: { isDark: true } }))
            });

            // "Instagram" -> Dark
            ScrollTrigger.create({
                trigger: "#instagram-section",
                start: "top 100px",
                onEnter: () => window.dispatchEvent(new CustomEvent('bloom-navbar-change', { detail: { isDark: true } })),
                onLeaveBack: () => window.dispatchEvent(new CustomEvent('bloom-navbar-change', { detail: { isDark: true } }))
            });

        }, containerRef);

        return () => {
            ctx.revert();
            // Double check cleanup for any stray triggers
            ScrollTrigger.getAll().filter(t =>
                t.vars.trigger === "#blooming-section" ||
                t.vars.trigger === "#expertise-section" ||
                t.vars.trigger === "#journey-stats" ||
                t.vars.trigger === "#client-love-section" ||
                t.vars.trigger === "#brands-content" ||
                t.vars.trigger === "#instagram-section"
            ).forEach(t => t.kill());
        };
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            ref={containerRef}
            className="overflow-x-hidden"
        >
            {/* Hero Section */}
            <section style={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'sticky',
                top: 0,
                zIndex: 0,
                backgroundImage: 'url("/images/herosecbg(2).jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                scrollSnapAlign: 'start'
            }}>
                {/* Overlay removed as requested */}
                {/* <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.2)', zIndex: 0 }}></div> */}

                {/* Thrown Magazines Animation - Layered Behind */}
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {(() => {
                        const magazines = [
                            {
                                src: "/images/page1.png",
                                start: { x: -1800, y: -1200 },
                                end: { x: '-42vw', y: '-35vh' },
                                tabletEnd: { x: -420, y: -180 },
                                mobileEnd: { x: -160, y: -220 },
                                rotate: -25, // More anticlockwise
                                delay: 0.2, z: 1, finalScale: 1.0, scaleX: -1, scaleY: -1,
                                width: '400px', tabletWidth: '350px', mobileWidth: '220px'
                            },
                            {
                                src: "/images/page2.png",
                                start: { x: 1800, y: -1200 },
                                end: { x: '42vw', y: '-35vh' },
                                tabletEnd: { x: 420, y: -250 },
                                mobileEnd: { x: 160, y: -220 },
                                rotate: 10,
                                delay: 0.0, z: 2, scaleY: -1, scaleX: -1,
                                width: '400px', tabletWidth: '350px', mobileWidth: '220px'
                            },
                            {
                                src: "/images/page3.png",
                                start: { x: -1800, y: 1200 },
                                end: { x: '-42vw', y: '32vh' },
                                tabletEnd: { x: -420, y: 250 },
                                mobileEnd: { x: -160, y: 240 },
                                rotate: 5,
                                delay: 0.3, z: 12,
                                width: '400px', tabletWidth: '350px', mobileWidth: '220px'
                            },
                            {
                                src: "/images/page4.png",
                                start: { x: 1800, y: 1200 },
                                end: { x: '40vw', y: '32vh' }, // Moved Right (was 32vw)
                                tabletEnd: { x: 420, y: 250 },
                                mobileEnd: { x: 160, y: 240 },
                                rotate: -25, // More anti-clockwise (was -10)
                                delay: 0.1, z: 13,
                                width: '400px', tabletWidth: '350px', mobileWidth: '220px'
                            },
                            {
                                src: "/images/megaphone.png",
                                start: { x: -1500, y: 0 },
                                end: { x: -450, y: -20 },
                                tabletEnd: { x: -260, y: -80 },
                                mobileEnd: { x: -160, y: -60 },
                                rotate: 25, delay: 0.5, z: 15, width: '180px', tabletWidth: '130px', mobileWidth: '110px'
                            },
                            {
                                src: "/images/cam.png",
                                start: { x: 1500, y: -500 },
                                end: { x: 350, y: -250 },
                                tabletEnd: { x: '35vw', y: '-25vh' }, // More Right
                                mobileEnd: { x: '30vw', y: '-25vh' }, // Moved Left (was 40vw)
                                rotate: -15, delay: 0.7, z: 6, width: '250px', tabletWidth: '180px', mobileWidth: '130px'
                            },
                            {
                                src: "/images/star.png",
                                start: { x: 250, y: -290 },
                                end: { x: 250, y: -290 },
                                tabletEnd: { x: '25vw', y: '-30vh' }, // More Right (was 20vw)
                                mobileEnd: { x: '22vw', y: '-28vh' }, // More Left (was 26vw)
                                rotate: 45, delay: 1.3, z: 5, width: '130px', tabletWidth: '100px', mobileWidth: '80px'
                            }
                        ];

                        return magazines.map((mag, i) => {
                            const isMobile = screenSize === 'mobile';
                            const isTablet = screenSize === 'tablet';

                            let targetX = mag.end.x;
                            let targetY = mag.end.y;
                            let targetWidth = mag.width;
                            let targetRotate = mag.rotate;

                            if (isMobile) {
                                targetX = mag.mobileEnd.x;
                                targetY = mag.mobileEnd.y;
                                targetWidth = mag.mobileWidth;
                                targetRotate = mag.mobileRotate || mag.rotate;
                            } else if (isTablet) {
                                targetX = mag.tabletEnd.x;
                                targetY = mag.tabletEnd.y;
                                targetWidth = mag.tabletWidth || mag.width;
                                targetRotate = mag.rotate;
                            }

                            // Determine exit animation wrapper style
                            let wrapperStyle = {
                                position: 'absolute',
                                inset: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                pointerEvents: 'none',
                                zIndex: mag.z
                            };

                            let exitX = 0;
                            let exitY = 0;

                            if (mag.src.includes('page1')) {
                                exitX = p1ExitX;
                                exitY = p1ExitY;
                            } else if (mag.src.includes('page2')) {
                                exitX = p2ExitX;
                                exitY = p2ExitY;
                            } else if (mag.src.includes('page3')) {
                                exitX = p3ExitX;
                                exitY = p3ExitY;
                            } else if (mag.src.includes('page4')) {
                                exitX = p4ExitX;
                                exitY = p4ExitY;
                            } else if (mag.src.includes('megaphone')) {
                                exitX = megaExitX;
                                exitY = megaExitY;
                            } else if (mag.src.includes('cam')) {
                                exitX = camExitX;
                                exitY = camExitY;
                            } else if (mag.src.includes('star')) {
                                exitY = starExitY;
                            }

                            // Wrap all page images and extras to handle the exit shift
                            if (mag.src.includes('page') || mag.src.includes('megaphone') || mag.src.includes('cam') || mag.src.includes('star')) {
                                return (
                                    <motion.div
                                        key={i}
                                        style={{ ...wrapperStyle, x: exitX, y: exitY }}
                                    >
                                        <motion.img
                                            src={mag.src}
                                            initial={{
                                                opacity: 0,
                                                x: isMobile
                                                    ? (typeof mag.mobileEnd.x === 'string' ? `calc(${mag.mobileEnd.x} * 2)` : mag.mobileEnd.x * 2)
                                                    : mag.start.x,
                                                y: isMobile
                                                    ? (typeof mag.mobileEnd.y === 'string' ? `calc(${mag.mobileEnd.y} * 2)` : mag.mobileEnd.y * 2)
                                                    : mag.start.y,
                                                scaleX: 0.5 * (mag.scaleX || 1),
                                                scaleY: 0.5 * (mag.scaleY || 1),
                                                rotate: mag.rotate * 3
                                            }}
                                            animate={{
                                                opacity: 1,
                                                x: targetX,
                                                y: targetY,
                                                scaleX: mag.scaleX || 1,
                                                scaleY: mag.scaleY || 1,
                                                scale: mag.finalScale || 1,
                                                rotate: targetRotate
                                            }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 50,
                                                damping: 15,
                                                mass: 1.2,
                                                delay: 0.2 + mag.delay,
                                                duration: 1.5
                                            }}
                                            style={{
                                                position: 'absolute',
                                                width: targetWidth,
                                                height: 'auto',
                                                // zIndex handled by wrapper
                                                filter: mag.src.includes('page') ? 'drop-shadow(0 15px 25px rgba(0,0,0,0.5))' : 'none'
                                            }}
                                        />
                                    </motion.div>
                                );
                            }

                            // Default return for other items
                            return (
                                <motion.img
                                    key={i}
                                    src={mag.src}
                                    initial={{
                                        opacity: 0,
                                        x: isMobile
                                            ? (typeof mag.mobileEnd.x === 'string' ? `calc(${mag.mobileEnd.x} * 2)` : mag.mobileEnd.x * 2)
                                            : mag.start.x,
                                        y: isMobile
                                            ? (typeof mag.mobileEnd.y === 'string' ? `calc(${mag.mobileEnd.y} * 2)` : mag.mobileEnd.y * 2)
                                            : mag.start.y,
                                        scaleX: 0.5 * (mag.scaleX || 1),
                                        scaleY: 0.5 * (mag.scaleY || 1),
                                        rotate: mag.rotate * 3
                                    }}
                                    animate={{
                                        opacity: 1,
                                        x: targetX,
                                        y: targetY,
                                        scaleX: mag.scaleX || 1,
                                        scaleY: mag.scaleY || 1,
                                        scale: mag.finalScale || 1,
                                        rotate: targetRotate
                                    }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 35,
                                        damping: 20,
                                        mass: 1.2,
                                        delay: 0.2 + mag.delay
                                    }}
                                    style={{
                                        position: 'absolute',
                                        width: targetWidth,
                                        height: 'auto',
                                        zIndex: mag.z,
                                        filter: mag.src.includes('page') ? 'drop-shadow(0 15px 25px rgba(0,0,0,0.5))' : 'none'
                                    }}
                                />
                            );
                        });
                    })()}
                </div>

                <ParallaxContent>
                    <motion.div style={{
                        position: 'relative', // essential for z-index
                        zIndex: 14, // Parallax shift
                        y: textExitY,
                        textAlign: 'center',
                        maxWidth: screenSize === 'mobile' ? '95%' : '80%',
                        margin: screenSize === 'mobile' ? '15vh auto 0 auto' : '0 auto', // Position lower on mobile
                        transform: 'translateX(-35px)' // Visually centering adjustment
                    }}>
                        <motion.img
                            src="/images/main logo.png"
                            alt="Bloom Branding Logo"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: "spring", stiffness: 40, damping: 20, mass: 1, duration: 1.2 }}
                            style={{
                                width: screenSize === 'mobile' ? '240px' : '450px', // Bigger logo on mobile
                                maxWidth: screenSize === 'mobile' ? '85vw' : '90vw',
                                objectFit: 'contain',
                                marginBottom: '0.5rem'
                            }}
                        />

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ type: "spring", stiffness: 40, damping: 20, mass: 1, delay: 0.5 }}
                            className="font-subtitle"
                            style={{
                                fontSize: screenSize === 'mobile' ? '0.9rem' : '1.2rem',
                                margin: '0 auto 2rem auto',
                                color: 'var(--color-white)',
                                textShadow: '0 0 10px rgba(0,0,0,0.5)',
                                textAlign: 'center',
                                whiteSpace: screenSize === 'mobile' ? 'nowrap' : 'normal'
                            }}
                        >
                            We build brands that bloom.
                        </motion.p>
                    </motion.div>
                </ParallaxContent>
            </section>

            {/* Intro / Our Story Snippet */}
            <section
                id="blooming-section"
                className="section-padding"
                style={{
                    backgroundColor: 'var(--color-white)',
                    position: 'relative',
                    zIndex: 40,
                    scrollSnapAlign: 'start', // Changed to start for better focus
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    paddingTop: screenSize === 'mobile' ? '8rem' : '6rem', // More space for mobile header
                    paddingBottom: 0, // No bottom padding so dome sits flush
                    paddingLeft: 0,   // Full width
                    paddingRight: 0   // Full width
                }}
            >
                {/* 1. Arced Title */}
                <motion.div
                    initial={{ y: 120, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1.0, ease: "easeOut" }}
                    viewport={{ once: true, amount: 0.3 }}
                    style={{
                        width: '100%',
                        maxWidth: '1200px',
                        marginBottom: screenSize === 'mobile' ? '0px' : '-50px', // Gap between title and image on mobile
                        position: 'relative',
                        zIndex: 2,
                        textAlign: 'center',
                        marginLeft: 'auto',
                        marginRight: 'auto'
                    }}
                >
                    {/* Widened ViewBox and deeply curved path for mobile */}
                    <svg viewBox={screenSize === 'mobile' ? "0 0 500 220" : "0 0 1200 300"} style={{ width: '100%', overflow: 'visible' }}>
                        <defs>
                            {/* Adjusted Mobile Curve: Starts lower, goes higher - Deep Arch */}
                            <path id="textCurve" d={screenSize === 'mobile' ? "M 10 220 Q 250 20 490 220" : "M 0 300 Q 600 50 1200 300"} fill="transparent" />
                        </defs>
                        {/* Reduced Font Size on Mobile to prevent cutoff */}
                        <text style={{ fontSize: screenSize === 'mobile' ? '45px' : '120px', fontFamily: 'var(--font-brand)', fill: 'var(--color-electric-blue)', fontWeight: 'bold' }}>
                            <textPath href="#textCurve" startOffset="50%" textAnchor="middle">
                                BLOOMING THE BRAND
                            </textPath>
                        </text>
                    </svg>
                </motion.div>

                {/* 2. Full-Width Dome Image Container */}
                <motion.div
                    initial={{ y: 200 }} // Slide up from below
                    whileInView={{ y: 0 }}
                    transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                    viewport={{ once: true }}
                    style={{
                        width: '100%',
                        maxWidth: 'none',
                        aspectRatio: screenSize === 'mobile' ? '1.3 / 1' : '2 / 1', // Wider, gentler curve on mobile (was 0.8/1)
                        position: 'relative',
                        borderRadius: '50% 50% 0 0',
                        overflow: 'hidden',
                        boxShadow: '0 -20px 50px rgba(0,0,0,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: screenSize === 'mobile' ? '-30px' : '-20px', // Pull up slightly to tuck under arc
                        marginBottom: 0
                    }}
                >
                    {/* The Image */}
                    <img
                        src="/images/bloomingthebrand.png"
                        alt="Blooming the Brand"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                    />

                    {/* Dark Gradient Overlay for Readability */}
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'radial-gradient(circle at center 60%, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.8) 100%)',
                        zIndex: 1
                    }} />

                    {/* Overlay Content (Text + Button) */}
                    <div style={{
                        position: 'absolute',
                        inset: 0, // Fill the circle
                        zIndex: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center', // Center vertically in the dome
                        alignItems: 'center',
                        textAlign: 'center',
                        padding: screenSize === 'mobile' ? '2rem' : '4rem',
                        paddingTop: screenSize === 'mobile' ? '6rem' : '8rem' // Push content down slightly to be in the "meat" of the dome
                    }}>
                        {/* 3. Text - SLIDE UP */}
                        <motion.p
                            initial={{ opacity: 0, y: 80 }} // Stronger slide
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }} // Text Delay (after image)
                            viewport={{ once: true }}
                            className="font-subtitle"
                            style={{
                                fontSize: 'clamp(1rem, 2.5vw, 1.8rem)', // Adjusted min size for mobile
                                lineHeight: 1.4,
                                maxWidth: '900px',
                                color: 'var(--color-white)',
                                marginBottom: '2rem',
                                textShadow: '0 2px 5px rgba(0,0,0,0.5)'
                            }}
                        >
                            We are a creative branding studio that helps brands grow through strategic storytelling, content creation, and high-impact digital experiences. We focus on modern, bold, and growth-driven brand identities.
                        </motion.p>

                        {/* 4. Button - SLIDE UP */}
                        <motion.div
                            initial={{ opacity: 0, y: 50 }} // Changed to Slide
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }} // Button Delay (last)
                            viewport={{ once: true }}
                        >
                            <AnimatedButton
                                to="/about"
                                className="btn-primary"
                                style={{
                                    backgroundColor: 'var(--color-white)',
                                    color: 'var(--color-electric-blue)',
                                    border: 'none',
                                    fontSize: '1rem',
                                    padding: '0.8rem 2rem'
                                }}
                            >
                                Our Story
                            </AnimatedButton>
                        </motion.div>
                    </div>
                </motion.div>
            </section>

            {/* Services Highlight */}
            <section id="expertise-section" style={{ backgroundColor: 'var(--color-electric-blue)', color: 'var(--color-earl-gray)', padding: 0, position: 'relative', zIndex: 30, boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
                <ServiceList screenSize={screenSize} />
            </section>

            {/* Selected Work */}
            <section className="section-padding"
                ref={selectedWorkRef}
                style={{
                    backgroundColor: 'transparent',
                    color: 'var(--color-earl-gray)',
                    position: 'relative',
                    zIndex: 10,
                    marginTop: 0,
                    paddingTop: screenSize === 'mobile' ? '20rem' : '12rem',
                    scrollSnapAlign: 'start', // Changed: Added scroll snap
                    scrollSnapStop: 'always'  // Changed: Force stop to prevent skipping
                }}>
                <ViscousWrapper intensity={80}>
                    <div className="container">
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1rem' }}>
                            <motion.h2
                                style={{
                                    y: titleY,
                                    fontSize: 'clamp(5rem, 10vw, 10rem)',
                                    color: 'var(--color-butter-yellow)',
                                    textAlign: 'center'
                                }}>
                                Selected Work
                            </motion.h2>

                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
                            {content.selectedWork.map((item, index) => {
                                const isMobile = screenSize === 'mobile';

                                // Clean variants approach
                                const cardVariants = {
                                    mobileInitial: {
                                        opacity: 0,
                                        x: index % 2 === 0 ? -100 : 100 // Alternating directions
                                    },
                                    mobileAnimate: {
                                        opacity: 1,
                                        x: 0,
                                        transition: { duration: 0.8, ease: "easeOut" }
                                    },
                                    desktopInitial: {
                                        opacity: 0,
                                        y: 100
                                    },
                                    desktopAnimate: {
                                        opacity: 1,
                                        y: 0,
                                        transition: { duration: 0.8, ease: "easeOut", delay: index * 0.3 }
                                    }
                                };

                                return (
                                    <motion.div
                                        key={`${isMobile ? 'm' : 'd'}-${item.id}`} // Force remount on screen change
                                        className="group"
                                        style={{ cursor: 'pointer' }}
                                        whileHover={{ scale: 0.98 }}
                                        initial={isMobile ? "mobileInitial" : "desktopInitial"}
                                        whileInView={isMobile ? "mobileAnimate" : "desktopAnimate"}
                                        viewport={{ once: true, margin: "-10%" }} // Trigger a bit earlier
                                        variants={cardVariants}
                                    >
                                        {item.image ? (
                                            <img src={item.image} alt={item.title} style={{ width: '100%', height: '500px', objectFit: 'cover', borderRadius: '10px', marginBottom: '1rem' }} />
                                        ) : (
                                            <div className="img-placeholder" style={{ width: '100%', height: '500px', backgroundColor: '#4a3832', borderRadius: '10px', marginBottom: '1rem' }} />
                                        )}
                                        <h3 style={{ fontSize: '2rem' }}>{item.title}</h3>
                                        <p className="font-subtitle">{item.category}</p>
                                    </motion.div>
                                );
                            })}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
                            <AnimatedButton to="/work" className="btn-primary" style={{ backgroundColor: 'var(--color-butter-yellow)', color: 'var(--color-dark-choc)' }}>View All Projects</AnimatedButton>
                        </div>
                    </div>
                </ViscousWrapper >
            </section >

            {/* Our Journey */}
            <section id="journey-stats" className="section-padding light-section" style={{
                paddingTop: '6rem',
                position: 'relative',
                zIndex: 20,
                scrollSnapAlign: 'start', // Changed: Added scroll snap
                scrollSnapStop: 'always'  // Changed: Force stop
            }}>
                <ViscousWrapper intensity={50} >
                    <div className="container">
                        <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '2rem', textAlign: 'center' }}>
                            <Counter to={5} label="Years of Experience" />
                            <Counter to={50} label="Happy Clients" />
                            <Counter to={100} label="Projects Delivered" />
                        </div>
                    </div>
                </ViscousWrapper>
            </section >

            {/* Testimonials - Sticky Scroll Layout */}
            <section
                id="client-love-section"
                className="section-padding"
                style={{
                    position: 'relative',
                    backgroundColor: '#fafafa', // Off-white solid color
                    color: 'var(--color-dark-choc)',
                    padding: 0,
                    minHeight: '100vh',
                    scrollSnapAlign: 'start'
                }}
            >
                {/* Reviews Part Wrapper - Confines Sticky Flowers */}
                <div style={{ position: 'relative' }}>
                    {/* Floating Decor Images (Absolute > Sticky Wrapper) */}
                    <div style={{
                        position: 'absolute', // Out of flow to prevent blank space
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        pointerEvents: 'none',
                        zIndex: 1
                    }}>
                        <div style={{
                            position: 'sticky', // Sticks within the absolute parent
                            top: 0,
                            width: '100%',
                            height: '100vh',
                            overflow: 'hidden'
                        }}>
                            <motion.img
                                src="/images/f5.png"
                                alt="Decor"
                                animate={{ y: [-40, 40, -40] }}
                                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                                style={{
                                    position: 'absolute',
                                    left: '-10%',
                                    top: '20%',
                                    width: '500px',
                                    maxWidth: '35vw',
                                    rotate: '15deg'
                                }}
                            />
                            <motion.img
                                src="/images/f4.png"
                                alt="Decor"
                                animate={{ y: [-50, 50, -50] }}
                                transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 1 }}
                                style={{
                                    position: 'absolute',
                                    right: '-5%',
                                    top: '30%',
                                    width: '450px',
                                    maxWidth: '40vw'
                                }}
                            />
                        </div>
                    </div>

                    <div
                        className="container"
                        style={{
                            display: 'flex',
                            flexDirection: screenSize === 'mobile' ? 'column' : 'row',
                            position: 'relative',
                            zIndex: 2,
                            maxWidth: '100%',
                            margin: 0,
                            padding: 0
                        }}
                    >
                        {/* Left Column: Sticky Title */}
                        <div style={{
                            width: screenSize === 'mobile' ? '100%' : '50%',
                            height: screenSize === 'mobile' ? 'auto' : '100vh',
                            position: screenSize === 'mobile' ? 'relative' : 'sticky',
                            top: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '4rem',
                            paddingTop: screenSize === 'mobile' ? '6rem' : '4rem'
                        }}>
                            <motion.h2
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-10%" }}
                                variants={{
                                    visible: { transition: { staggerChildren: 0.08 } },
                                    hidden: {}
                                }}
                                style={{
                                    fontSize: 'clamp(5rem, 10vw, 10rem)', // Matches Expertise Title
                                    fontFamily: 'var(--font-brand)',
                                    lineHeight: 0.9,
                                    color: 'var(--color-electric-blue)',
                                    textAlign: 'left',
                                    width: '100%',
                                    paddingLeft: '5%'
                                }}
                            >
                                {Array.from("What Our").map((char, i) => (
                                    <motion.span key={`line1-${i}`} variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0 } } }}>{char}</motion.span>
                                ))}
                                <br />
                                {Array.from("Clients Say...").map((char, i) => (
                                    <motion.span key={`line2-${i}`} variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0 } } }}>{char}</motion.span>
                                ))}
                            </motion.h2>
                        </div>

                        {/* Right Column: Scrollable Cards - Horizontal on Mobile */}
                        <motion.div
                            whileInView={screenSize === 'mobile' ? {
                                x: [0, -50, 0], // Nudge animation (moves content left to peek right, then back)
                                transition: { duration: 0.8, delay: 0.5, ease: "easeInOut" }
                            } : {}}
                            viewport={{ once: true }}
                            className="hide-scrollbar" // Hides scrollbar
                            style={{
                                width: screenSize === 'mobile' ? '100%' : '50%',
                                display: 'flex',
                                flexDirection: screenSize === 'mobile' ? 'row' : 'column',
                                overflowX: screenSize === 'mobile' ? 'auto' : 'visible',
                                scrollSnapType: screenSize === 'mobile' ? 'x mandatory' : 'none',
                                gap: '2rem',
                                padding: screenSize === 'mobile' ? '0 1rem 4rem 1rem' : '4rem 2rem',
                                paddingBottom: '10rem', // Space at bottom
                                scrollBehavior: 'smooth',
                                WebkitOverflowScrolling: 'touch' // Smooth scroll on iOS
                            }}>
                            {/* 8 Dummy Testimonials */}
                            {[...Array(8)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-10%" }}
                                    transition={{ duration: 0.6 }}
                                    style={{
                                        backgroundColor: 'rgba(255, 255, 255, 1)',
                                        borderRadius: '2px', // Sharpened edges
                                        padding: screenSize === 'mobile' ? '1.5rem' : '2rem', // Reduced padding
                                        color: 'var(--color-dark-choc)',
                                        boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                                        maxWidth: screenSize === 'mobile' ? '80vw' : '500px', // Reduced size
                                        minWidth: screenSize === 'mobile' ? '280px' : 'auto', // Ensure width for horizontal scroll
                                        border: '1px solid rgba(0,0,0,0.05)',
                                        scrollSnapAlign: 'center', // Center snap
                                        flexShrink: 0 // Prevent squishing
                                    }}
                                >
                                    <div style={{ display: 'flex', gap: '5px', marginBottom: '1rem' }}>
                                        {[...Array(5)].map((_, s) => (
                                            <span key={s} style={{ color: '#FFD700', fontSize: '1.2rem' }}>★</span>
                                        ))}
                                    </div>
                                    <p style={{
                                        fontSize: screenSize === 'mobile' ? '0.9rem' : '1rem',
                                        lineHeight: 1.5,
                                        marginBottom: '1.5rem',
                                        fontFamily: 'var(--font-body)'
                                    }}>
                                        "Working with Bloom Branding was an absolute game-changer. They understood our vision perfectly and translated it into a visual identity that speaks volumes."
                                    </p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#eee', overflow: 'hidden' }}>
                                            <img src={`https://ui-avatars.com/api/?name=Client+${i + 1}&background=random`} alt="Client" style={{ width: '100%' }} />
                                        </div>
                                        <div>
                                            <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 'bold' }}>Client Name {i + 1}</h4>
                                            <span style={{ fontSize: '0.8rem', color: '#666' }}>CEO, Company {i + 1}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>

                {/* Brands Content (Merged) */}
                <div
                    id="brands-content"
                    style={{
                        backgroundColor: '#fafafa',
                        position: 'relative',
                        zIndex: 2,
                        paddingTop: '12rem',
                        paddingBottom: '8rem'
                    }}
                >
                    <div className="container">
                        <motion.h2
                            initial={{ opacity: 0, y: 100 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            style={{
                                fontSize: 'clamp(5rem, 10vw, 10rem)',
                                fontFamily: 'var(--font-brand)',
                                color: 'var(--color-electric-blue)',
                                textAlign: 'center',
                                marginBottom: '4rem',
                                textTransform: 'uppercase'
                            }}
                        >
                            Brands We've Bloomed
                        </motion.h2>

                        <div className="brands-grid-container">
                            {[
                                "amar.png",
                                "ambc.png",
                                "bafna.png",
                                "bthere.png",
                                "dhruv gems.png",
                                "fine decor.png",
                                "kaffyn.png",
                                "lifes a beach.png",
                                "mansi nagdev.png",
                                "moire.png",
                                "shoP..png",
                                "subhrekha.png",
                                "the right cut.png",
                                "thyme & whisk.png",
                                "vardhaman.png"
                            ].map((img, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.05 }}
                                    whileHover={{ scale: 1.05 }}
                                    style={{
                                        width: '100%',
                                        aspectRatio: '3/2',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        padding: screenSize === 'mobile' ? '0.5rem' : '1rem'
                                    }}
                                >
                                    <img
                                        src={`/images/${img}`}
                                        alt={img}
                                        style={{
                                            maxWidth: screenSize === 'mobile' ? '70%' : '100%',
                                            maxHeight: '100%',
                                            objectFit: 'contain',
                                            filter: 'grayscale(100%)',
                                            opacity: 0.8,
                                            transition: 'all 0.3s ease'
                                        }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.filter = 'grayscale(0%)';
                                            e.currentTarget.style.opacity = '1';
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.filter = 'grayscale(100%)';
                                            e.currentTarget.style.opacity = '0.8';
                                        }}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Instagram Section */}
            <section
                id="instagram-section"
                style={{
                    backgroundColor: '#fafafa',
                    position: 'relative',
                    zIndex: 2,
                    paddingTop: '4rem',
                    paddingBottom: 0,
                    scrollSnapAlign: 'start',
                    overflow: 'hidden' // Ensure no scroll-bar flicker during anim
                }}
            >
                <div className="container" style={{ position: 'relative' }}>
                    {/* Title Wrapper - Animates UP from behind the grid */}
                    <motion.div
                        initial={{ y: 250 }}
                        whileInView={{ y: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        viewport={{ once: false }}
                        style={{ position: 'relative', zIndex: 1, marginBottom: '3rem', textAlign: 'center' }}
                    >
                        <h2 style={{
                            fontSize: 'clamp(5rem, 10vw, 10rem)',
                            fontFamily: 'var(--font-brand)',
                            color: 'var(--color-electric-blue)',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            lineHeight: 1
                        }}>
                            Check Out Our Vibe
                        </h2>
                        <a href="https://www.instagram.com/bloom.branding_/?hl=en" target="_blank" rel="noopener noreferrer" style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.5rem)', fontFamily: 'var(--font-subtitle)', color: 'var(--color-dark-choc)', textDecoration: 'none', marginTop: '1rem', display: 'inline-block' }}>@bloom.branding_</a>
                    </motion.div>
                </div>

                {/* Grid - sits ON TOP of the initial text position to mask it */}
                <div style={{
                    position: 'relative',
                    zIndex: 10, // Higher z-index to cover text
                    backgroundColor: '#fafafa', // Solid bg to act as mask
                    display: 'grid',
                    gridTemplateColumns: screenSize === 'mobile' ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
                    gap: 0,
                    width: '100%',
                    margin: 0,
                    padding: 0
                }}>
                    {['insta1.png', 'insta2.png', 'insta3.png', 'insta4.png'].map((img, i) => (
                        <motion.a
                            key={i}
                            href="https://www.instagram.com/bloom.branding_/?hl=en"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group"
                            style={{
                                display: 'block',
                                width: '100%',
                                position: 'relative',
                                overflow: 'hidden',
                                aspectRatio: '1/1'
                            }}
                        >
                            <img
                                src={`/images/${img}`}
                                alt="Instagram Post"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    transition: 'transform 0.5s ease'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            />
                            {/* Overlay Icon */}
                            <div style={{
                                position: 'absolute',
                                inset: 0,
                                backgroundColor: 'rgba(0,0,0,0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: 0,
                                transition: 'opacity 0.3s ease'
                            }}
                                onMouseOver={(e) => e.currentTarget.style.opacity = 1}
                                onMouseOut={(e) => e.currentTarget.style.opacity = 0}
                            >
                                <span style={{ color: '#fff', fontSize: '2rem' }}>↗</span>
                            </div>
                        </motion.a>
                    ))}
                </div>
            </section>
        </motion.div>
    );
}