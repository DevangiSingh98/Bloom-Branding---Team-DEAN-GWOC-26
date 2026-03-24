import React, { useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';

const InstagramFeed = () => {
    useEffect(() => {
        // Load the Elfsight script dynamically when the component mounts
        const script = document.createElement('script');
        script.src = "https://elfsightcdn.com/platform.js";
        script.async = true;
        document.body.appendChild(script);

        return () => {
            // Cleanup script on unmount
            document.body.removeChild(script);
        };
    }, []);

    return (
        <section className="section-padding light-section">
            <div className="container" style={{ textAlign: 'center' }}>
                <a href="https://www.instagram.com/bloom.branding_/?hl=en" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h2 className="insta-title" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '2rem' }}>
                        @bloom.branding_ <ArrowUpRight size={40} strokeWidth={1} />
                    </h2>
                </a>
                
                {/* Elfsight Instagram Widget */}
                <div className="elfsight-app-a3cc93fe-4fe9-4652-8dc4-aab6bc14cbb2" data-elfsight-app-lazy></div>
            </div>
        </section>
    );
};

export default InstagramFeed;
