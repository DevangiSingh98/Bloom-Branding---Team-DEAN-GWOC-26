import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const ContentContext = createContext();

export const useContent = () => {
    return useContext(ContentContext);
};

const defaultContent = {
    hero: {
        subtitle: "We build brands that bloom."
    },
    vibes: [
        'Minimalist', 'Bold & Loud', 'Luxury', 'Playful',
        'Geometric', 'Organic', 'Tech', 'Vintage',
        'Editorial', 'Abstract'
    ],
    // ... (rest of default content)

    allProjects: [
        {
            id: 1,
            title: "Vardhaman Diam",
            category: "Jewellery Brand",
            image: "/images/project1.png",
            images: [
                "/images/project1.png",
                "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2400&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1618220048045-10a6dbdf83e0?q=80&w=2400&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2400&auto=format&fit=crop"
            ],
            description: "A luxurious brand identity reflecting the brilliance and precision of fine diamonds."
        },
        {
            id: 2,
            title: "Binal Patel",
            category: "Fashion Brand",
            image: "/images/project2.png",
            images: [
                "/images/project2.png",
                "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2400&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1616486338812-3dadae4b4f9d?q=80&w=2400&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1616137466211-f939a420be63?q=80&w=2400&auto=format&fit=crop"
            ],
            description: "An elegant, heritage-inspired visual system tailored for a contemporary fashion label."
        },
        {
            id: 3,
            title: "Life's A Beach",
            category: "Other Lifestyle Brand",
            image: "/images/project3.png",
            images: [
                "/images/project3.png",
                "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=2400&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2400&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1515405295579-ba7b45403062?q=80&w=2400&auto=format&fit=crop"
            ],
            description: "Vibrant storytelling and strategic positioning for a spirited lifestyle brand."
        },
        {
            id: 4,
            title: "Thyme & Whisk",
            category: "Cafes & Restaurants",
            image: "/images/project4.png",
            images: [
                "/images/project4.png",
                "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2400&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2400&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1504384308090-c54be3855833?q=80&w=2400&auto=format&fit=crop"
            ],
            description: "A flavorful brand experience designed to capture the culinary soul of the restaurant."
        },
        {
            id: 5,
            title: "AMBC Gems",
            category: "Jewellery Brand",
            image: "/images/project5.png",
            images: [
                "/images/project5.png",
                "https://images.unsplash.com/photo-1449824913929-49aa262918a5?q=80&w=2400&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1518005020951-ecc8e1213ac4?q=80&w=2400&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2400&auto=format&fit=crop"
            ],
            description: "Exquisite craftsmanship meets timeless elegance in this jewellery brand identity."
        },
        {
            id: 6,
            title: "Moire Rugs",
            category: "Home Furnishing Brand",
            image: "/images/project6.png",
            images: [
                "/images/project6.png",
                "https://images.unsplash.com/photo-1516939884455-1445c8652f83?q=80&w=2400&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=2400&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2400&auto=format&fit=crop"
            ],
            description: "Weaving tradition with modernity to create a distinct home furnishing identity."
        },
        {
            id: 7,
            title: "The Right Cut",
            category: "Fashion Brand",
            image: "/images/project7.png",
            description: "Sharp, stylish, and sophisticated branding for a contemporary fashion house."
        },
        {
            id: 8,
            title: "ShoP",
            category: "Luxury Sourcing Brand",
            image: "/images/project8.png",
            description: "Connecting discernment with luxury through a refined and exclusive brand persona."
        },
        {
            id: 9,
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
            bio1: "I’m drawn to the stories that live beneath a brand’s surface—the quiet intentions, emotions, and purpose that give it meaning. By observing people, culture, and nuance, I translate these insights into narratives that feel honest, thoughtful, and deeply human.",
            bio2: "At Bloom Branding, I blend strategy with creativity to craft cohesive brand identities, meaningful content, and immersive experiences. My goal is to help brands stand out with clarity and grow with confidence in the digital space."
        },
        right: {
            name: "Anushi Shah",
            role: "Co-founder",
            bio1: "I began my journey as a Graphic Designer four years ago, driven by a passion for design and learning. That journey shaped my creative voice and gave me the confidence to lead and build meaningful visual stories.",
            bio2: "Today, as the Co-founder of Bloom Branding, I blend aesthetics, strategy, and creativity to help brands grow, evolve, and truly bloom"
        }
    },
    values: [
        { id: 1, title: "Authenticity", text: "We believe in brands that are true to themselves." },
        { id: 2, title: "Creativity", text: "Pushing boundaries is in our DNA." },
        { id: 3, title: "Growth", text: "We design with the future in mind." }
    ],
    brandLogos: [
        { id: 1, name: "Amar", logo: "/images/amar.png" },
        { id: 2, name: "AMBC", logo: "/images/ambc.png" },
        { id: 3, name: "Bafna", logo: "/images/bafna.png" },
        { id: 4, name: "Bthere", logo: "/images/bthere.png" },
        { id: 5, name: "Dhruv Gems", logo: "/images/dhruv gems.png" },
        { id: 6, name: "Fine Decor", logo: "/images/fine decor.png" },
        { id: 7, name: "Kaffyn", logo: "/images/kaffyn.png" },
        { id: 8, name: "Life's A Beach", logo: "/images/lifes a beach.png" },
        { id: 9, name: "Mansi Nagdev", logo: "/images/mansi nagdev.png" },
        { id: 10, name: "Moire", logo: "/images/moire.png" },
        { id: 11, name: "ShoP", logo: "/images/shoP..png" },
        { id: 12, name: "Subhrekha", logo: "/images/subhrekha.png" },
        { id: 13, name: "The Right Cut", logo: "/images/the right cut.png" },
        { id: 14, name: "Thyme & Whisk", logo: "/images/thyme & whisk.png" },
        { id: 15, name: "Vardhaman", logo: "/images/vardhaman.png" }
    ],
    siteImages: {
        // Fallbacks for Home Page
        hero_bg: "/images/herosecbg(2).jpg",
        hero_page1: "/images/page1.png",
        hero_page2: "/images/page2.png",
        hero_page3: "/images/page3.png",
        hero_page4: "/images/page4.png",
        hero_megaphone: "/images/megaphone.png",
        hero_camera: "/images/cam.png",
        hero_star: "/images/star.png",

        home_main_logo: "/images/main logo.png",
        home_blooming: "/images/bloomingthebrand.png",
        home_story: "/images/ourstory.png",

        home_service_branding: "/images/service_branding.png",
        home_service_social: "/images/service_jewellery.png",
        home_service_production: "/images/service_decor.png",
        home_service_influencer: "/images/service_fashion.png",
        home_service_creative: "/images/service_lifestyle.png",

        // About Page
        about_blooming: "/images/dummy9.png",
        about_vision: "/images/dummy6.png",
        about_values: "/images/dummy8.png",
        about_approach: "/images/dummy7.png",

        // Navbar / Menu Icons
        nav_home: "/images/home.png",
        nav_story: "/images/ourstory.png",
        nav_services: "/images/services.png",
        nav_work: "/images/Ourwork.png",
        nav_contact: "/images/tele.png"
    },


    services: [
        {
            id: 'branding',
            title: 'BRANDING',
            subtitle: 'IDENTITY & STRATEGY',
            description: 'Crafting identities that build dominance.',
            image: '/images/dummypost4.png',
            iconSrc: '/images/branding.png',
            accent: 'var(--color-electric-blue)',
            textColor: '#FFFFFF',
            longText: 'Crafting narratives that resonate. Your identity, felt not just seen.',
            mobileText: 'Crafting identities that build dominance and resonate deeply.'
        },
        {
            id: 'social',
            title: 'SOCIAL MEDIA',
            subtitle: 'MEDIA & GROWTH',
            description: 'Quality strategies for your goals.',
            image: '/images/s_social.jpg',
            iconSrc: '/images/socialmedia.png',
            accent: 'var(--color-butter-yellow)',
            textColor: 'var(--color-electric-blue)',
            longText: 'Maximizing engagement with precision. Viral moments to sustained growth.',
            mobileText: 'Strategize to maximize engagement and reach the right audience.'
        },
        {
            id: 'production',
            title: 'PRODUCTION',
            subtitle: 'SHOOT & EDIT',
            description: 'Cinematic production aligned with your voice.',
            image: '/images/s_production.jpg',
            iconSrc: '/images/production.png',
            accent: 'var(--color-electric-blue)',
            textColor: '#FFFFFF',
            longText: 'Cinematic excellence blending with your brand voice. Visual stories that captivate.',
            mobileText: 'Cinematic excellence aligned with your brand voice to captivate.'
        },
        {
            id: 'influencer',
            title: 'INFLUENCER',
            subtitle: 'CONNECT & AMPLIFY',
            description: 'Authentic partnerships maximizing your value.',
            image: '/images/s_influencer.jpg',
            iconSrc: '/images/influencer.png',
            accent: 'var(--color-butter-yellow)',
            textColor: 'var(--color-electric-blue)',
            longText: 'Connecting you with voices that amplify your message. Authentic partnerships.',
            mobileText: 'Authentic partnerships that amplify your message and drive value.'
        },
        {
            id: 'creative',
            title: 'CREATIVE',
            subtitle: 'DESIGN & DIRECTION',
            description: 'Designing experiences that captivate.',
            image: '/images/s_creative.jpg',
            iconSrc: '/images/creativedesign.png',
            accent: 'var(--color-electric-blue)',
            textColor: '#FFFFFF',
            longText: 'Pushing boundaries to deliver experiences that leave a mark. Aesthetics met with strategy.',
            mobileText: 'Design intelligence creating experiences that leave a lasting mark.'
        }
    ],
    enquiries: [],
    legal: {
        privacy: `<h2>Privacy Policy</h2>
<p><strong>Effective Date:</strong> January 16, 2026</p>

<h3>1. Introduction</h3>
<p>Welcome to Bloom Branding. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.</p>

<h3>2. Information We Collect</h3>
<p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:</p>
<ul>
    <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
    <li><strong>Contact Data:</strong> includes email address and telephone number.</li>
    <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform and other technology on the devices you use to access this website.</li>
</ul>

<h3>3. How We Use Your Data</h3>
<p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
<ul>
    <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
    <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
    <li>Where we need to comply with a legal or regulatory obligation.</li>
</ul>

<h3>4. Data Security</h3>
<p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.</p>

<h3>5. Your Legal Rights</h3>
<p>Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access, correction, erasure, restriction, transfer, to object to processing, to portability of data and (where the lawful ground of processing is consent) to withdraw consent.</p>

<p>If you wish to exercise any of the rights set out above, please contact us.</p>`,
        terms: `<h2>Terms of Service</h2>
<p><strong>Last Updated:</strong> January 16, 2026</p>

<h3>1. Terms</h3>
<p>By accessing the website at Bloom Branding, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site.</p>

<h3>2. Use License</h3>
<p>Permission is granted to temporarily download one copy of the materials (information or software) on Bloom Branding's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
<ul>
    <li>modify or copy the materials;</li>
    <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
    <li>attempt to decompile or reverse engineer any software contained on Bloom Branding's website;</li>
    <li>remove any copyright or other proprietary notations from the materials; or</li>
    <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
</ul>

<h3>3. Disclaimer</h3>
<p>The materials on Bloom Branding's website are provided on an 'as is' basis. Bloom Branding makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>

<h3>4. Limitations</h3>
<p>In no event shall Bloom Branding or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Bloom Branding's website.</p>

<h3>5. Governing Law</h3>
<p>These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit to the exclusive jurisdiction of the courts in that location.</p>`
    }
};

