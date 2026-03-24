import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AnimatedButton from '../components/AnimatedButton';
import { useContent } from '../context/ContentContext';
import EmailServiceSelector from '../components/EmailServiceSelector';
import { Mail, Instagram, MapPin } from 'lucide-react';

export default function Contact() {
    const { addEnquiry, content } = useContent();

    const [emailModalOpen, setEmailModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const success = await addEnquiry(formData);

            if (success) {
                alert("Enquiry sent successfully! We'll be in touch.");
                setFormData({
                    name: '', phone: '', email: '', message: ''
                });
            } else {
                alert("Failed to send enquiry. Please try again or email us directly.");
            }
        } catch (err) {
            console.error(err);
            alert("An unexpected error occurred.");
        }
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ backgroundColor: '#f4f3ea', minHeight: '100vh', display: 'flex', flexDirection: 'column', color: 'var(--color-dark-choc)' }}
            >
                {/* TOP SECTION: CENTERED */}
                <div style={{ textAlign: 'center', paddingTop: '7vh', paddingBottom: '2rem', paddingLeft: '5vw', paddingRight: '5vw' }}>
                    <h1 style={{
                        fontSize: 'clamp(3rem, 6vw, 4.5rem)',
                        fontFamily: 'var(--font-brand)',
                        fontWeight: '900',
                        textTransform: 'uppercase',
                        color: 'var(--color-electric-blue)',
                        margin: 0
                    }}>
                        LET'S COLLABORATE
                    </h1>

                    {/* HORIZONTAL CONTACT INFO */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '3rem',
                        marginTop: '2rem',
                        flexWrap: 'wrap'
                    }}>
                        {/* Email */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ backgroundColor: '#e2e7fa', padding: '0.8rem', borderRadius: '50%', color: 'var(--color-electric-blue)' }}>
                                <Mail size={24} />
                            </div>
                            <div style={{ textAlign: 'left' }}>
                                <h4 style={{ fontFamily: 'var(--font-brand)', fontSize: '1.1rem', color: 'var(--color-dark-choc)', margin: 0 }}>Email Us</h4>
                                <p style={{ fontFamily: 'var(--font-subtitle)', fontSize: '1rem', color: '#666', margin: 0, cursor: 'pointer' }} onClick={() => setEmailModalOpen(true)}>hello@bloombranding.com</p>
                            </div>
                        </div>

                        {/* Follow Us */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ backgroundColor: '#faefe2', padding: '0.8rem', borderRadius: '50%', color: '#d99d30' }}>
                                <Instagram size={24} />
                            </div>
                            <div style={{ textAlign: 'left' }}>
                                <h4 style={{ fontFamily: 'var(--font-brand)', fontSize: '1.1rem', color: 'var(--color-dark-choc)', margin: 0 }}>Follow Us</h4>
                                <p style={{ fontFamily: 'var(--font-subtitle)', fontSize: '1rem', color: '#666', margin: 0 }}>@bloombrandingstudio</p>
                            </div>
                        </div>

                        {/* Location */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ backgroundColor: '#e6effa', padding: '0.8rem', borderRadius: '50%', color: 'var(--color-electric-blue)' }}>
                                <MapPin size={24} />
                            </div>
                            <div style={{ textAlign: 'left' }}>
                                <h4 style={{ fontFamily: 'var(--font-brand)', fontSize: '1.1rem', color: 'var(--color-dark-choc)', margin: 0 }}>Location</h4>
                                <p style={{ fontFamily: 'var(--font-subtitle)', fontSize: '1rem', color: '#666', margin: 0 }}>Bloom Branding Studio</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* BOTTOM SECTION: SPLIT */}
                <div style={{ padding: '0 5vw 2rem 5vw', display: 'flex', flexGrow: 1 }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10%', width: '100%', maxWidth: '1400px', margin: '0 auto' }}>

                        {/* LEFT SIDE: FORM */}
                        <div style={{ width: '100%', maxWidth: '500px', flex: '1 1 400px' }}>
                            <form onSubmit={handleSubmit}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                    <InputGroup label="Full Name" name="name" value={formData.name} onChange={handleChange} />
                                    <InputGroup label="Phone No" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
                                    <InputGroup label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} />

                                    <div style={{ textAlign: 'left' }}>
                                        <label style={{ display: 'block', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.3rem', color: '#666', fontWeight: 'bold' }}>Query / Help Needed</label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            rows="2"
                                            style={{
                                                width: '100%',
                                                border: 'none',
                                                borderBottom: '2px solid var(--color-dark-choc)',
                                                fontSize: '1.2rem',
                                                padding: '0.5rem 0',
                                                fontFamily: 'var(--font-subtitle)',
                                                resize: 'none',
                                                outline: 'none',
                                                backgroundColor: 'transparent'
                                            }}
                                        />
                                    </div>

                                    <div style={{ marginTop: '0.5rem', textAlign: 'left' }}>
                                        <AnimatedButton
                                            type="submit"
                                            style={{
                                                fontSize: '1.1rem',
                                                padding: '0.8rem 2.5rem',
                                                backgroundColor: 'var(--color-dark-choc)',
                                                color: '#fff',
                                                borderRadius: '50px'
                                            }}
                                        >
                                            SUBMIT ENQUIRY
                                        </AnimatedButton>
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* RIGHT SIDE: Let's Talk Business Text */}
                        <div style={{ width: '100%', maxWidth: '500px', flex: '1 1 400px', textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', paddingTop: '1rem' }}>
                            <h2 style={{
                                fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                                fontFamily: 'var(--font-brand)',
                                fontWeight: '900',
                                textTransform: 'uppercase',
                                color: 'var(--color-dark-choc)',
                                margin: 0,
                                lineHeight: 1.1
                            }}>
                                Let's Talk<br />
                                <span style={{ color: 'var(--color-electric-blue)' }}>Business</span>
                            </h2>
                            <p style={{
                                fontSize: '1.1rem',
                                color: '#666',
                                fontFamily: 'var(--font-subtitle)',
                                lineHeight: '1.6',
                                marginTop: '1rem',
                                maxWidth: '350px'
                            }}>
                                Let's collaborate to build an identity that sets you apart and elevates your brand to new heights.
                            </p>
                        </div>

                    </div>
                </div>
            </motion.div >

            <EmailServiceSelector
                isOpen={emailModalOpen}
                onClose={() => setEmailModalOpen(false)}
                recipient="hello@bloombranding.com"
            />
        </>
    );
}

// Micro-Components for cleaner code
const InputGroup = ({ label, name, value, onChange, type = "text" }) => (
    <div style={{ textAlign: 'left' }}>
        <label style={{ display: 'block', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.3rem', color: '#666', fontWeight: 'bold' }}>{label}</label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            required
            style={{
                width: '100%',
                border: 'none',
                borderBottom: '2px solid var(--color-dark-choc)',
                fontSize: '1.2rem',
                padding: '0.5rem 0',
                fontFamily: 'var(--font-subtitle)',
                outline: 'none',
                backgroundColor: 'transparent'
            }}
        />
    </div>
);