import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '../components/Footer';

const ClientDashboard = () => {
    const API_URL = import.meta.env.VITE_API_URL ||
        (window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://bloom-backend-pq68.onrender.com');
    const navigate = useNavigate();
    const [clientInfo, setClientInfo] = useState(null);
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAssets, setSelectedAssets] = useState(new Set());

    useEffect(() => {
        const checkAuth = async () => {
            const searchParams = new URLSearchParams(window.location.search);
            const loginSuccess = searchParams.get('login');

            if (loginSuccess === 'success') {
                try {
                    // Fetch user from session
                    // CRITICAL: Must send cookies for session auth
                    const { data: user } = await axios.get(`${API_URL}/auth/current_user`, {
                        withCredentials: true
                    });

                    if (user) {
                        // User object from Passport usually has googleId, etc.
                        // We need to ensure it has a token for future requests if we use JWT?
                        // Wait, passport session doesn't give a JWT. It gives a session cookie.
                        // BUT, our API routes protected by `protect` middleware expect `Bearere ${token}`.
                        // THIS IS A MISMATCH.

                        // FIX: We need generating a Token in the backend for the Google User.
                        // OR we rely on Session for everything?
                        // Existing Middleware `protect` uses:
                        // if (req.headers.authorization && req.headers.authorization.startsWith('Bearer'))

                        // Passport Session works differently.
                        // We need to return a Token from `/auth/current_user` or generate it in the Callback.

                        // Correction: Let's assume we want to Issue a Token.
                        // I will update the Frontend to expect a user object that contains a token (if I modify the backend).
                        // If I don't modify the backend, `req.user` is just the database user object.

                        // Let's modify `server.js` `current_user` route to issue a token if missing.

                        localStorage.setItem('clientInfo', JSON.stringify(user));
                        setClientInfo(user);
                        // Clean URL
                        window.history.replaceState({}, document.title, window.location.pathname);
                        return user;
                    }
                } catch (error) {
                    console.error("Failed to fetch Google user", error);
                    navigate('/client-login');
                    return null;
                }
            }

            // Normal check
            const storedInfo = localStorage.getItem('clientInfo')
                ? JSON.parse(localStorage.getItem('clientInfo'))
                : null;

            if (!storedInfo) {
                navigate('/client-login');
                return null;
            }

            setClientInfo(storedInfo);
            return storedInfo;
        };

        const init = async () => {
            const user = await checkAuth();
            if (!user) return; // Redirected already

            // Fetch Assets
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get(`${API_URL}/api/assets`, config);
                setAssets(data);
            } catch (error) {
                console.error("Failed to fetch assets", error);
                if (error.response && error.response.status === 401) {
                    navigate('/client-login');
                }
            } finally {
                setLoading(false);
            }
        };

        init();
    }, [navigate]);

    const logout = () => {
        localStorage.removeItem('clientInfo');
        navigate('/');
    };

    const toggleSelection = (id) => {
        const newSet = new Set(selectedAssets);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelectedAssets(newSet);
    };

    const handleSelectAll = () => {
        if (selectedAssets.size === assets.length && assets.length > 0) {
            setSelectedAssets(new Set());
        } else {
            setSelectedAssets(new Set(assets.map(a => a._id)));
        }
    };

    const handleDownloadSelected = async () => {
        // Trigger downloads for each selected asset
        const selected = assets.filter(a => selectedAssets.has(a._id));
        for (const asset of selected) {
            try {
                // Fetch blob to force download for cross-origin images
                const response = await fetch(asset.url);
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);

                const link = document.createElement('a');
                link.href = url;
                link.download = asset.title || 'download';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);

                // Small delay
                await new Promise(r => setTimeout(r, 500));
            } catch (error) {
                console.error("Download failed for", asset.title, error);
                // Fallback to direct link if fetch fails
                const link = document.createElement('a');
                link.href = asset.url;
                link.download = asset.title || 'download';
                link.target = '_blank';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
    };

    const handleDeleteSelected = async () => {
        if (!window.confirm(`Delete ${selectedAssets.size} items permanently?`)) return;

        try {
            const config = { headers: { Authorization: `Bearer ${clientInfo.token}` } };
            // Delete sequentially or parallel
            await Promise.all(Array.from(selectedAssets).map(id =>
                axios.delete(`/api/assets/${id}`, config)
            ));

            setAssets(prev => prev.filter(a => !selectedAssets.has(a._id)));
            setSelectedAssets(new Set());
        } catch (error) {
            console.error("Delete failed", error);
            alert("Some items could not be deleted.");
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
    };

    // Helper loading check before render logic if needed, or keep it simple.
    // The previous code had a loading check. Let's ensure we didn't delete that too?
    // Wait, the file view shows `if (loading) return (...)` is MISSING in the current view?
    // Looking at lines 118-120 in previous view_file... it just says `// ... (rest of code)`.
    // AH, the previous `replace_file_content` (Step 548) replaced a huge chunk including `loading` check and variants with `// ... (rest of code)`.
    // I NEED TO RESTORE ALL OF THAT.

    if (loading) return (
        <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', flexDirection: 'column', gap: '1rem' }}>
            <div className="loader" style={{ width: '40px', height: '40px', border: '2px solid #eee', borderTop: '2px solid black', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <span style={{ fontFamily: 'var(--font-subtitle)', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem' }}>Opening Vault...</span>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
    );

    return (
        <div style={{ backgroundColor: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* ACTION BAR (Fixed Bottom) */}
            <AnimatePresence>
                {selectedAssets.size > 0 && (
                    <motion.div
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        exit={{ y: 100 }}
                        style={{
                            position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
                            backgroundColor: 'black', color: 'white', padding: '1rem 2rem', borderRadius: '50px',
                            display: 'flex', gap: '2rem', alignItems: 'center', zIndex: 100,
                            boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
                        }}
                    >
                        <span style={{ fontFamily: 'var(--font-subtitle)', fontSize: '0.9rem' }}>{selectedAssets.size} Selected</span>
                        <div style={{ width: '1px', height: '20px', background: '#333' }} />
                        <button onClick={handleDownloadSelected} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontFamily: 'var(--font-subtitle)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Download</button>
                        <button onClick={handleDeleteSelected} style={{ background: 'none', border: 'none', color: '#ff4d4f', cursor: 'pointer', fontFamily: 'var(--font-subtitle)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Delete</button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* HEADER */}
            <div style={{ padding: '3rem 5%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #f5f5f5', textAlign: 'center', position: 'relative' }}>
                <div>
                    <h1 style={{ fontFamily: 'var(--font-brand)', fontSize: '4rem', margin: 0, lineHeight: 1 }}>THE VAULT</h1>
                    <div style={{ fontFamily: 'var(--font-subtitle)', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '1rem', color: '#666' }}>
                        {clientInfo?.companyName || 'Client Portal'}
                    </div>
                </div>

                <div style={{ position: 'absolute', right: '5%', bottom: '3rem', display: 'flex', gap: '3rem', alignItems: 'center' }}>
                    <button
                        onClick={handleSelectAll}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-subtitle)', textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '1px', borderBottom: '1px solid transparent', transition: 'border-color 0.3s' }}
                        onMouseEnter={(e) => e.target.style.borderBottom = '1px solid black'}
                        onMouseLeave={(e) => e.target.style.borderBottom = '1px solid transparent'}
                    >
                        {selectedAssets.size === assets.length && assets.length > 0 ? 'Deselect All' : 'Select All'}
                    </button>
                    <button
                        onClick={logout}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-subtitle)', textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '1px', color: '#999' }}
                    >
                        Exit Studio
                    </button>
                </div>
            </div>

            {/* GALLERY */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                style={{ flex: 1, padding: '3rem 5%' }}
            >
                {assets.length === 0 ? (
                    <div style={{ height: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: '#999' }}>
                        <p style={{ fontFamily: 'var(--font-brand)', fontSize: '2rem', marginBottom: '1rem' }}>Empty Canvas</p>
                        <p style={{ fontFamily: 'var(--font-subtitle)' }}>No assets have been archived yet.</p>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '4rem 2rem'
                    }}>
                        {assets.map((asset) => (
                            <motion.div
                                key={asset._id}
                                variants={itemVariants}
                                onClick={() => toggleSelection(asset._id)}
                                whileHover={{ y: -5 }}
                                style={{ cursor: 'pointer', position: 'relative' }}
                            >
                                {/* Selection Indicator */}
                                <div style={{
                                    position: 'absolute', top: '10px', left: '10px', zIndex: 10,
                                    width: '20px', height: '20px', borderRadius: '50%',
                                    border: '1px solid white',
                                    backgroundColor: selectedAssets.has(asset._id) ? 'black' : 'rgba(0,0,0,0.2)',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    {selectedAssets.has(asset._id) && <div style={{ width: '8px', height: '8px', backgroundColor: 'white', borderRadius: '50%' }} />}
                                </div>

                                {/* Asset Preview */}
                                <div style={{
                                    aspectRatio: '0.8',
                                    backgroundColor: '#f9f9f9',
                                    marginBottom: '1rem',
                                    overflow: 'hidden',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    {asset.type === 'video' ? (
                                        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                                            <video src={asset.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted playsInline onMouseOver={e => e.target.play()} onMouseOut={e => e.target.pause()} />
                                            <div style={{ position: 'absolute', bottom: '10px', right: '10px', backgroundColor: 'white', padding: '2px 8px', fontSize: '0.7rem', textTransform: 'uppercase', borderRadius: '4px', fontFamily: 'var(--font-subtitle)' }}>Video</div>
                                        </div>
                                    ) : (
                                        <img src={asset.url} alt={asset.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    )}
                                </div>

                                {/* Metadata */}
                                <div>
                                    <h3 style={{ fontFamily: 'var(--font-subtitle)', fontSize: '0.9rem', margin: '0 0 0.5rem 0', textTransform: 'uppercase', letterSpacing: '1px' }}>{asset.title}</h3>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#999', fontSize: '0.75rem', fontFamily: 'var(--font-subtitle)' }}>
                                        <span>{(asset.size / 1024 / 1024).toFixed(2)} MB {asset.format?.toUpperCase()}</span>
                                        <span>{new Date(asset.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>

            <Footer />
        </div>
    );
};

export default ClientDashboard;
