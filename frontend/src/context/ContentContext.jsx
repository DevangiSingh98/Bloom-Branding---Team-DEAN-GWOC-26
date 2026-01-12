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
            author: "Client"
        },
        {
            id: 2,
            rating: 5,
            text: "The team really understood our vision and brought it to life in ways we couldn't imagine.",
            author: "Client"
        },
        {
            id: 3,
            rating: 5,
            text: "Professional, creative, and results-driven. Highly recommend working with them.",
            author: "Client"
        },
        {
            id: 4,
            rating: 5,
            text: "A breath of fresh air in the branding world. They captured our essence perfectly.",
            author: "Client"
        },
        {
            id: 5,
            rating: 4,
            text: "Strategic and beautiful. Our conversion rates doubled after the rebrand.",
            author: "Client"
        },
        {
            id: 7,
            rating: 5,
            text: "Exceptional quality and speed. I was blown away by the final delivery.",
            author: "Client"
        },
        {
            id: 8,
            rating: 4,
            text: "They helped us find our voice in a crowded market. Forever grateful.",
            author: "Client"
        },
        {
            id: 9,
            rating: 5,
            text: "Minimalist, elegant, and impactful. Exactly what we needed.",
            author: "Client"
        },
        {
            id: 10,
            rating: 5,
            text: "The team went above and beyond. Our new brand identity is stunning.",
            author: "Client"
        },
        {
            id: 11,
            rating: 5,
            text: "Highly professional and creative team.",
            author: "Client"
        },
        {
            id: 12,
            rating: 5,
            text: "A joy to work with from start to finish.",
            author: "Client"
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
    brandLogos: [
        { id: 1, name: "Brand 1", logo: "/images/client1.png" },
        { id: 2, name: "Brand 2", logo: "/images/client2.png" },
        { id: 3, name: "Brand 3", logo: "/images/client3.png" }
    ],
    enquiries: []
};

