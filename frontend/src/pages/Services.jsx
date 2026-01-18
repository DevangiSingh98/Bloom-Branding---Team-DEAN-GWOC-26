import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useContent } from '../context/ContentContext';

// --- Configuration ---
const BASE_SERVICES = [
    {
        id: 'branding',
        title: 'BRANDING',
        subtitle: 'IDENTITY & STRATEGY',
        description: 'Crafting identities that build dominance.',
        image: '/images/dummypost4.png',
        accent: 'var(--color-electric-blue)',
        textColor: '#FFFFFF', // White on Blue
        longText: 'Crafting narratives that resonate. Your identity, felt not just seen.',
        mobileText: 'Crafting identities that build dominance and resonate deeply.'
    },
    {
        id: 'social',
        title: 'SOCIAL MEDIA',
        subtitle: 'MEDIA & GROWTH',
        description: 'Quality strategies for your goals.',
        image: '/images/s_social.jpg',
        accent: 'var(--color-butter-yellow)',
        textColor: 'var(--color-electric-blue)', // Blue on Yellow
        longText: 'Maximizing engagement with precision. Viral moments to sustained growth.',
        mobileText: 'Strategize to maximize engagement and reach the right audience.'
    },
    {
        id: 'production',
        title: 'PRODUCTION',
        subtitle: 'SHOOT & EDIT',
        description: 'Cinematic production aligned with your voice.',
        image: '/images/s_production.jpg',
        accent: 'var(--color-electric-blue)',
        textColor: '#FFFFFF', // White on Blue
        longText: 'Cinematic excellence blending with your brand voice. Visual stories that captivate.',
        mobileText: 'Cinematic excellence aligned with your brand voice to captivate.'
    },
    {
        id: 'influencer',
        title: 'INFLUENCER',
        subtitle: 'CONNECT & AMPLIFY',
        description: 'Authentic partnerships maximizing your value.',
        image: '/images/s_influencer.jpg',
        accent: 'var(--color-butter-yellow)',
        textColor: 'var(--color-electric-blue)', // Blue on Yellow
        longText: 'Connecting you with voices that amplify your message. Authentic partnerships.',
        mobileText: 'Authentic partnerships that amplify your message and drive value.'
    },
    {
        id: 'creative',
        title: 'CREATIVE',
        subtitle: 'DESIGN & DIRECTION',
        description: 'Designing experiences that captivate.',
        image: '/images/s_creative.jpg',
        accent: 'var(--color-electric-blue)',
        textColor: '#FFFFFF', // White on Blue
        longText: 'Pushing boundaries to deliver experiences that leave a mark. Aesthetics met with strategy.',
        mobileText: 'Design intelligence creating experiences that leave a lasting mark.'
    }
];

