import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const AnimatedButton = ({ to, children, className, style, onClick, type = "button" }) => {
    const [hover, setHover] = useState(false);
    const [randomDirs, setRandomDirs] = useState([]);

    const handleEnter = () => {
        setHover(true);
        setRandomDirs([1, 2, 3].map(() => {
            const angle = Math.random() * Math.PI * 2;
            const distance = 80 + Math.random() * 40;
            return {
                x: Math.cos(angle) * distance,
                y: Math.sin(angle) * distance,
                r: (Math.random() - 0.5) * 360
            };
        }));
    };

    return (
        <div style={{ position: 'relative', display: 'inline-block' }} onMouseEnter={handleEnter} onMouseLeave={() => setHover(false)}>
            <div style={{ position: 'absolute', top: '50%', left: '50%', width: 0, height: 0, zIndex: 2, pointerEvents: 'none' }}>
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
                <Link
                    to={to}
                    className={className}
                    style={{ position: 'relative', zIndex: 1, ...style }}
                    onClick={() => window.scrollTo(0, 0)}
                >
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
