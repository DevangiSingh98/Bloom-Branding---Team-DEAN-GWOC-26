import React from 'react';
import { motion } from 'framer-motion';

const Section = ({ children, className = "" }) => (
    <section className={`section-padding ${className}`}>
        <div className="container">{children}</div>
    </section>
);

export default function About() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ paddingTop: '8rem' }}
        >
            <Section>
                <motion.h1
                    initial={{ y: 50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    style={{ fontSize: 'clamp(3rem, 6vw, 6rem)', marginBottom: '3rem', color: 'var(--color-electric-blue)' }}
                >
                    Curating the <br /> Unconventional
                </motion.h1>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'start' }}>
                    <div className="font-subtitle" style={{ fontSize: '1.2rem' }}>
                        <p style={{ marginBottom: '1.5rem' }}>
                            At Bloom Branding, we believe that every brand has a soul waiting to blossom. We are not just a digital agency; we are storytellers, strategists, and creators dedicated to crafting meaningful connections.
                        </p>
                        <p>
                            Our philosophy is rooted in the "Blooming the Brand" concept—taking the core essence of a business and nurturing it through design, strategy, and motion until it flourishes into a market leader.
                        </p>
                    </div>
                    <div className="img-placeholder" style={{ width: '100%', height: '400px', borderRadius: '10px' }}>
                        AGENCY CULTURE IMAGE
                    </div>
                </div>
            </Section>

            {/* Founder Section */}
            <section className="section-padding" style={{ backgroundColor: 'var(--color-white)' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '6rem', alignItems: 'center' }}>
                        <div style={{ order: 2 }}>
                            <div className="img-placeholder" style={{ width: '100%', height: '500px', borderRadius: '200px 200px 0 0' }}>
                                FOUNDER PORTRAIT
                            </div>
                        </div>

                        <div>
                            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--color-electric-blue)' }}>Meet the Founder</h2>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem', fontFamily: 'var(--font-subtitle)' }}>Jane Doe, Creative Director</h3>

                            <p style={{ marginBottom: '1.5rem', lineHeight: 1.8 }}>
                                With over a decade of experience in digital transformation, Jane started Bloom Branding with a singular vision: to bridge the gap between aesthetic beauty and strategic growth.
                            </p>
                            <p style={{ lineHeight: 1.8 }}>
                                "I believe that design is not just about how things look, but how they work and how they make people feel. My goal is to empower brands to stand out in a crowded digital landscape through bold choices and authentic storytelling."
                            </p>

                            <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem' }}>
                                <div className="img-placeholder" style={{ width: '100px', height: '100px', borderRadius: '50%' }}>Motion</div>
                                <div className="img-placeholder" style={{ width: '100px', height: '100px', borderRadius: '50%' }}>Vision</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <Section>
                <h2 style={{ textAlign: 'center', marginBottom: '4rem', fontSize: '2.5rem' }}>Our Values</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', textAlign: 'center' }}>
                    {[
                        { title: 'Boldness', text: 'We take risks to help you stand out.' },
                        { title: 'Empathy', text: 'Understanding your audience is key.' },
                        { title: 'Growth', text: 'Design that drives results.' },
                        { title: 'Transparency', text: 'Clear communication, always.' }
                    ].map((v, i) => (
                        <div key={i} style={{ padding: '2rem', border: '1px solid var(--color-dark-choc)' }}>
                            <h3 style={{ marginBottom: '1rem', color: 'var(--color-electric-blue)' }}>{v.title}</h3>
                            <p className="font-subtitle">{v.text}</p>
                        </div>
                    ))}
                </div>
            </Section>
        </motion.div>
    );
}
