import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useContent } from "../context/ContentContext";

// --- CONFIGURATION ---
const BG_COLOR = '#e8e6d8';

// Colors from reference
const TEXT_COLORS = [
    '#E63946', // Red
    '#2A9D8F', // Teal
    '#E9C46A', // Yellow/Beige (Matches LIFE'S image)
    '#000000', // Black
    '#004AAD'  // Blue
];

// --- ANIMATION VARIANTS ---
const textContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 0.15, // Watermark
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.0
        }
    },
    exit: { opacity: 0, transition: { duration: 0.3 } }
};

const lineVariants = {
    hidden: { y: '15%' },
    visible: {
        y: '0%',
        transition: { duration: 1.0, ease: [0.16, 1, 0.3, 1] }
    }
};

const imageVariants = {
    hidden: {
        scale: 0.85,
        opacity: 0,
        clipPath: 'inset(18% 18% 18% 18%)'
    },
    visible: {
        scale: 1,
        opacity: 1,
        clipPath: 'inset(0% 0% 0% 0%)',
        transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1] }
    },
    exit: { opacity: 0, scale: 1.05, transition: { duration: 0.5 } }
};

const ProjectPanel = ({ project, index, isActive, onClose }) => {
    // 1. Dusty/Prettier Pastels (Visible on Earl Grey #e8e6d8)
    const PASTEL_TEXT_COLORS = [
        '#D88C9A', // Dusty Rose
        '#82A0AA', // Dusty Blue/Teal
        '#CFA759', // Muted Gold
        '#8E9F85', // Sage Green
        '#9A8C98'  // Muted Purple/Grey
    ];
    const textColor = PASTEL_TEXT_COLORS[index % PASTEL_TEXT_COLORS.length];

    // Handle multiple images with fallback
    const sourceImages = (project.images && project.images.length > 0) ? project.images : [project.image];
    // We need exactly 4 images for the grid slots, repeat if necessary
    const displayImages = [];
    while (displayImages.length < 4) {
        displayImages.push(...sourceImages);
    }
    const images = displayImages.slice(0, 4);

    const title = project.title.toUpperCase();

    return (
        <div className="project-panel">
            <AnimatePresence mode='wait'>
                {isActive && (
                    <>
                        {/* 1. PROJECT INFO (TOP LEFT) - Moved from Title block */}
                        <motion.div
                            key={`info-${index}`}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="project-panel-info"
                        >
                            <h4 style={{
                                fontFamily: '"Lekton", monospace',
                                fontSize: '0.9rem',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                marginBottom: '0.8rem',
                                color: '#333'
                            }}>
                                {project.category || 'Featured'}
                            </h4>
                            <p style={{ fontFamily: '"Lekton", monospace', fontSize: '0.85rem', lineHeight: '1.1', marginBottom: '1rem', color: '#555' }}>
                                {project.description?.substring(0, 100)}...
                            </p>


                        </motion.div>

                        {/* 2. CENTERED OVERLAPPING TITLE */}
                        <motion.div
                            key={`title-${index}`}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="project-panel-title-container"
                        >
                            <h2 className="project-panel-title" style={{ color: textColor }}>
                                {title}
                            </h2>
                        </motion.div>

                        {/* 3. SCATTERED IMAGES */}

                        {/* Img 1: BOTTOM LEFT (Requested Position) */}
                        <motion.div
                            variants={imageVariants}
                            initial="hidden" animate="visible" exit="exit"
                            className="project-panel-img-1"
                        >
                            <img src={images[0]} alt="1" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.onerror = null; e.target.src = project.image; }} />
                        </motion.div>

                        {/* Img 2: TOP RIGHT (Balancing) */}
                        <motion.div
                            variants={imageVariants}
                            initial="hidden" animate="visible" exit="exit"
                            className="project-panel-img-2"
                        >
                            <img src={images[1]} alt="2" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.onerror = null; e.target.src = project.image; }} />
                        </motion.div>

                        {/* Img 3: CENTER BOTTOM (Under Title) */}
                        <motion.div
                            variants={imageVariants}
                            initial="hidden" animate="visible" exit="exit"
                            className="project-panel-img-3"
                        >
                            <img src={images[2]} alt="3" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.onerror = null; e.target.src = project.image; }} />
                        </motion.div>

                        {/* Img 4: FAR RIGHT VERTICAL (Optional Anchor) */}
                        <motion.div
                            variants={imageVariants}
                            initial="hidden" animate="visible" exit="exit"
                            className="project-panel-img-4"
                        >
                            <img src={images[3]} alt="4" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.onerror = null; e.target.src = project.image; }} />
                        </motion.div>

                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

