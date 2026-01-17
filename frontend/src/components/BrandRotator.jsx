import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BrandRotator = ({ brands }) => {
    const [index, setIndex] = useState(0);
    const BATCH_SIZE = 15;

    useEffect(() => {
        if (!brands || brands.length <= BATCH_SIZE) return;

        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % Math.ceil(brands.length / BATCH_SIZE));
        }, 4000);

        return () => clearInterval(interval);
    }, [brands]);

    const visibleBrands = brands ? brands.slice(index * BATCH_SIZE, (index + 1) * BATCH_SIZE) : [];

    return (
        <div style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AnimatePresence mode="wait">
                <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="brands-grid"
                    style={{ width: '100%' }}
                >
                    {visibleBrands.map((brand, idx) => (
                        <motion.div
                            key={brand.id || (index * BATCH_SIZE + idx)}
                            className="brand-logo-item"
                            whileHover={{ opacity: 1, scale: 1.05 }}
                        >
                            {brand.logo && (
                                <img
                                    src={brand.logo}
                                    alt="Brand Logo"
                                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                />
                            )}
                        </motion.div>
                    ))}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default BrandRotator;
