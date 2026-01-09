import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const AnimatedButton = ({ to, children, className, style, onClick, type = "button" }) => {
    const [hover, setHover] = useState(false);
    const [randomDirs, setRandomDirs] = useState([]);

    const handleEnter = () => {
        setHover(true);
<<<<<<< HEAD
        setRandomDirs([1, 2, 3].map(() => {
            const angle = Math.random() * Math.PI * 2;
            const distance = 40 + Math.random() * 20;
            return {
                x: Math.cos(angle) * distance,
                y: Math.sin(angle) * distance,
                r: (Math.random() - 0.5) * 360
            };
        }));
=======
        setRandomDirs([1, 2, 3].map(() => ({
            x: (Math.random() - 0.5) * 250,
            y: (Math.random() - 0.5) * 150,
            r: (Math.random() - 0.5) * 360
        })));
>>>>>>> 2dfe213 (feat: Add Chatbot component with FAQ support)
    };

    return (
        <div style={{ position: 'relative', display: 'inline-block' }} onMouseEnter={handleEnter} onMouseLeave={() => setHover(false)}>
<<<<<<< HEAD
            <div style={{ position: 'absolute', top: '50%', left: '50%', width: 0, height: 0, zIndex: 2, pointerEvents: 'none' }}>
=======
            <div style={{ position: 'absolute', top: '50%', left: '50%', width: 0, height: 0, zIndex: 0, pointerEvents: 'none' }}>
>>>>>>> 2dfe213 (feat: Add Chatbot component with FAQ support)
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
            {to ? (
<<<<<<< HEAD
                <Link
                    to={to}
                    className={className}
                    style={{ position: 'relative', zIndex: 1, ...style }}
                    onClick={() => window.scrollTo(0, 0)}
                >
=======
                <Link to={to} className={className} style={{ position: 'relative', zIndex: 1, ...style }}>
>>>>>>> 2dfe213 (feat: Add Chatbot component with FAQ support)
                    {children}
                </Link>
            ) : (
                <button type={type} onClick={onClick} className={className} style={{ position: 'relative', zIndex: 1, ...style }}>
                    {children}
                </button>
            )}
        </div>
    );
};

export default AnimatedButton;
