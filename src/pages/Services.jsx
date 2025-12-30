import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

export default function Services() {
    const { hash } = useLocation();

    useEffect(() => {
        if (hash) {
            const element = document.getElementById(hash.replace('#', ''));
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            }
        } else {
            window.scrollTo(0, 0);
        }
    }, [hash]);

    const services = [
        { title: 'Brand Strategy', desc: 'We build the blueprint for your brand’s future.', details: ['Market Research', 'Brand Positioning', 'Visual Identity System', 'Voice & Tone Handbooks'] },
        { title: 'Content Creation', desc: 'Storytelling that captures attention and drives action.', details: ['Photography & Art Direction', 'Video Production', 'Copywriting', 'Social First Content'] },
        { title: 'Web & Digital', desc: 'Immersive digital experiences that convert.', details: ['UI/UX Design', 'Frontend Development', 'Motion Graphics', 'E-commerce Solutions'] },
        { title: 'Social Media', desc: 'Building communities around your brand.', details: ['Social Strategy', ' influencer Management', 'Community Management', 'Organic Growth'] },
        { title: 'Production', desc: 'Bringing your vision to life through high-end production.', details: ['Commercial Video', 'Product Photography', 'Set Design', 'Post-Production'] }
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ paddingTop: '8rem' }}
        >
            <section className="section-padding" style={{ textAlign: 'center' }}>
                <h1 style={{ fontSize: 'clamp(3rem, 8vw, 8rem)', color: 'var(--color-electric-blue)' }}>Our Services</h1>
                <p className="font-subtitle" style={{ maxWidth: '600px', margin: '2rem auto', fontSize: '1.2rem' }}>
                    We provide a holistic suite of services designed to take your brand from seed to bloom.
                </p>
            </section>

            <div className="container">
                {services.map((service, index) => (
                    <motion.div
                        key={index}
                        id={service.title.toLowerCase().replace(/\s+/g, '-')}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ margin: "-100px" }}
                        style={{
                            marginBottom: '4rem',
                            padding: '4rem',
                            backgroundColor: index % 2 === 0 ? 'var(--color-white)' : 'transparent',
                            borderRadius: '20px',
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '4rem',
                            alignItems: 'center',
                            scrollMarginTop: '100px' // Add scroll margin for sticky header offset
                        }}
                    >
                        <div style={{ flex: 1, minWidth: '300px' }}>
                            <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem', color: 'var(--color-electric-blue)' }}>{service.title}</h2>
                            <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>{service.desc}</p>
                            <ul className="font-subtitle" style={{ listStyle: 'none' }}>
                                {service.details.map((d, i) => (
                                    <li key={i} style={{ padding: '0.5rem 0', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>{d}</li>
                                ))}
                            </ul>
                        </div>

                        <div style={{ flex: 1, minWidth: '300px' }}>
                            <div className="img-placeholder" style={{ width: '100%', height: '400px', borderRadius: '15px', backgroundColor: 'var(--color-earl-gray)', border: '2px solid var(--color-dark-choc)' }}>
                                {service.title} Illustration
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
