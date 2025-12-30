import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AnimatedButton from '../components/AnimatedButton';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        service: '',
        message: ''
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Thank you for your enquiry! We will bloom together soon.");
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ paddingTop: '8rem', paddingBottom: '4rem' }}
        >
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h1 style={{ fontSize: 'clamp(3rem, 7vw, 7rem)', color: 'var(--color-electric-blue)' }}>Start a Project</h1>
                    <p className="font-subtitle" style={{ fontSize: '1.2rem', marginTop: '1rem' }}>
                        Ready to make your brand bloom? Tell us about your vision.
                    </p>
                </div>

                <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'var(--color-white)', padding: '4rem', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label className="font-subtitle" htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    onChange={handleChange}
                                    style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '10px' }}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label className="font-subtitle" htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    onChange={handleChange}
                                    style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '10px' }}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label className="font-subtitle" htmlFor="service">Interested Service</label>
                            <select
                                name="service"
                                onChange={handleChange}
                                style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '10px', backgroundColor: '#fff' }}
                            >
                                <option value="">Select a service...</option>
                                <option value="strategy">Brand Strategy</option>
                                <option value="content">Content Creation</option>
                                <option value="web">Web & Digital</option>
                                <option value="social">Social Media</option>
                            </select>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label className="font-subtitle" htmlFor="message">Tell us about your project</label>
                            <textarea
                                name="message"
                                rows="5"
                                onChange={handleChange}
                                style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '10px' }}
                            ></textarea>
                        </div>

                        <AnimatedButton type="submit" className="btn-primary" style={{ alignSelf: 'start', marginTop: '1rem' }}>
                            Send Enquiry
                        </AnimatedButton>

                    </form>
                </div>
            </div>
        </motion.div>
    );
}
