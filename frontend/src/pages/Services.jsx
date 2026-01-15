import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import Footer from '../components/Footer';
import AnimatedButton from '../components/AnimatedButton';


// SERVICE DATA
const services = [
    {
        title: 'Branding',
        desc: 'Build a brand that commands loyalty.',
        impact: 'We don’t just design logos; we craft identities that resonate with your audience.',
        details: ['Brand Identity', 'Strategy', 'Voice & Tone'],
        color: '#4B2E26',
        img: '/images/service_branding.png',
        bg: '#EADDCD'
    },
    {
        title: 'Social Media',
        desc: 'Turn followers into a community.',
        impact: 'From strategy to execution, we create content that sparks conversations.',
        details: ['Strategy', 'Management', 'Growth'],
        color: '#004AAD',
        img: '/images/service_jewellery.png',
        bg: '#D4E2F0'
    },
    {
        title: 'Production',
        desc: 'Visuals that stop the scroll.',
        impact: 'High-end photography and videography that captures the essence of your product.',
        details: ['Photography', 'Videography', 'Direction'],
        color: '#9d1c3a',
        img: '/images/service_decor.png',
        bg: '#F2D4D7'
    },
    {
        title: 'Influencer Marketing',
        desc: 'Amplify your reach with authentic voices.',
        impact: 'We connect you with influencers who align with your values to create campaigns.',
        details: ['Campaigns', 'Vetting', 'Relations'],
        color: '#4B2E26',
        img: '/images/service_fashion.png',
        bg: '#E8E6D8'
    },
    {
        title: 'Creative Design',
        desc: 'Design that converts visitors into customers.',
        impact: 'Beautiful, functional design solutions for web and print.',
        details: ['Web Design', 'Print', 'Packaging'],
        color: '#004AAD',
        img: '/images/service_lifestyle.png',
        bg: '#D4E2F0'
    }
];

// REUSABLE COMPONENTS

const Tape = ({ rotate = 0, top = -15, left = '50%' }) => (
    <div style={{
        position: 'absolute',
        top: `${top}px`,
        left: left,
        transform: `translateX(-50%) rotate(${rotate}deg)`,
        width: '120px',
        height: '35px',
        backgroundColor: 'rgba(255,255,255,0.4)',
        backdropFilter: 'blur(2px)',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        zIndex: 10
    }}></div>
);

const ScribbleUnderline = ({ color = '#333' }) => (
    <svg width="100%" height="20" viewBox="0 0 200 20" style={{ marginTop: '-5px', overflow: 'visible' }}>
        <motion.path
            d="M 5 15 Q 50 0 95 12 T 195 10"
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            transition={{ duration: 1.5, type: 'spring' }}
        />
    </svg>
);

// Helper for Parallax
const ParallaxItem = ({ children, yOffset = 50, style = {}, className = '', containerRef }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        container: containerRef, // Needed for custom scroll container
        offset: ["start end", "end start"]
    });
    const y = useTransform(scrollYProgress, [0, 1], [yOffset, -yOffset]);

    return (
        <motion.div ref={ref} style={{ ...style, y }} className={className}>
            {children}
        </motion.div>
    );
};

