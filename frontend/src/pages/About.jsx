import React, { useRef } from 'react';
import { useContent } from '../context/ContentContext';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Footer from '../components/Footer';

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

        const rightContent = container.querySelector('.right-content-container');
        const storySection = container.querySelector('.story-item');
        const visionItem = container.querySelector('.vision-item');
        const valuesItem = container.querySelector('.values-item');
        const approachItem = container.querySelector('.approach-item');

        function getScrollDistance() {
            return titleCard.offsetWidth + textStream.offsetWidth;
        }

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: storyContainerRef.current,
                start: "top top",
                end: "+=5000",
                scrub: 5,
                pin: true,
                invalidateOnRefresh: true,
            }
        });

        tl.to(track, {
            x: () => -getScrollDistance(),
            ease: "power1.inOut",
            duration: 2
        })
            .fromTo(rightContent,
                { xPercent: -100, opacity: 0 },
                { xPercent: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
            )
            .fromTo(storySection, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.5 }, "<")
            .to(storySection, { yPercent: -100, opacity: 0, duration: 0.8, ease: "power2.inOut" }, "+=0.2")
            .fromTo(visionItem,
                { yPercent: 100, opacity: 0 },
                { yPercent: 0, opacity: 1, duration: 0.8, ease: "power2.inOut" },
                "<"
            )
            .to(visionItem, { yPercent: -100, opacity: 0, duration: 0.8, ease: "power2.inOut" }, ">")
            .fromTo(valuesItem,
                { yPercent: 100, opacity: 0 },
                { yPercent: 0, opacity: 1, duration: 0.8, ease: "power2.inOut" },
                "<"
            )
            .to(valuesItem, { yPercent: -100, opacity: 0, duration: 0.8, ease: "power2.inOut" }, ">")
            .fromTo(approachItem,
                { yPercent: 100, opacity: 0 },
                { yPercent: 0, opacity: 1, duration: 0.8, ease: "power2.inOut" },
                "<"
            )
            .to({}, { duration: 0.5 });

    }, { scope: storyContainerRef });

    const { scrollYProgress } = useScroll({
        target: founderSectionRef,
        offset: ["start end", "end start"]
    });

    const titleY = useTransform(scrollYProgress, [0, 1], [150, -250]);
    const xLeft = useTransform(scrollYProgress, [0.1, 0.4], [80, 0]);
    const xRight = useTransform(scrollYProgress, [0.1, 0.4], [-80, 0]);

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
        opacity: 0,
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ paddingTop: 0 }}
            className="light-section"
        >
            <section ref={storyContainerRef} style={{ height: '100vh', position: 'relative', overflow: 'hidden', backgroundColor: '#fff' }}>
                <div className="horizontal-track" style={{ display: 'flex', height: '100%', width: 'max-content', alignItems: 'center', willChange: 'transform' }}>
                    <div className="title-card" style={{ width: '100vw', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <h1 style={{ fontSize: 'clamp(4rem, 12vw, 12rem)', fontFamily: 'var(--font-brand)', color: 'var(--color-dark-choc)', lineHeight: 0.9, textAlign: 'center', textTransform: 'uppercase' }}>
                            The <br /> Story <br /> of <br /> Bloom
                        </h1>
                    </div>

                    <div className="text-stream" style={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', padding: '0 5vw', flexShrink: 0 }}>
                        <p style={{ fontSize: '6rem', fontFamily: 'var(--font-subtitle)', color: 'var(--color-dark-choc)', margin: 0, lineHeight: 1 }}>
                            It started with a seed—a belief that brands need to flourish.
                        </p>
                    </div>

                    <div className="image-section" style={{ width: '100vw', height: '100%', position: 'relative', flexShrink: 0, display: 'flex', alignItems: 'center', backgroundColor: '#fff' }}>
                        <div style={{ width: '50%', height: '100%', position: 'absolute', left: 0, top: 0, zIndex: 20 }}>
                            <img src="/images/bloomingthebrand.png" alt="Blooming" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>

                        <div className="right-content-container" style={{ width: '50%', height: '100%', position: 'absolute', right: 0, top: 0, zIndex: 10, overflow: 'hidden' }}>
                            <div className="story-item" style={{ ...slideItemStyle, opacity: 1 }}>
                                <h2 style={{ fontFamily: 'var(--font-brand)', fontSize: '5rem', marginBottom: '2rem', color: 'var(--color-dark-choc)', lineHeight: 0.9 }}>
                                    Rooted in <br /> Authenticity
                                </h2>
                                <p style={{ fontFamily: 'var(--font-subtitle)', fontSize: '1.5rem', lineHeight: 1.4, color: '#333' }}>
                                    We realized that the most powerful brands, like the strongest trees, have deep roots. Our story is about digging deep to find the unique "seed" of every business—its truth, its passion, its reason for being.
                                </p>
                            </div>

                            <div className="vision-item" style={slideItemStyle}>
                                <h3 style={{ fontFamily: 'var(--font-brand)', fontSize: '6rem', color: 'var(--color-electric-blue)', marginBottom: '1rem', lineHeight: 1 }}>VISION</h3>
                                <p style={{ fontFamily: 'var(--font-subtitle)', fontSize: '2rem', lineHeight: 1.4 }}>
                                    To cultivate distinct identities that stand the test of time.
                                </p>
                            </div>

                            <div className="values-item" style={slideItemStyle}>
                                <h3 style={{ fontFamily: 'var(--font-brand)', fontSize: '6rem', color: 'var(--color-electric-blue)', marginBottom: '1rem', lineHeight: 1 }}>VALUES</h3>
                                <p style={{ fontFamily: 'var(--font-subtitle)', fontSize: '2rem', lineHeight: 1.4 }}>
                                    Authenticity, Growth, and Creative Courage.
                                </p>
                            </div>

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

            <section ref={founderSectionRef} className="section-padding" style={{ backgroundColor: 'var(--color-dark-choc)', paddingBottom: 0, paddingTop: '6rem', position: 'relative', overflow: 'hidden' }}>
                <div className="container" style={{ position: 'relative' }}>
                    <motion.h2 style={{ y: titleY, fontSize: 'clamp(4rem, 8vw, 8rem)', marginBottom: '-3rem', color: 'var(--color-butter-yellow)', textAlign: 'center', position: 'relative', zIndex: 0 }}>
                        Meet the Founders
                    </motion.h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0', alignItems: 'end', position: 'relative', zIndex: 10 }}>
                        <motion.div style={{ x: xLeft, textAlign: 'right', alignSelf: 'center', paddingBottom: '4rem', position: 'relative', zIndex: 5 }}>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontFamily: 'var(--font-subtitle)', color: 'var(--color-butter-yellow)' }}>{content.founders.left.name}</h3>
                            <div style={{ color: 'var(--color-butter-yellow)', marginBottom: '1.5rem', fontWeight: 'bold' }}>{content.founders.left.role}</div>
                            <p style={{ marginBottom: '1rem', lineHeight: 1.6, color: 'var(--color-white)' }}>{content.founders.left.bio1}</p>
                            <p style={{ lineHeight: 1.6, color: 'var(--color-white)' }}>{content.founders.left.bio2}</p>
                        </motion.div>

                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '-60px', position: 'relative', zIndex: 20 }}>
                            <img src={content.founders.image} alt="Founders" style={{ width: '250%', maxWidth: 'none', marginLeft: '0%', height: 'auto', borderRadius: '10px 10px 0 0', display: 'block' }} />
                        </div>

                        <motion.div style={{ x: xRight, textAlign: 'left', alignSelf: 'center', paddingBottom: '4rem', position: 'relative', zIndex: 5 }}>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontFamily: 'var(--font-subtitle)', color: 'var(--color-butter-yellow)' }}>{content.founders.right.name}</h3>
                            <div style={{ color: 'var(--color-butter-yellow)', marginBottom: '1.5rem', fontWeight: 'bold' }}>{content.founders.right.role}</div>
                            <p style={{ marginBottom: '1rem', lineHeight: 1.6, color: 'var(--color-white)' }}>{content.founders.right.bio1}</p>
                            <p style={{ lineHeight: 1.6, color: 'var(--color-white)' }}>{content.founders.right.bio2}</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* JOURNEY & PHILOSOPHY ARCHED PORTALS */}
            <section style={{ backgroundColor: '#fff', padding: '150px 5%', overflow: 'hidden' }}>
                <div className="container">
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                        gap: '20px',
                        alignItems: 'start'
                    }}>
                        {/* ARCH 1: OUR JOURNEY */}
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            style={{
                                backgroundColor: 'transparent',
                                borderRadius: '500px 500px 0 0',
                                padding: '120px 40px 60px',
                                border: '2.5px solid var(--color-dark-choc)',
                                color: 'var(--color-dark-choc)',
                                display: 'flex',
                                flexDirection: 'column',
                                height: '700px',
                                position: 'relative'
                            }}
                        >
                            {/* Decorative Star */}
                            <div style={{ position: 'absolute', top: '40px', left: '50%', transform: 'translateX(-50%)', color: 'var(--color-dark-choc)' }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                                </svg>
                            </div>

                            <h3 style={{
                                fontFamily: 'var(--font-brand)',
                                fontSize: '3.5rem',
                                textAlign: 'center',
                                marginBottom: '2rem',
                                lineHeight: 1.1,
                                letterSpacing: '1px'
                            }}>
                                OUR <br /> JOURNEY
                            </h3>

                            <p style={{
                                fontFamily: 'var(--font-subtitle)',
                                fontSize: '1.5rem',
                                fontWeight: 'bold',
                                lineHeight: 1.6,
                                textAlign: 'center',
                                marginTop: 'auto',
                                marginBottom: 'auto',
                                padding: '0 20px'
                            }}>
                                OUR JOURNEY DIDN'T BEGIN IN A BOARDROOM. IT STARTED WITH A PASSION FOR ART, A CURIOSITY FOR TECHNOLOGY, AND A BELIEF THAT BUSINESS CAN BE BEAUTIFUL. WE'VE NAVIGATED THE EVOLVING DIGITAL LANDSCAPE BY STAYING TRUE TO OUR CORE: AUTHENTIC CONNECTION.
                            </p>
                        </motion.div>

                        {/* ARCH 2: PHILOSOPHY */}
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            style={{
                                backgroundColor: 'transparent',
                                borderRadius: '500px 500px 0 0',
                                padding: '120px 40px 60px',
                                border: '2.5px solid var(--color-dark-choc)',
                                color: 'var(--color-dark-choc)',
                                display: 'flex',
                                flexDirection: 'column',
                                height: '700px',
                                position: 'relative'
                            }}
                        >
                            {/* Decorative Star */}
                            <div style={{ position: 'absolute', top: '40px', left: '50%', transform: 'translateX(-50%)', color: 'var(--color-dark-choc)' }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                                </svg>
                            </div>

                            <h3 style={{
                                fontFamily: 'var(--font-brand)',
                                fontSize: '3.5rem',
                                textAlign: 'center',
                                marginBottom: '2rem',
                                lineHeight: 1.1,
                                letterSpacing: '1px'
                            }}>
                                OUR <br /> PHILOSOPHY
                            </h3>

                            <p style={{
                                fontFamily: 'var(--font-subtitle)',
                                fontSize: '1.5rem',
                                fontWeight: 'bold',
                                lineHeight: 1.4,
                                textAlign: 'center',
                                marginTop: 'auto',
                                marginBottom: 'auto',
                                padding: '0 20px'
                            }}>
                                MOTION IS AT THE HEART OF OUR PHILOSOPHY BECAUSE LIFE DOESN'T STAND STILL. BY INTEGRATING FLUID ANIMATIONS AND DYNAMIC VISUALS, WE BREATHE LIFE INTO STATIC BRANDS. WE CREATE DIGITAL ECOSYSTEMS WHERE USERS DON'T JUST VISIT—THEY FEEL, INTERACT, AND REMEMBER.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>
            <Footer />
        </motion.div>
    );
}
