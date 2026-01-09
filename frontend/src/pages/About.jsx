<<<<<<< HEAD
import React, { useRef } from 'react';
import { useContent } from '../context/ContentContext';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
    const { content } = useContent();
    const founderSectionRef = useRef(null);
    const storyContainerRef = useRef(null);

    useGSAP(() => {
        const container = storyContainerRef.current;
        const track = container.querySelector('.horizontal-track');
        const titleCard = container.querySelector('.title-card');
        const textStream = container.querySelector('.text-stream');

        // Reveal items
        const rightContent = container.querySelector('.right-content-container');
        const storySection = container.querySelector('.story-item');

        // Individual Detail Items
        const visionItem = container.querySelector('.vision-item');
        const valuesItem = container.querySelector('.values-item');
        const approachItem = container.querySelector('.approach-item');

        // Calculate scroll distance to bring Image Section to viewport
        function getScrollDistance() {
            return titleCard.offsetWidth + textStream.offsetWidth;
        }

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: storyContainerRef.current,
                start: "top top",
                end: "+=5000",
                scrub: 5, // Increased viscosity as requested
                pin: true,
                invalidateOnRefresh: true,
            }
        });

        // Phase 1: Horizontal Scroll -> Moves Track Left until Image is flush Left
        tl.to(track, {
            x: () => -getScrollDistance(),
            ease: "power1.inOut", // Smoother easing than linear
            duration: 2 // Increased duration relative to total timeline
        })

            // Phase 2: Reveal "Rooted in Authenticity"
            .fromTo(rightContent,
                { xPercent: -100, opacity: 0 },
                { xPercent: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
            )
            .fromTo(storySection, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.5 }, "<")

            // Phase 3: Story Exit -> Vision Entry
            .to(storySection, { yPercent: -100, opacity: 0, duration: 0.8, ease: "power2.inOut" }, "+=0.2") // Shorter pause
            .fromTo(visionItem,
                { yPercent: 100, opacity: 0 },
                { yPercent: 0, opacity: 1, duration: 0.8, ease: "power2.inOut" },
                "<" // Perfect Overlap
            )

            // Phase 4: Vision Exit -> Values Entry
            // Removed pauses, flowing directly
            .to(visionItem, { yPercent: -100, opacity: 0, duration: 0.8, ease: "power2.inOut" }, ">")
            .fromTo(valuesItem,
                { yPercent: 100, opacity: 0 },
                { yPercent: 0, opacity: 1, duration: 0.8, ease: "power2.inOut" },
                "<"
            )

            // Phase 5: Values Exit -> Approach Entry
            .to(valuesItem, { yPercent: -100, opacity: 0, duration: 0.8, ease: "power2.inOut" }, ">")
            .fromTo(approachItem,
                { yPercent: 100, opacity: 0 },
                { yPercent: 0, opacity: 1, duration: 0.8, ease: "power2.inOut" },
                "<"
            )

            // Hold final state briefly
            .to({}, { duration: 0.5 });

    }, { scope: storyContainerRef });

    const { scrollYProgress } = useScroll({
        target: founderSectionRef,
        offset: ["start end", "end start"]
    });

    const titleY = useTransform(scrollYProgress, [0, 1], [150, -250]);
    const xLeft = useTransform(scrollYProgress, [0.1, 0.4], [80, 0]);
    const xRight = useTransform(scrollYProgress, [0.1, 0.4], [-80, 0]);

    // Reusable style for slideshow items
    const slideItemStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '4rem',
        opacity: 0, // Initially hidden
    };

=======
import React from 'react';
import { motion } from 'framer-motion';

const Section = ({ children, className = "" }) => (
    <section className={`section-padding ${className}`}>
        <div className="container">{children}</div>
    </section>
);

