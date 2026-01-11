import React, { useRef, useEffect } from 'react';
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
const ServiceCard = ({ service, index, containerRef, id }) => {
    // Pure Sticky Stacking - No entry animation (scale/fade) as requested.
    // The "Slide Over" effect is naturally handled by position: sticky and scrolling.

    const isEven = index % 2 === 0;

    return (
        <motion.div
            id={id} // Add ID for hash linking
            style={{
                top: 0,
                position: 'sticky',
                minHeight: '100vh',
                scrollSnapAlign: 'start',
                backgroundColor: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px',
                boxSizing: 'border-box',
                zIndex: index + 1,
                borderTop: '1px solid rgba(0,0,0,0.1)',
                borderRadius: '40px 40px 0 0',
                boxShadow: '0 -10px 30px rgba(0,0,0,0.05)',
            }}
        >
            <div style={{
                width: '100%',
                maxWidth: '1400px',
                display: 'flex',
                flexDirection: isEven ? 'row' : 'row-reverse',
                alignItems: 'center',
                gap: '80px',
                flexWrap: 'wrap',
                position: 'relative'
            }}>
                {/* DECORATIVE TRIANGLE ARROW */}


                {/* A. TEXT CARD SIDE */}
                <div style={{ flex: '1 1 450px', position: 'relative', zIndex: 5 }}>
                    {/* SPECIFIC STICKERS */}
                    {service.title === 'Production' && (
                        <motion.img
                            src="/images/f1.png"
                            animate={{ rotate: [0, 10, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            style={{
                                position: 'absolute',
                                top: '-30px',
                                left: '-30px',
                                width: '80px',
                                zIndex: 0,
                                opacity: 0.9
                            }}
                        />
                    )}
                    {service.title === 'Social Media' && (
                        <div style={{
                            position: 'absolute',
                            bottom: '-20px',
                            right: '-20px',
                            width: '50px',
                            height: '50px',
                            backgroundColor: '#004AAD',
                            borderRadius: '50%',
                            zIndex: 10,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
                        }}>
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
                            style={{
                                position: 'absolute',
                                top: '-15px',
                                left: '30px',
                                width: '20px',
                                height: '20px',
                                backgroundColor: '#004AAD',
                                transform: 'rotate(45deg)',
                                zIndex: 10,
                                boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
                            }}
                        />
                    )}

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        style={{
                            backgroundColor: service.bg,
                            padding: '60px 50px',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                            position: 'relative',
                            transform: isEven ? 'rotate(-1deg)' : 'rotate(1deg)',
                            zIndex: 1
                        }}
                    >
                        <Tape top={-20} />
                        <h2 style={{
                            fontFamily: 'var(--font-brand)',
                            fontSize: '4rem',
                            color: '#333',
                            marginBottom: '20px',
                            lineHeight: 0.9,
                            letterSpacing: '-2px'
                        }}>
                            {service.title.toUpperCase()}
                        </h2>
                        <p style={{ fontSize: '1.4rem', fontStyle: 'italic', marginBottom: '30px', color: '#555', fontFamily: 'Georgia, serif' }}>
                            "{service.desc}"
                        </p>
                        <p style={{ fontSize: '1.1rem', marginBottom: '40px', color: '#444', lineHeight: 1.6 }}>
                            {service.impact}
                        </p>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {service.details.map((detail, idx) => (
                                <li key={idx} style={{
                                    marginBottom: '15px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    fontSize: '1rem',
                                    fontFamily: 'monospace',
                                    borderBottom: '1px solid rgba(0,0,0,0.1)',
                                    paddingBottom: '5px'
                                }}>
                                    <span>{detail}</span>
                                    <span>→</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>

                {/* B. IMAGE SIDE (Polaroid) */}
                <div style={{ flex: '1 1 450px', position: 'relative', zIndex: 1 }}>
                    <motion.div
                        whileHover={{ scale: 1.02, rotate: isEven ? 2 : -2 }}
                        style={{
                            position: 'relative',
                            padding: '20px 20px 80px 20px',
                            backgroundColor: '#fff',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
                            transform: `rotate(${isEven ? '2deg' : '-3deg'})`
                        }}
                    >
                        <Tape top={-20} />
                        <div style={{ width: '100%', height: '400px', backgroundColor: '#f0f0f0', overflow: 'hidden', position: 'relative' }}>
                            <img src={service.img} alt={service.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ position: 'absolute', bottom: '25px', right: '30px', fontFamily: 'var(--font-brand)', fontSize: '1.2rem', color: '#333' }}>
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
            <div className="services-hero" style={{ height: '100vh', width: '100%', display: 'flex', position: 'relative' }}>

                {/* LEFT: DARK TEXT SIDE */}
                <div style={{
                    flex: '1',
                    backgroundColor: '#2C2B2B',
                    color: '#F4F1EA',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: '140px 5% 0', // Reduced top padding to move text higher
                    position: 'relative'
                }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h4 style={{ fontFamily: 'var(--font-subtitle)', fontSize: '0.9rem', letterSpacing: '2px', opacity: 0.7, marginBottom: '40px', textTransform: 'uppercase' }}>
                            Our Services
                        </h4>

                        <h1 style={{ fontFamily: 'var(--font-brand)', fontSize: 'clamp(2.5rem, 4vw, 4rem)', lineHeight: 1.1, marginBottom: '30px', fontWeight: 'normal' }}>
                            Building brands that <br /> command attention. <br />
                            <span style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: "lighter" }}>Your vision, fully realized.</span>
                        </h1>


                    </motion.div>
                </div>

                {/* RIGHT: FEATURE IMAGE SIDE */}
                <div style={{ flex: '1', backgroundColor: '#EADDCD', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

                    {/* Background Texture */}
                    <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'url("/images/noise.png")' }}></div>

                    {/* Featured Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
                        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        style={{
                            width: '70%',
                            height: 'auto',
                            aspectRatio: '0.8',
                            position: 'relative',
                            backgroundColor: '#fff',
                            padding: '20px 20px 60px 20px',
                            boxShadow: '0 30px 60px rgba(0,0,0,0.15)',
                            transform: 'rotate(-3deg)'
                        }}
                    >
                        <Tape top={-25} />
                        <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}>
                            <img src="/images/service_lifestyle.png" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Bloom Services" />
                        </div>
                        <div style={{
                            position: 'absolute',
                            bottom: '20px',
                            left: '0',
                            width: '100%',
                            textAlign: 'center',
                            fontFamily: 'var(--font-brand)',
                            fontSize: '1.5rem',
                            color: '#333'
                        }}>
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
                    <div style={{ padding: '40px 5%', maxWidth: '1400px', margin: '0 auto' }}>
                        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                            <h2 style={{ fontFamily: 'var(--font-brand)', fontSize: '4rem', color: '#333', textTransform: 'uppercase', letterSpacing: '-2px' }}>The Bloom Difference</h2>
                            <p style={{ fontFamily: 'monospace', fontSize: '1rem', color: '#666', marginTop: '10px' }}>We can't just make things pretty. We build brands that work.</p>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '30px' }}>
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
                                        style={{
                                            width: '350px',
                                            padding: '60px 40px',
                                            backgroundColor: '#fff',
                                            boxShadow: '0 20px 50px rgba(0,0,0,0.08)',
                                            position: 'relative',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            textAlign: 'center'
                                        }}
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
                            <ServiceCard key={index} service={service} index={index} containerRef={ref} id={id} />
                        );
                    })}
                </div>

                {/* CTA */}
                <div style={{ textAlign: 'center', padding: '100px 20px 50px', minHeight: '50vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <h2 style={{ fontFamily: 'var(--font-brand)', fontSize: '3rem', marginBottom: '30px' }}>Ready to create something beautiful?</h2>
                    <AnimatedButton to="/contact" className="btn-primary" style={{ backgroundColor: '#333', color: '#fff' }}>
                        Start a Project
                    </AnimatedButton>
                </div>

            </div>

        </div>

    );
}