export const ContentProvider = ({ children }) => {
    // Initialize state from localStorage if available, else default
    const [content, setContent] = useState(() => {
        const savedContent = localStorage.getItem('bloomContent_v23'); // Changed key to force reset
        const parsed = savedContent ? JSON.parse(savedContent) : defaultContent;
        // Merge with defaultContent to ensure all mandatory keys (like brandLogos) exist
        return { ...defaultContent, ...parsed };
    });

    // 1. Fetch live projects from MongoDB on mount
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/projects');
                if (response.ok) {
                    const projects = await response.json();
                    if (projects && projects.length > 0) {
                        const mappedProjects = projects.map(p => ({
                            _id: p._id,
                            id: p._id, // Add id for consistency
                            title: p.title,
                            category: p.category,
                            image: p.imageUrl,
                            description: p.description
                        }));
                        setContent(prev => ({ ...prev, allProjects: mappedProjects }));
                    }
                }

                // Fetch Hero
                const hResponse = await fetch('http://localhost:5000/api/hero');
                if (hResponse.ok) {
                    const hero = await hResponse.json();
                    if (hero && hero.subtitle) {
                        setContent(prev => ({ ...prev, hero: hero }));
                    }
                }

                // Fetch Testimonials
                const tResponse = await fetch('http://localhost:5000/api/testimonials');
                if (tResponse.ok) {
                    const testimonials = await tResponse.json();
                    if (testimonials && testimonials.length > 0) {
                        const mappedTestimonials = testimonials.map(t => ({ ...t, id: t._id }));
                        setContent(prev => ({ ...prev, testimonials: mappedTestimonials }));
                    }
                }

                // Fetch Instagram
                const iResponse = await fetch('http://localhost:5000/api/instagram');
                if (iResponse.ok) {
                    const insta = await iResponse.json();
                    if (insta && insta.length > 0) {
                        const mappedInsta = insta.map(i => ({ ...i, id: i._id }));
                        setContent(prev => ({ ...prev, instagram: mappedInsta }));
                    }
                }

                // Fetch Founders
                const fResponse = await fetch('http://localhost:5000/api/founders');
                if (fResponse.ok) {
                    const foundersArr = await fResponse.json();
                    if (foundersArr && foundersArr.length > 0) {
                        const foundersObj = { ...content.founders };
                        foundersArr.forEach(f => {
                            if (f.key) foundersObj[f.key] = f;
                        });
                        setContent(prev => ({ ...prev, founders: foundersObj }));
                    }
                }

                // Fetch Values
                const vResponse = await fetch('http://localhost:5000/api/values');
                if (vResponse.ok) {
                    const values = await vResponse.json();
                    if (values && values.length > 0) {
                        const mappedValues = values.map(v => ({ ...v, id: v._id }));
                        setContent(prev => ({ ...prev, values: mappedValues }));
                    }
                }

                // Fetch Brands
                const cResponse = await fetch('http://localhost:5000/api/brands');
                if (cResponse.ok) {
                    const brands = await cResponse.json();
                    if (brands && brands.length > 0) {
                        const mappedBrands = brands.map(c => ({ ...c, id: c._id }));
                        setContent(prev => ({ ...prev, brandLogos: mappedBrands }));
                    }
                }

                // Fetch Selected Work
                const wResponse = await fetch('http://localhost:5000/api/selected-work');
                if (wResponse.ok) {
                    const work = await wResponse.json();
                    if (work && work.length > 0) {
                        const mappedWork = work.map(w => ({ ...w, id: w._id }));
                        setContent(prev => ({ ...prev, selectedWork: mappedWork }));
                    }
                }
            } catch (error) {
                console.error('Error fetching data from backend:', error);
            }
        };

        fetchProjects();
    }, []);

    // Helper to sanitize content for localStorage (remove large media)
    const sanitizeForStorage = (data) => {
        const sanitized = { ...data };

        if (sanitized.allProjects) {
            sanitized.allProjects = sanitized.allProjects.map(p => ({
                ...p,
                image: p.image && p.image.startsWith('data:') ? '' : p.image,
                video: p.video && p.video.startsWith('data:') ? '' : p.video
            }));
        }
        if (sanitized.selectedWork) {
            sanitized.selectedWork = sanitized.selectedWork.map(w => ({
                ...w,
                image: w.image && w.image.startsWith('data:') ? '' : w.image,
                video: w.video && w.video.startsWith('data:') ? '' : w.video
            }));
        }
        if (sanitized.testimonials) {
            sanitized.testimonials = sanitized.testimonials.map(t => ({
                ...t
            }));
        }
        if (sanitized.instagram) {
            sanitized.instagram = sanitized.instagram.map(i => ({ ...i, image: i.image && i.image.startsWith('data:') ? '' : i.image }));
        }
        if (sanitized.brandLogos) {
            sanitized.brandLogos = sanitized.brandLogos.map(c => ({ ...c, logo: c.logo && c.logo.startsWith('data:') ? '' : c.logo }));
        }
        if (sanitized.founders) {
            sanitized.founders = { ...sanitized.founders, image: sanitized.founders.image && sanitized.founders.image.startsWith('data:') ? '' : sanitized.founders.image };
        }

        return sanitized;
    };

    // Save to localStorage whenever content changes (Sanitized)
    useEffect(() => {
        try {
            const sanitized = sanitizeForStorage(content);
            localStorage.setItem('bloomContent_v23', JSON.stringify(sanitized));
        } catch (e) {
            console.error('Failed to save to localStorage:', e);
        }
    }, [content]);

    const updateHero = async (updates) => {
        setContent(prev => ({
            ...prev,
            hero: { ...prev.hero, ...updates }
        }));
        // Sync to backend
        try {
            await fetch('http://localhost:5000/api/hero', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...content.hero, ...updates })
            });
        } catch (e) { console.error(e); }
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

    const updateBrandLogos = (newLogos) => {
        setContent(prev => ({ ...prev, brandLogos: newLogos }));
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

    const syncProject = async (project) => {
        try {
            const body = {
                title: project.title,
                description: project.description,
                category: project.category,
                imageUrl: project.image !== undefined ? project.image : project.imageUrl,
                video: project.video,
                link: project.link
            };

            const url = project._id
                ? `http://localhost:5000/api/projects/${project._id}`
                : 'http://localhost:5000/api/projects';

            const method = project._id ? 'PUT' : 'POST'; // Assuming PUT exists for update

            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (response.ok) {
                const savedProject = await response.json();
                // Refresh local state with backend data (especially for new projects with IDs)
                if (!project._id) {
                    setContent(prev => ({
                        ...prev,
                        allProjects: prev.allProjects.map(p =>
                            (p.id === project.id && !p._id) ? { ...p, _id: savedProject._id, id: savedProject._id } : p
                        )
                    }));
                }
                return savedProject;
            }
        } catch (error) {
            console.error('Error syncing project to backend:', error);
        }
    };

    const removeProject = async (id) => {
        if (!id) return;
        try {
            const response = await fetch(`http://localhost:5000/api/projects/${id}`, {
                method: 'DELETE'
            });
            return response.ok;
        } catch (error) {
            console.error('Error deleting project from backend:', error);
        }
    };

    const syncTestimonial = async (t) => {
        try {
            const url = t._id ? `http://localhost:5000/api/testimonials/${t._id}` : 'http://localhost:5000/api/testimonials';
            const method = t._id ? 'PUT' : 'POST';
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(t)
            });
            if (response.ok) {
                const saved = await response.json();
                if (!t._id) {
                    setContent(prev => ({
                        ...prev,
                        testimonials: prev.testimonials.map(item =>
                            (item.id === t.id && !item._id) ? { ...saved, id: saved._id } : item
                        )
                    }));
                }
                return saved;
            }
        } catch (e) { console.error(e); }
    };

    const removeTestimonial = async (id) => {
        if (!id) return;
        try {
            await fetch(`http://localhost:5000/api/testimonials/${id}`, { method: 'DELETE' });
        } catch (e) { console.error(e); }
    };

    const syncInstagram = async (post) => {
        try {
            const url = post._id ? `http://localhost:5000/api/instagram/${post._id}` : 'http://localhost:5000/api/instagram';
            const method = post._id ? 'PUT' : 'POST';
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(post)
            });
            if (response.ok) {
                const saved = await response.json();
                if (!post._id) {
                    setContent(prev => ({
                        ...prev,
                        instagram: prev.instagram.map(item =>
                            (item.id === post.id && !item._id) ? { ...saved, id: saved._id } : item
                        )
                    }));
                }
                return saved;
            }
        } catch (e) { console.error(e); }
    };

    const removeInstagram = async (id) => {
        if (!id) return;
        try {
            await fetch(`http://localhost:5000/api/instagram/${id}`, { method: 'DELETE' });
        } catch (e) { console.error(e); }
    };

    const syncFounder = async (f) => {
        try {
            const url = f._id ? `http://localhost:5000/api/founders/${f._id}` : 'http://localhost:5000/api/founders';
            const response = await fetch(url, {
                method: f._id ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(f)
            });
            if (response.ok) {
                const saved = await response.json();
                if (!f._id) {
                    setContent(prev => {
                        const newFounders = { ...prev.founders };
                        if (f.key) {
                            newFounders[f.key] = { ...newFounders[f.key], _id: saved._id };
                        } else {
                            // If no key, maybe it's the main image or something else
                            Object.assign(newFounders, saved);
                        }
                        return { ...prev, founders: newFounders };
                    });
                }
            }
        } catch (e) { console.error(e); }
    };

    const removeFounder = async (id) => {
        if (!id) return;
        try { await fetch(`http://localhost:5000/api/founders/${id}`, { method: 'DELETE' }); } catch (e) { console.error(e); }
    };

    const syncValue = async (v) => {
        try {
            const url = v._id ? `http://localhost:5000/api/values/${v._id}` : 'http://localhost:5000/api/values';
            const response = await fetch(url, {
                method: v._id ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(v)
            });
            if (response.ok) {
                const saved = await response.json();
                if (!v._id) {
                    setContent(prev => ({
                        ...prev,
                        values: prev.values.map(item => (item.id === v.id && !item._id) ? { ...saved, id: saved._id } : item)
                    }));
                }
            }
        } catch (e) { console.error(e); }
    };

    const removeValue = async (id) => {
        if (!id) return;
        try { await fetch(`http://localhost:5000/api/values/${id}`, { method: 'DELETE' }); } catch (e) { console.error(e); }
    };

    const syncBrand = async (c) => {
        try {
            const url = c._id ? `http://localhost:5000/api/brands/${c._id}` : 'http://localhost:5000/api/brands';
            const response = await fetch(url, {
                method: c._id ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(c)
            });
            if (response.ok) {
                const saved = await response.json();
                if (!c._id) {
                    setContent(prev => ({
                        ...prev,
                        brandLogos: prev.brandLogos.map(item => (item.id === c.id && !item._id) ? { ...saved, id: saved._id } : item)
                    }));
                }
            }
        } catch (e) { console.error(e); }
    };

    const removeBrand = async (id) => {
        if (!id) return;
        try { await fetch('http://localhost:5000/api/brands/' + id, { method: 'DELETE' }); } catch (e) { console.error(e); }
    };

    const syncSelectedWork = async (w) => {
        try {
            const url = w._id ? `http://localhost:5000/api/selected-work/${w._id}` : 'http://localhost:5000/api/selected-work';
            const response = await fetch(url, {
                method: w._id ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(w)
            });
            if (response.ok) {
                const saved = await response.json();
                if (!w._id) {
                    setContent(prev => ({
                        ...prev,
                        selectedWork: prev.selectedWork.map(item => (item.id === w.id && !item._id) ? { ...saved, id: saved._id } : item)
                    }));
                }
            }
        } catch (e) { console.error(e); }
    };

    const removeSelectedWork = async (id) => {
        if (!id) return;
        try { await fetch(`http://localhost:5000/api/selected-work/${id}`, { method: 'DELETE' }); } catch (e) { console.error(e); }
    };

    return (
        <ContentContext.Provider value={{
            content,
            updateHero,
            updateAllProjects,
            syncProject,
            removeProject,
            syncTestimonial,
            removeTestimonial,
            syncInstagram,
            removeInstagram,
            syncFounder,
            removeFounder,
            syncValue,
            removeValue,
            syncBrand,
            removeBrand,
            syncSelectedWork,
            removeSelectedWork,
            updateSelectedWork,
            updateTestimonials,
            updateBrandLogos,
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
