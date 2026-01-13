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
            rating: 4,
            text: "I’ve been working with Bloom for past 4-5 months and my experience with them has been great! Both the founders are very creative and also the team is flexible managing shoot timings and dates and accommodating special requests needed be! I’d recommend you take that meeting :)",
            author: "Nishant Shah"
        },
        {
            id: 2,
            rating: 5,
            text: "The bloom branding team is really hardworking and efficient. I am associated with bloom since more than a year now and they have taken my brand’s page from 20k followers to 50k + followers . Looking forward to touching 100k followers and many more effective collabs together . So wish they were in my city though to really make organic content for me as I suck at it myself.",
            author: "Mansi Nagdev"
        },
        {
            id: 3,
            rating: 5,
            text: "I had an exceptional experience working with Bloom Branding. Their professionalism, tailored strategies, and excellent communication made them stand out. They tackled challenges creatively, delivered precise campaigns, and their dedication to results was evident throughout. I highly recommend Bloom Branding for their expertise and commitment to excellence.",
            author: "Harsh Kheni"
        },
        {
            id: 4,
            rating: 5,
            text: "It was such a nice experience to have an working with bloom branding as, The way they all measure single detail is amazing and apart from that it really help my business. Keep it up bloom branding and team and thanks to you.",
            author: "Shwet Tejani"
        },
        {
            id: 5,
            rating: 5,
            text: "Great work done by these people! One stop for all the assistance needed for digital marketing related work. The employees and all the staff here provide all the guidance to the best of your satisfaction.",
            author: "Purva Shah"
        }
    ],
    instagram: [
        { id: 1, link: "https://www.instagram.com/p/DMfXqlEoCHN/?hl=en&img_index=1", image: "/images/insta1.png" },
        { id: 2, link: "https://www.instagram.com/p/DMScm7lITsA/?hl=en", image: "/images/insta2.png" },
        { id: 3, link: "https://www.instagram.com/p/DBd_RZBy7JS/?hl=en", image: "/images/insta3.png" },
        { id: 4, link: "https://www.instagram.com/p/C_5lTgmByDn/?hl=en&img_index=1", image: "/images/insta4.png" }
    ],
    founders: {
        main: {
            image: "/images/founders.png"
        },
        left: {
            name: "Meghna Kherajani",
            role: "Co-founder",
            bio1: "I’m drawn to the stories that live beneath the surface of a brand—the quiet intentions, the emotions, and the purpose that give it meaning. I love observing people, culture, and nuance, and translating those insights into brand narratives that feel honest, thoughtful, and deeply human. For me, branding is not just about how something looks, but how it feels and the connection it creates.",
            bio2: "At Bloom Branding, I blend strategy with creativity to shape cohesive brand identities, meaningful content, and marketing experiences that help businesses stand out with clarity and grow with confidence in the digital space."
        },
        right: {
            name: "Anushi Shah",
            role: "Co-founder",
            bio1: "I started my career as a Graphic Designer four years ago, driven by a deep passion for design and an eagerness to constantly learn. Over time, this passion helped me discover not just my creative direction, but also my ability to lead and build meaningful visual stories.The belief in myself and my vision led to the creation of my own Branding & Advertising firm.",
            bio2: "Today, I proudly co-found Bloom Branding, where I blend aesthetics, strategy, and creative leadership to help brands grow, evolve, and truly bloom 🌷"
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
        const savedContent = localStorage.getItem('bloomContent_REVIEWS_FINAL_V2'); // Increment version to force reset
        console.log("Loading content...", savedContent ? "Found cached" : "Using default");
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
                /* 
                const tResponse = await fetch('http://localhost:5000/api/testimonials');
                if (tResponse.ok) {
                    const testimonials = await tResponse.json();
                    if (testimonials && testimonials.length > 0) {
                        const mappedTestimonials = testimonials.map(t => ({ ...t, id: t._id }));
                        setContent(prev => ({ ...prev, testimonials: mappedTestimonials }));
                    }
                }
                */

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
                    console.log("Fetched Founders:", foundersArr);
                    if (foundersArr && foundersArr.length > 0) {
                        const foundersObj = { ...content.founders };
                        foundersArr.forEach(f => {
                            if (f.key && foundersObj[f.key]) {
                                foundersObj[f.key] = f;
                            }
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
            const cleanFounders = { ...sanitized.founders };
            if (cleanFounders.main && cleanFounders.main.image && cleanFounders.main.image.startsWith('data:')) {
                cleanFounders.main = { ...cleanFounders.main, image: '' };
            }
            sanitized.founders = cleanFounders;
        }

        // Do not save enquiries to local storage
        if (sanitized.enquiries) {
            sanitized.enquiries = [];
        }

        return sanitized;
    };

    // Save to localStorage whenever content changes (Sanitized)
    useEffect(() => {
        try {
            const sanitized = sanitizeForStorage(content);
            localStorage.setItem('bloomContent_v24', JSON.stringify(sanitized));
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

    const addEnquiry = async (enquiry) => {
        try {
            const response = await fetch('http://localhost:5000/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(enquiry)
            });
            if (response.ok) {
                const saved = await response.json();
                setContent(prev => ({
                    ...prev,
                    enquiries: [saved, ...(prev.enquiries || [])]
                }));
            }
        } catch (e) { console.error("Failed to send enquiry:", e); }
    };

    const updateEnquiries = (newEnquiries) => {
        setContent(prev => ({ ...prev, enquiries: newEnquiries }));
    };

    const removeEnquiry = async (id, token) => {
        if (!id || !token) return;
        try {
            const res = await fetch(`http://localhost:5000/api/messages/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                setContent(prev => ({
                    ...prev,
                    enquiries: prev.enquiries.filter(e => e.id !== id)
                }));
            }
        } catch (e) { console.error("Failed to delete enquiry", e); }
    };

    const removeEnquiries = async (ids, token) => {
        if (!ids || ids.length === 0 || !token) return;
        try {
            const res = await fetch(`http://localhost:5000/api/messages`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ ids })
            });
            if (res.ok) {
                setContent(prev => ({
                    ...prev,
                    enquiries: prev.enquiries.filter(e => !ids.includes(e.id))
                }));
            }
        } catch (e) { console.error("Failed to delete enquiries", e); }
    };

    const removeAllEnquiries = async (token) => {
        if (!token) return;
        try {
            const res = await fetch(`http://localhost:5000/api/messages`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ all: true })
            });
            if (res.ok) {
                setContent(prev => ({ ...prev, enquiries: [] }));
            }
        } catch (e) { console.error("Failed to delete all enquiries", e); }
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

    const syncFounder = async (f, token) => {
        try {
            const url = f._id ? `http://localhost:5000/api/founders/${f._id}` : 'http://localhost:5000/api/founders';
            const response = await fetch(url, {
                method: f._id ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(f)
            });
            if (response.ok) {
                const saved = await response.json();
                // Ensure we update the LOCAL state with the database ID to prevent future duplicates
                setContent(prev => {
                    const newFounders = { ...prev.founders };
                    if (saved.key && newFounders[saved.key]) {
                        newFounders[saved.key] = { ...newFounders[saved.key], ...saved, _id: saved._id };
                    }
                    return { ...prev, founders: newFounders };
                });
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
        console.log("Syncing Brand:", c); // Debug log
        try {
            const url = c._id ? `http://localhost:5000/api/brands/${c._id}` : 'http://localhost:5000/api/brands';
            console.log("Sync URL:", url, "Method:", c._id ? 'PUT' : 'POST');

            const response = await fetch(url, {
                method: c._id ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(c)
            });
            console.log("Sync Response Status:", response.status);

            if (response.ok) {
                const saved = await response.json();
                console.log("Saved Brand:", saved);
                if (!c._id) {
                    setContent(prev => ({
                        ...prev,
                        brandLogos: prev.brandLogos.map(item => (item.id === c.id && !item._id) ? { ...saved, id: saved._id } : item)
                    }));
                }
            } else {
                console.error("Sync Failed:", await response.text());
                alert("Failed to save brand to database. Please ensure the backend server is running.");
            }
        } catch (e) {
            console.error("Sync Exception:", e);
            alert("Connection Error: Could not reach the server. Please check if the backend is running on port 5000.");
        }
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
            updateEnquiries,
            removeEnquiry,
            removeEnquiries,
            removeAllEnquiries,
            addEnquiry,
            resetContent
        }}>
            {children}
        </ContentContext.Provider>
    );
};
