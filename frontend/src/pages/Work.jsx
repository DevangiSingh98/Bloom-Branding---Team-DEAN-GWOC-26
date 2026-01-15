
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
        <div className="project-slide-inner">
            {/* Text Section Wrapper */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="project-info-wrapper"
            >
                {/* Header: Category + Title */}
                <div className="project-slide-header">
                    <h3 className="font-subtitle" style={{ fontSize: '1.2rem', color: '#fdfd96', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '2px', opacity: 0.8 }}>
                        {project.category}
                    </h3>
                    <h2 style={{ marginBottom: '1.5rem', lineHeight: 0.9, color: '#fdfd96' }}>
                        {project.title}
                    </h2>
                </div>

                {/* Description - Separate for mobile ordering */}
                <div className="project-slide-desc">
                    <p style={{ fontSize: '1.2rem', opacity: 0.9, marginBottom: '2.5rem', lineHeight: 1.6, color: '#fdfd96' }}>
                        {project.description}
                    </p>
                </div>
            </motion.div>

            {/* Media Section */}
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="project-slide-media"
            >
                {project.video ? (
                    <video
                        src={project.video}
                        controls
                        autoPlay
                        loop
                        muted
                        className="project-slide-media-element"
                    />
                ) : (
                    <img
                        src={project.image}
                        alt={project.title}
                        className="project-slide-media-element"
                    />
                )}
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

            // Adjust Speed (multiplier 0.8 for responsiveness)
            const move = e.deltaY * 0.8;

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

    // Scroll Logic for Hint Fade-out
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });
    const opacity = useTransform(scrollYProgress, [0.9, 1], [1, 0]);

    return (
        <div
            ref={containerRef}
            style={{
                minHeight: '100vh',
                width: '100vw',
                overflowY: 'auto',
                overflowX: 'hidden',
                backgroundColor: '#3b2f2f',
                position: 'relative',
                overflowX: 'hidden', // Prevent incidental horizontal scroll
            }}
        >
            {/* CONTENT CONTAINER - Added padding for Navbar */}
            <div style={{
                maxWidth: '1600px',
                margin: '0 auto',
                padding: '120px 5% 50px 5%',
                boxSizing: 'border-box'
            }}>
                {/* PAGE TITLE */}
                <h1 style={{
                    fontFamily: 'Bigilla',
                    fontSize: 'clamp(4rem, 10vw, 8rem)',
                    color: '#fdfd96',
                    textAlign: 'center',
                    marginBottom: '4rem',
                    lineHeight: 0.9,
                    letterSpacing: '2px',
                    fontWeight: 'normal'
                }}>
                    OUR WORKS
                </h1>

                <div className="work-grid">
                    {projects.map((project, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            onClick={() => {
                                setInitialSlide(index);
                                setModalOpen(true);
                            }}
                            style={{
                                cursor: 'pointer',
                                position: 'relative'
                            }}
                        >
                            {/* STRICT SQUARE IMAGE WRAPPER */}
                            <div style={{
                                width: '100%',
                                aspectRatio: '1/1',
                                overflow: 'hidden',
                                borderRadius: '5px',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                            }}>
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                />
                            </div>

                            {/* PROJECT TITLE */}
                            <div style={{
                                marginTop: '1.5rem',
                                textAlign: 'center',
                                fontFamily: 'var(--font-brand)',
                                color: '#fdfd96',
                            }}>
                                <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>
                                    {project.title}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* FIXED BOTTOM "CLICK TO SEE DETAILS" INDICATOR - Fades out near bottom */}
            <motion.div style={{
                position: 'fixed',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 50,
                color: '#fdfd96',
                fontFamily: 'var(--font-subtitle)',
                fontSize: '1.3rem',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                pointerEvents: 'none',
                opacity: opacity, // Dynamic Opacity
                mixBlendMode: 'difference'
            }}>
                Click to see details
            </motion.div>

            {/* MODAL (Preserved) */}
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