// --- SUB-COMPONENT: LEFT SERVICE ITEM ---
const ServiceLeftItem = ({ service, index, currentIndex }) => {

    const x = useTransform(
        currentIndex,
        [index - 1, index, index + 1],
        ["100%", "0%", "-100%"]
    );

    // Initial state fix for first item: Sync exactly with Item 1's entry
    // If Item 1 goes 100% -> 0% (as index goes 0->1)
    // Item 0 must go 0% -> -100% (as index goes 0->1)
    const xStyle = index === 0
        ? useTransform(currentIndex, [0, 1], ["0%", "-100%"])
        : x;

    return (
        <motion.div
            key={`left-${service.id}`}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                x: xStyle,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10
            }}
        >
            <div style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <svg
                    viewBox="0 0 500 700"
                    preserveAspectRatio="xMidYMid slice"
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '42%',
                        height: '55vh',
                        zIndex: 10,
                        overflow: 'visible',
                        cursor: 'grab'
                    }}
                >
                    <defs>
                        <mask id={`mask-${service.id}`}>
                            <rect width="100%" height="100%" fill="white" />
                            <text
                                x="50%"
                                y="12%"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                style={{
                                    fontSize: '42px',
                                    fontWeight: '900',
                                    fontFamily: 'Druk, sans-serif',
                                    letterSpacing: '-0.02em',
                                    textTransform: 'uppercase',
                                    fill: 'black'
                                }}
                            >
                                {(() => {
                                    const words = service.description.split(' ');
                                    const mid = Math.ceil(words.length / 2);
                                    const line1 = words.slice(0, mid).join(' ');
                                    const line2 = words.slice(mid).join(' ');
                                    return (
                                        <>
                                            <tspan x="50%" dy="-0.6em">{line1}</tspan>
                                            <tspan x="50%" dy="1.2em">{line2}</tspan>
                                        </>
                                    );
                                })()}
                            </text>
                        </mask>
                    </defs>

                    {/* BACK TEXT */}
                    <text
                        x="50%"
                        y="12%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        style={{
                            fontSize: '42px',
                            fontWeight: '900',
                            fontFamily: 'Druk, sans-serif',
                            letterSpacing: '-0.02em',
                            textTransform: 'uppercase',
                            fill: 'var(--color-dark-choc)'
                        }}
                    >
                        {(() => {
                            const words = service.description.split(' ');
                            const mid = Math.ceil(words.length / 2);
                            const line1 = words.slice(0, mid).join(' ');
                            const line2 = words.slice(mid).join(' ');
                            return (
                                <>
                                    <tspan x="50%" dy="-0.6em">{line1}</tspan>
                                    <tspan x="50%" dy="1.2em">{line2}</tspan>
                                </>
                            );
                        })()}
                    </text>

                    {/* BLOCKER */}
                    <rect width="100%" height="100%" fill="#f4f4f0" rx="5%" ry="5%" />

                    {/* IMAGE */}
                    <image
                        href={service.image}
                        width="100%"
                        height="100%"
                        mask={`url(#mask-${service.id})`}
                        preserveAspectRatio="xMidYMid slice"
                        style={{
                            objectFit: 'cover',
                            clipPath: 'inset(0% round 5%)'
                        }}
                    />
                </svg>
            </div>

            {/* EXPERTISE HEADING */}
            <div style={{
                position: 'absolute',
                bottom: '5%',
                width: '100%',
                textAlign: 'center',
                zIndex: 15
            }}>
                <h1 style={{
                    fontSize: 'min(4.5rem, 7vw)',
                    fontFamily: 'var(--font-brand)',
                    fontWeight: '900',
                    color: 'var(--color-electric-blue)',
                    margin: 0,
                    textTransform: 'uppercase',
                    lineHeight: '0.8',
                    textShadow: '0px 0px 2px var(--color-electric-blue)'
                }}>
                    {service.title}
                </h1>
            </div>
        </motion.div>
    );
};

