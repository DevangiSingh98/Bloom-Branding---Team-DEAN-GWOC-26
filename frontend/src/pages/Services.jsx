import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import Footer from '../components/Footer';


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
        longText: 'Building a brand is about crafting a narrative that resonates deeply. We ensure your identity is not just seen but felt, creating a lasting dominance in your market. Our approach merges psychological depth with aesthetic precision.',
        mobileText: 'Building a brand is about crafting a narrative that resonates deeply. We ensure your identity is not just seen but felt, creating a lasting dominance.'
    },
    {
        id: 'social',
        title: 'SOCIAL MEDIA',
        subtitle: 'MEDIA & GROWTH',
        description: 'Quality strategies for your goals.',
        image: '/images/s_social.jpg',
        accent: 'var(--color-butter-yellow)',
        textColor: 'var(--color-dark-choc)', // Brown on Yellow
        longText: 'In the digital age, attention is currency. We strategize to maximize engagement, ensuring your content reaches the right audience with precision and impact. From viral moments to sustained growth, we engineer interactions that convert.',
        mobileText: 'In the digital age, attention is currency. We strategize to maximize engagement, ensuring your content reaches the right audience with precision and impact.'
    },
    {
        id: 'production',
        title: 'PRODUCTION',
        subtitle: 'SHOOT & EDIT',
        description: 'Cinematic production aligned with your voice.',
        image: '/images/s_production.jpg',
        accent: 'var(--color-electric-blue)',
        textColor: '#FFFFFF', // White on Blue
        longText: 'Every frame matters. Our production team blends cinematic excellence with your brand voice to create visual stories that captivate. We handle everything from concept to final cut, delivering high-fidelity visuals that leave a lasting imprint.',
        mobileText: 'Every frame matters. Our production team blends cinematic excellence with your brand voice to create visual stories that captivate and convert.'
    },
    {
        id: 'influencer',
        title: 'INFLUENCER',
        subtitle: 'CONNECT & AMPLIFY',
        description: 'Authentic partnerships maximizing your value.',
        image: '/images/s_influencer.jpg',
        accent: 'var(--color-butter-yellow)',
        textColor: 'var(--color-dark-choc)', // Brown on Yellow
        longText: 'True influence is built on authenticity. We connect you with voices that amplify your message, creating partnerships that drive real value. By leveraging data-driven matchmaking, we ensure your brand aligns with creators who embody your values.',
        mobileText: 'True influence is built on authenticity. We connect you with voices that amplify your message, creating partnerships that drive real value.'
    },
    {
        id: 'creative',
        title: 'CREATIVE',
        subtitle: 'DESIGN & DIRECTION',
        description: 'Designing experiences that captivate.',
        image: '/images/s_creative.jpg',
        accent: 'var(--color-electric-blue)',
        textColor: '#FFFFFF', // White on Blue
        longText: 'Design is intelligence made visible. We push creative boundaries to deliver experiences that leave a mark, merging aesthetics with strategy. Our designs are crafted to not only look stunning but to function seamlessly across your brand ecosystem.',
        mobileText: 'Design is intelligence made visible. We push creative boundaries to deliver experiences that leave a mark, merging aesthetics with strategy.'
    }
];

// Create a looped version (20x repeat = 100 items, lighter on performance)
const SERVICES = Array(20).fill(BASE_SERVICES).flat().map((service, index) => ({
    ...service,
    id: `${service.id}-${index}`, // Ensure unique ID for React keys
    originalId: service.id
}));

