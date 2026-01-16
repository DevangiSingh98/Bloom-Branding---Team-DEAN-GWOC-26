import React from 'react';
import { motion } from 'framer-motion'; // Removed ParallaxContent dependency to avoid import issues if it's complex
import { ArrowUpRight } from 'lucide-react';

const InstagramFeed = ({ instagramItems }) => {
    return (
        <section className="section-padding light-section">
            <div className="container" style={{ textAlign: 'center' }}>
                <a href="https://www.instagram.com/bloom.branding_/?hl=en" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h2 className="insta-title" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                        @bloom.branding_ <ArrowUpRight size={40} strokeWidth={1} />
                    </h2>
                </a>
                <div className="insta-grid">
                    {instagramItems && instagramItems.map((item, index) => (
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
                            className="img-placeholder insta-item"
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
        </section>
    );
};

export default InstagramFeed;
