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
import { ContentProvider } from './context/ContentContext';
import { AnimatePresence } from 'framer-motion';
import Chatbot from './components/Chatbot';

// Scroll to top on route change and refresh
function ScrollToTop() {
    const { pathname } = useLocation();

    // Set manual scroll restoration once on mount
    React.useEffect(() => {
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }
    }, []);

    // Scroll to top on route change
    React.useLayoutEffect(() => {
        window.scrollTo(0, 0);
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
                <Chatbot />
                <Footer />
            </Router>
        </ContentProvider>
    );
}

export default App;
