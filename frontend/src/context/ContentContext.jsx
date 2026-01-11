import React, { createContext, useContext, useState, useEffect } from 'react';

const ContentContext = createContext();

export const useContent = () => {
    return useContext(ContentContext);
};

const defaultContent = {
    hero: {
        subtitle: "We build brands that bloom."
    },
    allProjects: [
        {
            title: "Vardhaman Diam",
            category: "Jewellery Brand",
            image: "/images/project1.png",
            description: "A luxurious brand identity reflecting the brilliance and precision of fine diamonds."
        },
        {
            title: "Binal Patel",
            category: "Fashion Brand",
            image: "/images/project2.png",
            description: "An elegant, heritage-inspired visual system tailored for a contemporary fashion label."
        },
        {
            title: "Life's A Beach",
            category: "Other Lifestyle Brand",
            image: "/images/project3.png",
            description: "Vibrant storytelling and strategic positioning for a spirited lifestyle brand."
        },
        {
            title: "Thyme & Whisk",
            category: "Cafes & Restaurants",
            image: "/images/project4.png",
            description: "A flavorful brand experience designed to capture the culinary soul of the restaurant."
        },
        {
            title: "AMBC Gems",
            category: "Jewellery Brand",
            image: "/images/project5.png",
            description: "Exquisite craftsmanship meets timeless elegance in this jewellery brand identity."
        },
        {
            title: "Moire Rugs",
            category: "Home Furnishing Brand",
            image: "/images/project6.png",
            description: "Weaving tradition with modernity to create a distinct home furnishing identity."
        },
        {
            title: "The Right Cut",
            category: "Fashion Brand",
            image: "/images/project7.png",
            description: "Sharp, stylish, and sophisticated branding for a contemporary fashion house."
        },
        {
            title: "ShoP",
            category: "Luxury Sourcing Brand",
            image: "/images/project8.png",
            description: "Connecting discernment with luxury through a refined and exclusive brand persona."
        },
        {
            title: "Kaffyn",
            category: "Cafes & Restaurants",
            image: "/images/project9.png",
            description: "A vibrant and energetic brand identity for a modern cafe experience."
        }
    ],
    selectedWork: [
        {
            id: 1,
            title: "Vardhaman Diam",
            category: "Jewellery Brand",
            image: "/images/project1.png"
        },
        {
            id: 2,
            title: "Binal Patel",
            category: "Fashion Brand",
            image: "/images/project2.png"
        },
        {
            id: 3,
            title: "Life's A Beach",
            category: "Other Lifestyle Brand",
            image: "/images/project3.png"
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
            image: "/images/client4.png"
        },
        {
            id: 5,
            rating: 4,
            text: "Strategic and beautiful. Our conversion rates doubled after the rebrand.",
            author: "Client",
            image: "/images/client5.png"
        },
        {
            id: 7,
            rating: 5,
            text: "Exceptional quality and speed. I was blown away by the final delivery.",
            author: "Client",
            image: "/images/client1.jpg"
        },
        {
            id: 8,
            rating: 4,
            text: "They helped us find our voice in a crowded market. Forever grateful.",
            author: "Client",
            image: "/images/client2.jpg"
        },
        {
            id: 9,
            rating: 5,
            text: "Minimalist, elegant, and impactful. Exactly what we needed.",
            author: "Client",
            image: "/images/client3.jpg"
        },
        {
            id: 10,
            rating: 5,
            text: "The team went above and beyond. Our new brand identity is stunning.",
            author: "Client",
            image: "/images/client4.png"
        },
        {
            id: 11,
            rating: 5,
            text: "Highly professional and creative team.",
            author: "Client",
            image: "/images/client5.png"
        },
        {
            id: 12,
            rating: 5,
            text: "A joy to work with from start to finish.",
            author: "Client",
            image: "/images/client1.jpg"
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
    clientLogos: [
        { id: 1, name: "Client 1", logo: "/images/client1.png" },
        { id: 2, name: "Client 2", logo: "/images/client2.png" },
        { id: 3, name: "Client 3", logo: "/images/client3.png" }
    ],
    enquiries: []
};

export const ContentProvider = ({ children }) => {
    // Initialize state from localStorage if available, else default
    const [content, setContent] = useState(() => {
        const savedContent = localStorage.getItem('bloomContent_v23'); // Changed key to force reset
        return savedContent ? JSON.parse(savedContent) : defaultContent;
    });

    // Save to localStorage whenever content changes
    useEffect(() => {
        localStorage.setItem('bloomContent_v23', JSON.stringify(content));
    }, [content]);

    const updateHero = (updates) => {
        setContent(prev => ({
            ...prev,
            hero: { ...prev.hero, ...updates }
        }));
    };

    const updateAllProjects = (newProjects) => {
        setContent(prev => ({ ...prev, allProjects: newProjects }));
    };

    const updateSelectedWork = (newWork) => {
        setContent(prev => ({ ...prev, selectedWork: newWork }));
    };

    const updateTestimonials = (newTestimonials) => {
        setContent(prev => ({ ...prev, testimonials: newTestimonials }));
    };

    const updateClientLogos = (newLogos) => {
        setContent(prev => ({ ...prev, clientLogos: newLogos }));
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
            updateAllProjects,
            updateSelectedWork,
            updateTestimonials,
            updateClientLogos,
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
