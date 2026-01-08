import React, { createContext, useContext, useState, useEffect } from 'react';

const ContentContext = createContext();

const defaultContent = {
    hero: {
        subtitle: "Bringing synergy of aesthetics and expertise to help your brand bloom."
    },
    selectedWork: [
        { id: 1, title: "Modern Aesthetics", category: "Branding / Web Design", image: "/images/selected_work_1.jpg" },
        { id: 2, title: "Elevated Living", category: "Social Media / Content", image: "/images/selected_work_2.jpg" },
        { id: 3, title: "Artisan Coffee", category: "Photography / Strategy", image: "/images/selected_work_3.png" }
    ],
    testimonials: [
        { id: 1, text: "Bloom Branding completely transformed our digital presence. The team is incredible!", author: "Jane Doe, CEO", rating: 5, image: "/images/client_1.png" },
        { id: 2, text: "Creative, professional, and results-driven. Highly recommend!", author: "John Smith, Founder", rating: 5, image: "/images/client_2.png" },
        { id: 3, text: "They truly understood our vision and brought it to life.", author: "Sarah Lee, CMO", rating: 5, image: "/images/client_3.jpg" }
    ],
    instagram: [
        { id: 1, image: "/images/dummypost1.png", link: "#" },
        { id: 2, image: "/images/dummypost2.png", link: "#" },
        { id: 3, image: "/images/dummypost3.png", link: "#" },
        { id: 4, image: "/images/dummypost4.png", link: "#" }
    ],
    founder: {
        name: "Jane Doe",
        role: "Creative Director",
        bio1: "With over a decade of experience in digital transformation...",
        bio2: "\"I believe that design is not just about how things look...\"",
        image: "/images/founders.png"
    },
    values: [
        { id: 1, title: "Boldness", text: "We take risks to help you stand out." },
        { id: 2, title: "Empathy", "text": "Understanding your audience is key." },
        { id: 3, title: "Growth", "text": "Design that drives results." },
        { id: 4, title: "Transparency", "text": "Clear communication, always." }
    ]
};

export const ContentProvider = ({ children }) => {
    const [content, setContent] = useState(defaultContent);

    const fetchContent = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/content');
            if (response.ok) {
                const data = await response.json();
                setContent(data);
            }
        } catch (error) {
            console.error("Failed to fetch content:", error);
        }
    };

    useEffect(() => {
        // fetchContent(); // Temporarily disabled to force local updates
    }, []);

    const updateContent = async (newContent) => {
        setContent(newContent);
        try {
            await fetch('http://localhost:5000/api/content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newContent)
            });
        } catch (error) {
            console.error("Failed to update content:", error);
        }
    };

    const updateHero = (heroData) => {
        const newContent = { ...content, hero: { ...content.hero, ...heroData } };
        updateContent(newContent);
    };

    const updateSelectedWork = (works) => {
        const newContent = { ...content, selectedWork: works };
        updateContent(newContent);
    };

    const updateTestimonials = (testimonials) => {
        const newContent = { ...content, testimonials };
        updateContent(newContent);
    };

    const updateInstagram = (posts) => {
        const newContent = { ...content, instagram: posts };
        updateContent(newContent);
    };

    const updateFounder = (founderData) => {
        const newContent = { ...content, founder: { ...content.founder, ...founderData } };
        updateContent(newContent);
    };

    const updateValues = (valuesData) => {
        const newContent = { ...content, values: valuesData };
        updateContent(newContent);
    };

    const resetContent = () => {
        updateContent(defaultContent);
    };

    return (
        <ContentContext.Provider value={{ content, updateContent, updateHero, updateSelectedWork, updateTestimonials, updateInstagram, updateFounder, updateValues, resetContent }}>
            {children}
        </ContentContext.Provider>
    );
};

export const useContent = () => useContext(ContentContext);
