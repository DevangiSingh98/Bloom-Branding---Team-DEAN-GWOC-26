import React, { createContext, useContext, useState, useEffect } from 'react';

const ContentContext = createContext();

export const useContent = () => {
    return useContext(ContentContext);
};

const defaultContent = {
    hero: {
        subtitle: "We build brands that bloom."
    },
    selectedWork: [
        {
            id: 1,
            title: "Lumina",
            category: "Branding & Identity",
            image: "/images/work1.png"
        },
        {
            id: 2,
            title: "Vogue",
            category: "Editorial Design",
            image: "/images/work2.png"
        },
        {
            id: 3,
            title: "Elevate",
            category: "Social Media Strategy",
            image: "/images/work3.png"
        }
    ],
    testimonials: [
        {
            id: 1,
            rating: 5,
            text: "Bloom Branding completely transformed our online presence. Their attention to detail is unmatched.",
            author: "Client",
            image: "/images/client1.jpg"
        },
        {
            id: 2,
            rating: 5,
            text: "The team really understood our vision and brought it to life in ways we couldn't imagine.",
            author: "Client",
            image: "/images/client2.jpg"
        },
        {
            id: 3,
            rating: 5,
            text: "Professional, creative, and results-driven. Highly recommend working with them.",
            author: "Client",
            image: "/images/client3.jpg"
        },
        {
            id: 4,
            rating: 5,
            text: "A breath of fresh air in the branding world. They captured our essence perfectly.",
            author: "Client",
            image: "/images/work1.png"
        },
        {
            id: 5,
            rating: 4,
            text: "Strategic and beautiful. Our conversion rates doubled after the rebrand.",
            author: "Client",
            image: "/images/main logo.png"
        },
        {
            id: 7,
            rating: 5,
            text: "Exceptional quality and speed. I was blown away by the final delivery.",
            author: "Client",
            image: "/images/work1.png"
        },
        {
            id: 8,
            rating: 4,
            text: "They helped us find our voice in a crowded market. Forever grateful.",
            author: "Client",
            image: "/images/service_lifestyle.png"
        },
        {
            id: 9,
            rating: 5,
            text: "Minimalist, elegant, and impactful. Exactly what we needed.",
            author: "Client",
            image: "/images/service_decor.png"
        },
        {
            id: 10,
            rating: 5,
            text: "The team went above and beyond. Our new brand identity is stunning.",
            author: "Client",
            image: "/images/service_fashion.png"
        },
        {
            id: 11,
            rating: 5,
            text: "Highly professional and creative team.",
            author: "Client",
            image: "/images/client1.jpg"
        },
        {
            id: 12,
            rating: 5,
            text: "A joy to work with from start to finish.",
            author: "Client",
            image: "/images/client2.jpg"
        }
    ],
    instagram: [
        { id: 1, link: "https://www.instagram.com/p/DMfXqlEoCHN/?hl=en&img_index=1", image: "/images/insta1.png" },
        { id: 2, link: "https://www.instagram.com/p/DMScm7lITsA/?hl=en", image: "/images/insta2.png" },
        { id: 3, link: "https://www.instagram.com/p/DBd_RZBy7JS/?hl=en", image: "/images/insta3.png" },
        { id: 4, link: "https://www.instagram.com/p/C_5lTgmByDn/?hl=en&img_index=1", image: "/images/insta4.png" }
    ],
    founders: {
        image: "/images/founders.png",
        left: {
            name: "Founder Name 1",
            role: "Co-founder",
            bio1: "Bio Paragraph 1 for Founder 1. They are an expert in branding and strategy.",
            bio2: "Bio Paragraph 2 for Founder 1. They love creating meaningful connections."
        },
        right: {
            name: "Founder Name 2",
            role: "Co-founder",
            bio1: "Bio Paragraph 1 for Founder 2. They specialize in motion graphics and design.",
            bio2: "Bio Paragraph 2 for Founder 2. They bring brands to life with animation."
        }
    },
    values: [
        { id: 1, title: "Authenticity", text: "We believe in brands that are true to themselves." },
        { id: 2, title: "Creativity", text: "Pushing boundaries is in our DNA." },
        { id: 3, title: "Growth", text: "We design with the future in mind." }
    ],
    enquiries: []
};

export const ContentProvider = ({ children }) => {
    // Initialize state from localStorage if available, else default
    const [content, setContent] = useState(() => {
        const savedContent = localStorage.getItem('bloomContent_v10'); // Changed key to force reset
        return savedContent ? JSON.parse(savedContent) : defaultContent;
    });

    // Save to localStorage whenever content changes
    useEffect(() => {
        localStorage.setItem('bloomContent_v10', JSON.stringify(content));
    }, [content]);

    const updateHero = (updates) => {
        setContent(prev => ({
            ...prev,
            hero: { ...prev.hero, ...updates }
        }));
    };

    const updateSelectedWork = (newWork) => {
        setContent(prev => ({ ...prev, selectedWork: newWork }));
    };

    const updateTestimonials = (newTestimonials) => {
        setContent(prev => ({ ...prev, testimonials: newTestimonials }));
    };

    const updateInstagram = (newInsta) => {
        setContent(prev => ({ ...prev, instagram: newInsta }));
    };

    const updateFounders = (updates) => {
        setContent(prev => ({
            ...prev,
            founders: { ...prev.founders, ...updates }
        }));
    };

    const updateValues = (newValues) => {
        setContent(prev => ({ ...prev, values: newValues }));
    };

    const addEnquiry = (enquiry) => {
        setContent(prev => ({
            ...prev,
            enquiries: [enquiry, ...(prev.enquiries || [])]
        }));
    };

    const resetContent = () => {
        setContent(defaultContent);
    };

    return (
        <ContentContext.Provider value={{
            content,
            updateHero,
            updateSelectedWork,
            updateTestimonials,
            updateInstagram,
            updateFounders,
            updateValues,
            addEnquiry,
            resetContent
        }}>
            {children}
        </ContentContext.Provider>
    );
};
