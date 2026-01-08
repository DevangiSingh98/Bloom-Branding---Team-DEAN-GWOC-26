import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';

import Services from './pages/Services';
import Work from './pages/Work';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import { ContentProvider } from './context/ContentContext';
import { AnimatePresence } from 'framer-motion';

// Scroll to top on route change
// Scroll to top on route change and refresh
function ScrollToTop() {
    const { pathname } = useLocation();

    React.useEffect(() => {
        // Prevent browser from restoring scroll position on refresh
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }
    }, []); // Run once on mount

    React.useLayoutEffect(() => {
        // Immediate scroll
        window.scrollTo(0, 0);

        // Ensure it sticks (sometimes browsers fight back)
        const frameId = requestAnimationFrame(() => {
            window.scrollTo(0, 0);
        });

        return () => cancelAnimationFrame(frameId);
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
            </Routes>
        </AnimatePresence>
    );
}

function App() {
    return (
        <ContentProvider>
            <Router>
                <ScrollToTop />
                <Navbar />
                <AnimatedRoutes />
                <Footer />
            </Router>
        </ContentProvider>
    );
}

export default App;
