import React from 'react';
import { motion } from 'framer-motion';
import Footer from '../components/Footer';
import AnimatedButton from '../components/AnimatedButton';

const services = [
    {
        id: 'branding',
        title: 'Branding',
        desc: 'Build a brand that commands loyalty.',
        impact: 'We dont just design logos; we craft identities that resonate with your audience.',
        details: ['Brand Identity', 'Strategy', 'Voice & Tone'],
        img: '/images/service_branding.png',
        color: 'var(--color-electric-blue)',
        textColor: '#fff'
    },
    {
        id: 'social-media',
        title: 'Social Media',
        desc: 'Turn followers into a community.',
        impact: 'From strategy to execution, we create content that sparks conversations.',
        details: ['Strategy', 'Management', 'Growth'],
        img: '/images/service_jewellery.png',
        color: 'var(--color-butter-yellow)',
        textColor: '#333'
    },
    {
        id: 'production',
        title: 'Production',
        desc: 'Visuals that stop the scroll.',
        impact: 'High-end photography and videography that captures the essence of your product.',
        details: ['Photography', 'Videography', 'Direction'],
        img: '/images/service_decor.png',
        color: 'var(--color-earl-gray)',
        textColor: '#333'
    },
    {
        id: 'influencer',
        title: 'Influencer Marketing',
        desc: 'Amplify your reach with authentic voices.',
        impact: 'We connect you with influencers who align with your values to create campaigns.',
        details: ['Campaigns', 'Vetting', 'Relations'],
        img: '/images/service_fashion.png',
        color: 'var(--color-electric-blue)',
        textColor: '#fff'
    },
    {
        id: 'creative',
        title: 'Creative Design',
        desc: 'Design that converts visitors into customers.',
        impact: 'Beautiful, functional design solutions for web and print.',
        details: ['Web Design', 'Print', 'Packaging'],
        img: '/images/service_lifestyle.png',
        color: 'var(--color-butter-yellow)',
        textColor: '#333'
    }
];

export default function Services() {
    return (
        <div style={{ width: '100%', backgroundColor: '#f0f0f0', padding: '10vh 0' }}>
            {services.map((service, index) => (
                <div
                    key={service.id}
                    style={{
                        display: 'flex',
                        height: '75vh', // Smaller height (was 90vh)
                        width: '80%',   // Smaller width (was 90%)
                        maxWidth: '1400px',
                        margin: '0 auto 10vh auto',
                        // Remove overflow:hidden to allow overlapping text to pop out if needed, 
                        // but user said "rest on the other surface background" (the card bg).
                        // So overflow:hidden is seemingly fine IF the background refers to the card.
                        position: 'relative',
                        boxShadow: '0 30px 60px rgba(0,0,0,0.1)',
                        backgroundColor: '#fff'
                    }}
                >
                    {/* LEFT SQUARE - Text Content */}
                    <div
                        style={{
                            width: '50%',
                            height: '100%',
                            backgroundColor: service.color,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            padding: '6%',
                            color: service.textColor,
                            position: 'relative',
                            zIndex: 10
                        }}
                    >
                        <h1 style={{
                            fontFamily: 'var(--font-brand)',
                            fontSize: 'clamp(2.5rem, 4vw, 5rem)',
                            lineHeight: 0.9,
                            marginBottom: '1.5rem'
                        }}>
                            {service.title.toUpperCase()}
                        </h1>
                        <p style={{
                            fontFamily: 'var(--font-subtitle)',
                            fontSize: '1rem',
                            lineHeight: 1.5,
                            marginBottom: '2rem',
                            maxWidth: '400px'
                        }}>
                            {service.desc}
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
                            {service.details.map(detail => (
                                <span key={detail} style={{
                                    border: `1px solid ${service.textColor}`,
                                    padding: '0.5rem 1rem',
                                    borderRadius: '50px',
                                    fontSize: '0.8rem'
                                }}>
                                    {detail}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT SQUARE - Image Content & Overlapping Text */}
                    <div
                        style={{
                            width: '50%',
                            height: '100%',
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center', // Center vertically
                            justifyContent: 'center', // Center horizontally
                            backgroundColor: '#fff' // Or a neutral background
                        }}
                    >
                        {/* The Image - 3/4 Size */}
                        <div style={{
                            width: '75%',
                            height: '75%',
                            position: 'relative',
                            zIndex: 1
                        }}>
                            <img
                                src={service.img}
                                alt={service.title}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    display: 'block'
                                }}
                            />
                        </div>

                        {/* Overlapping Text - "Impact" */}
                        {/* "1/4 of the text is on top of the picture and rest on the other surface" */}
                        <div
                            style={{
                                position: 'absolute',
                                bottom: '15%', // Adjusted to overlap bottom of image
                                left: '15%',   // Push in from left
                                width: '60%',  // Restrict width
                                zIndex: 5,     // On top of image
                            }}
                        >
                            <h3 style={{
                                fontFamily: 'var(--font-brand)',
                                fontSize: '2rem',
                                color: service.color, // Use service color for contrast? Or Black?
                                // If image is dark, needs white. If light, needs black. 
                                // User picture implies HIGH CONTRAST big text.
                                // Let's use a mixwire technique: white text on image, colored/black on bg?
                                // CSS mix-blend-mode: difference is cool but maybe too much.
                                // Let's stick to safe White with Shadow or just Color if bg allows.
                                // "rest on the other surface" implies it hangs off.
                                color: 'var(--color-dark-choc)',
                                backgroundColor: '#fff', // Safety background? No, user wants it overlapping.
                                padding: '1rem',
                                // Let's try just plain text for now, maybe add a subtle bg if readability sucks
                            }}>
                                {service.impact ? service.impact.toUpperCase() : "CREATING IMPACT"}
                            </h3>
                        </div>
                    </div>
                </div>
            ))}
            <Footer />
        </div>
    );
}