export default function About() {
>>>>>>> 2dfe213 (feat: Add Chatbot component with FAQ support)
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
<<<<<<< HEAD
            style={{ paddingTop: 0 }}
            className="light-section"
        >
            {/* GSAP Storytelling Section */}
            <section ref={storyContainerRef} style={{ height: '100vh', position: 'relative', overflow: 'hidden', backgroundColor: '#fff' }}>

                {/* Horizontal Track */}
                <div
                    className="horizontal-track"
                    style={{
                        display: 'flex',
                        height: '100%',
                        width: 'max-content',
                        alignItems: 'center',
                        willChange: 'transform'
                    }}
                >
                    {/* 1. Title Card */}
                    <div
                        className="title-card"
                        style={{
                            width: '100vw',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                        }}
                    >
                        <h1 style={{
                            fontSize: 'clamp(4rem, 12vw, 12rem)',
                            fontFamily: 'var(--font-brand)',
                            color: 'var(--color-dark-choc)',
                            lineHeight: 0.9,
                            textAlign: 'center',
                            textTransform: 'uppercase'
                        }}>
                            The <br /> Story <br /> of <br /> Bloom
                        </h1>
                    </div>

                    {/* 2. Text Stream */}
                    <div
                        className="text-stream"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            whiteSpace: 'nowrap',
                            padding: '0 5vw',
                            flexShrink: 0
                        }}
                    >
                        <p style={{
                            fontSize: '6rem',
                            fontFamily: 'var(--font-subtitle)',
                            color: 'var(--color-dark-choc)',
                            margin: 0,
                            lineHeight: 1
                        }}>
                            It started with a seed—a belief that brands need to flourish.
                        </p>
                    </div>

                    {/* 3. Image Section (Flush Left) */}
                    <div
                        className="image-section"
                        style={{
                            width: '100vw',
                            height: '100%',
                            position: 'relative',
                            flexShrink: 0,
                            display: 'flex',
                            alignItems: 'center',
                            backgroundColor: '#fff'
                        }}
                    >
                        {/* The Image (Flush Left, Full Height, 50% Width) */}
                        <div
                            style={{
                                width: '50%',
                                height: '100%',
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                zIndex: 20,
                            }}
                        >
                            <img
                                src="/images/bloomingthebrand.png"
                                alt="Blooming"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>

                        {/* Right Content Container (The "Scrollable" Part) */}
                        <div
                            className="right-content-container"
                            style={{
                                width: '50%',
                                height: '100%',
                                position: 'absolute',
                                right: 0,
                                top: 0,
                                zIndex: 10,
                                overflow: 'hidden'
                            }}
                        >
                            {/* 1. Rooted Story (Visible First via Opacity/Transform) */}
                            <div className="story-item" style={{ ...slideItemStyle, opacity: 1 }}>
                                <h2 style={{ fontFamily: 'var(--font-brand)', fontSize: '5rem', marginBottom: '2rem', color: 'var(--color-dark-choc)', lineHeight: 0.9 }}>
                                    Rooted in <br /> Authenticity
                                </h2>
                                <p style={{ fontFamily: 'var(--font-subtitle)', fontSize: '1.5rem', lineHeight: 1.4, color: '#333' }}>
                                    We realized that the most powerful brands, like the strongest trees, have deep roots. Our story is about digging deep to find the unique "seed" of every business—its truth, its passion, its reason for being.
                                </p>
                            </div>

                            {/* 2. Vision */}
                            <div className="vision-item" style={slideItemStyle}>
                                <h3 style={{ fontFamily: 'var(--font-brand)', fontSize: '6rem', color: 'var(--color-electric-blue)', marginBottom: '1rem', lineHeight: 1 }}>VISION</h3>
                                <p style={{ fontFamily: 'var(--font-subtitle)', fontSize: '2rem', lineHeight: 1.4 }}>
                                    To cultivate distinct identities that stand the test of time.
                                </p>
                            </div>

                            {/* 3. Values */}
                            <div className="values-item" style={slideItemStyle}>
                                <h3 style={{ fontFamily: 'var(--font-brand)', fontSize: '6rem', color: 'var(--color-electric-blue)', marginBottom: '1rem', lineHeight: 1 }}>VALUES</h3>
                                <p style={{ fontFamily: 'var(--font-subtitle)', fontSize: '2rem', lineHeight: 1.4 }}>
                                    Authenticity, Growth, and Creative Courage.
                                </p>
                            </div>

                            {/* 4. Creative Approach */}
                            <div className="approach-item" style={slideItemStyle}>
                                <h3 style={{ fontFamily: 'var(--font-brand)', fontSize: '5rem', color: 'var(--color-electric-blue)', marginBottom: '1rem', lineHeight: 0.9 }}>CREATIVE <br /> APPROACH</h3>
                                <p style={{ fontFamily: 'var(--font-subtitle)', fontSize: '2rem', lineHeight: 1.4 }}>
                                    Merging strategy with fluid, artistic expression.
                                </p>
                            </div>

                        </div>

                    </div>
                </div>

            </section>

            {/* Founder Section */}
            <section ref={founderSectionRef} className="section-padding" style={{ backgroundColor: 'var(--color-dark-choc)', paddingBottom: 0, paddingTop: '6rem', position: 'relative', overflow: 'hidden' }}>
                <div className="container" style={{ position: 'relative' }}>

                    <motion.h2
                        style={{
                            y: titleY,
                            fontSize: 'clamp(4rem, 8vw, 8rem)',
                            marginBottom: '-3rem',
                            color: 'var(--color-butter-yellow)',
                            textAlign: 'center',
                            position: 'relative',
                            zIndex: 0
                        }}
                    >
                        Meet the Founders
                    </motion.h2>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '0',
                        alignItems: 'end',
                        position: 'relative',
                        zIndex: 10
                    }}>
                        <motion.div style={{ x: xLeft, textAlign: 'right', alignSelf: 'center', paddingBottom: '4rem', position: 'relative', zIndex: 5 }}>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontFamily: 'var(--font-subtitle)', color: 'var(--color-butter-yellow)' }}>{content.founders.left.name}</h3>
                            <div style={{ color: 'var(--color-butter-yellow)', marginBottom: '1.5rem', fontWeight: 'bold' }}>{content.founders.left.role}</div>
                            <p style={{ marginBottom: '1rem', lineHeight: 1.6, color: 'var(--color-white)' }}>{content.founders.left.bio1}</p>
                            <p style={{ lineHeight: 1.6, color: 'var(--color-white)' }}>{content.founders.left.bio2}</p>
                        </motion.div>

                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '-60px', position: 'relative', zIndex: 20 }}>
                            {content.founders.image ? (
                                <img src={content.founders.image} alt="Founders" style={{ width: '250%', maxWidth: 'none', marginLeft: '0%', height: 'auto', borderRadius: '10px 10px 0 0', display: 'block' }} />
                            ) : (
                                <div className="img-placeholder" style={{ width: '100%', height: '600px', borderRadius: '10px 10px 0 0' }}>Founders Image</div>
                            )}
                        </div>

                        <motion.div style={{ x: xRight, textAlign: 'left', alignSelf: 'center', paddingBottom: '4rem', position: 'relative', zIndex: 5 }}>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontFamily: 'var(--font-subtitle)', color: 'var(--color-butter-yellow)' }}>{content.founders.right.name}</h3>
                            <div style={{ color: 'var(--color-butter-yellow)', marginBottom: '1.5rem', fontWeight: 'bold' }}>{content.founders.right.role}</div>
                            <p style={{ marginBottom: '1rem', lineHeight: 1.6, color: 'var(--color-white)' }}>{content.founders.right.bio1}</p>
                            <p style={{ lineHeight: 1.6, color: 'var(--color-white)' }}>{content.founders.right.bio2}</p>
                        </motion.div>