// Service Card Component for Animation
const ServiceCard = ({ service, index, containerRef, id, isMobile }) => {
    // Desktop: Pure Sticky Stacking (via CSS class .service-card-sticky)
    // Mobile: Scroll Entry Animation (via Framer Motion)

    const isEven = index % 2 === 0;

    // Mobile Animation Variants
    const mobileVariants = {
        offscreen: {
            opacity: 0,
            y: 100,
            scale: 0.95,
            rotate: isEven ? -2 : 2
        },
        onscreen: {
            opacity: 1,
            y: 0,
            scale: 1,
            rotate: 0,
            transition: {
                type: "spring",
                bounce: 0.2,
                duration: 0.8
            }
        }
    };

    return (
        <motion.div
            id={id} // Add ID for hash linking
            className="service-card-sticky"
            style={{
                zIndex: index + 1,
            }}
            initial={isMobile ? "offscreen" : undefined}
            whileInView={isMobile ? "onscreen" : undefined}
            viewport={{ once: true, amount: 0.1 }}
            variants={isMobile ? mobileVariants : undefined}
        >
            <div className={`service-content-wrapper ${isEven ? 'row-normal' : 'row-reverse'}`}>
                {/* DECORATIVE TRIANGLE ARROW */}


                {/* A. TEXT CARD SIDE */}
                <div className="service-text-side">
                    {/* SPECIFIC STICKERS */}
                    {service.title === 'Production' && (
                        <motion.img
                            src="/images/f1.png"
                            animate={{ rotate: [0, 10, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            className="sticker-production"
                        />
                    )}
                    {service.title === 'Social Media' && (
                        <div className="sticker-social-circle">
                            <span style={{ color: '#fff', fontSize: '1.2rem', transform: 'rotate(-45deg)' }}>➜</span>
                        </div>
                    )}
                    {/* DIAMOND STICKER */}
                    {service.title === 'Social Media' && (
                        <motion.div
                            animate={{ y: [0, -10, 0], rotate: 360 }}
                            transition={{
                                y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                                rotate: { duration: 10, repeat: Infinity, ease: "linear" }
                            }}
                            className="sticker-social-diamond"
                        />
                    )}

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="service-text-card"
                        style={{
                            backgroundColor: service.bg,
                            transform: isEven ? 'rotate(-1deg)' : 'rotate(1deg)',
                        }}
                    >
                        <Tape top={-20} />
                        <h2 className="service-card-title">
                            {service.title.toUpperCase()}
                        </h2>
                        <p className="service-card-desc">
                            "{service.desc}"
                        </p>
                        <p className="service-card-impact">
                            {service.impact}
                        </p>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {service.details.map((detail, idx) => (
                                <li key={idx} className="service-card-detail">
                                    <span>{detail}</span>
                                    <span>→</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>

                {/* B. IMAGE SIDE (Polaroid) */}
                <div className="service-image-side">
                    <motion.div
                        whileHover={{ scale: 1.02, rotate: isEven ? 2 : -2 }}
                        className="service-image-card"
                        style={{
                            transform: `rotate(${isEven ? '2deg' : '-3deg'})`
                        }}
                    >
                        <Tape top={-20} />
                        <div className="service-image-inner">
                            <img src={service.img} alt={service.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div className="service-image-footer">
                            bloom branding // 2024
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default function Services() {
    const ref = useRef(null); // MAIN SCROLL CONTAINER REF
    const { scrollYProgress } = useScroll({
        container: ref, // Track this container specifically
        offset: ["start start", "end end"]
    });
    const { hash } = useLocation();

    // Track Mobile State for Animations
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize(); // Init
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Handle Hash Scroll
    useEffect(() => {
        if (hash) {
            const id = hash.replace('#', '');
            const element = document.getElementById(id);
            if (element) {
                // Determine scroll alignment manually due to sticky positioning stacking
                // However, basic scrollIntoView usually puts it at the top, which works for sticky stacking (top:0)
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 500); // Slight delay for page load/animation
            }
        }
    }, [hash]);

    const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

    // Hide Body Scrollbar removed to allow native scroll for Navbar detection
    // useEffect(() => {
    //     document.body.style.overflow = 'hidden';
    //     return () => {
    //         document.body.style.overflow = 'auto';
    //     };
    // }, []);

    return (
        // MAIN SCROLL CONTAINER - SNAP REMOVED FOR NAVBAR COMPATIBILITY
        <div
            ref={ref}
            style={{
                // height: '100vh',
                // overflowY: 'scroll',
                // scrollSnapType: 'y mandatory',
                backgroundColor: '#FFFFFF',
                // overflowX: 'hidden', // REMOVED: Breaks sticky positioning by creating a new context
                paddingBottom: '0',
                fontFamily: 'var(--font-main)',
                position: 'relative'
            }}
        >

            {/* 1. NEW SPLIT HERO SECTION */}
            <div className="services-hero">

                {/* LEFT: DARK TEXT SIDE */}
                <div className="services-hero-text">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h4 className="services-subtitle">
                            Our Services
                        </h4>

                        <h1 className="services-title">
                            Building brands that <br /> command attention. <br />
                            <span style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: "lighter" }}>Your vision, fully realized.</span>
                        </h1>


                    </motion.div>
                </div>

                {/* RIGHT: FEATURE IMAGE SIDE */}
                <div className="services-hero-image">

                    {/* Background Texture */}
                    <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'url("/images/noise.png")' }}></div>

                    {/* Featured Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
                        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="hero-image-card"
                    >
                        <Tape top={-25} />
                        <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}>
                            <img src="/images/service_lifestyle.png" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Bloom Services" />
                        </div>
                        <div className="hero-image-caption">
                            Bloom Studios ©
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* 2. STATS & DIFFERENCE - Start of Single Light Section Wrapper */}
            <div style={{ position: 'relative', backgroundColor: '#FFFFFF' }}>
                <div style={{ paddingBottom: '100px' }}>

                    {/* STATS BANNER REMOVED */}

                    {/* THE BLOOM DIFFERENCE (White Cards with Stickers) */}
                    <div className="difference-section">
                        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                            <h2 style={{ fontFamily: 'var(--font-brand)', fontSize: '4rem', color: '#333', textTransform: 'uppercase', letterSpacing: '-2px' }}>The Bloom Difference</h2>
                            <p style={{ fontFamily: 'monospace', fontSize: '1rem', color: '#666', marginTop: '10px' }}>We can't just make things pretty. We build brands that work.</p>
                        </div>
                        <div className="difference-grid">
                            {[
                                { title: 'STRATEGIC STORYTELLING', desc: 'We turn passive scrollers into loyal customers.', icon: '📖' },
                                { title: 'BESPOKE AESTHETICS', desc: 'No templates. No cookie-cutter trends. Every pixel is crafted.', icon: '✨' },
                                { title: 'HOLISTIC GROWTH', desc: 'From logo design to video production, we handle your entire visual presence.', icon: '🌱' }
                            ].map((item, i) => (
                                <ParallaxItem key={i} yOffset={(i + 1) * 20} style={{ zIndex: 2 }} containerRef={ref}>
                                    <motion.div
                                        whileHover={{ y: -10 }}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.2 }}
                                        className="difference-card"
                                    >
                                        {/* Tape at top */}
                                        <div style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', width: '100px', height: '30px', backgroundColor: 'rgba(255,255,255,0.8)', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}></div>

                                        {/* Icon / Sticker */}
                                        <div style={{ fontSize: '3rem', marginBottom: '20px' }}>{item.icon}</div>

                                        <h3 style={{ fontFamily: 'var(--font-brand)', fontSize: '2.2rem', marginBottom: '20px', lineHeight: 1.1 }}>{item.title}</h3>
                                        <p style={{ color: '#666', lineHeight: 1.6, fontSize: '1rem' }}>{item.desc}</p>
                                    </motion.div>
                                </ParallaxItem>
                            ))}
                        </div>
                    </div>
                </div>
                {/* END INTRO WRAPPER */}

                {/* 4. MAIN SERVICES LIST */}
                <div style={{ position: 'relative' }}>
                    {services.map((service, index) => {
                        // Generate ID: e.g. "Branding" -> "branding", "Social Media" -> "social-media"
                        const id = service.title.toLowerCase().replace(/\s+/g, '-');
                        return (
                            <ServiceCard key={index} service={service} index={index} containerRef={ref} id={id} isMobile={isMobile} />
                        );
                    })}
                </div>

                {/* CTA */}
                <div className="services-cta">
                    <h2 style={{ fontFamily: 'var(--font-brand)', fontSize: '3rem', marginBottom: '30px' }}>Ready to create something beautiful?</h2>
                    <AnimatedButton to="/contact" className="btn-primary" style={{ backgroundColor: '#333', color: '#fff' }}>
                        Start a Project
                    </AnimatedButton>
                </div>

            </div>

        </div>

    );
}
