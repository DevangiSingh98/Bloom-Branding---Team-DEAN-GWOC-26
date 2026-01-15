import React, { useRef, useState, useEffect } from 'react';
import { useContent } from '../context/ContentContext';
import { motion, useScroll, useTransform, animate, useInView } from 'framer-motion';
import { ArrowRight, Star, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import AnimatedButton from '../components/AnimatedButton';
import ParallaxContent from '../components/ParallaxContent';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const fadeInUp = {
    initial: { opacity: 0, x: -60 }, // Left to Right
    animate: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
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
            <h3 style={{ fontSize: '5rem', color: 'var(--color-electric-blue)', lineHeight: 1.2, paddingTop: '10px' }}>{count}+</h3>
            <motion.p
                className="font-subtitle"
                initial={{ opacity: 0, y: 20 }}
                animate={showLabel ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5 }}
            >
                {label}
            </motion.p>
        </div>
    );
};

const _UnusedAnimatedButton = ({ to, children, className, style }) => {
    const [hover, setHover] = useState(false);
    const [randomDirs, setRandomDirs] = useState([]);

    const handleEnter = () => {
        setHover(true);
        setRandomDirs([1, 2, 3].map(() => ({
            x: (Math.random() - 0.5) * 250,
            y: (Math.random() - 0.5) * 150,
            r: (Math.random() - 0.5) * 360
        })));
    };

    return (
        <div style={{ position: 'relative', display: 'inline-block' }} onMouseEnter={handleEnter} onMouseLeave={() => setHover(false)}>
            <div style={{ position: 'absolute', top: '50%', left: '50%', width: 0, height: 0, zIndex: 0, pointerEvents: 'none' }}>
                {[1, 2, 3].map((i, index) => (
                    <motion.img
                        key={i}
                        src={`/images/f${i}.png`}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={hover && randomDirs[index] ? {
                            scale: 0.5,
                            opacity: 1,
                            x: randomDirs[index].x,
                            y: randomDirs[index].y,
                            rotate: randomDirs[index].r
                        } : { scale: 0, opacity: 0, x: 0, y: 0 }}
                        transition={{ type: "spring", stiffness: 100, damping: 10 }}
                        style={{ position: 'absolute', width: '80px', transform: 'translate(-50%, -50%)' }}
                    />
                ))}
            </div>
            <Link to={to} className={className} style={{ position: 'relative', zIndex: 1, ...style }}>
                {children}
            </Link>
        </div>
    );
};