=======
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
>>>>>>> 2dfe213 (feat: Add Chatbot component with FAQ support)
                    </div>
                </div>
            </section>

<<<<<<< HEAD
            {/* Journey & Philosophy Section */}
            <section className="section-padding" style={{ backgroundColor: '#fff', position: 'relative', zIndex: 10 }}>
                <div className="container">
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        style={{ fontSize: '3.5rem', textAlign: 'center', marginBottom: '5rem', color: 'var(--color-dark-choc)' }}
                    >
                        Our Journey & Philosophy
                    </motion.h2>

                    {/* Row 1: Journey */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', marginBottom: '6rem', alignItems: 'center' }}>
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="img-placeholder"
                            style={{ height: '400px', borderRadius: '10px', overflow: 'hidden' }}
                        >
                            {/* Placeholder for Video/Image */}
                            <div style={{ width: '100%', height: '100%', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
                                Journey Video/Image Placeholder
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h3 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: 'var(--color-electric-blue)' }}>A Path Less Traveled</h3>
                            <p className="font-subtitle" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                                Our journey didn't begin in a boardroom. It started with a passion for art, a curiosity for technology, and a belief that business can be beautiful. We've navigated the evolving digital landscape by staying true to our core: authentic connection. Every project is a stepping stone, every client a partner in our shared story of growth and discovery.
                            </p>
                        </motion.div>
                    </div>

                    {/* Row 2: Philosophy */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            style={{ order: 2 }}
                        >
                            <h3 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: 'var(--color-electric-blue)' }}>Motion & Emotion</h3>
                            <p className="font-subtitle" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                                We don't just design; we move. Motion is at the heart of our philosophy because life doesn't stand still. By integrating fluid animations and dynamic visuals, we breathe life into static brands. We create digital ecosystems where users don't just visit—they feel, interact, and remember.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="img-placeholder"
                            style={{ height: '400px', borderRadius: '10px', overflow: 'hidden', order: 1 }}
                        >
                            {/* Placeholder for Video/Image */}
                            <div style={{ width: '100%', height: '100%', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
                                Philosophy Video/Image Placeholder
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
=======
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
>>>>>>> 2dfe213 (feat: Add Chatbot component with FAQ support)
        </motion.div>
    );
}
