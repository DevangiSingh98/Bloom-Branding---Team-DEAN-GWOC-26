import React from 'react';
import { useContent } from '../context/ContentContext';
import { motion } from 'framer-motion';
import ParallaxContent from '../components/ParallaxContent';

const Section = ({ children, className = "" }) => (
    <section className={`section-padding ${className}`}>
        <div className="container">{children}</div>
    </section>
);

export default function About() {
    const { content } = useContent();
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ paddingTop: '8rem' }}
            className="light-section"
        >
            <Section>
                <ParallaxContent>
                    <motion.h1
                        initial={{ y: 50, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        style={{ fontSize: 'clamp(3rem, 6vw, 6rem)', marginBottom: '3rem', color: 'var(--color-electric-blue)', paddingTop: '10px' }}
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
                        <div className="img-placeholder" style={{ width: '100%', height: '400px', borderRadius: '10px', overflow: 'hidden' }}>
                            <img src="/images/bloomingthebrand.png" alt="Agency Culture" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                    </div>
                </ParallaxContent>
            </Section>

            {/* Founder Section */}
            <section className="section-padding" style={{ backgroundColor: 'var(--color-white)', paddingBottom: 0, paddingTop: '4rem', position: 'relative', zIndex: 1 }}>
                <div className="container">
                    <ParallaxContent>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '6rem', alignItems: 'end' }}>
                            <div style={{ order: 2 }}>
                                {/* Use Parallax wrapper directly instead of one-time motion */}
                                <div>
                                    {/* <ParallaxContent offset={50}> */}
                                    {content.founder.image ? (
                                        <img src={content.founder.image} alt={content.founder.name} style={{ width: '100%', height: '500px', objectFit: 'cover', objectPosition: 'top center', borderRadius: '200px 200px 0 0', display: 'block' }} />
                                    ) : (
                                        <div className="img-placeholder" style={{ width: '100%', height: '500px', borderRadius: '200px 200px 0 0' }}>
                                            FOUNDER PORTRAIT
                                        </div>
                                    )}
                                    {/* </ParallaxContent> */}
                                </div>
                            </div>

                            <div style={{ alignSelf: 'center', paddingBottom: '4rem' }}> {/* Lift text up and add some bottom padding to balance */}
                                <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--color-electric-blue)' }}>Meet the Founders</h2>
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem', fontFamily: 'var(--font-subtitle)' }}>{content.founder.name}, {content.founder.role}</h3>

                                <p style={{ marginBottom: '1.5rem', lineHeight: 1.8 }}>
                                    {content.founder.bio1}
                                </p>
                                <p style={{ lineHeight: 1.8 }}>
                                    {content.founder.bio2}
                                </p>

                                <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem' }}>
                                    <div className="img-placeholder" style={{ width: '100px', height: '100px', borderRadius: '50%' }}>Motion</div>
                                    <div className="img-placeholder" style={{ width: '100px', height: '100px', borderRadius: '50%' }}>Vision</div>
                                </div>
                            </div>
                        </div>
                    </ParallaxContent>
                </div>
            </section>

            {/* Values */}
            <section className="section-padding" style={{ position: 'relative', zIndex: 10, backgroundColor: '#e8e6d8' }}>
                <div className="container">
                    <ParallaxContent>
                        <h2 style={{ textAlign: 'center', marginBottom: '4rem', fontSize: '2.5rem' }}>Our Values</h2>
                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem', textAlign: 'center' }}>
                            {content.values.map((v) => (
                                <div key={v.id} style={{ padding: '2rem', border: '1px solid var(--color-dark-choc)', flex: '1 1 250px', maxWidth: '300px' }}>
                                    <h3 style={{ marginBottom: '1rem', color: 'var(--color-electric-blue)' }}>{v.title}</h3>
                                    <p className="font-subtitle">{v.text}</p>
                                </div>
                            ))}
                        </div>
                    </ParallaxContent>
                </div>
            </section>
        </motion.div>
    );
}
