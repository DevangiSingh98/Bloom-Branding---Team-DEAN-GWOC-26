import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useContent } from "../context/ContentContext";

// Component for the Detailed Project View inside Modal
const ProjectSlide = ({ project }) => (
    <div
        style={{
            minWidth: '100vw',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            backgroundColor: '#3b2f2f',
            color: '#fdfd96',
            padding: '0 5%',
            boxSizing: 'border-box',
            scrollSnapAlign: 'start'
        }}
    >
        <div style={{
            display: 'flex',
            gap: '6rem',
            alignItems: 'center',
            width: '100%',
            maxWidth: '1400px',
            justifyContent: 'center'
        }}>
            {/* Text Section */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                style={{ width: '450px', textAlign: 'left', flexShrink: 0 }}
            >
                <h3 className="font-subtitle" style={{ fontSize: '1.2rem', color: '#fdfd96', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '2px', opacity: 0.8 }}>
                    {project.category}
                </h3>
                <h2 style={{ fontSize: 'clamp(2.5rem, 4vw, 4.5rem)', marginBottom: '1.5rem', lineHeight: 0.9, color: '#fdfd96' }}>
                    {project.title}
                </h2>
                <p style={{ fontSize: '1.2rem', opacity: 0.9, marginBottom: '2.5rem', lineHeight: 1.6, color: '#fdfd96' }}>
                    {project.description}
                </p>
            </motion.div>

            {/* Image Section */}
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                style={{ flexShrink: 0, display: 'flex', justifyContent: 'center' }}
            >
                <img
                    src={project.image}
                    alt={project.title}
                    style={{
                        maxHeight: '80vh',
                        maxWidth: '50vw',
                        width: 'auto',
                        borderRadius: '5px',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
                        display: 'block'
                    }}
                />
            </motion.div>
        </div>
    </div>
);

// Modal Component with Custom Smooth Scroll
const WorkModal = ({ projects, initialIndex, onClose }) => {
    const scrollRef = useRef(null);
    const scrollState = useRef({
        target: 0,
        current: 0,
        max: 0,
        isActive: false,
        lastDirection: 0
    });
    const rafRef = useRef(null);
    const snapTimeout = useRef(null);

    // Initialize Scroll Position
    useEffect(() => {
        if (scrollRef.current) {
            // Give time for layout
            setTimeout(() => {
                const el = scrollRef.current;
                if (!el) return;

                // Calculate correct start position
                const width = el.offsetWidth;
                const startPos = width * initialIndex;

                // Snap instantly
                el.scrollLeft = startPos;
                scrollState.current.current = startPos;
                scrollState.current.target = startPos;
                scrollState.current.max = el.scrollWidth - el.offsetWidth;
                scrollState.current.isActive = true;

                startLoop();
            }, 50);
        }
        return () => stopLoop();
    }, [initialIndex]);

    const startLoop = () => {
        if (!rafRef.current) {
            loop();
        }
    };

    const stopLoop = () => {
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        }
    };

    const loop = () => {
        const state = scrollState.current;
        if (!state.isActive || !scrollRef.current) return;

        // Linear interpolation for smoothness (0.08 = very smooth/heavy, 0.2 = snappy)
        // Using 0.08 for a "cinematic" smooth feel as requested
        const diff = state.target - state.current;

        // Stop if close enough
        if (Math.abs(diff) < 0.5) {
            state.current = state.target;
            scrollRef.current.scrollLeft = state.current;
            rafRef.current = requestAnimationFrame(loop); // Keep running to catch updates, or optimized: continue only if moved
            // Optimization: we keep running is fine for simple modals, but better to stop if idle?
            // For now, consistent loop ensures responsiveness.
            return;
        }

        state.current += diff * 0.08;
        scrollRef.current.scrollLeft = state.current;
        rafRef.current = requestAnimationFrame(loop);
    };

    // Ensure loop keeps running or restarts on interaction
    useEffect(() => {
        startLoop();
        return () => stopLoop();
    });

    const handleWheel = (e) => {
        if (e.deltaY !== 0) {
            e.preventDefault();
            const state = scrollState.current;
            state.lastDirection = Math.sign(e.deltaY);

            // Adjust Speed (multiplier 4 for responsiveness)
            const move = e.deltaY * 4;

            state.target += move;
            if (scrollRef.current) {
                state.max = scrollRef.current.scrollWidth - scrollRef.current.offsetWidth;
            }
            state.target = Math.max(0, Math.min(state.target, state.max));

            // Snapping Logic: Lock to nearest slide based on direction
            if (snapTimeout.current) clearTimeout(snapTimeout.current);
            snapTimeout.current = setTimeout(() => {
                if (!scrollRef.current) return;
                const width = scrollRef.current.offsetWidth;

                let snapIndex;
                if (state.lastDirection > 0) {
                    // Moving forward -> snap to next
                    snapIndex = Math.ceil(state.target / width);
                } else if (state.lastDirection < 0) {
                    // Moving backward -> snap to prev
                    snapIndex = Math.floor(state.target / width);
                } else {
                    snapIndex = Math.round(state.target / width);
                }

                // Update target to exact snap position
                state.target = snapIndex * width;
                state.target = Math.max(0, Math.min(state.target, state.max));
            }, 60); // Faster snap (60ms)
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: '#3b2f2f',
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column'
            }}>
            <button
                onClick={onClose}
                style={{
                    position: 'absolute',
                    top: '2rem',
                    right: '2rem',
                    zIndex: 10000,
                    background: 'transparent',
                    border: 'none',
                    color: '#fdfd96',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    padding: '1rem',
                    border: '1px solid #fdfd96',
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                ✕
            </button>

            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
            <div
                ref={scrollRef}
                className="no-scrollbar"
                onWheel={handleWheel} // Attach directly via React event
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    overflowX: 'auto',
                    overflowY: 'hidden',
                    scrollBehavior: 'auto' // Important: disable CSS smooth scroll
                }}
            >
                {projects.map((project, index) => (
                    <ProjectSlide key={index} project={project} />
                ))}
            </div>
        </motion.div>
    );
};

