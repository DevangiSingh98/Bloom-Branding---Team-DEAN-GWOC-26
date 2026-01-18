import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AnimatedButton from '../components/AnimatedButton';
import { useContent } from '../context/ContentContext';
import EmailServiceSelector from '../components/EmailServiceSelector';

export default function Contact() {
    const { addEnquiry, content } = useContent(); // Destructure content

    const [emailModalOpen, setEmailModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        service: '',
        budget: '',
        timeline: '',
        message: '',
        vibes: [],
        vibeDescription: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const toggleVibe = (vibe) => {
        setFormData(prev => {
            const vibes = prev.vibes.includes(vibe)
                ? prev.vibes.filter(v => v !== vibe)
                : [...prev.vibes, vibe];
            return { ...prev, vibes };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!addEnquiry) {
            alert("Error: Enquiry function not available. Please try again later.");
            return;
        }
        const success = await addEnquiry(formData);
        if (success) {
            alert("Enquiry sent successfully! We'll be in touch.");
            setFormData({
                name: '', email: '', company: '', service: '', budget: '', timeline: '', message: '', vibes: [], vibeDescription: ''
            });
        } else {
            alert("Failed to send enquiry. Please try again or email us directly.");
        }
    };

    // Vibe Keywords ( Dynamic with fallback )
    const VIBES = (content.vibes && content.vibes.length > 0)
        ? content.vibes.map(v => v.label || v)
        : ['Minimalist', 'Bold & Loud', 'Luxury', 'Playful', 'Geometric', 'Organic', 'Tech', 'Vintage', 'Editorial', 'Abstract'];

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ backgroundColor: '#fff', minHeight: '100vh', paddingBottom: '0' }}
            >
                {/* HERO HEADER */}
                <div style={{ paddingTop: '15vh', paddingBottom: '5vh', paddingLeft: '5vw', paddingRight: '5vw' }}>
                    <h1 style={{
                        fontSize: 'clamp(3.5rem, 15vw, 12rem)', // HUGE TYPOGRAPHY
                        fontFamily: 'var(--font-brand)',
                        fontWeight: '900',
                        lineHeight: 0.85,
                        textTransform: 'uppercase',
                        color: 'var(--color-electric-blue)',
                        margin: 0
                    }}>
                        Let's Talk
                    </h1>
                    <h1 style={{
                        fontSize: 'clamp(3.5rem, 15vw, 12rem)',
                        fontFamily: 'var(--font-brand)',
                        fontWeight: '900',
                        lineHeight: 0.85,
                        textTransform: 'uppercase',
                        color: 'var(--color-dark-choc)', // Dark Chocolate
                        margin: 0,
                        textAlign: 'right' // Editorial stagger
                    }}>
                        Business
                    </h1>
                </div>

                <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 5vw' }}>

                    <form onSubmit={handleSubmit} style={{ marginTop: '5rem' }}>

                        {/* 01. THE VIBE */}
                        <section style={{ marginBottom: '8rem' }}>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '2rem', marginBottom: '3rem', borderBottom: '2px solid var(--color-dark-choc)', paddingBottom: '1rem' }}>
                                <span style={{ fontFamily: 'var(--font-brand)', fontSize: '3rem', color: 'var(--color-electric-blue)' }}>01</span>
                                <h2 style={{ fontFamily: 'var(--font-subtitle)', fontSize: '2rem', textTransform: 'uppercase', margin: 0 }}>The Vibe Check</h2>
                            </div>

                            <p style={{ fontSize: '1.2rem', marginBottom: '2rem', fontFamily: 'var(--font-subtitle)' }}>Select keywords that define your vision:</p>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                                {VIBES.map(vibe => (
                                    <motion.button
                                        key={vibe}
                                        type="button"
                                        onClick={() => toggleVibe(vibe)}
                                        whileHover={{ scale: 1.05, backgroundColor: 'var(--color-dark-choc)', color: '#fff' }}
                                        whileTap={{ scale: 0.95 }}
                                        style={{
                                            padding: '0.8rem 2rem',
                                            fontSize: '1.1rem',
                                            textTransform: 'uppercase',
                                            border: '1px solid var(--color-dark-choc)',
                                            backgroundColor: formData.vibes.includes(vibe) ? 'var(--color-electric-blue)' : 'transparent',
                                            color: formData.vibes.includes(vibe) ? '#fff' : 'var(--color-dark-choc)',
                                            borderColor: formData.vibes.includes(vibe) ? 'var(--color-electric-blue)' : 'var(--color-dark-choc)',
                                            borderRadius: '50px',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        {vibe}
                                    </motion.button>
                                ))}
                            </div>

                            <div style={{ marginTop: '3rem' }}>
                                <label style={{ display: 'block', fontSize: '1.5rem', fontFamily: 'var(--font-subtitle)', marginBottom: '1rem', fontWeight: 'bold' }}>
                                    Tell us more about your vibe...
                                </label>
                                <textarea
                                    name="vibeDescription"
                                    value={formData.vibeDescription}
                                    onChange={handleChange}
                                    placeholder="Describe the mood, feeling, or aesthetic you're aiming for..."
                                    rows="3"
                                    style={{
                                        width: '100%',
                                        border: 'none',
                                        borderBottom: '2px solid #ccc',
                                        fontSize: '1.5rem',
                                        padding: '1rem 0',
                                        fontFamily: 'var(--font-subtitle)',
                                        resize: 'none',
                                        outline: 'none',
                                        backgroundColor: 'transparent'
                                    }}
                                />
                            </div>
                        </section>

                        {/* 02. THE BASICS */}
                        <section style={{ marginBottom: '8rem' }}>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '2rem', marginBottom: '3rem', borderBottom: '2px solid var(--color-dark-choc)', paddingBottom: '1rem' }}>
                                <span style={{ fontFamily: 'var(--font-brand)', fontSize: '3rem', color: 'var(--color-electric-blue)' }}>02</span>
                                <h2 style={{ fontFamily: 'var(--font-subtitle)', fontSize: '2rem', textTransform: 'uppercase', margin: 0 }}>The Basics</h2>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem 2rem' }}>
                                <InputGroup label="Name" name="name" value={formData.name} onChange={handleChange} />
                                <InputGroup label="Email" name="email" type="email" value={formData.email} onChange={handleChange} />
                                <InputGroup label="Company / Brand" name="company" value={formData.company} onChange={handleChange} />
                            </div>
                        </section>

                        {/* 03. THE DETAILS */}
                        <section style={{ marginBottom: '8rem' }}>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '2rem', marginBottom: '3rem', borderBottom: '2px solid var(--color-dark-choc)', paddingBottom: '1rem' }}>
                                <span style={{ fontFamily: 'var(--font-brand)', fontSize: '3rem', color: 'var(--color-electric-blue)' }}>03</span>
                                <h2 style={{ fontFamily: 'var(--font-subtitle)', fontSize: '2rem', textTransform: 'uppercase', margin: 0 }}>The Details</h2>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem 2rem' }}>
                                <SelectGroup label="Service" name="service" value={formData.service} onChange={handleChange}
                                    options={['Branding', 'Social Media', 'Production', 'Web Design', 'Strategy', 'Other']} />

                                <SelectGroup label="Budget" name="budget" value={formData.budget} onChange={handleChange}
                                    options={['₹50k - ₹1L', '₹1L - ₹3L', '₹3L - ₹5L', '₹5L+']} />

                                <SelectGroup label="Timeline" name="timeline" value={formData.timeline} onChange={handleChange}
                                    options={['ASAP', '1 Month', '1-3 Months', '3+ Months']} />
                            </div>

                            <div style={{ marginTop: '4rem' }}>
                                <label style={{ display: 'block', fontSize: '1.2rem', fontFamily: 'var(--font-subtitle)', marginBottom: '1rem', color: '#666' }}>
                                    Anything else?
                                </label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Tell us about your project goals..."
                                    rows="2"
                                    style={{
                                        width: '100%',
                                        border: 'none',
                                        borderBottom: '2px solid #ccc',
                                        fontSize: '1.5rem',
                                        padding: '1rem 0',
                                        fontFamily: 'var(--font-subtitle)',
                                        resize: 'none',
                                        outline: 'none',
                                        backgroundColor: 'transparent'
                                    }}
                                />
                            </div>
                        </section>

                        <div style={{ textAlign: 'right', marginBottom: '10rem' }}>
                            <AnimatedButton
                                type="submit"
                                style={{
                                    fontSize: '1.5rem',
                                    padding: '1.5rem 4rem',
                                    backgroundColor: 'var(--color-dark-choc)',
                                    color: '#fff',
                                    borderRadius: '50px' // Rounded corners
                                }}
                            >
                                SUBMIT ENQUIRY
                            </AnimatedButton>
                        </div>

                    </form>

                    {/* COLLAB / MAP SECTION - SIMPLIFIED EDITORIAL */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', paddingBottom: '4rem' }}>

                        {/* ADDRESS */}
                        <div style={{ flex: 1, minWidth: '300px' }}>
                            <h3 style={{ fontFamily: 'var(--font-brand)', fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--color-electric-blue)' }}>VISIT US</h3>
                            <p style={{ fontSize: '1.2rem', lineHeight: 1.6, fontFamily: 'var(--font-subtitle)', marginBottom: '1.5rem' }}>
                                Solarium Business Centre,<br />
                                515, beside Times Corner,<br />
                                Surat, Gujarat 395007<br />
                                <br />
                                Contact: +91 9727068674
                            </p>
                        </div>


                        {/* COLLAB */}
                        <div style={{ flex: 1, minWidth: '300px' }}>
                            <h3 style={{ fontFamily: 'var(--font-brand)', fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--color-electric-blue)' }}>COLLABORATE</h3>
                            <p style={{ fontSize: '1.2rem', lineHeight: 1.6, fontFamily: 'var(--font-subtitle)' }}>
                                Partnerships, press, or just a coffee chat?
                            </p>
                            <button
                                onClick={() => setEmailModalOpen(true)}
                                style={{
                                    marginTop: '1rem',
                                    background: 'none',
                                    border: 'none',
                                    borderBottom: '2px solid var(--color-dark-choc)',
                                    fontSize: '1.2rem',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    paddingBottom: '5px',
                                    fontFamily: 'var(--font-subtitle)'
                                }}
                            >
                                EMAIL US DIRECTLY
                            </button>
                        </div>

                    </div>

                    {/* FULL WIDTH MAP */}
                    <div style={{ width: '100%', height: '500px', borderRadius: '15px', overflow: 'hidden', border: '1px solid #ddd', marginBottom: '4rem' }}>
                        <iframe
                            src="https://maps.google.com/maps?q=Bloom+Branding+Surat&t=&z=17&ie=UTF8&iwloc=&output=embed"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>

                </div>
            </motion.div >



            <EmailServiceSelector
                isOpen={emailModalOpen}
                onClose={() => setEmailModalOpen(false)}
                recipient="hello.bloombranding@gmail.com"
            />
        </>
    );
}

// Micro-Components for cleaner code
const InputGroup = ({ label, name, value, onChange, type = "text" }) => (
    <div>
        <label style={{ display: 'block', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem', color: '#999' }}>{label}</label>
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
                fontSize: '1.5rem',
                padding: '0.5rem 0',
                fontFamily: 'var(--font-subtitle)',
                outline: 'none',
                backgroundColor: 'transparent'
            }}
        />
    </div>
);

const SelectGroup = ({ label, name, value, onChange, options }) => (
    <div>
        <label style={{ display: 'block', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem', color: '#999' }}>{label}</label>
        <select
            name={name}
            value={value}
            onChange={onChange}
            required
            style={{
                width: '100%',
                border: 'none',
                borderBottom: '2px solid var(--color-dark-choc)',
                fontSize: '1.5rem',
                padding: '0.5rem 0',
                fontFamily: 'var(--font-subtitle)',
                outline: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer'
            }}
        >
            <option value="">Select...</option>
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
);
