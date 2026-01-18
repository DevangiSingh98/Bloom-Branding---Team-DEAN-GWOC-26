
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';

import Work from './pages/Work';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import Brands from './pages/Brands';
import { ContentProvider } from './context/ContentContext';
import { AnimatePresence } from 'framer-motion';
import Chatbot from './components/Chatbot';
import ClientLogin from './pages/ClientLogin'; // Import
import ClientDashboard from './pages/ClientDashboard'; // Import
import VaultLogin from './pages/VaultLogin'; // Import
import ClientResetPassword from './pages/ClientResetPassword'; // Import

// Scroll to top on route change
// Scroll to top on route change and refresh
function ScrollToTop() {
    const { pathname } = useLocation();

    React.useLayoutEffect(() => {
        // Dynamic Snap Logic
        if (pathname === '/' || pathname === '/services') {
            document.documentElement.style.scrollSnapType = 'y proximity';
        } else {
            document.documentElement.style.scrollSnapType = 'none';
        }

        // Disable smooth scroll for instant jump
        const originalScrollBehavior = document.documentElement.style.scrollBehavior;
        document.documentElement.style.scrollBehavior = 'auto';

        // Manual restoration setting to prevent browser interference
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }

        const resetScroll = () => {
            window.scrollTo(0, 0);
            document.documentElement.scrollTo(0, 0);
            document.body.scrollTo(0, 0);
        };

        // Attempt 1: Immediate
        resetScroll();

        // Attempt 2: Short delay to catch React render/paint
        const t1 = setTimeout(resetScroll, 10);

        // Attempt 3: Longer delay for browser restoration quirks
        const t2 = setTimeout(() => {
            resetScroll();
            // Restore original behavior
            document.documentElement.style.scrollBehavior = originalScrollBehavior;
        }, 100);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            document.documentElement.style.scrollBehavior = originalScrollBehavior;
            // Cleanup: Reset to default (optional, but good practice)
            document.documentElement.style.scrollSnapType = 'none';
        };
    }, [pathname]);

    return null;
}

function AnimatedRoutes() {
    const location = useLocation();
    return (
        <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />

                <Route path="/work" element={<Work />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/brands" element={<Brands />} />
                <Route path="/client-login" element={<VaultLogin />} /> {/* Updated to use VaultLogin */}
                <Route path="/vault" element={<ClientDashboard />} />
                <Route path="/vault/login" element={<VaultLogin />} /> {/* New Route */}
                <Route path="/reset-password/:token" element={<ClientResetPassword />} />
            </Routes>
        </AnimatePresence>
    );
}

function ConditionalFooter() {
    const location = useLocation();
    // Check if the current path starts with /work since there might be sub-routes like /work/project-name, 
    // BUT the user specifically said "for the works page". 
    // Assuming they mean the main work listing page. 
    // However, usually detailed pages also might want this or not. 
    // Let's stick to strict equality for now or strict equality to /work.
    // The user said "remove the footer from THIS page".
    // Check if the current path starts with /work since there might be sub-routes like /work/project-name, 
    // BUT the user specifically said "for the works page". 
    // Assuming they mean the main work listing page. 
    // However, usually detailed pages also might want this or not. 
    // Let's stick to strict equality for now or strict equality to /work.
    // The user said "remove the footer from THIS page".
    // Normalized path check to prevent duplication
    if (location.pathname.toLowerCase().replace(/\/$/, '') === '/about') {
        return null;
    }
    return <Footer />;
}

import Preloader from './components/Preloader';

function App() {
    const [loading, setLoading] = React.useState(true);

    return (
        <ContentProvider>
            <Router>
                <ScrollToTop />
                <AnimatePresence mode="wait">
                    {loading && <Preloader key="preloader" setLoading={setLoading} />}
                </AnimatePresence>
                {!loading && (
                    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                        <Navbar />
                        <main style={{ flex: 1 }}>
                            <AnimatedRoutes />
                        </main>
                        <ConditionalFooter />
                        <Chatbot />
                    </div>
                )}
            </Router>
        </ContentProvider>
    );
}

export default App;
