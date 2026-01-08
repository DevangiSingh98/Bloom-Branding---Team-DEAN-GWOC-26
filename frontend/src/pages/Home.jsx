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



const ServicesCarousel = () => {
    const containerRef = useRef(null);
    const itemsRef = useRef([]);


    const originalServices = [
        { title: "Branding", desc: "We build the blueprint for your brand’s future." },
        { title: "Social Media Marketing", desc: "Building communities around your brand." },
        { title: "Production", desc: "Bringing your vision to life through high-end production." },
        { title: "Influencer Marketing", desc: "Connecting your brand with authentic voices." },
        { title: "Creative Design", desc: "Immersive digital experiences that convert." }
    ];

    // Map titles to Service Page IDs
    const getServiceLink = (title) => {
        const map = {
            "Branding": "#branding",
            "Social Media Marketing": "#social-media",
            "Production": "#production",
            "Influencer Marketing": "#influencer-marketing",
            "Creative Design": "#creative-design"
        };
        return "/services" + (map[title] || "");
    };

    // Duplicate list 6 times for a safe buffer
    const services = [...originalServices, ...originalServices, ...originalServices, ...originalServices, ...originalServices, ...originalServices];

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Initialize scroll to the middle (Set 3)
        const initializeScroll = () => {
            const setHeight = container.scrollHeight / 6;
            if (container.scrollTop === 0) {
                container.scrollTop = setHeight * 3;
            }
        };

        initializeScroll();
        setTimeout(initializeScroll, 50);

        const updateItems = () => {
            if (!container) return;

            const scrollHeight = container.scrollHeight;
            const setHeight = scrollHeight / 6;
            const scrollTop = container.scrollTop;

            // Infinite Scroll Loop Logic
            if (scrollTop < setHeight) {
                container.scrollTop = scrollTop + (setHeight * 3);
                return;
            } else if (scrollTop > setHeight * 5) {
                container.scrollTop = scrollTop - (setHeight * 3);
                return;
            }

            const center = container.scrollTop + container.clientHeight / 2;
            let minDistance = Infinity;
            let closestIndex = 0;

            itemsRef.current.forEach((item, index) => {
                if (!item) return;

                const itemCenter = item.offsetTop + item.offsetHeight / 2;
                const distance = Math.abs(center - itemCenter);

                // Track closest item for active state
                if (distance < minDistance) {
                    minDistance = distance;
                    closestIndex = index;
                }

                const maxDistance = container.clientHeight;

                // Normalized position (-1 Top, 0 Center, 1 Bottom)
                let normalizedPos = (distance / maxDistance);
                if (itemCenter < center) normalizedPos *= -1;
                normalizedPos = Math.max(Math.min(normalizedPos, 1.0), -1.0);

                const absNormalized = Math.abs(normalizedPos);

                // 3D Effects
                const rotateX = normalizedPos * -15;
                const translateZ = -Math.abs(normalizedPos) * 100;
                const scale = Math.max(1.1 - (absNormalized * 0.25), 0.85);

                // Opacity & Blur
                let opacity = 1 - Math.pow(absNormalized, 1.5);
                opacity = Math.max(opacity, 0.2);

                // Keep center crisp (threshold of 0.15)
                const blur = absNormalized < 0.15 ? 0 : (absNormalized - 0.15) * 8;

                // INTERACTION LOGIC:
                const isFocused = absNormalized < 0.15;
                item.style.pointerEvents = isFocused ? 'auto' : 'none';

                gsap.set(item, {
                    transform: `perspective(1000px) rotateX(${rotateX}deg) translateZ(${translateZ}px) scale(${scale})`,
                    opacity: opacity,
                    filter: `blur(${blur}px)`,
                    // color removed to prevent overwriting white/hover styles
                    zIndex: 100 - Math.round(distance),
                    overwrite: 'auto'
                });
            });

        };

        container.addEventListener('scroll', updateItems);
        updateItems();

        return () => {
            container.removeEventListener('scroll', updateItems);
        };
    }, []);

    return (
        <div style={{ width: '100%', overflow: 'hidden', position: 'relative', paddingBottom: '10vh' }}>
            <h2 style={{
                fontSize: '4.5rem',
                lineHeight: 1.3,
                marginBottom: '8vh',
                textAlign: 'center',
                color: 'var(--color-butter-yellow)',
                textTransform: 'uppercase'
            }}>
                Our Expertise
            </h2>

            <div style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'center', position: 'relative', height: '60vh' }}>



                <div
                    ref={containerRef}
                    className="hide-scrollbar no-smooth-scroll"
                    style={{
                        height: '50vh', // Constrain height within flex container
                        width: '700px',
                        overflowY: 'auto',
                        padding: '25vh 0',
                        perspective: '1500px',
                        transformStyle: 'preserve-3d',
                        scrollBehavior: 'auto',
                        overscrollBehaviorY: 'none',
                        maskImage: 'linear-gradient(to bottom, transparent 0%, black 25%, black 75%, transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 25%, black 75%, transparent 100%)'
                    }}
                >
                    {services.map((service, index) => (
                        <div
                            key={index}
                            ref={el => itemsRef.current[index] = el}
                            style={{
                                height: '14vh',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transformOrigin: 'center center',
                                backfaceVisibility: 'hidden',
                                willChange: 'transform, opacity, filter',
                                pointerEvents: 'none'
                            }}
                        >
                            <Link to={getServiceLink(service.title)} style={{ textDecoration: 'none' }}>
                                <motion.div
                                    whileHover={{ scale: 1.1, color: 'var(--color-butter-yellow)' }}
                                    transition={{ duration: 0.2 }}
                                    style={{ color: '#ffffff' }}
                                >
                                    <h3
                                        className="font-brand"
                                        style={{
                                            fontSize: '3.5rem',
                                            margin: 0,
                                            textAlign: 'center',
                                            color: 'inherit',
                                            whiteSpace: 'nowrap',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {service.title}
                                    </h3>
                                </motion.div>
                            </Link>
                        </div>
                    ))}
                </div>
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
                    {[
                        { src: "/images/page1.png", start: { x: -1800, y: -1200 }, end: { x: -600, y: -200 }, rotate: -15, delay: 0.2, z: 1, finalScale: 1.2 },
                        { src: "/images/page2.png", start: { x: 1800, y: -1200 }, end: { x: 600, y: -300 }, rotate: 10, delay: 0.0, z: 2, scaleY: -1, scaleX: -1 },
                        { src: "/images/page3.png", start: { x: -1800, y: 1200 }, end: { x: -600, y: 300 }, rotate: 5, delay: 0.3, z: 3 },
                        { src: "/images/page4.png", start: { x: 1800, y: 1200 }, end: { x: 600, y: 300 }, rotate: -10, delay: 0.1, z: 4 },
                        { src: "/images/megaphone.png", start: { x: -1500, y: 0 }, end: { x: -450, y: -20 }, rotate: 25, delay: 0.5, z: 5, width: '180px' },
                        { src: "/images/cam.png", start: { x: 1500, y: -500 }, end: { x: 350, y: -250 }, rotate: -15, delay: 0.7, z: 6, width: '250px' },
                        { src: "/images/star.png", start: { x: 250, y: -290 }, end: { x: 250, y: -290 }, rotate: 45, delay: 1.3, z: 0, width: '130px' }
                    ].map((mag, i) => (
                        <motion.img
                            key={i}
                            src={mag.src}
                            initial={{ opacity: 0, x: mag.start.x, y: mag.start.y, scaleX: 0.5 * (mag.scaleX || 1), scaleY: 0.5 * (mag.scaleY || 1), rotate: mag.rotate * 3 }}
                            animate={{ opacity: 1, x: mag.end.x, y: mag.end.y, scaleX: mag.scaleX || 1, scaleY: mag.scaleY || 1, scale: mag.finalScale || 1, rotate: mag.rotate }}
                            transition={{
                                type: "spring",
                                stiffness: 50,
                                damping: 15,
                                delay: 0.2 + mag.delay,
                                duration: 1.5
                            }}
                            style={{
                                position: 'absolute',
                                width: mag.width || '400px',
                                height: 'auto',
                                zIndex: mag.z
                            }}
                        />
                    ))}
                </div>

                <ParallaxContent>
                    <motion.div style={{ zIndex: 1, textAlign: 'center', maxWidth: '80%', margin: '0 auto' }}>
                        <motion.img
                            src="/images/main logo.png"
                            alt="Bloom Branding Logo"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            style={{ width: '450px', maxWidth: '90vw', objectFit: 'contain', marginBottom: '1rem' }}
                        />

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 1 }}
                            className="font-subtitle"
                            style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 2rem auto', color: 'var(--color-white)', textShadow: '0 0 10px rgba(0,0,0,0.5)' }}
                        >
                            {content.hero.subtitle}
                        </motion.p>
                    </motion.div>
                </ParallaxContent>
            </section>

            {/* Intro / Our Story Snippet */}
            <section className="section-padding light-section" style={{ backgroundColor: 'var(--color-white)' }}>
                <ParallaxContent>
                    <div className="container">
                        <motion.div
                            variants={staggerContainer}
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true }}
                            className="grid"
                            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}
                        >
                            <motion.div variants={fadeInUp}>
                                <h2 style={{ fontSize: '3rem', marginBottom: '2rem', color: 'var(--color-electric-blue)' }}>Blooming the Brand</h2>
                                <motion.p
                                    className="font-subtitle"
                                    style={{ fontSize: '1.1rem', lineHeight: 1.8 }}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    variants={{
                                        hidden: { opacity: 1 },
                                        visible: { opacity: 1, transition: { staggerChildren: 0.02 } }
                                    }}
                                >
                                    {"We are a creative branding studio that helps brands grow through strategic storytelling, content creation, and high-impact digital experiences. We focus on modern, bold, and growth-driven brand identities.".split("").map((char, index) => (
                                        <motion.span
                                            key={index}
                                            variants={{
                                                hidden: { opacity: 0 },
                                                visible: { opacity: 1, transition: { duration: 0 } }
                                            }}
                                        >
                                            {char}
                                        </motion.span>
                                    ))}
                                </motion.p>
                                <br />
                                <AnimatedButton to="/about" className="btn-primary" style={{ marginTop: '1rem' }}>Our Story</AnimatedButton>
                            </motion.div>
                            <motion.div variants={fadeInUp}>
                                <div className="img-placeholder" style={{ width: '100%', height: '400px', borderRadius: '20px', overflow: 'hidden' }}>
                                    <img src="/images/bloomingthebrand.png" alt="Blooming the Brand" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </ParallaxContent>
            </section>

            {/* Services Highlight */}
            <section style={{ backgroundColor: 'var(--color-electric-blue)', color: 'var(--color-earl-gray)', padding: 0 }}>
                <ParallaxContent>
                    <ServicesCarousel />
                </ParallaxContent>
            </section>

            {/* Selected Work */}
            <section className="section-padding" style={{ backgroundColor: 'var(--color-dark-choc)', color: 'var(--color-earl-gray)' }}>
                <ParallaxContent>
                    <div className="container">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
                            <h2 style={{ fontSize: '4.5rem', color: 'var(--color-butter-yellow)' }}>Selected Work</h2>
                            <AnimatedButton to="/work" className="btn-primary" style={{ backgroundColor: 'var(--color-butter-yellow)', color: 'var(--color-dark-choc)' }}>View All Projects</AnimatedButton>
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
                                        <img src={item.image} alt={item.title} style={{ width: '100%', height: '500px', objectFit: 'cover', borderRadius: '10px', marginBottom: '1rem' }} />
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
            <section className="section-padding light-section">
                <ParallaxContent>
                    <div className="container">
                        <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '2rem', textAlign: 'center' }}>
                            <Counter to={5} label="Years of Experience" />
                            <Counter to={50} label="Happy Clients" />
                            <Counter to={100} label="Projects Delivered" />
                        </div>
                    </div>
                </ParallaxContent>
            </section>

            {/* Testimonials */}
            <section className="section-padding light-section" style={{ backgroundColor: 'var(--color-butter-yellow)', color: 'var(--color-dark-choc)', paddingTop: '0' }}>
                <ParallaxContent>
                    <div className="container">
                        <motion.h2
                            initial={{ y: 100, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            viewport={{ once: true }}
                            style={{ marginTop: '-1rem', marginBottom: '3rem', textAlign: 'center', fontSize: '6rem', lineHeight: 1 }}
                        >
                            Client Love
                        </motion.h2>
                        {/* Horizontal Marquee Container - Pinterest Style */}
                        <div style={{
                            width: '100%',
                            overflow: 'hidden',
                            position: 'relative',
                            paddingTop: '2rem',
                            paddingBottom: '2rem'
                        }}>
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
                                        duration: 120, // Very slow scroll for elegance
                                        ease: "linear"
                                    }
                                }}
                            >
                                {/* We create a function to generate columns to ensure consistent layout in the loop */}
                                {(() => {
                                    // Split items into 6 columns for a dense board layout
                                    // 12 items / 6 columns = 2 items per column (approx)
                                    const numCols = 6;
                                    const columns = Array.from({ length: numCols }, () => []);
                                    content.testimonials.forEach((t, i) => {
                                        columns[i % numCols].push(t);
                                    });

                                    // Render a set of columns
                                    const renderSet = (keyPrefix) => (
                                        <>
                                            {columns.map((col, colIndex) => (
                                                <div key={`${keyPrefix}-col-${colIndex}`} style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: '1.5rem', // Slight gap increase
                                                    width: '200px', // Strict width to prevent expansion
                                                    // Stagger every other column to create "up and down" unevenness
                                                    marginTop: colIndex % 2 === 1 ? '4rem' : '0'
                                                }}>
                                                    {col.map((item, itemIndex) => {
                                                        // Deterministic random height
                                                        const randomVal = (item.id * 7 + itemIndex * 13) % 4;
                                                        const height = randomVal === 0 ? '250px'
                                                            : randomVal === 1 ? '320px'
                                                                : randomVal === 2 ? '380px'
                                                                    : '290px';

                                                        return (
                                                            <motion.div
                                                                key={`${keyPrefix}-item-${item.id}`}
                                                                initial={{ scale: 0.1, opacity: 0 }} // Start mainly invisible but exist as a point
                                                                whileInView={{ scale: 1, opacity: 1 }} // Pop to full size
                                                                transition={{ type: "spring", stiffness: 120, damping: 20, mass: 1 }} // Subtler spring, less bounce
                                                                viewport={{ once: false, amount: 0.25, margin: "0px" }} // Explicit 1/4th trigger
                                                                style={{
                                                                    width: '100%',
                                                                    height: height,
                                                                    borderRadius: '16px',
                                                                    overflow: 'hidden',
                                                                    backgroundColor: 'rgba(255,255,255,0.4)',
                                                                    display: 'flex',
                                                                    flexDirection: 'column',
                                                                    boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
                                                                }}>
                                                                {/* Media */}
                                                                <div style={{
                                                                    flex: 1,
                                                                    overflow: 'hidden',
                                                                    position: 'relative'
                                                                }}>
                                                                    {item.video ? (
                                                                        <video
                                                                            src={item.video}
                                                                            autoPlay
                                                                            muted
                                                                            loop
                                                                            playsInline
                                                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                                        />
                                                                    ) : item.image ? (
                                                                        <img src={item.image} alt={item.author} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                                    ) : (
                                                                        <div style={{ width: '100%', height: '100%', backgroundColor: '#fff', opacity: 0.5 }}></div>
                                                                    )}
                                                                </div>

                                                                {/* Content */}
                                                                <div style={{ padding: '1.2rem', background: '#fff' }}>
                                                                    <div style={{ display: 'flex', gap: '0.2rem', marginBottom: '0.5rem' }}>
                                                                        {[...Array(item.rating)].map((_, starIndex) => <Star key={starIndex} size={12} fill="#000" />)}
                                                                    </div>
                                                                    <p style={{ fontSize: '0.95rem', lineHeight: 1.4, color: '#333', marginBottom: '0.8rem', display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                                        "{item.text}"
                                                                    </p>
                                                                    <p className="font-subtitle" style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>{item.author}</p>
                                                                </div>
                                                            </motion.div>
                                                        );
                                                    })}
                                                </div>
                                            ))}
                                        </>
                                    );

                                    // Return duplicated sets
                                    return (
                                        <>
                                            {renderSet('set1')}
                                            {renderSet('set2')}
                                            {renderSet('set3')} {/* Triple buffer for wider screens */}
                                        </>
                                    );
                                })()}
                            </motion.div>
                        </div>
                    </div>
                </ParallaxContent>
            </section>

            {/* Instagram Preview */}
            <section className="section-padding light-section">
                <ParallaxContent>
                    <div className="container" style={{ textAlign: 'center' }}>
                        <a href="https://www.instagram.com/bloom.branding_/?hl=en" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <h2 style={{ marginBottom: '3rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                @bloom.branding_ <ArrowUpRight size={48} strokeWidth={0.75} />
                            </h2>
                        </a>
                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem' }}>
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