export default function Work() {
    const { content } = useContent();
    const projects = content.allProjects || [];

    // Modal State
    const [modalOpen, setModalOpen] = useState(false);
    const [initialSlide, setInitialSlide] = useState(0);
    const modalScrollRef = useRef(null);

    // Scroll Logic for Main Page
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        container: containerRef,
    });

    const smoothProgress = useSpring(scrollYProgress, {
        mass: 0.1,
        stiffness: 100,
        damping: 20,
        restDelta: 0.001
    });

    // Dynamic Grid Logic
    const ITEMS_PER_PAGE = 9;
    const gridPagesCount = Math.ceil(projects.length / ITEMS_PER_PAGE) || 1;
    const totalSections = 1 + gridPagesCount + 1; // Intro + Grids + CTA

    // Horizontal Scroll Logic
    // Map 0 -> 1 vertical progress to 0 -> -((totalSections-1) * 100)vw
    // e.g. 3 sections -> -200vw
    const x = useTransform(smoothProgress, [0, 1], ["0%", `-${(totalSections - 1) * 100}vw`]);

    // Parallax for Desk Items (Shift left when scrolling) - REMOVED to fix glitch
    // Items will move left naturally with the main horizontal scroll 'x'

    // Resize Scale logic logic
    const [scale, setScale] = useState(() => {
        if (typeof window !== 'undefined') {
            return Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
        }
        return 1;
    });

    useEffect(() => {
        const handleResize = () => {
            const widthScale = window.innerWidth / 1920;
            const heightScale = window.innerHeight / 1080;
            setScale(Math.min(widthScale, heightScale));
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Modal scroll logic moved to WorkModal component


    return (
        <div
            ref={containerRef}
            style={{
                height: '100vh',
                width: '100vw',
                overflowY: 'auto',
                overflowY: 'auto',
                overflowX: 'hidden',
                backgroundColor: '#3b2f2f',
                position: 'relative',
                scrollSnapType: 'y mandatory',
                scrollBehavior: 'smooth'
            }}
        >
            {/* Scrollable Height for Dynamic Sections */}
            <div style={{ height: `${totalSections * 100}vh`, position: 'relative' }}>
                {/* Dynamic Snap Targets */}
                {Array.from({ length: totalSections }).map((_, i) => (
                    <div
                        key={i}
                        style={{
                            position: 'absolute',
                            top: `${i * 100}vh`,
                            left: 0,
                            width: '100%',
                            height: '100vh',
                            scrollSnapAlign: 'start',
                            pointerEvents: 'none'
                        }}
                    />
                ))}

                <div style={{
                    position: 'sticky',
                    top: 0,
                    height: '100vh',
                    width: '100vw',
                    overflow: 'hidden'
                }}>
                    <motion.div
                        style={{
                            x,
                            display: 'flex',
                            width: `${totalSections * 100}vw`,
                            height: '100vh',
                            willChange: 'transform'
                        }}
                    >
                        {/* 1. INTRO / HERO SECTION */}
                        <div style={{
                            width: '100vw',
                            height: '100vh',
                            position: 'relative',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            overflow: 'hidden',
                            backgroundColor: '#3b2f2f',
                            flexShrink: 0
                        }}>
                            <div style={{
                                width: '1920px',
                                height: '1080px',
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: `translate(-50%, -50%) scale(${scale})`,
                                transformOrigin: 'center center',
                                pointerEvents: 'none'
                            }}>
                                <motion.div
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                >
                                    {/* Paper & Stuff */}
                                    <motion.img
                                        src="/images/paper.png"
                                        variants={{ hidden: { x: -600, y: -600, rotate: -90, opacity: 0 }, visible: { x: -100, y: -100, rotate: -15, opacity: 1 } }}
                                        transition={{ duration: 1.5, ease: "backOut", delay: 0.5 }}
                                        style={{ position: 'absolute', width: '500px', top: 0, left: 0, willChange: 'transform' }}
                                    />
                                    <motion.img
                                        src="/images/stuff.png"
                                        variants={{ hidden: { x: 600, y: -600, rotate: 90, opacity: 0 }, visible: { x: 100, y: -100, rotate: 15, opacity: 1 } }}
                                        transition={{ duration: 1.5, ease: "backOut", delay: 0.6 }}
                                        style={{ position: 'absolute', width: '550px', top: 0, right: 0, willChange: 'transform' }}
                                    />

                                    {/* Title Text - Behind Folder, Slides UP */}
                                    <motion.div
                                        variants={{ hidden: { y: 630, opacity: 1 }, visible: { y: 150, opacity: 1 } }}
                                        transition={{ type: "spring", stiffness: 40, damping: 15, delay: 0.5 }}
                                        style={{ position: 'absolute', width: '100%', display: 'flex', justifyContent: 'center', zIndex: 10, willChange: 'transform' }}
                                    >
                                        <h1 style={{
                                            fontFamily: 'Bigilla',
                                            fontSize: '200px',
                                            color: '#fdfd96',
                                            margin: 0,
                                            lineHeight: 0.85,
                                            letterSpacing: '2px',
                                            textAlign: 'center',
                                            textShadow: '0 10px 40px rgba(0,0,0,0.3)'
                                        }}>
                                            <div>OUR</div>
                                            <div>WORK</div>
                                        </h1>
                                    </motion.div>

                                    {/* Folder - Larger & Static (Standard IMG) */}
                                    <img
                                        src="/images/folder.png"
                                        style={{ position: 'absolute', width: '900px', left: 'calc(50% - 450px)', top: '400px', zIndex: 20 }}
                                        alt="Folder"
                                    />

                                    {/* Bottom Items - Enter WITH reveal */}
                                    <motion.img src="/images/polaroid.png" variants={{ hidden: { x: -600, y: 600, opacity: 0 }, visible: { x: -80, y: 80, rotate: -10, opacity: 1 } }} transition={{ duration: 1.5, ease: "backOut", delay: 0.5 }} style={{ position: 'absolute', width: '450px', bottom: 0, left: 0, willChange: 'transform' }} />
                                    <motion.img src="/images/pin.png" variants={{ hidden: { x: -200, y: 200, opacity: 0 }, visible: { x: 0, y: 0, opacity: 1 } }} transition={{ duration: 1.5, ease: "backOut", delay: 0.7 }} style={{ position: 'absolute', width: '120px', bottom: '25%', left: '5%', willChange: 'transform' }} />
                                    <motion.img src="/images/pen.png" variants={{ hidden: { x: 600, y: 600, opacity: 0 }, visible: { x: 100, y: 100, rotate: -15, opacity: 1 } }} transition={{ duration: 1.5, ease: "backOut", delay: 0.6 }} style={{ position: 'absolute', width: '500px', bottom: '0', right: 0, willChange: 'transform' }} />
                                    <motion.img src="/images/clip.png" variants={{ hidden: { x: 200, y: 200, opacity: 0 }, visible: { x: 0, y: 0, opacity: 1 } }} transition={{ duration: 1.5, ease: "backOut", delay: 0.7 }} style={{ position: 'absolute', width: '150px', bottom: '20%', right: '10%', willChange: 'transform' }} />
                                </motion.div>
                            </div>
                        </div>

                        {/* 2. DYNAMIC PROJECT GRID SECTIONS */}
                        {Array.from({ length: gridPagesCount }).map((_, pageIndex) => {
                            const pageProjects = projects.slice(pageIndex * ITEMS_PER_PAGE, (pageIndex + 1) * ITEMS_PER_PAGE);
                            return (
                                <div key={pageIndex} style={{
                                    width: '100vw',
                                    height: '100vh',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                    padding: '0 5%',
                                    boxSizing: 'border-box'
                                }}>
                                    <div style={{
                                        width: '100%',
                                        maxWidth: '1400px',
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(3, 1fr)',
                                        gap: '1.5rem',
                                        marginLeft: '12%' // Shift to optical center as requested
                                    }}>
                                        <style>{`
                                            @media (max-width: 1200px) {
                                                .work-grid { grid-template-columns: repeat(2, 1fr) !important; }
                                            }
                                            @media (max-width: 768px) {
                                                .work-grid { grid-template-columns: 1fr !important; }
                                            }
                                        `}</style>
                                        {pageProjects.map((project, index) => {
                                            // Calculate global index for modal using page offset
                                            const globalIndex = (pageIndex * ITEMS_PER_PAGE) + index;
                                            return (
                                                <motion.div
                                                    key={globalIndex}
                                                    className="work-grid"
                                                    whileHover={{ scale: 1.05 }}
                                                    onClick={() => {
                                                        setInitialSlide(globalIndex);
                                                        setModalOpen(true);
                                                    }}
                                                    style={{
                                                        cursor: 'pointer',
                                                        aspectRatio: '16/9',
                                                        position: 'relative'
                                                    }}
                                                >
                                                    <img
                                                        src={project.image}
                                                        alt={project.title}
                                                        style={{
                                                            width: '100%',
                                                            height: '100%',
                                                            objectFit: 'cover',
                                                            borderRadius: '5px',
                                                            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                                                        }}
                                                    />
                                                    <div style={{
                                                        marginTop: '1rem',
                                                        textAlign: 'center',
                                                        fontFamily: 'var(--font-brand)',
                                                        color: '#fdfd96',
                                                        fontSize: '1.2rem'
                                                    }}>
                                                        {project.title}
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}

                        {/* 3. CTA SECTION */}
                        <div style={{
                            width: '100vw',
                            height: '100vh',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#3b2f2f',
                            color: '#fdfd96',
                            flexShrink: 0,
                            position: 'relative'
                        }}>
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                                style={{ textAlign: 'center', maxWidth: '800px', padding: '0 20px' }}
                            >
                                <h2 style={{
                                    fontFamily: 'Bigilla',
                                    fontSize: 'clamp(3rem, 7vw, 7rem)',
                                    color: '#fdfd96',
                                    marginBottom: '1rem',
                                    lineHeight: 1.1
                                }}>
                                    Ready to make your<br />brand bloom?
                                </h2>
                                <p style={{ fontSize: '1.5rem', opacity: 0.8, marginBottom: '3rem', fontFamily: 'Bigilla' }}>
                                    Let's craft a unique identity that stands the test of time.
                                </p>
                                <Link
                                    to="/contact"
                                    className="btn-primary"
                                    style={{
                                        backgroundColor: '#fdfd96',
                                        color: '#3b2f2f',
                                        padding: '1.2rem 3.5rem',
                                        fontSize: '1.2rem',
                                        fontWeight: 'bold',
                                        borderRadius: '50px',
                                        textDecoration: 'none',
                                        display: 'inline-block'
                                    }}
                                >
                                    Start a Project
                                </Link>
                            </motion.div>
                        </div>

                    </motion.div>
                </div>
            </div>

            {/* MODAL */}
            <AnimatePresence>
                {modalOpen && (
                    <WorkModal
                        key="modal"
                        projects={projects}
                        initialIndex={initialSlide}
                        onClose={() => setModalOpen(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