export const ContentProvider = ({ children }) => {
    // Initialize state from localStorage if available, else default (Forcing Refresh)
    const [content, setContent] = useState(() => {
        const savedContent = localStorage.getItem('bloomContent_v26'); // Bumped version for IDs
        console.log("Loading content...", savedContent ? "Found cached" : "Using default");
        const parsed = savedContent ? JSON.parse(savedContent) : defaultContent;
        return { ...defaultContent, ...parsed };
    });

    // History for Undo/Redo
    const [history, setHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [isUndoing, setIsUndoing] = useState(false);

    // Snapshot: Call this BEFORE making a change
    const takeSnapshot = () => {
        if (isUndoing) return; // Don't snap during undo/redo
        const currentSnapshot = JSON.parse(JSON.stringify(content));
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(currentSnapshot);
        // Limit history to 20 steps
        if (newHistory.length > 20) newHistory.shift();
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    };

    const undo = () => {
        if (historyIndex >= 0) {
            setIsUndoing(true);
            const previous = history[historyIndex];
            // We need to save the CURRENT state as "future" if we haven't already
            // Actually, standard undo pushes current to redo stack?
            // Simple approach: History is a timeline.
            // If we are at tip, we should snap "current" before formatting? 
            // Let's use a simpler standard:
            // When undoing, we move pointer back. 
            // But we need to verify we aren't losing the "now".
            // Let's trust the snapshots were taken BEFORE changes.

            setContent(previous);
            setHistoryIndex(prev => prev - 1);
            setTimeout(() => setIsUndoing(false), 50);
        }
    };

    const redo = () => {
        if (historyIndex < history.length - 1) {
            setIsUndoing(true);
            const next = history[historyIndex + 1];
            setContent(next);
            setHistoryIndex(prev => prev + 1);
            setTimeout(() => setIsUndoing(false), 50);
        }
    };

    const canUndo = historyIndex >= 0;
    const canRedo = historyIndex < history.length - 1;

    // Use environment variable for API URL, fallback to localhost for dev or production URL for deployed
    const API_BASE_URL = import.meta.env.VITE_API_URL ||
        (window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://bloom-backend-pq68.onrender.com');

    // 1. Fetch live projects from MongoDB on mount
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                // Fetch Projects
                const response = await fetch(`${API_BASE_URL}/api/projects`);
                if (response.ok) {
                    const projects = await response.json();
                    if (projects && projects.length > 0) {
                        const mappedProjects = projects.map(p => ({
                            _id: p._id,
                            id: p._id,
                            title: p.title,
                            category: p.category,
                            image: p.imageUrl,
                            description: p.description
                        }));
                        setContent(prev => ({ ...prev, allProjects: mappedProjects }));
                    }
                }

                // Fetch Hero
                const hResponse = await fetch(`${API_BASE_URL}/api/hero`);
                if (hResponse.ok) {
                    const hero = await hResponse.json();
                    if (hero && hero.subtitle) {
                        setContent(prev => ({ ...prev, hero: hero }));
                    }
                }

                // Fetch Instagram
                const iResponse = await fetch(`${API_BASE_URL}/api/instagram`);
                if (iResponse.ok) {
                    const insta = await iResponse.json();
                    if (insta && insta.length > 0) {
                        const mappedInsta = insta.map(i => ({ ...i, id: i._id }));
                        setContent(prev => ({ ...prev, instagram: mappedInsta }));
                    }
                }

                // Fetch Founders
                const fResponse = await fetch(`${API_BASE_URL}/api/founders`);
                if (fResponse.ok) {
                    const foundersArr = await fResponse.json();
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
                const vResponse = await fetch(`${API_BASE_URL}/api/values`);
                if (vResponse.ok) {
                    const values = await vResponse.json();
                    if (values && values.length > 0) {
                        const mappedValues = values.map(v => ({ ...v, id: v._id }));
                        setContent(prev => ({ ...prev, values: mappedValues }));
                    }
                }

                // Fetch Brands
                const cResponse = await fetch(`${API_BASE_URL}/api/brands`);
                if (cResponse.ok) {
                    const brands = await cResponse.json();
                    if (brands && brands.length > 0) {
                        const mappedBrands = brands.map(c => ({ ...c, id: c._id }));
                        setContent(prev => ({ ...prev, brandLogos: mappedBrands }));
                    }
                }

                // Fetch Selected Work
                const wResponse = await fetch(`${API_BASE_URL}/api/selected-work`);
                if (wResponse.ok) {
                    const work = await wResponse.json();
                    if (work && work.length > 0) {
                        const mappedWork = work.map(w => ({ ...w, id: w._id }));
                        setContent(prev => ({ ...prev, selectedWork: mappedWork }));
                    }
                }

                // Fetch Site Images (NEW)
                const siResponse = await fetch(`${API_BASE_URL}/api/site-images`);
                if (siResponse.ok) {
                    const imagesArr = await siResponse.json();
                    if (Array.isArray(imagesArr) && imagesArr.length > 0) {
                        const imagesObj = imagesArr.reduce((acc, img) => {
                            acc[img.key] = img.image;
                            return acc;
                        }, {});
                        setContent(prev => ({
                            ...prev,
                            siteImages: { ...prev.siteImages, ...imagesObj } // Merge with defaults
                        }));
                    }
                }

                // Fetch All Projects (NEW)
                const pResponse = await fetch(`${API_BASE_URL}/api/projects`);
                if (pResponse.ok) {
                    const projects = await pResponse.json();
                    if (projects && projects.length > 0) {
                        const mappedProjects = projects.map(p => ({ ...p, id: p._id }));
                        setContent(prev => ({ ...prev, allProjects: mappedProjects })); // Update allProjects
                    }
                }

                // Fetch Legal
                const lResponse = await fetch(`${API_BASE_URL}/api/legal`);
                if (lResponse.ok) {
                    const legalMap = await lResponse.json();
                    setContent(prev => ({
                        ...prev,
                        legal: { ...prev.legal, ...legalMap }
                    }));
                }

                // Fetch Services (NEW)
                const sResponse = await fetch(`${API_BASE_URL}/api/services`);
                if (sResponse.ok) {
                    const servicesData = await sResponse.json();
                    if (servicesData && servicesData.length > 0) {
                        setContent(prev => ({ ...prev, services: servicesData }));
                    } else {
                        // FIX: If DB is empty, use defaults immediately so Admin isn't empty
                        setContent(prev => ({ ...prev, services: defaultContent.services }));
                    }
                }

                // Fetch Vibes (NEW)
                const vbResponse = await fetch(`${API_BASE_URL}/api/vibes`);
                if (vbResponse.ok) {
                    const vibesData = await vbResponse.json();
                    // Always set vibes, even if empty array, to reflect DB state
                    setContent(prev => ({ ...prev, vibes: vibesData || [] }));
                }


            } catch (error) {
                console.error('Error fetching data from backend:', error);
            }
        };

        fetchProjects();
    }, []);

    // Add Enquiry (For Contact Form)
    const addEnquiry = async (data) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (res.ok) {
                const newMsg = await res.json();
                setContent(prev => ({
                    ...prev,
                    enquiries: [newMsg, ...(prev.enquiries || [])]
                }));
                return true;
            }
            return false;
        } catch (e) {
            console.error("Failed to add enquiry", e);
            return false;
        }
    };

    const updateSiteImage = async (key, section, label, image, token) => {
        // Optimistic Update
        setContent(prev => ({
            ...prev,
            siteImages: { ...prev.siteImages, [key]: image }
        }));

        try {
            await fetch(`${API_BASE_URL}/api/site-images`, {
                method: 'POST', // Only POST needed as per controller logic (upsert)
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ key, section, label, image })
            });

        } catch (error) {
            console.error('Failed to update site image:', error);
            // Revert optimistic update if needed, but risky without deep copy
        }
    };

    const updateLegalContent = async (type, rawContent) => {
        // Optimistic
        setContent(prev => ({
            ...prev,
            legal: { ...prev.legal, [type]: rawContent }
        }));

        try {
            await fetch(`${API_BASE_URL}/api/legal`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${content.founders?.main?.token || localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).token : ''}` // Fallback token logic
                },
                body: JSON.stringify({ type, content: rawContent })
            });
            return true;
        } catch (error) {
            console.error('Failed to update legal:', error);
            return false;
        }
    };

    const addVibe = async (label, token) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/vibes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ label })
            });
            if (res.ok) {
                const newVibe = await res.json();
                setContent(prev => {
                    // Handle if vibes is array of strings or objects. normalize to objects.
                    const current = Array.isArray(prev.vibes) ? prev.vibes : [];
                    return { ...prev, vibes: [...current, newVibe] };
                });
            }
        } catch (e) { console.error("Failed to add vibe", e); }
    };

    const removeVibe = async (id, token) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/vibes/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setContent(prev => ({
                    ...prev,
                    vibes: prev.vibes.filter(v => v._id !== id)
                }));
            }
        } catch (e) { console.error("Failed to remove vibe", e); }
    };




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
            localStorage.setItem('bloomContent_v25', JSON.stringify(sanitized));
        } catch (e) {
            console.error('Failed to save to localStorage:', e);
        }
    }, [content]);

    const updateHero = async (updates, token) => {
        setContent(prev => ({
            ...prev,
            hero: { ...prev.hero, ...updates }
        }));
        // Sync to backend
        try {
            if (!token) {
                console.warn("updateHero called without token, skipping backend sync");
                return;
            }
            await fetch(`${API_BASE_URL}/api/hero`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
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



    const updateEnquiries = (newEnquiries) => {
        setContent(prev => ({ ...prev, enquiries: newEnquiries }));
    };

    const removeEnquiry = async (id, token) => {
        if (!id || !token) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/messages/${id}`, {
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
            const res = await fetch(`${API_BASE_URL}/api/messages`, {
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
            const res = await fetch(`${API_BASE_URL}/api/messages`, {
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

    const resetFounders = async (token) => {
        const defaults = {
            left: { ...defaultContent.founders.left, key: 'left' },
            right: { ...defaultContent.founders.right, key: 'right' },
            main: { ...defaultContent.founders.main, key: 'main' }
        };

        setContent(prev => ({
            ...prev,
            founders: {
                ...prev.founders,
                left: defaults.left,
                right: defaults.right,
                main: defaults.main
            }
        }));

        if (token) {
            // Auto-sync if token is provided
            try {
                // Must fetch to get current IDs if they exist to perform updates, 
                // but syncFounder handles fetch logic or we just overwrite. 
                // Actually syncFounder uses _id if present in object passed. 
                // defaults objects won't have _id. 
                // We need to merge with existing IDs from content state so we UPDATE instead of CREATE duplicates.

                const currentFounders = content.founders;

                // Helper to merge and sync
                const mergeAndSync = async (key) => {
                    const defaultData = defaults[key];
                    const currentData = currentFounders[key];
                    const merged = { ...defaultData, _id: currentData?._id }; // Preseve ID
                    await syncFounder(merged, token);
                };

                await mergeAndSync('left');
                await mergeAndSync('right');
                await mergeAndSync('main');
                console.log("Founders reset and synced to database.");
            } catch (e) {
                console.error("Error auto-syncing reset founders:", e);
            }
        }

        return defaults;
    };

    const resetLegal = async (token) => {
        const defaults = {
            privacy: defaultContent.legal.privacy,
            terms: defaultContent.legal.terms
        };
        setContent(prev => ({ ...prev, legal: defaults }));

        if (token) {
            try {
                await fetch(`${API_BASE_URL}/api/legal`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ type: 'privacy', content: defaults.privacy })
                });
                await fetch(`${API_BASE_URL}/api/legal`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ type: 'terms', content: defaults.terms })
                });
                console.log("Legal content reset to defaults.");
            } catch (e) {
                console.error("Error resetting legal content:", e);
            }
        }
    };



    const syncProject = async (project, token) => {
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
                ? `${API_BASE_URL}/api/projects/${project._id}`
                : `${API_BASE_URL}/api/projects`;

            const method = project._id ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });

            if (response.ok) {
                const savedProject = await response.json();
                if (!project._id) {
                    setContent(prev => ({
                        ...prev,
                        allProjects: prev.allProjects.map(p =>
                            (p.id === project.id && !p._id) ? { ...p, _id: savedProject._id, id: savedProject._id } : p
                        )
                    }));
                }
                return savedProject;
            } else {
                console.error("Sync Project Failed:", await response.text());
                alert("Failed to save project. Ensure you are logged in.");
            }
        } catch (error) {
            console.error('Error syncing project to backend:', error);
        }
    };

    const removeProject = async (id, token) => {
        if (!id) return;
        try {
            const response = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return response.ok;
        } catch (error) {
            console.error('Error deleting project from backend:', error);
        }
    };

    const syncTestimonial = async (t, token) => {
        try {
            const url = t._id ? `${API_BASE_URL}/api/testimonials/${t._id}` : `${API_BASE_URL}/api/testimonials`;
            const method = t._id ? 'PUT' : 'POST';
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
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
            } else {
                console.error("Sync Testimonial Failed");
                alert("Failed to save testimonial. Ensure you are logged in.");
            }
        } catch (e) { console.error(e); }
    };

    const removeTestimonial = async (id, token) => {
        if (!id) return;
        try {
            await fetch(`${API_BASE_URL}/api/testimonials/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } catch (e) { console.error(e); }
    };

    const syncInstagram = async (post, token) => {
        try {
            const url = post._id ? `${API_BASE_URL}/api/instagram/${post._id}` : `${API_BASE_URL}/api/instagram`;
            const method = post._id ? 'PUT' : 'POST';
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
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
            } else {
                console.error("Sync Instagram Failed");
                alert("Failed to save Instagram post.");
            }
        } catch (e) { console.error(e); }
    };

    const removeInstagram = async (id, token) => {
        if (!id) return;
        try {
            await fetch(`${API_BASE_URL}/api/instagram/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } catch (e) { console.error(e); }
    };

    const syncFounder = async (f, token) => {
        try {
            const url = f._id ? `${API_BASE_URL}/api/founders/${f._id}` : `${API_BASE_URL}/api/founders`;
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
                setContent(prev => {
                    const newFounders = { ...prev.founders };
                    if (saved.key && newFounders[saved.key]) {
                        newFounders[saved.key] = { ...newFounders[saved.key], ...saved, _id: saved._id };
                    }
                    return { ...prev, founders: newFounders };
                });
            } else {
                console.error("Sync Founder Failed");
                alert("Failed to save founder data.");
            }
        } catch (e) { console.error(e); }
    };

    const removeFounder = async (id, token) => {
        if (!id) return;
        try {
            await fetch(`${API_BASE_URL}/api/founders/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } catch (e) { console.error(e); }
    };

    const syncValue = async (v, token) => {
        try {
            const url = v._id ? `${API_BASE_URL}/api/values/${v._id}` : `${API_BASE_URL}/api/values`;
            const response = await fetch(url, {
                method: v._id ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
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
            } else {
                console.error("Sync Value Failed");
                alert("Failed to save value.");
            }
        } catch (e) { console.error(e); }
    };

    const removeValue = async (id, token) => {
        if (!id) return;
        try {
            await fetch(`${API_BASE_URL}/api/values/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } catch (e) { console.error(e); }
    };

    const syncBrand = async (c, token) => {
        console.log("Syncing Brand:", c);
        try {
            const url = c._id ? `${API_BASE_URL}/api/brands/${c._id}` : `${API_BASE_URL}/api/brands`;

            const response = await fetch(url, {
                method: c._id ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
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
            } else {
                console.error("Sync Brand Failed:", await response.text());
                alert("Failed to save brand to database. Please ensure you are logged in.");
            }
        } catch (e) {
            console.error("Sync Exception:", e);
            alert("Connection Error: Could not reach the server.");
        }
    };

    const removeBrand = async (id, token) => {
        if (!id) return;
        try {
            await fetch(`${API_BASE_URL}/api/brands/` + id, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } catch (e) { console.error(e); }
    };

    const syncSelectedWork = async (w, token) => {
        try {
            const url = w._id ? `${API_BASE_URL}/api/selected-work/${w._id}` : `${API_BASE_URL}/api/selected-work`;
            const method = w._id ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
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
                return saved;
            } else {
                console.error("Sync Selected Work Failed");
                alert("Failed to save selected work.");
            }
        } catch (e) { console.error(e); }
    };

    const removeSelectedWork = async (id, token) => {
        if (!id) return;
        try {
            await fetch(`${API_BASE_URL}/api/selected-work/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } catch (e) { console.error(e); }
    };

    // --- Cloud Storage Upload ---
    // --- Cloud Storage Upload (Cloudinary) ---
    const uploadFile = async (file) => {
        if (!file) return null;

        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

        if (!cloudName || !uploadPreset) {
            console.error("Cloudinary credentials missing! Check .env file.");
            alert("Cloudinary configuration missing. Please check console.");
            return null; // Stops the upload attempt
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);

        try {
            // Using 'auto' allows both image and video uploads
            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error.message || 'Upload failed');
            }

            const data = await response.json();
            return data.secure_url; // Returns the HTTPS URL
        } catch (error) {
            console.error("Cloudinary Upload Error:", error);
            throw error;
        }
    };

    const updateServices = async (newServices) => {
        setContent(prev => ({ ...prev, services: newServices }));
        try {
            await fetch(`${API_BASE_URL}/api/services`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).token : ''}`
                }, // Add Auth token
                body: JSON.stringify(newServices)
            });
        } catch (error) {
            console.error("Failed to update services", error);
        }
    };



    const refreshEnquiries = async (token) => {
        if (!token) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/messages`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                const formatted = Array.isArray(data) ? data.map((msg, idx) => ({
                    ...msg,
                    id: msg._id || `enquiry-${idx}`,
                    service: msg.service || 'General',
                    date: new Date(msg.createdAt).toLocaleDateString(),
                    time: new Date(msg.createdAt).toLocaleTimeString(),
                })) : [];
                setContent(prev => ({ ...prev, enquiries: formatted }));
            }
        } catch (e) {
            console.error("Failed to refresh enquiries", e);
        }
    };

    const refreshVibes = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/vibes`);
            if (res.ok) {
                const data = await res.json();
                setContent(prev => ({ ...prev, vibes: data || [] }));
            }
        } catch (e) {
            console.error("Failed to refresh vibes", e);
        }
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
            updateServices, // Newly added
            updateEnquiries,
            removeEnquiry,
            removeEnquiries,
            removeAllEnquiries,
            addEnquiry,
            resetContent,
            resetFounders,
            resetLegal,

            refreshEnquiries,
            uploadFile, // Export this
            updateLegalContent,
            updateSiteImage,
            addVibe,
            removeVibe,
            refreshVibes,
            // History
            undo, redo, canUndo, canRedo, takeSnapshot,
            // Missing Resets
            resetServices: async (token) => {
                // Default Services (Fallbacks)
                const defaults = [
                    {
                        "id": "1",
                        "title": "Branding",
                        "subtitle": "Identity & Strategy",
                        "description": "We craft unique brand identities that resonate with your audience.",
                        "longText": "Our branding process delves deep into your core values to create...",
                        "image": "/images/service_branding.png",
                        "accent": "#F5E6CC",
                        "textColor": "#5D4037"
                    },
                    {
                        "id": "2",
                        "title": "Social Media",
                        "subtitle": "Content & Growth",
                        "description": "Engaging content strategies to grow your digital presence.",
                        "longText": "We manage your social media channels with tailored content...",
                        "image": "/images/service_jewellery.png",
                        "accent": "#F5E6CC",
                        "textColor": "#5D4037"
                    },
                    {
                        "id": "3",
                        "title": "Production",
                        "subtitle": "Photo & Video",
                        "description": "High-quality production services for your brand assets.",
                        "longText": "From concept to final cut, our production team delivers...",
                        "image": "/images/service_decor.png",
                        "accent": "#F5E6CC",
                        "textColor": "#5D4037"
                    },
                    {
                        "id": "4",
                        "title": "Influencer",
                        "subtitle": "Marketing & reach",
                        "description": "Connecting your brand with the right voices.",
                        "longText": "Our influencer marketing strategies help you reach new audiences...",
                        "image": "/images/service_fashion.png",
                        "accent": "#004AAD",
                        "textColor": "#FFFFFF"
                    },
                    {
                        "id": "5",
                        "title": "Creative",
                        "subtitle": "Design & Direction",
                        "description": "Creative direction for campaigns and launches.",
                        "longText": "We provide creative direction that aligns with your brand goals...",
                        "image": "/images/service_lifestyle.png",
                        "accent": "#004AAD",
                        "textColor": "#FFFFFF"
                    }
                ];
                setContent(prev => ({ ...prev, services: defaults }));
                if (token) {
                    // Sync logic would go here if we had a bulk update endpoint
                    // For now, we just reset local state which syncs if we have individual updaters
                    alert("Services reset to defaults. Click 'View' to edit details.");
                }
            }
        }}>
            {children}
        </ContentContext.Provider>
    );
};
