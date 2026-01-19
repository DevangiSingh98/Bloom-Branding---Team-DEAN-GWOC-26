import React from 'react';
import { useContent } from '../context/ContentContext';
import { motion } from 'framer-motion';

const Brands = () => {
    const { content } = useContent();

    return (
        <div style={{ background: 'linear-gradient(to bottom, var(--color-earl-gray), #d8d6c8)', minHeight: '100vh', paddingTop: '10rem' }}>
            <div className="container">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        color: 'var(--color-dark-choc)',
                        textAlign: 'center',
                        marginBottom: '5rem',
                        fontSize: '8rem',
                        fontFamily: 'Bigilla, serif',
                        letterSpacing: '2px'
                    }}
                >
                    BRANDS WE HAVE BLOOMED
                </motion.h1>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: '6rem',
                    alignItems: 'center',
                    justifyItems: 'center'
                }}>
                    {Array.isArray(content.brandLogos) && content.brandLogos.map((brand, idx) => (
                        <motion.div
                            key={brand._id || idx}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            style={{ width: '220px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                            <img
                                src={brand.logo}
                                alt="Brand Logo"
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    objectFit: 'contain',
                                    // filter: 'brightness(0) invert(1)' // Removed to show original logo colors
                                }}
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Brands;