// --- 3. SUB-COMPONENT: LEFT SERVICE ITEM (Fixes Hook Rules) ---
const ServiceLeftItem = ({ service, index, total, smoothScroll }) => {
    // Hooks called at top level of sub-component: SUCCESS
    const x = useTransform(
        smoothScroll,
        [(index - 1) / total, index / total, (index + 1) / total],
        ["100%", "0%", "-100%"]
    );

    const xStyle = index === 0
        ? useTransform(smoothScroll, [0, 1 / total], ["0%", "-120%"])
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

    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const smoothScroll = useSpring(scrollYProgress, { stiffness: 50, damping: 20, mass: 1.4 });

    const currentIndex = useTransform(smoothScroll, [0, 1], [0, SERVICES.length - 1]);
    const [activeSection, setActiveSection] = useState(0);

    useEffect(() => {
        const unsubscribe = currentIndex.on("change", (latest) => {
            setActiveSection(Math.round(latest));
        });
        return () => unsubscribe();
    }, [currentIndex]);

    const getAccentColor = (idx) => SERVICES[idx % SERVICES.length].accent;

    // --- RESIZE LOGIC ---
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <>
            <div ref={containerRef} style={{ height: `${SERVICES.length * 100}vh`, backgroundColor: 'var(--color-earl-gray)' }}>
                <div style={{
                    position: 'sticky', // CHANGED FROM FIXED
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
                        flexDirection: isMobile ? 'column' : 'row', // STACKED ON MOBILE
                        backgroundColor: 'transparent',
                        overflow: 'hidden'
                    }}>

                        {/* --- LEFT RECTANGLE --- */}
                        <div style={{
                            display: isMobile ? 'none' : 'block', // HIDDEN ON MOBILE
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
                                    total={SERVICES.length}
                                    smoothScroll={smoothScroll}
                                />
                            ))}
                        </div>

                        {/* --- RIGHT RECTANGLE --- */}
                        <div style={{
                            width: isMobile ? '100%' : '50%',
                            height: '100%', // Full height on mobile
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
                                    transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }} // Soft Ease
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

                            {/* MOBILE ADJUSTMENTS FOR INTERNAL ELEMENTS */}
                            <div style={{
                                position: 'absolute',
                                top: isMobile ? '5%' : '0', // Slight top padding on mobile
                                left: isMobile ? '5%' : '0', // Centered on mobile
                                width: isMobile ? '90%' : '75%', // Wider on mobile but with margins
                                height: isMobile ? '60%' : '80%', // Mobile Image Height
                                overflow: 'hidden',
                                zIndex: 10,
                                borderRadius: isMobile ? '10px' : '0' // rounded corners on mobile
                            }}>
                                <AnimatePresence mode="popLayout">
                                    <motion.img
                                        key={`img-${SERVICES[activeSection].id}`}
                                        src={SERVICES[activeSection].image}
                                        alt={SERVICES[activeSection].title}
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
                                            key={`title-${SERVICES[activeSection].id}`}
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
                                                mixBlendMode: ['social', 'influencer'].includes(SERVICES[activeSection].originalId || SERVICES[activeSection].id) ? 'normal' : 'difference' // White for Social/Influencer
                                            }}
                                        >
                                            <h1 style={{
                                                fontFamily: 'var(--font-brand)',
                                                fontSize: '15vw', // BIGGER (was 12vw)
                                                fontWeight: '900',
                                                color: 'white',
                                                margin: 0,
                                                lineHeight: 0.85,
                                                textTransform: 'uppercase'
                                            }}>
                                                {SERVICES[activeSection].title}
                                            </h1>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div style={{
                                position: 'absolute',
                                top: isMobile ? '68%' : '72%', // Below the 60% image
                                left: isMobile ? '5%' : '3rem',
                                right: isMobile ? '5%' : 'auto',
                                width: isMobile ? '90%' : '50%',
                                zIndex: 20
                            }}>
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={`txt-${SERVICES[activeSection].id}`}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.8, ease: "easeOut" }}
                                    >
                                        <p style={{
                                            margin: 0,
                                            fontSize: isMobile ? '0.9rem' : '0.8rem',
                                            lineHeight: '1.5',
                                            fontWeight: '900', // Extra Bold
                                            fontFamily: isMobile ? "'Arial Nova', sans-serif" : 'sans-serif', // Keep standard font
                                            textTransform: 'uppercase', // Always uppercase
                                            letterSpacing: isMobile ? '0' : '0.05em',
                                            color: SERVICES[activeSection].textColor, // Dynamic Color (White or Brown)
                                            width: isMobile ? '100%' : '140%',
                                            textShadow: 'none'
                                        }}>
                                            {isMobile ? SERVICES[activeSection].mobileText : SERVICES[activeSection].longText}
                                        </p>
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Services;
