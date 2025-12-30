import React from 'react';
import { motion } from 'framer-motion';

const projects = [
    { id: 1, title: 'Velvet & Vine', category: 'Brand Identity', color: '#4a3832' },
    { id: 2, title: 'TechNova', category: 'Web Design & Dev', color: '#2c3e50' },
    { id: 3, title: 'Lumina', category: 'Packaging Design', color: '#e67e22' },
    { id: 4, title: 'Urban Pulse', category: 'Social Media Campaign', color: '#e74c3c' },
    { id: 5, title: 'Elevate', category: 'UI/UX Design', color: '#8e44ad' },
    { id: 6, title: 'Pure Earth', category: 'Brand Strategy', color: '#27ae60' },
    { id: 7, title: 'Nebula', category: 'Fintech Platform', color: '#2980b9' },
    { id: 8, title: 'Zenith', category: 'Art Direction', color: '#f1c40f' },
    { id: 9, title: 'Echo', category: 'Motion Graphics', color: '#16a085' },
    { id: 10, title: 'Solstice', category: 'Rebranding', color: '#d35400' },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" }
    }
};

export default function Work() {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0 }}
            variants={containerVariants}
            style={{ paddingTop: '8rem', paddingBottom: '4rem' }}
        >
            <div className="container">
                <motion.h1
                    variants={itemVariants}
                    style={{
                        fontSize: 'clamp(3rem, 8vw, 8rem)',
                        marginBottom: '4rem',
                        color: 'var(--color-electric-blue)'
                    }}
                >
                    Selected Work
                </motion.h1>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '4rem 2rem' }}>
                    {projects.map((project) => (
                        <motion.div
                            key={project.id}
                            variants={itemVariants}
                            whileHover={{ y: -10 }}
                            style={{ cursor: 'pointer' }}
                        >
                            <div
                                className="img-placeholder"
                                style={{
                                    width: '100%',
                                    height: '500px',
                                    borderRadius: '15px',
                                    marginBottom: '1.5rem',
                                    backgroundColor: project.color, // Using distinct colors for visual variety in placeholders
                                    color: '#fff',
                                    fontSize: '2rem',
                                    opacity: 0.8
                                }}
                            >
                                {project.title} Preview
                            </div>
                            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{project.title}</h2>
                            <p className="font-subtitle" style={{ fontSize: '1rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '1px' }}>
                                {project.category}
                            </p>
                        </motion.div>
                    ))}
                </div>

                <motion.div variants={itemVariants} style={{ textAlign: 'center', marginTop: '6rem' }}>
                    <p className="font-subtitle" style={{ marginBottom: '2rem' }}>Want to see more detailed case studies?</p>
                    <button className="btn-primary">Contact Us</button>
                </motion.div>

            </div>
        </motion.div>
    );
}
