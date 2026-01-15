import React from 'react';
import { motion } from 'framer-motion';

const Loading = ({ setLoading }) => {
    React.useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, [setLoading]);

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#fcfbf7', // Warm off-white from reference
            zIndex: 9999
        }}>
            {/* 
                Simple 4-Flower Loading Sequence
                Style: Cute, Flat Daisy Shape (from reference).
                Animation: "Coming one by one" (Sequential Bounce/Fade).
                Colors: Blue, Yellow, Brown, Grey (Brand colors).
            */}
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                {/* Defined the 4 brand colors */}
                {[
                    { color: "#004AAD", center: "#F6F1B5" }, // Blue (Electric)
                    { color: "#F6F1B5", center: "#4B2E26" }, // Yellow (Butter)
                    { color: "#4B2E26", center: "#e8e6d8" }, // Brown (Dark Choc)
                    { color: "#e8e6d8", center: "#004AAD" }  // Grey (Earl Grey)
                ].map((theme, i) => (
                    <motion.div
                        key={i}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{
                            scale: [0, 1.2, 1],
                            opacity: 1
                        }}
                        transition={{
                            duration: 0.6,
                            ease: "backOut",
                            delay: i * 0.2, // "Coming one by one"
                            repeat: Infinity,
                            repeatDelay: 2, // Pause before restarting the sequence
                            repeatType: "reverse" // Disappear one by one too? Or just loop appearance. 
                            // Let's make it loop nicely: Appear 1,2,3,4 -> Pause -> Reset
                        }}
                    >
                        {/* Simple 5-Petal Daisy SVG */}
                        <svg width="50" height="50" viewBox="0 0 100 100">
                            <g transform="translate(50,50)">
                                {[0, 72, 144, 216, 288].map((rot, j) => (
                                    <circle
                                        key={j}
                                        cx="0" cy="-25" r="20"
                                        fill={theme.color}
                                        transform={`rotate(${rot})`}
                                    />
                                ))}
                                <circle cx="0" cy="0" r="20" fill={theme.center} />
                            </g>
                        </svg>
                    </motion.div>
                ))}
            </div>

            <motion.p
                style={{
                    marginTop: '1rem',
                    fontFamily: 'var(--font-subtitle)',
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    color: '#4B2E26',
                    letterSpacing: '3px',
                    opacity: 0.6
                }}
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
            >
                Blooming...
            </motion.p>
        </div>
    );
};

export default Loading;