const ServiceList = () => {
    const containerRef = useRef(null);
    const gridRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "center center"]
    });

    // Parallax Reveal: Starts "higher" (negative Y) behind the previous section and slides down to 0
    const titleY = useTransform(scrollYProgress, [0, 1], [-300, 0]);

    const services = [
        { title: "Branding", link: "/services#branding", img: "/images/service_branding.png" },
        { title: "Social Media", link: "/services#social-media", img: "/images/service_jewellery.png" },
        { title: "Production", link: "/services#production", img: "/images/service_decor.png" },
        { title: "Influencer", link: "/services#influencer-marketing", img: "/images/service_fashion.png" }, // Shortened title for layout balance
        { title: "Creative", link: "/services#creative-design", img: "/images/service_lifestyle.png" } // Shortened title
    ];

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Mobile "Peek" Animation
            // We match the CSS media query (max-width: 640px)
            if (window.innerWidth <= 640) {
                ScrollTrigger.create({
                    trigger: gridRef.current,
                    start: "top 50%", // Wait until the grid is centered in view
                    once: true, // Only run once
                    onEnter: () => {
                        // Animate scrollLeft to "peek" (scrolls view to right, shifting items left)
                        gsap.to(gridRef.current, {
                            scrollLeft: 100, // Distance to peek
                            duration: 1, // Slightly smoother duration
                            delay: 0.5, // Slight pause to let the user "settle" on the screen
                            ease: "power2.out",
                            onComplete: () => {
                                // Spring back to start
                                gsap.to(gridRef.current, {
                                    scrollLeft: 0,
                                    duration: 1.5,
                                    ease: "elastic.out(1, 0.5)"
                                });
                            }
                        });
                    }
                });
            }
        }, gridRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} style={{ width: '100%', padding: '10vh 5%', backgroundColor: 'var(--color-electric-blue)' }}>
            <motion.h2
                style={{
                    y: titleY,
                    fontSize: 'clamp(3rem, 9vw, 10rem)',
                    fontFamily: 'var(--font-brand)',
                    marginBottom: '60px',
                    textAlign: 'center',
                    color: 'var(--color-butter-yellow)',
                    textTransform: 'uppercase',
                    lineHeight: 0.9,
                    zIndex: 0,
                    position: 'relative',
                    whiteSpace: 'nowrap'
                }}
            >
                Our Expertise
            </motion.h2>

            <div ref={gridRef} className="services-grid">
                {services.map((service, index) => (
                    <Link
                        key={index}
                        to={service.link}
                        style={{ textDecoration: 'none' }}
                    >
                        <motion.div
                            whileHover="hover"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-50px" }} // Trigger earlier
                            className="service-card"
                            variants={{
                                hidden: { opacity: 0, x: -50 }, // Start Left
                                visible: { opacity: 1, x: 0, y: 0, transition: { duration: 0.6, ease: "easeOut" } }, // Move to Center
                                hover: { y: -10 }
                            }}
                        >
                            {/* Top Title */}
                            <h3 className="service-title" style={{ fontSize: '2rem' }}>
                                {service.title}
                            </h3>

                            {/* Service Image (Large Circular Focus) */}
                            <motion.div
                                className="service-img-container"
                                variants={{
                                    rest: { scale: 1, borderColor: 'var(--color-butter-yellow)' },
                                    hover: { scale: 1.05, borderColor: 'var(--color-white)' }
                                }}
                                transition={{ duration: 0.4 }}
                            >
                                <img
                                    src={service.img}
                                    alt={service.title}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                />
                            </motion.div>

                            {/* Bottom Pill */}
                            <motion.div
                                className="service-btn"
                                variants={{
                                    rest: { backgroundColor: 'transparent', color: 'var(--color-butter-yellow)' },
                                    hover: { backgroundColor: 'var(--color-butter-yellow)', color: 'var(--color-electric-blue)' }
                                }}
                            >
                                style={{ fontSize: '1rem', padding: '12px 35px' }}
                            >
                                Explore
                            </motion.div>

                        </motion.div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default function Home() {
    const { content } = useContent();
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 200]);

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

        }, containerRef);

        return () => {
            ctx.revert();
            // Double check cleanup for any stray triggers
            ScrollTrigger.getAll().filter(t => t.vars.trigger === "#blooming-section" || t.vars.trigger === "#expertise-section" || t.vars.trigger === "#journey-stats" || t.vars.trigger === "#client-love-section").forEach(t => t.kill());
        };
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            ref={containerRef}
            className="overflow-hidden"
        >
            {/* Hero Section */}
            <section style={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
                backgroundImage: 'url("/images/herosecbg(2).jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}>
                {/* Overlay removed as requested */}
                {/* <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.2)', zIndex: 0 }}></div> */}

                {/* Thrown Magazines Animation - Layered Behind */}
                <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {(() => {
                        const magazines = [
                            {
                                src: "/images/page1.png",
                                start: { x: -1800, y: -1200 },
                                end: { x: -580, y: -180 },
                                tabletEnd: { x: -420, y: -180 }, // Moved Inside (was -500)
                                mobileEnd: { x: -220, y: -260 }, // "Outside" slightly (was -200), Moved Up (was -240)
                                rotate: -25, // Synced Angle
                                delay: 0.2, z: 1, finalScale: 1.0, scaleX: -1, scaleY: -1,
                                width: '400px', tabletWidth: '350px', mobileWidth: '280px'
                            },
                            {
                                src: "/images/page2.png",
                                start: { x: 1800, y: -1200 },
                                end: { x: 600, y: -300 },
                                tabletEnd: { x: 420, y: -250 }, // Moved Inside (was 500)
                                mobileEnd: { x: 220, y: -260 }, // "Outside" slightly (was 200), Moved Up (was -240)
                                rotate: -15, // Angled more left (was 10)
                                delay: 0.0, z: 2, scaleY: -1, scaleX: -1,
                                width: '400px', tabletWidth: '350px', mobileWidth: '280px'
                            },
                            {
                                src: "/images/page3.png",
                                start: { x: -1800, y: 1200 },
                                end: { x: -600, y: 300 },
                                tabletEnd: { x: -420, y: 250 }, // Moved Inside (was -500)
                                mobileEnd: { x: -200, y: 260 },
                                rotate: 5, // Synced Angle
                                delay: 0.3, z: 3,
                                width: '400px', tabletWidth: '350px', mobileWidth: '280px'
                            },
                            {
                                src: "/images/page4.png",
                                start: { x: 1800, y: 1200 },
                                end: { x: 600, y: 300 },
                                tabletEnd: { x: 420, y: 250 }, // Moved Inside (was 500)
                                mobileEnd: { x: 200, y: 260 },
                                rotate: -10, // Synced Angle
                                delay: 0.1, z: 4,
                                width: '400px', tabletWidth: '350px', mobileWidth: '280px'
                            },
                            {
                                src: "/images/megaphone.png",
                                start: { x: -1500, y: 0 },
                                end: { x: -450, y: -20 },
                                tabletEnd: { x: -260, y: -80 },
                                mobileEnd: { x: -160, y: -140 },
                                rotate: 25, delay: 0.5, z: 5, width: '180px', tabletWidth: '130px', mobileWidth: '110px'
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
                                        stiffness: 50,
                                        damping: 15,
                                        delay: 0.2 + mag.delay,
                                        duration: 1.5
                                    }}
                                    style={{
                                        position: 'absolute',
                                        width: targetWidth,
                                        height: 'auto',
                                        zIndex: mag.z
                                    }}
                                />
                            );
                        });
                    })()}
                </div>

                <ParallaxContent>
                    <motion.div style={{
                        zIndex: 1,
                        textAlign: 'center',
                        maxWidth: screenSize === 'mobile' ? '95%' : '80%',
                        margin: '0 auto',
                        transform: 'translateX(-20px)' // Visually centering adjustment
                    }}>
                        <motion.img
                            src="/images/main logo.png"
                            alt="Bloom Branding Logo"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            style={{
                                width: screenSize === 'mobile' ? '300px' : '450px',
                                maxWidth: screenSize === 'mobile' ? '75vw' : '90vw',
                                objectFit: 'contain',
                                marginBottom: '1rem'
                            }}
                        />

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 1 }}
                            className="font-subtitle"
                            style={{
                                fontSize: screenSize === 'mobile' ? '1.5rem' : '1.2rem',
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
            <section id="blooming-section" className="section-padding light-section" style={{ backgroundColor: 'var(--color-white)', position: 'relative', zIndex: 10 }}>
                <ParallaxContent>
                    <div className="container">
                        <motion.div
                            variants={staggerContainer}
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true }}
                            className="grid"
                            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center', textAlign: window.innerWidth < 768 ? 'left' : 'justify' }}
                        >
                            <motion.div variants={fadeInUp}>
                                <h2 style={{ fontSize: '3.8rem', marginBottom: '2rem', color: 'var(--color-electric-blue)' }}>Blooming the Brand</h2>
                                <motion.p
                                    className="font-subtitle"
                                    style={{ fontSize: '1.6rem', lineHeight: 1.6, textAlign: 'justify' }}
                                    initial={{ opacity: 0, y: -30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                >
                                    We are a creative branding studio that helps brands grow through strategic storytelling, content creation, and high-impact digital experiences. We focus on modern, bold, and growth-driven brand identities.
                                </motion.p>
                                <br />
                                <AnimatedButton to="/about" className="btn-primary" style={{ marginTop: '1rem' }}>Our Story</AnimatedButton>
                            </motion.div>
                            <motion.div variants={fadeInUp} style={{ order: window.innerWidth < 768 ? -1 : 0 }}> {/* Image First on Mobile */}
                                <div className="img-placeholder" style={{ width: '100%', height: '400px', borderRadius: '20px', overflow: 'hidden' }}>
                                    <img src="/images/bloomingthebrand.png" alt="Blooming the Brand" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </ParallaxContent>
            </section>

            {/* Services Highlight */}
            <section id="expertise-section" style={{ backgroundColor: 'var(--color-electric-blue)', color: 'var(--color-earl-gray)', padding: 0, position: 'relative', zIndex: 1 }}>
                <ServiceList />
            </section>

            {/* Selected Work */}
            <section className="section-padding" style={{ backgroundColor: 'var(--color-dark-choc)', color: 'var(--color-earl-gray)' }}>
                <ParallaxContent>
                    <div className="container">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
                            <h2 style={{ fontSize: '4.5rem', color: 'var(--color-butter-yellow)' }}>Selected Work</h2>
                            <AnimatedButton to="/work" className="btn-primary" style={{ backgroundColor: 'var(--color-butter-yellow)', color: 'var(--color-dark-choc)', whiteSpace: 'nowrap', fontSize: window.innerWidth < 768 ? '0.8rem' : '1rem', padding: window.innerWidth < 768 ? '0.5rem 1rem' : '1rem 2rem' }}>View All Projects</AnimatedButton>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
                            {content.selectedWork.map((item) => (
                                <motion.div
                                    key={item.id}
                                    className="group"
                                    style={{ cursor: 'pointer' }}
                                    whileHover={{ scale: 0.98 }}
                                >
                                    {item.image ? (
                                        <img src={item.image} alt={item.title} style={{ width: window.innerWidth < 768 ? '80%' : '100%', height: '500px', objectFit: 'cover', borderRadius: '10px', marginBottom: '1rem', margin: window.innerWidth < 768 ? '0 auto 1rem' : '0 0 1rem', display: 'block' }} />
                                    ) : (
                                        <div className="img-placeholder" style={{ width: '100%', height: '500px', backgroundColor: '#4a3832', borderRadius: '10px', marginBottom: '1rem' }} />
                                    )}
                                    <h3 style={{ fontSize: '2rem' }}>{item.title}</h3>
                                    <p className="font-subtitle">{item.category}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </ParallaxContent>
            </section>

            {/* Our Journey */}
            <section id="journey-stats" className="section-padding light-section">
                <ParallaxContent>
                    <div className="container">
                        <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'nowrap', gap: '1rem', textAlign: 'center', overflowX: 'auto', paddingBottom: '1rem' }}>
                            <Counter to={5} label="Years of Experience" />
                            <Counter to={50} label="Happy Clients" />
                            <Counter to={100} label="Projects Delivered" />
                        </div>
                    </div>
                </ParallaxContent>
            </section>

            {/* Testimonials */}
            <section id="client-love-section" className="section-padding light-section" style={{ backgroundColor: 'var(--color-butter-yellow)', color: 'var(--color-dark-choc)', padding: '0' }}>
                <ParallaxContent>
                    <div className="container" style={{ maxWidth: '100%' }}>
                        <div style={{ marginTop: '4rem', marginBottom: '3rem', textAlign: 'center' }}>
                            <motion.h2
                                initial={{ y: 50, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                viewport={{ once: true }}
                                style={{
                                    fontSize: 'clamp(3rem, 8vw, 5.5rem)',
                                    lineHeight: 1,
                                    textTransform: 'uppercase',
                                    fontFamily: 'var(--font-brand)',
                                    letterSpacing: '2px',
                                    marginBottom: '1.2rem',
                                    color: 'black'
                                }}
                            >
                                Client Reviews
                            </motion.h2>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3, duration: 0.6 }}
                                viewport={{ once: true }}
                                style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}
                            >
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={20} fill="black" color="black" />
                                ))}
                            </motion.div>
                        </div>
                        {/* Horizontal Marquee Container - Pinterest Style */}
                        <div style={{
                            width: '100%',
                            overflowX: 'auto', // Horizontal scroll enabled
                            position: 'relative',
                            paddingTop: '0',
                            paddingBottom: '4rem',
                            scrollbarWidth: 'none', // Hide scrollbar Firefox
                            msOverflowStyle: 'none' // Hide scrollbar IE/Edge
                        }} className="hide-scrollbar">
                            <motion.div
                                style={{
                                    display: 'flex',
                                    gap: '1rem',
                                    width: 'max-content'
                                }}
                                animate={{ x: ["0%", "-50%"] }} // Move entirely to the left
                                transition={{
                                    x: {
                                        repeat: Infinity,
                                        repeatType: "loop",
                                        duration: 40, // Increased speed (was 600)
                                        ease: "linear"
                                    }
                                }}
                            >
                                {(() => {
                                    // Duplicate the array to ensure seamless infinite scroll
                                    const allTestimonials = [
                                        ...content.testimonials,
                                        ...content.testimonials,
                                        ...content.testimonials,
                                        ...content.testimonials,
                                        ...content.testimonials // Extra buffer
                                    ];

                                    return (
                                        <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'flex-start', paddingLeft: '1rem', paddingRight: '1rem' }}>
                                            {allTestimonials.map((item, index) => {
                                                // Asymmetrical layout: Alternating up and down
                                                const marginTop = index % 2 === 1 ? '3rem' : '0rem';

                                                return (
                                                    <motion.div
                                                        key={`t-${index}`}
                                                        initial={{ scale: 0.5, opacity: 0 }}
                                                        whileInView={{ scale: 1, opacity: 1 }}
                                                        viewport={{ once: false, margin: "-10px" }}
                                                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                                                        whileHover={{ scale: 1.05, zIndex: 10 }}
                                                        style={{
                                                            marginTop: marginTop,
                                                            width: '320px',
                                                            height: '220px', // Fixed height for equal dimensions
                                                            flexShrink: 0,
                                                            borderRadius: '12px',
                                                            overflow: 'hidden',
                                                            backgroundColor: 'rgba(255,255,255,0.95)',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            justifyContent: 'space-between', // Push author to bottom
                                                            boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
                                                            border: '1px solid rgba(0,0,0,0.04)',
                                                            padding: '1.5rem'
                                                        }}
                                                    >
                                                        {/* Text Content */}
                                                        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                                            <div style={{ display: 'flex', gap: '0.2rem', marginBottom: '0.8rem' }}>
                                                                {[...Array(5)].map((_, starIndex) => (
                                                                    <Star
                                                                        key={starIndex}
                                                                        size={12}
                                                                        fill={starIndex < (item.rating || 5) ? "#000" : "none"}
                                                                        color="#000"
                                                                    />
                                                                ))}
                                                            </div>
                                                            <p style={{
                                                                fontSize: '0.9rem',
                                                                lineHeight: 1.5,
                                                                color: '#333',
                                                                fontFamily: '"Arial Nova", sans-serif',
                                                                fontStyle: 'italic',
                                                                margin: 0,
                                                                overflow: 'hidden',
                                                                display: '-webkit-box',
                                                                WebkitLineClamp: 4,
                                                                WebkitBoxOrient: 'vertical'
                                                            }}>
                                                                "{item.text}"
                                                            </p>
                                                            <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                                                                <p className="font-subtitle" style={{ fontWeight: 'bold', fontSize: '0.85rem', color: 'var(--color-electric-blue)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
                                                                    — {item.author}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    );
                                })()}
                            </motion.div>
                        </div>
                    </div>
                </ParallaxContent>
            </section>


            {/* Brands We Have Worked With Section */}
            <section style={{ background: 'linear-gradient(to bottom, var(--color-earl-gray), #d8d6c8)', padding: '5rem 0', overflow: 'hidden' }}>
                <div className="container">
                    <h2 style={{
                        color: 'var(--color-dark-choc)',
                        textAlign: 'center',
                        marginBottom: '3rem',
                        fontSize: window.innerWidth < 768 ? '3.5rem' : '6rem',
                        fontFamily: 'Bigilla, serif',
                        letterSpacing: '1px'
                    }}>
                        BRANDS WE HAVE BLOOMED
                    </h2>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: window.innerWidth < 768 ? 'repeat(3, 1fr)' : 'repeat(auto-fit, minmax(150px, 1fr))',
                        gap: '5rem',
                        alignItems: 'center',
                        justifyItems: 'center',
                        width: '100%'
                    }}>
                        {content.brandLogos && content.brandLogos.map((brand, idx) => (
                            <motion.div
                                key={brand.id || idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1, duration: 0.5 }}
                                style={{
                                    width: window.innerWidth < 768 ? '100px' : '220px',
                                    height: '120px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    // filter: 'brightness(0) invert(1)', // Removed to show original logo colors
                                    opacity: 0.8,
                                    cursor: 'default'
                                }}
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
                    </div>
                </div>
            </section>

            {/* Instagram Preview */}
            <section className="section-padding light-section">
                <ParallaxContent>
                    <div className="container" style={{ textAlign: 'center' }}>
                        <a href="https://www.instagram.com/bloom.branding_/?hl=en" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <h2 style={{ fontSize: window.innerWidth < 768 ? '2.5rem' : '4rem', marginBottom: '3rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                @bloom.branding_ <ArrowUpRight size={56} strokeWidth={0.75} />
                            </h2>
                        </a>
                        <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 768 ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                            {content.instagram.map((item, index) => (
                                <motion.a
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    key={item.id}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, delay: index * 0.2, ease: "easeOut" }}
                                    whileHover={{ opacity: 0.8, scale: 1.02 }}
                                    className="img-placeholder"
                                    style={{ width: '280px', flexGrow: 1, maxWidth: '350px', aspectRatio: '1', borderRadius: '1px', display: 'block', overflow: 'hidden' }}
                                >
                                    {item.image ? (
                                        <img src={item.image} alt="Insta" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        "INSTA POST"
                                    )}
                                </motion.a>
                            ))}
                        </div>
                    </div>
                </ParallaxContent>
            </section>

        </motion.div >
    );
}