// --- MODAL COMPONENT ---
const WorkModal = ({ projects, initialIndex, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [isAnimating, setIsAnimating] = useState(false);
    const wheelAccumulator = useRef(0);
    const WHEEL_THRESHOLD = 40;

    // Slide Switching Logic
    useEffect(() => {
        const handleWheel = (e) => {
            if (isAnimating) return;
            const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
            wheelAccumulator.current += delta;

            if (wheelAccumulator.current > WHEEL_THRESHOLD) {
                if (currentIndex < projects.length - 1) {
                    navigate(currentIndex + 1);
                }
                wheelAccumulator.current = 0;
            } else if (wheelAccumulator.current < -WHEEL_THRESHOLD) {
                if (currentIndex > 0) {
                    navigate(currentIndex - 1);
                }
                wheelAccumulator.current = 0;
            }
        };

        const navigate = (newIndex) => {
            setIsAnimating(true);
            setCurrentIndex(newIndex);
            setTimeout(() => setIsAnimating(false), 1200);
        };

        window.addEventListener('wheel', handleWheel);
        return () => window.removeEventListener('wheel', handleWheel);
    }, [currentIndex, isAnimating, projects.length]);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
                position: 'fixed',
                top: 0, left: 0, width: '100vw', height: '100vh',
                backgroundColor: BG_COLOR,
                zIndex: 9999,
                overflow: 'hidden'
            }}
        >
            <button
                onClick={onClose}
                style={{
                    position: 'absolute', top: '2rem', right: '2rem', zIndex: 10000,
                    cursor: 'pointer', padding: '0.8rem', backgroundColor: 'rgba(255,255,255,0.8)',
                    border: '1px solid black', borderRadius: '50%',
                    width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'black', fontSize: '1.2rem', backdropFilter: 'blur(5px)'
                }}
            >
                ✕
            </button>

            {/* TRACK */}
            <motion.div
                animate={{ x: `-${currentIndex * 100}vw` }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                style={{
                    display: 'flex',
                    width: `${projects.length * 100}vw`,
                    height: '100vh',
                    willChange: 'transform'
                }}
            >
                {projects.map((project, index) => (
                    <ProjectPanel
                        key={index}
                        project={project}
                        index={index}
                        isActive={index === currentIndex}
                        onClose={onClose}
                    />
                ))}
            </motion.div>
        </motion.div>
    );
};

export default function Work() {
    const { content } = useContent();
    const projects = content.allProjects || [];
    const [modalOpen, setModalOpen] = useState(false);
    const [initialSlide, setInitialSlide] = useState(0);

    const titleContainerVariants = { hidden: { scale: 1.4, y: 0 }, visible: { scale: 1, y: '-32vh', transition: { delay: 0.5, duration: 1.2, ease: [0.16, 1, 0.3, 1] } } };
    const letterVariants = { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8 } } };

    return (
        <div style={{ minHeight: '100vh', width: '100vw', backgroundColor: BG_COLOR, position: 'relative' }}>
            <div style={{ height: '100vh', position: 'absolute', top: 0, left: 0, width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 30, pointerEvents: 'none' }}>
                <motion.div initial="hidden" animate="visible" variants={titleContainerVariants}>
                    <h1 style={{ fontFamily: '"Bigilla", serif', fontSize: 'clamp(3rem, 12vw, 10rem)', marginTop: '80px', color: '#4B2E26', display: 'flex', gap: '0.5rem', fontWeight: 700 }}>
                        {"OUR WORKS".split("").map((char, i) => (<motion.span key={i} variants={letterVariants}>{char}</motion.span>))}
                    </h1>
                </motion.div>
            </div>
            <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 1.2 }} style={{ position: 'relative', zIndex: 20, paddingTop: '35vh', paddingBottom: '100px' }}>
                <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '0 5%' }}>
                    <div className="work-grid">
                        {projects.map((project, index) => (
                            <motion.div key={index} whileHover={{ scale: 1.02 }} onClick={() => { setInitialSlide(index); setModalOpen(true); }} className="work-grid-item">
                                <div className="work-grid-item-image-wrapper">
                                    <img src={project.image} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <h3 className="work-grid-item-title">{project.title}</h3>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>
            <AnimatePresence>
                {modalOpen && (<WorkModal projects={projects} initialIndex={initialSlide} onClose={() => setModalOpen(false)} />)}
            </AnimatePresence>
        </div>
    );
}