// --- MAIN COMPONENT ---
const Services = () => {

    const { content } = useContent();
    const dbServices = content?.services || [];

    // Force use of local BASE_SERVICES to ensure descriptions match local file
    const RAW_SERVICES = BASE_SERVICES;

    // Force Order
    const ORDER = ['branding', 'social', 'production', 'influencer', 'creative'];
    const SERVICES = [...RAW_SERVICES].sort((a, b) => {
        const idA = (a.id || '').toLowerCase();
        const idB = (b.id || '').toLowerCase();
        return ORDER.indexOf(idA) - ORDER.indexOf(idB);
    }).map((service, index) => ({
        ...service,
        id: `${service.id}-${index}`, // Ensure unique ID
        originalId: service.id
    }));

    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: containerRef });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 50,
        damping: 20,
        mass: 1.4
    });

    const totalItems = SERVICES.length;
    const currentIndex = useTransform(smoothProgress, [0, 1], [0, totalItems - 1]);
    const [activeIndex, setActiveIndex] = useState(0);

    // Sync active index for UI
    useEffect(() => {
        const unsubscribe = currentIndex.on("change", (latest) => {
            setActiveIndex(Math.round(latest));
        });
        return () => unsubscribe();
    }, [currentIndex]);

    // Alias for code compatibility
    const activeSection = activeIndex;
    const getAccentColor = (idx) => SERVICES[idx % SERVICES.length]?.accent || 'var(--color-electric-blue)';

    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Safety check
    if (!SERVICES.length) return null;
    const currentService = SERVICES[activeSection] || SERVICES[0];

    return (
        <>
            <div ref={containerRef} style={{ height: `${SERVICES.length * 100}vh`, backgroundColor: 'var(--color-earl-gray)' }}>
                <div style={{
                    position: 'sticky',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    backgroundColor: 'var(--color-earl-gray)',
                    zIndex: 1
                }}>
                    <div style={{
                        position: 'absolute',
                        top: isMobile ? '0' : '4vh',
                        bottom: isMobile ? '0' : '4vh',
                        left: isMobile ? '0' : '5vw',
                        right: isMobile ? '0' : '5vw',
                        display: 'flex',
                        flexDirection: isMobile ? 'column' : 'row',
                        backgroundColor: 'transparent',
                        overflow: 'hidden'
                    }}>

                        {/* --- LEFT RECTANGLE --- */}
                        <div style={{
                            display: isMobile ? 'none' : 'block',
                            width: '50%',
                            height: '100%',
                            position: 'relative',
                            overflow: 'hidden',
                            backgroundColor: '#f4f4f0',
                        }}>
                            {SERVICES.map((service, index) => (
                                <ServiceLeftItem
                                    key={service.id}
                                    service={service}
                                    index={index}
                                    currentIndex={currentIndex}
                                />
                            ))}
                        </div>

                        {/* --- RIGHT RECTANGLE --- */}
                        <div style={{
                            width: isMobile ? '100%' : '50%',
                            height: '100%',
                            position: 'relative',
                            overflow: 'hidden',
                            backgroundColor: 'var(--color-earl-gray)',
                        }}>
                            <AnimatePresence mode="popLayout">
                                <motion.div
                                    key={`bg-${activeSection}`}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1, backgroundColor: getAccentColor(activeSection) }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        zIndex: 0
                                    }}
                                />
                            </AnimatePresence>

                            {/* MOBILE ADJUSTMENTS */}
                            <div style={{
                                position: 'absolute',
                                top: isMobile ? '5%' : '0',
                                left: isMobile ? '5%' : '0',
                                width: isMobile ? '90%' : '75%',
                                height: isMobile ? '60%' : '80%',
                                overflow: 'hidden',
                                zIndex: 10,
                                borderRadius: isMobile ? '10px' : '0'
                            }}>
                                <AnimatePresence mode="popLayout">
                                    <motion.img
                                        key={`img-${currentService.id}`}
                                        src={currentService.image}
                                        alt={currentService.title}
                                        initial={{ y: '100%' }}
                                        animate={{ y: '0%' }}
                                        exit={{ y: '-100%' }}
                                        transition={{ duration: 1.0, ease: [0.19, 1, 0.22, 1] }}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            display: 'block',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0
                                        }}
                                    />
                                    {isMobile && (
                                        <motion.div
                                            key={`title-${currentService.id}`}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                                            style={{
                                                position: 'absolute',
                                                bottom: '20px',
                                                left: '0',
                                                width: '100%',
                                                textAlign: 'center',
                                                zIndex: 20,
                                                mixBlendMode: ['social', 'influencer'].includes(currentService.originalId) ? 'normal' : 'difference'
                                            }}
                                        >
                                            <h1 style={{
                                                fontFamily: 'var(--font-brand)',
                                                fontSize: '15vw',
                                                fontWeight: '900',
                                                color: 'white',
                                                margin: 0,
                                                lineHeight: 0.85,
                                                textTransform: 'uppercase'
                                            }}>
                                                {currentService.title}
                                            </h1>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div style={{
                                position: 'absolute',
                                top: isMobile ? '68%' : '72%',
                                left: isMobile ? '0' : '8%',
                                right: isMobile ? '0' : 'auto',
                                margin: isMobile ? '0 auto' : '0',
                                width: isMobile ? '90%' : '70%',
                                textAlign: isMobile ? 'center' : 'left', // Left align on desktop
                                zIndex: 20,
                                display: 'flex',
                                justifyContent: isMobile ? 'center' : 'flex-start'
                            }}>
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={`txt-${currentService.id}`}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -15 }}
                                        transition={{ duration: 0.8, ease: "easeOut" }}
                                        style={{ width: '100%' }}
                                    >
                                        <p style={{
                                            margin: '0',
                                            fontSize: isMobile ? '0.9rem' : '1.3rem',
                                            lineHeight: '1.2',
                                            fontWeight: '900',
                                            fontFamily: isMobile ? "'Arial Nova', sans-serif" : 'sans-serif',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.02em',
                                            color: currentService.textColor || 'white',
                                            mixBlendMode: ['social', 'influencer'].includes(currentService.originalId) ? 'normal' : 'difference',
                                            textShadow: ['social', 'influencer'].includes(currentService.originalId) ? '0px 0px 20px rgba(255, 255, 255, 1), 0px 0px 10px rgba(255, 255, 255, 0.8)' : 'none',
                                            width: '100%',
                                            maxWidth: '500px'
                                        }}>
                                            {isMobile ? currentService.mobileText : currentService.longText}
                                        </p>
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>

                    </div>
                </div>

                {/* --- SNAP POINTS --- */}
                {SERVICES.map((_, i) => (
                    <div
                        key={i}
                        style={{
                            height: '100vh',
                            scrollSnapAlign: i === 0 ? 'start' : 'center',
                            scrollSnapStop: 'always',
                            position: 'relative',
                            border: '1px solid transparent',
                            pointerEvents: 'none'
                        }}
                    />
                ))}
            </div>
            {/* Footer removed to rely on global ConditionalFooter */}
            {/* Spacer to shift footer down */}
            <div style={{ height: '20vh', backgroundColor: 'var(--color-earl-gray)' }} />
        </>
    );
};

export default Services;
// Force update
