import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AnimatedButton from '../components/AnimatedButton';
import { useContent } from '../context/ContentContext';
import EmailServiceSelector from '../components/EmailServiceSelector';

export default function Contact() {
    const { addEnquiry } = useContent();
    const [emailModalOpen, setEmailModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        service: '',
        budget: '',
        timeline: '',
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'message') {
            const words = value.trim().split(/\s+/);
            if (words.length > 200) {
                if (words.length > 200) return;
            }
        }
        setFormData({ ...formData, [name]: value });
    };

    // Calculate current word count for display
    const currentWordCount = formData.message.trim().split(/\s+/).filter(Boolean).length;

    const handleSubmit = (e) => {
        e.preventDefault();

        const newEnquiry = {
            id: Date.now(),
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
            ...formData
        };

        addEnquiry(newEnquiry);
        alert("Thank you for your enquiry! We will bloom together soon.");
        setFormData({ name: '', email: '', company: '', service: '', budget: '', timeline: '', message: '' });
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ paddingTop: '8rem', paddingBottom: '4rem' }}
            >
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h1 style={{ fontSize: 'clamp(3rem, 7vw, 7rem)', color: 'var(--color-electric-blue)', fontFamily: 'var(--font-brand)', lineHeight: 1 }}>Start a Project</h1>
                        <p className="font-subtitle" style={{ fontSize: '1.2rem', marginTop: '1rem', color: '#666' }}>
                            Ready to make your brand bloom? Fill out the form below to get started.
                        </p>
                    </div>

                    {/* PROJECT FORM */}
                    <div style={{ maxWidth: '900px', margin: '0 auto', backgroundColor: 'var(--color-white)', borderRadius: '20px', boxShadow: '0 20px 60px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                        <div style={{ padding: '4rem' }}>
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>

                                {/* Section 1: contact Info */}
                                <div>
                                    <h3 className="font-subtitle" style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--color-dark-choc)', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>01. You & Your Brand</h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <label className="font-subtitle" htmlFor="name" style={{ fontSize: '0.9rem', color: '#888' }}>Name *</label>
                                            <input type="text" name="name" required value={formData.name} onChange={handleChange} style={{ padding: '1rem', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#FCFCFC' }} placeholder="Name" />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <label className="font-subtitle" htmlFor="email" style={{ fontSize: '0.9rem', color: '#888' }}>Email *</label>
                                            <input type="email" name="email" required value={formData.email} onChange={handleChange} style={{ padding: '1rem', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#FCFCFC' }} placeholder="your@email.com" />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: '1 / -1' }}>
                                            <label className="font-subtitle" htmlFor="company" style={{ fontSize: '0.9rem', color: '#888' }}>Company / Brand Name *</label>
                                            <input type="text" name="company" required value={formData.company} onChange={handleChange} style={{ padding: '1rem', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#FCFCFC' }} placeholder="Your Company/brand" />
                                        </div>
                                    </div>
                                </div>

                                {/* Section 2: Project Details */}
                                <div>
                                    <h3 className="font-subtitle" style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--color-dark-choc)', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
                                        02. Project Details <span style={{ fontSize: '0.8rem', color: 'var(--color-electric-blue)', marginLeft: '10px' }}>(Required for understanding)</span>
                                    </h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <label className="font-subtitle" htmlFor="service" style={{ fontSize: '0.9rem', color: '#888' }}>Service of Interest *</label>
                                            <select name="service" required value={formData.service} onChange={handleChange} style={{ padding: '1rem', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#FCFCFC' }}>
                                                <option value="">Select a service...</option>
                                                <option value="Branding">Branding Identity</option>
                                                <option value="Social Media">Social Media Management</option>
                                                <option value="Production">Content Production</option>
                                                <option value="Web Design">Web Design & Dev</option>
                                                <option value="Strategy">Brand Strategy</option>
                                            </select>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <label className="font-subtitle" htmlFor="budget" style={{ fontSize: '0.9rem', color: '#888' }}>Estimated Budget *</label>
                                            <select name="budget" required value={formData.budget} onChange={handleChange} style={{ padding: '1rem', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#FCFCFC' }}>
                                                <option value="">Select a range...</option>
                                                <option value="₹50k - ₹1L">₹50k - ₹1L</option>
                                                <option value="₹1L - ₹3L">₹1L - ₹3L</option>
                                                <option value="₹3L - ₹5L">₹3L - ₹5L</option>
                                                <option value="₹5L+">₹5L+</option>
                                            </select>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: '1 / -1' }}>
                                            <label className="font-subtitle" htmlFor="timeline" style={{ fontSize: '0.9rem', color: '#888' }}>Desired Timeline *</label>
                                            <select name="timeline" required value={formData.timeline} onChange={handleChange} style={{ padding: '1rem', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#FCFCFC' }}>
                                                <option value="">When do you need this launched?</option>
                                                <option value="ASAP">As soon as possible</option>
                                                <option value="1 month">Within 1 month</option>
                                                <option value="1-3 months">1-3 months</option>
                                                <option value="3+ months">3+ months</option>
                                            </select>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: '1 / -1' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <label className="font-subtitle" htmlFor="message" style={{ fontSize: '0.9rem', color: '#888' }}>Tell us about your vision</label>
                                                <span style={{ fontSize: '0.8rem', color: currentWordCount >= 200 ? 'red' : '#aaa' }}>
                                                    {currentWordCount} / 200 words
                                                </span>
                                            </div>
                                            <textarea
                                                name="message"
                                                rows="5"
                                                value={formData.message}
                                                onChange={handleChange}
                                                style={{ padding: '1rem', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#FCFCFC' }}
                                                placeholder="Any specifics we should know? (Max 200 words)"
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>

                                <AnimatedButton type="submit" className="btn-primary" style={{ alignSelf: 'start', marginTop: '1rem', width: '100%', textAlign: 'center' }}>
                                    Submit Project Enquiry
                                </AnimatedButton>

                            </form>
                        </div>
                    </div>

                    {/* COLLABORATIONS CTA */}
                    <div style={{
                        marginTop: '6rem',
                        textAlign: 'center',
                        padding: '4rem 2rem',
                        backgroundColor: '#EADDCD',
                        borderRadius: '20px',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <h2 style={{ fontFamily: 'var(--font-brand)', fontSize: '3.5rem', marginBottom: '1rem', color: '#333' }}>Looking to Collaborate?</h2>
                            <p className="font-subtitle" style={{ fontSize: '1.2rem', color: '#555', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
                                For partnerships, press, podcast features, or just casual coffee chats, we'd love to hear from you directly.
                            </p>
                            <button
                                onClick={() => setEmailModalOpen(true)}
                                style={{
                                    display: 'inline-block',
                                    padding: '1rem 2.5rem',
                                    backgroundColor: '#333',
                                    color: '#fff',
                                    border: 'none',
                                    boxSizing: 'border-box',
                                    cursor: 'pointer',
                                    textDecoration: 'none',
                                    borderRadius: '50px',
                                    fontFamily: 'var(--font-subtitle)',
                                    fontWeight: 'bold',
                                    transition: 'transform 0.2s',
                                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                Email Us Directly
                            </button>
                        </div>
                        {/* Decor */}
                        <div style={{ position: 'absolute', top: -50, left: -50, width: 200, height: 200, backgroundColor: '#fff', borderRadius: '50%', opacity: 0.3 }}></div>
                        <div style={{ position: 'absolute', bottom: -50, right: -50, width: 150, height: 150, backgroundColor: '#fff', borderRadius: '50%', opacity: 0.3 }}></div>
                    </div>

                    {/* GOOGLE MAP & ADDRESS */}
                    <div style={{ marginTop: '6rem' }}>
                        <div style={{ marginBottom: '2rem', textAlign: 'center', fontFamily: 'var(--font-subtitle)' }}>
                            <h4 style={{ fontSize: '2rem', color: 'var(--color-dark-choc)', fontWeight: 'bold', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
                                Visit Our Office
                            </h4>
                            <p style={{ color: '#666', fontSize: '1rem', lineHeight: '1.6' }}>
                                Solarium Business Centre, 515, beside Times Corner<br />
                                Surat, Gujarat 395007
                                <br />
                                <a
                                    href="https://www.google.com/maps/search/?api=1&query=Bloom+Branding,+Solarium+Business+Centre,+515,+Surat"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ color: 'var(--color-electric-blue)', textDecoration: 'underline', fontSize: '0.9rem', marginTop: '10px', display: 'inline-block' }}
                                >
                                    View on Google Maps
                                </a>
                            </p>
                        </div>

                        <div style={{ width: '100%', height: '300px', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', position: 'relative' }}>
                            <iframe
                                title="Office Location"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                loading="lazy"
                                allowFullScreen
                                src="https://maps.google.com/maps?q=Bloom+Branding,+Solarium+Business+Centre,+515,+Surat&z=15&output=embed"
                            ></iframe>
                            {/* Overlay to ensure map style matches branding slightly or just clean look */}
                            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1)' }}></div>
                        </div>
                    </div>

                </div>
            </motion.div>

            <EmailServiceSelector
                isOpen={emailModalOpen}
                onClose={() => setEmailModalOpen(false)}
                recipient="hello.bloombranding@gmail.com"
            />
        </>
    );
}
