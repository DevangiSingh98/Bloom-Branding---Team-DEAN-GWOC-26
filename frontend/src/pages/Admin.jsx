import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContent } from '../context/ContentContext';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const FileUpload = ({ label, value, onFileSelect, onRemove, type = "image", onUpload, pathPrefix, previewBg }) => {
    const [fileName, setFileName] = useState("No file chosen");
    const fileInputRef = React.useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name);

            // OPTIMIZATION: If onUpload is provided (Cloud Storage), upload RAW file immediately.
            // Skipping client-side compression to ensure <10s upload speeds for large files.
            if (onUpload) {
                const folder = pathPrefix || 'uploads';
                const cleanName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
                const storagePath = `${folder}/${Date.now()}_${cleanName}`;

                setFileName("Uploading (Raw)...");
                onUpload(file, storagePath).then(url => {
                    setFileName(file.name + " (Uploaded)");
                    onFileSelect(url);
                }).catch(err => {
                    setFileName("Upload Failed");
                    console.error(err);
                });
                return;
            }

            // Legacy Logic (Base64/Canvas) - Only used if no onUpload provided
            const reader = new FileReader();
            reader.onloadend = () => {
                if (type === 'video') {
                    onFileSelect(reader.result);
                    return;
                }

                // Image compression logic (Legacy)
                const img = new Image();
                img.src = reader.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;
                    const MAX_WIDTH = 800;
                    const MAX_HEIGHT = 800;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    const compressedDataUrl = canvas.toDataURL('image/png');
                    onFileSelect(compressedDataUrl);
                };
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '1.1rem', marginBottom: '0.5rem', color: '#666' }}>{label}</label>
            <div className="file-upload-container" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '5px',
                    overflow: 'hidden',
                    border: '1px solid #ddd',
                    backgroundColor: '#eee',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                }}>
                    {value ? (
                        type === 'video' ? (
                            <span style={{ fontSize: '0.5rem' }}>Video Set</span>
                        ) : (
                            <img src={value} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        )
                    ) : (
                        <img src="/images/pfp.jpg" alt="Default" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }} />
                    )}
                </div>

                <input
                    type="file"
                    accept={type === 'video' ? "video/*" : "image/*"}
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                />
                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                    <button
                        className="admin-upload-btn"
                        onClick={() => fileInputRef.current.click()}
                        style={{
                            padding: '0.8rem 1.2rem',
                            fontSize: '1rem',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            backgroundColor: '#f0f0f0',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {value ? 'Change' : 'Choose File'}
                    </button>
                    {(value || type === 'video') && (
                        <button
                            className="admin-remove-btn"
                            disabled={!value}
                            onClick={() => {
                                setFileName("No file chosen");
                                if (onRemove) onRemove();
                            }}
                            title="Remove File"
                            style={{
                                padding: '0.5rem',
                                width: '32px',
                                height: '32px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1rem',
                                border: `1px solid ${value ? '#ff4d4f' : '#ccc'}`,
                                borderRadius: '4px',
                                backgroundColor: 'transparent',
                                color: value ? '#ff4d4f' : '#ccc',
                                cursor: value ? 'pointer' : 'not-allowed'
                            }}
                        >
                            ✕
                        </button>
                    )}
                </div>
            </div>
            {/* Show filename below with truncation */}
            <div className="truncate-text" style={{ fontSize: '0.85rem', color: '#888', marginTop: '0.5rem', width: '100%' }}>
                {fileName}
            </div>
        </div>
    );
};

// ... (Rest of code)

// Helper for Instagram Preview
// Helper for Instagram Preview
const getInstagramSrc = (src) => {
    if (!src) return null;
    if (src.includes('instagram.com/p/')) {
        // Strip query params (?...) and trailing slash, then append media modifier
        const baseUrl = src.split('?')[0].replace(/\/$/, '');
        return baseUrl + '/media/?size=l';
    }
    return src;
};



const CustomModal = ({ show, title, message, type = 'info', onConfirm, onCancel, confirmText, confirmColor }) => {
    if (!show) return null;
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0,0,0,0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                backdropFilter: 'blur(4px)'
            }}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                className="modal-content"
                style={{
                    backgroundColor: 'white',
                    borderRadius: '24px',
                    maxWidth: '450px',
                    width: '90%',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
                    border: '1px solid #eee',
                    position: 'relative'
                }}
            >
                <button
                    onClick={onCancel}
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: 'none',
                        border: 'none',
                        fontSize: '1.2rem',
                        cursor: 'pointer',
                        color: '#999',
                        padding: '5px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={e => e.target.style.backgroundColor = '#f5f5f5'}
                    onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}
                >
                    ✕
                </button>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                    {type === 'confirm' ? '❓' : type === 'success' ? '✨' : '⚠️'}
                </div>
                <h3 style={{
                    fontSize: '1.8rem',
                    marginBottom: '0.8rem',
                    color: 'var(--color-electric-blue)',
                    fontFamily: 'Bigilla, serif'
                }}>{title}</h3>
                <p style={{ color: '#666', lineHeight: 1.6, marginBottom: '2rem', fontSize: '1.1rem', textAlign: 'center' }}>{message}</p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    {type === 'confirm' && (
                        <button
                            onClick={onCancel}
                            style={{
                                padding: '0.8rem 1.8rem',
                                borderRadius: '30px',
                                border: '1px solid #ddd',
                                backgroundColor: 'transparent',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                color: '#555'
                            }}
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        onClick={onConfirm}
                        style={{
                            padding: '0.8rem 2.2rem',
                            borderRadius: '30px',
                            border: 'none',
                            backgroundColor: confirmColor || (type === 'confirm' ? '#5D4037' : 'var(--color-electric-blue)'),
                            color: 'white',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                    >
                        {confirmText || (type === 'confirm' ? 'Delete' : 'Got it')}
                    </button>
                </div>
            </motion.div>
        </motion.div >
    );
};

const AuthInput = ({ type, placeholder, value, onChange }) => {
    const [focused, setFocused] = useState(false);
    return (
        <div style={{ position: 'relative', marginBottom: '1.2rem' }}>
            <input
                type={type}
                value={value}
                onChange={onChange}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                style={{
                    width: '100%',
                    padding: '0.8rem 0',
                    border: 'none',
                    borderBottom: focused ? '2px solid var(--color-electric-blue)' : '1px solid #ddd',
                    outline: 'none',
                    fontSize: '1.2rem',
                    fontFamily: 'var(--font-body)',
                    color: '#333',
                    backgroundColor: 'transparent',
                    transition: 'border-color 0.3s ease'
                }}
            />
            <label style={{
                position: 'absolute',
                left: 0,
                top: focused || value ? '-0.8rem' : '0.8rem',
                fontSize: focused || value ? '0.9rem' : '1.2rem',
                color: focused ? 'var(--color-electric-blue)' : '#999',
                transition: 'all 0.3s ease',
                pointerEvents: 'none',
                fontFamily: 'var(--font-body)'
            }}>
                {placeholder}
            </label>
        </div>
    );
};

const AuthButton = ({ onClick, children, disabled, variant = 'primary', style }) => (
    <button
        type={onClick ? "button" : "submit"}
        onClick={onClick}
        disabled={disabled}
        style={{
            width: '100%',
            padding: '1rem',
            backgroundColor: variant === 'primary' ? 'var(--color-electric-blue)' : 'transparent',
            color: variant === 'primary' ? 'white' : '#666',
            border: 'none',
            borderRadius: '50px',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.7 : 1,
            transition: 'all 0.2s',
            fontFamily: 'var(--font-body)',
            boxShadow: variant === 'primary' ? '0 10px 20px rgba(0, 74, 173, 0.2)' : 'none',
            marginTop: variant === 'secondary' ? '0' : '1rem',
            ...style
        }}
        onMouseEnter={e => !disabled && (e.currentTarget.style.transform = 'translateY(-2px)')}
        onMouseLeave={e => !disabled && (e.currentTarget.style.transform = 'translateY(0)')}
    >
        {children}
    </button>
);

const InstagramPreview = ({ item }) => {
    const [imgError, setImgError] = React.useState(false);

    // 1. Video Support
    if (item.link && item.link.match(/\.(mp4|webm|ogg)$/i)) {
        return <video src={item.link} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />;
    }

    // 2. Placeholder Logic
    // If we have an error, OR if it's an IG link without a custom image update
    // (We assume if image === link, it's basically just the default state)
    const isIgLink = item.link && item.link.includes('instagram.com');
    const isDefaultImage = item.image && item.image.includes('instagram.com');

    if (imgError || (isIgLink && isDefaultImage)) {
        return (
            <div style={{
                width: '100%', height: '100%',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                color: 'white', fontSize: '0.8rem', textAlign: 'center', padding: '5px'
            }}>
                <span style={{ fontSize: '0.7rem' }}>{imgError ? 'No Preview' : 'IG Post'}</span>
            </div>
        );
    }

    // 3. Image Render
    return (
        <img
            src={item.image || item.link}
            alt="Preview"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={() => setImgError(true)}
        />
    );
};

const Admin = () => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    // Auth State
    const [userInfo, setUserInfo] = useState(() => {
        const saved = localStorage.getItem('userInfo');
        return saved ? JSON.parse(saved) : null;
    });
    const [loginData, setLoginData] = useState({ username: '', password: '' });
    const [authError, setAuthError] = useState('');

    // Forgot Password State
    const [forgotStep, setForgotStep] = useState(0); // 0: Login, 1: Enter Email, 2: Enter Token
    const [resetEmail, setResetEmail] = useState('');
    const [resetToken, setResetToken] = useState('');
    const [resetData, setResetData] = useState({ newPassword: '', confirmPassword: '' });
    const [resetMessage, setResetMessage] = useState({ type: '', text: '' });
    const [showPreview, setShowPreview] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const handleSendEmail = async (e) => {
        e.preventDefault();
        setResetMessage({ type: '', text: '' });
        setIsLoading(true);

        try {
            const res = await fetch(`${API_URL}/api/users/forgotpassword`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: resetEmail })
            });
            const data = await res.json();

            if (res.ok) {
                setForgotStep(2);
                setResetMessage({ type: 'success', text: 'Email sent! Check your inbox for the token.' });
            } else {
                setResetMessage({ type: 'error', text: data.message || 'Error sending email' });
            }
        } catch (err) {
            setResetMessage({ type: 'error', text: 'Connection failed' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setResetMessage({ type: '', text: '' });

        if (resetData.newPassword !== resetData.confirmPassword) {
            setResetMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/users/resetpassword`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    resetToken: resetToken,
                    newPassword: resetData.newPassword
                })
            });
            const data = await res.json();

            if (res.ok) {
                setResetMessage({ type: 'success', text: 'Password updated! Please login.' });
                setTimeout(() => {
                    setForgotStep(0);
                    setResetMessage({ type: '', text: '' });
                    setResetData({ newPassword: '', confirmPassword: '' });
                    setResetToken('');
                    setResetEmail('');
                    window.history.replaceState({}, document.title, window.location.pathname);
                }, 3000);
            } else {
                setResetMessage({ type: 'error', text: data.message || 'Reset failed' });
            }
        } catch (err) {
            setResetMessage({ type: 'error', text: 'Connection failed' });
        } finally {
            setIsLoading(false);
        }
    };

    // Magic Link Detection
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('resetToken');
        if (token) {
            setResetToken(token);
            setForgotStep(2);
        }
    }, []);


    const {
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
        updateServices,
        updateEnquiries,
        removeEnquiry,
        removeEnquiries,
        removeAllEnquiries,
        addEnquiry,
        resetContent,
        resetFounders,
        resetLegal,
        resetServices,
        refreshEnquiries,
        uploadFile,
        updateLegalContent,
        updateSiteImage,
        undo, redo, canUndo, canRedo, takeSnapshot,
        refreshVibes, // Added refreshVibes
        addVibe,
        removeVibe
    } = useContent();

    const [activeTab, setActiveTab] = useState('enquiries');
    const [clients, setClients] = useState([]);
    const [filteredClients, setFilteredClients] = useState([]);

    // Asset Management State
    const [assetModalOpen, setAssetModalOpen] = useState(false);
    const [selectedClientForAssets, setSelectedClientForAssets] = useState(null);
    const [clientAssets, setClientAssets] = useState([]);
    const [uploadingAssets, setUploadingAssets] = useState(false);

    useEffect(() => {
        if (userInfo && userInfo.token) {
            refreshEnquiries(userInfo.token);
            refreshVibes(); // Fetch Vibes
            // Site images, projects, etc. are fetched on mount in ContentContext.
            // But if we want to be sure:
            // updateSiteImage? No, that's for single update.
            // We assume ContentContext initial fetch worked. IF not, we might need a manual refresh.

            const fetchClients = async () => {
                try {
                    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                    const { data } = await axios.get('/api/users', config);
                    const safeData = Array.isArray(data) ? data : [];
                    setClients(safeData);
                    setFilteredClients(safeData);
                } catch (error) { console.error("Error fetching users", error); setClients([]); setFilteredClients([]); }
            };
            fetchClients();
        }
    }, [userInfo, activeTab]);
    const [openEnquiryId, setOpenEnquiryId] = useState(null);
    const [aiIdeas, setAiIdeas] = useState({}); // Store ideas by enquiry ID
    const [loadingAi, setLoadingAi] = useState(null); // ID of enquiry currently generating
    const [aiError, setAiError] = useState({}); // Store errors per enquiry ID
    const [newVibeInput, setNewVibeInput] = useState('');

    const [isInitializing, setIsInitializing] = useState(false);
    const [legalForm, setLegalForm] = useState({ privacy: '', terms: '' });

    // Sync legal form with content when loaded or tab changed
    useEffect(() => {
        if (activeTab === 'legal') {
            if (content.legal) {
                setLegalForm({
                    privacy: content.legal.privacy || '',
                    terms: content.legal.terms || ''
                });
            }
        }
    }, [content.legal, activeTab]);

    // Enquiry Deletion Logic
    const [selectedEnquiries, setSelectedEnquiries] = useState(new Set());

    const toggleSelect = (id) => {
        const newSelected = new Set(selectedEnquiries);
        if (newSelected.has(id)) newSelected.delete(id);
        else newSelected.add(id);
        setSelectedEnquiries(newSelected);
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedEnquiries(new Set(content.enquiries.map(enq => enq.id)));
        } else {
            setSelectedEnquiries(new Set());
        }
    };

    const handleDeleteEnquiry = (id) => {
        showAlert("Delete Enquiry?", "Are you sure you want to delete this enquiry?", "warning", () => {
            removeEnquiry(id, userInfo.token);
        }, "Delete", "red");
    };

    const handleBulkDelete = () => {
        if (selectedEnquiries.size === 0) return;
        showAlert("Delete Enquiries?", `Delete ${selectedEnquiries.size} selected items?`, "warning", () => {
            removeEnquiries(Array.from(selectedEnquiries), userInfo.token);
            setSelectedEnquiries(new Set());
        }, "Delete All", "red");
    };

    // --- AI GENERATION LOGIC ---
    const handleGenerateIdeas = async (enquiry) => {
        setLoadingAi(enquiry.id);
        setAiError(prev => ({ ...prev, [enquiry.id]: null })); // Clear prev errors
        try {
            console.log("Generating ideas for:", enquiry.company);
            const { data } = await axios.post('/api/ai/generate', {
                service: enquiry.service,
                message: enquiry.message,
                company: enquiry.company,
                vibe: (enquiry.vibes && enquiry.vibes.length > 0) ? enquiry.vibes.join(', ') : (enquiry.vibeDescription || enquiry.budget),
                vibeDescription: enquiry.vibeDescription
            }, {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });

            console.log("AI Response:", data);
            setAiIdeas(prev => ({ ...prev, [enquiry.id]: data.ideas }));
        } catch (error) {
            console.error("AI Generation Failed:", error);
            const msg = error.response && error.response.data && error.response.data.message
                ? error.response.data.message
                : "Failed to generate ideas.";
            setAiError(prev => ({ ...prev, [enquiry.id]: msg }));
        } finally {
            setLoadingAi(null);
        }
    };


    const logout = () => {
        localStorage.removeItem('userInfo');
        setUserInfo(null);
        window.location.reload(); // Force reload to clear any context/cache
    };

    const handleDeleteAllEnquiries = () => {
        showAlert("Delete ALL?", "Are you sure you want to delete ALL enquiries? This cannot be undone.", "warning", () => {
            removeAllEnquiries(userInfo.token);
            setSelectedEnquiries(new Set());
        }, "Delete ALL", "red");
    };

    // Fetch Enquiries when tab is active and user is logged in
    useEffect(() => {
        if (activeTab === 'enquiries' && userInfo && userInfo.token) {
            const fetchEnquiries = async () => {
                try {
                    const res = await fetch(`${API_URL}/api/messages`, {
                        headers: {
                            Authorization: `Bearer ${userInfo.token}`
                        }
                    });
                    if (res.ok) {
                        const data = await res.json();
                        // Format msg for UI: backend fields -> UI fields
                        const formatted = data.map(msg => ({
                            id: msg._id,
                            name: msg.name,
                            email: msg.email,
                            message: msg.message,
                            service: msg.service || 'General',
                            company: msg.company,
                            budget: msg.budget,
                            timeline: msg.timeline,
                            vibes: msg.vibes, // Added
                            vibeDescription: msg.vibeDescription, // Added
                            date: new Date(msg.createdAt).toLocaleDateString(),
                            time: new Date(msg.createdAt).toLocaleTimeString(),
                            read: msg.read
                        }));
                        // Backend already sorts by createdAt: -1 (newest first), so no need to reverse
                        updateEnquiries(formatted);
                    }
                } catch (e) {
                    console.error("Failed to fetch enquiries", e);
                }
            };
            fetchEnquiries();
        }
    }, [activeTab, userInfo]); // Removed updateEnquiries from deps to avoid loop if unstable

    // Custom Modal State
    const [modal, setModal] = useState({ show: false, title: '', message: '', type: 'info', onConfirm: () => { }, confirmText: '', confirmColor: '' });

    const showAlert = (title, message, type = 'info', onConfirm = null, confirmText = '', confirmColor = '') => {
        setModal({
            show: true,
            title,
            message,
            type,
            confirmText,
            confirmColor,
            onConfirm: () => {
                if (onConfirm) onConfirm();
                setModal(prev => ({ ...prev, show: false }));
            },
            onCancel: () => setModal(prev => ({ ...prev, show: false }))
        });
    };

    const showConfirm = (title, message, onConfirm, confirmText = '', confirmColor = '') => {
        showAlert(title, message, 'confirm', onConfirm, confirmText, confirmColor);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setAuthError('');
        try {
            const res = await fetch(`${API_URL}/api/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData)
            });
            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('userInfo', JSON.stringify(data));
                setUserInfo(data);
            } else {
                setAuthError(data.message || 'Invalid credentials');
            }
        } catch (err) {
            setAuthError('Connection failed');
        }
    };



    // Asset Management Functions
    const openAssetManager = async (client) => {
        setSelectedClientForAssets(client);
        setAssetModalOpen(true);
        // Fetch existing assets
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await axios.get(`/api/assets?userId=${client._id}`, config);
            setClientAssets(data);
        } catch (error) {
            console.error("Failed to fetch assets", error);
            alert("Could not load assets.");
        }
    };

    const handleAssetDelete = async (assetId) => {
        if (!window.confirm("Delete this asset?")) return;
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            await axios.delete(`/api/assets/${assetId}`, config);
            setClientAssets(prev => prev.filter(a => a._id !== assetId));
        } catch (error) {
            console.error("Failed to delete asset", error);
            alert("Failed to delete asset.");
        }
    };

    const handleAssetUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setUploadingAssets(true);
        try {
            // We can reuse the uploadFile from context logic if it exposes a raw upload function,
            // but usually it expects to update state. 
            // We'll assume we have a generic upload helper or use the cloud logic directly.
            // Since `uploadFile` in context updates STATE, we need a raw upload function. 
            // Let's rely on the fact that `uploadFile` (from context) might be for SINGLE file -> State.
            // We need a loop here. 
            // Actually, `uploadFile` in `ContentContext` likely handles the cloudinary post.
            // We should peek generic content context? 
            // For now, let's implement a direct Cloudinary upload loop here or use a helper if available,
            // OR if `uploadFile` is the generic one.

            // Assuming we need to implement raw upload here similar to how `ContentContext` probably does it.
            // Let's use the `/api/upload` endpoint if it existed, BUT `ContentContext` usually does client-side upload to Cloudinary?
            // Wait, looking at previous code `FileUpload` uses `uploadFile`.

            // Let's assume `uploadFile` takes (file) and returns URL. 
            // If `uploadFile` is NOT exposed as a raw function returning a promise of URL, we might need to add one.
            // Checking `ContentContext`: `uploadFile` was destructured. 

            // Let's try to fetch a signature or use an unassigned upload preset if configured.
            // Better: Let's create `uploadAssetToCloud` helper inside logic here if possible, 
            // Or assume `uploadFile` returns the URL. 

            // WORKAROUND: We will iterate and use `uploadFile` if it returns data.
            // Detailed check of `ContentContext` showed `uploadFile` updates state directly? 
            // No, `FileUpload` calls `onUpload`.

            // Let's look at `ContentContext` later. For now, I'll skeleton the loop.

            // Parallel Uploads
            const uploadPromises = files.map(async (file) => {
                const fileUrl = await uploadFile(file);
                if (!fileUrl) throw new Error(`Failed to upload ${file.name}`);

                const assetData = {
                    title: file.name,
                    type: file.type.startsWith('video') ? 'video' : 'image',
                    url: fileUrl,
                    userId: selectedClientForAssets._id,
                    format: file.name.split('.').pop(),
                    size: file.size
                };

                const { data: newAsset } = await axios.post('/api/assets', assetData, {
                    headers: { Authorization: `Bearer ${userInfo.token}` }
                });
                return newAsset;
            });

            const newAssets = await Promise.all(uploadPromises);
            setClientAssets(prev => [...newAssets, ...prev]);
            alert("Upload Complete!");
        } catch (error) {
            console.error("Upload failed", error);
            alert("Upload failed. Ensure you have an Upload Route working.");
        } finally {
            setUploadingAssets(false);
            e.target.value = null; // reset input
        }
    };




    const initializeDatabase = async () => {
        showConfirm(
            "Initialize Database",
            "This will sync all your current local content (Projects, Testimonials, etc.) to the database. Ready to bloom?",
            async () => {
                setIsInitializing(true);
                try {
                    // Sync Hero
                    if (content.hero) await updateHero(content.hero); // updateHero already handles its own sync internally in ContentContext without token param? Checks... updateHero in ContentContext uses fetch but NO token? need to check updateHero too.

                    // Sync All Projects
                    if (content.allProjects) {
                        for (const item of content.allProjects) {
                            await syncProject(item, userInfo.token);
                        }
                    }

                    // Sync Selected Work (Projects on Work page)
                    if (content.selectedWork) {
                        for (const item of content.selectedWork) {
                            await syncSelectedWork(item, userInfo.token);
                        }
                    }

                    // --- 3. FILTER SITE IMAGES (Exclude 'Expertise' / Services) ---
                    // Only allow Home, About, Menu, Logo
                    const ALLOWED_IMAGE_TYPES = ['home', 'about', 'menu', 'logo', 'background'];

                    const filteredSiteImages = (Array.isArray(content.siteImages) ? content.siteImages : []).filter(img => {
                        // Basic filter: Check if category or ID implies "expert" or "service"
                        const lowerId = (img.id || '').toLowerCase();
                        const lowerCat = (img.category || '').toLowerCase();

                        // Explicit exclusions
                        if (lowerId.includes('expert') || lowerCat.includes('expert')) return false;
                        if (lowerId.includes('service') || lowerCat.includes('service')) return false;

                        return true;
                    }) || [];
                    // Sync Testimonials
                    if (content.testimonials) {
                        for (const item of content.testimonials) {
                            await syncTestimonial(item, userInfo.token);
                        }
                    }

                    // Sync Instagram
                    if (content.instagram) {
                        for (const item of content.instagram) {
                            await syncInstagram(item, userInfo.token);
                        }
                    }

                    // Sync Values
                    if (content.values) {
                        for (const item of content.values) {
                            await syncValue(item, userInfo.token);
                        }
                    }

                    // Sync Brands
                    if (content.brandLogos) {
                        for (const item of content.brandLogos) {
                            await syncBrand(item, userInfo.token);
                        }
                    }

                    // Sync Founders
                    if (content.founders) {
                        if (content.founders.left) await syncFounder({ ...content.founders.left, key: 'left' }, userInfo.token);
                        if (content.founders.right) await syncFounder({ ...content.founders.right, key: 'right' }, userInfo.token);
                        // Check if main exists as an object now
                        if (content.founders.main) await syncFounder({ ...content.founders.main, key: 'main' }, userInfo.token);
                    }

                    showAlert("Success!", "Database initialization complete! Everything is now synced and safely stored.", "success");
                } catch (error) {
                    console.error("Initialization failed:", error);
                    showAlert("Sync Error", `Initialization failed: ${error.message || 'Unknown error'}. Please check the console for details.`, "error");
                } finally {
                    setIsInitializing(false);
                }
            },
            "Sync Now",
            "var(--color-electric-blue)"
        );
    };

    // Delete Modal State
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        type: null,
        index: null
    });

    const handleHeroChange = (e) => {
        takeSnapshot();
        updateHero({ [e.target.name]: e.target.value }, userInfo.token);
    };

    const handleFoundersChange = (section, field, value) => {
        takeSnapshot();
        const newFounders = { ...content.founders };
        // Ensure section object exists
        if (!newFounders[section]) newFounders[section] = {};

        newFounders[section] = { ...newFounders[section], [field]: value };
        updateFounders(newFounders);
        syncFounder({ ...newFounders[section], key: section }, userInfo.token);
    };

    const handleArrayChange = (index, field, value, type) => {
        takeSnapshot();
        let newArray;
        if (type === 'work') {
            newArray = [...content.selectedWork];
            newArray[index] = { ...newArray[index], [field]: value };
            updateSelectedWork(newArray);
            syncSelectedWork(newArray[index], userInfo.token);
        } else if (type === 'projects') {
            newArray = [...content.allProjects];
            newArray[index] = { ...newArray[index], [field]: value };
            updateAllProjects(newArray);
            syncProject(newArray[index], userInfo.token);
        } else if (type === 'testimonials') {
            newArray = [...content.testimonials];
            newArray[index] = { ...newArray[index], [field]: value };
            updateTestimonials(newArray);
            syncTestimonial(newArray[index], userInfo.token);
        } else if (type === 'instagram') {
            newArray = [...content.instagram];
            newArray[index] = { ...newArray[index], [field]: value };
            updateInstagram(newArray);
            syncInstagram(newArray[index], userInfo.token);
        } else if (type === 'values') {
            newArray = [...content.values];
            newArray[index] = { ...newArray[index], [field]: value };
            updateValues(newArray);
            syncValue(newArray[index], userInfo.token);
        } else if (type === 'brands') {
            newArray = [...content.brandLogos];
            newArray[index] = { ...newArray[index], [field]: value };
            updateBrandLogos(newArray);
            syncBrand(newArray[index], userInfo.token);
        }
    };

    const handleProjectImageChange = (index, imgIndex, val) => {
        takeSnapshot();
        const newArray = [...content.allProjects];
        const project = newArray[index];
        // Ensure images array exists
        const images = project.images ? [...project.images] : (project.image ? [project.image] : []);

        // Pad array if needed
        while (images.length <= imgIndex) {
            images.push("");
        }

        images[imgIndex] = val;

        // Update both 'images' array AND 'image' (main) for backwards compat
        newArray[index] = {
            ...project,
            images: images,
            image: images[0] || ""
        };

        updateAllProjects(newArray);
        syncProject(newArray[index], userInfo.token);
    };

    const addItem = async (type) => {
        takeSnapshot();
        const tempId = Date.now() + Math.random();
        // PREPEND new items to make them appear at the top
        if (type === 'work') {
            const newItem = { id: tempId, title: "New Project", category: "Category", image: "" };
            updateSelectedWork([newItem, ...content.selectedWork]);
        } else if (type === 'projects') {
            const newProject = { id: tempId, title: "New Project", category: "Category", image: "", description: "Description" };
            updateAllProjects([newProject, ...content.allProjects]);
        } else if (type === 'testimonials') {
            const newItem = { id: tempId, text: "New testimonial", author: "Author", rating: 5 };
            updateTestimonials([newItem, ...content.testimonials]);
        } else if (type === 'instagram') {
            const newItem = { id: tempId, image: "", link: "#" };
            updateInstagram([newItem, ...content.instagram]);
        } else if (type === 'values') {
            const newItem = { id: tempId, title: "New Value", text: "Description" };
            updateValues([newItem, ...content.values]);
        } else if (type === 'brands') {
            const newItem = { id: tempId, logo: "" };
            updateBrandLogos([newItem, ...content.brandLogos]);
        }
    };

    const deleteItem = async (index, type) => {
        takeSnapshot();
        showConfirm(
            "Confirm Deletion",
            `Are you sure you want to delete this ${type.slice(0, -1)}? This cannot be undone.`,
            async () => {
                let newArray;
                if (type === 'projects') {
                    const item = content.allProjects[index];
                    if (item._id) await removeProject(item._id, userInfo.token);
                } else if (type === 'testimonials') {
                    const item = content.testimonials[index];
                    if (item._id) await removeTestimonial(item._id, userInfo.token);
                } else if (type === 'instagram') {
                    const item = content.instagram[index];
                    if (item._id) await removeInstagram(item._id, userInfo.token);
                } else if (type === 'work') {
                    const item = content.selectedWork[index];
                    if (item._id) await removeSelectedWork(item._id, userInfo.token);
                } else if (type === 'values') {
                    const item = content.values[index];
                    if (item._id) await removeValue(item._id, userInfo.token);
                } else if (type === 'brands') {
                    const item = content.brandLogos[index];
                    if (item._id) await removeBrand(item._id, userInfo.token);
                }

                if (type === 'work') newArray = content.selectedWork.filter((_, i) => i !== index);
                else if (type === 'projects') newArray = content.allProjects.filter((_, i) => i !== index);
                else if (type === 'testimonials') newArray = content.testimonials.filter((_, i) => i !== index);
                else if (type === 'instagram') newArray = content.instagram.filter((_, i) => i !== index);
                else if (type === 'values') newArray = content.values.filter((_, i) => i !== index);
                else if (type === 'brands') newArray = content.brandLogos.filter((_, i) => i !== index);

                if (type === 'work') updateSelectedWork(newArray);
                else if (type === 'projects') updateAllProjects(newArray);
                else if (type === 'testimonials') updateTestimonials(newArray);
                else if (type === 'instagram') updateInstagram(newArray);
                else if (type === 'values') updateValues(newArray);
                else if (type === 'brands') updateBrandLogos(newArray);
            },
            "Delete",
            "#5D4037"
        );
    };

    if (!userInfo) {
        return (
            <div style={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f8f9fa',
                backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)',
                backgroundSize: '24px 24px'
            }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="admin-login-container"
                    style={{
                        background: 'rgba(255, 255, 255, 0.85)',
                        backdropFilter: 'blur(12px)',
                        borderRadius: '24px',
                        boxShadow: '0 20px 50px -12px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.05)',
                        border: '1px solid rgba(255,255,255,0.6)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'linear-gradient(90deg, var(--color-electric-blue), #4ecdc4)' }} />

                    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <h2 className="admin-login-title">
                            {forgotStep === 1 ? 'Forgot Password' : forgotStep === 2 ? 'Reset Access' : 'Admin Access'}
                        </h2>
                        <p style={{ fontFamily: 'var(--font-body)', color: '#666', fontSize: '1.2rem' }}>
                            {forgotStep === 1 ? 'Enter your email to receive a secure token.' :
                                forgotStep === 2 ? 'Creating a new secure password.' :
                                    'Welcome back. Please login to enter the studio.'}
                        </p>
                    </div>

                    <AnimatePresence mode="wait">
                        {forgotStep === 0 && (
                            <motion.form
                                key="login"
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: 20, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                onSubmit={handleLogin}
                            >
                                <AuthInput
                                    type="text"
                                    placeholder="Username"
                                    value={loginData.username}
                                    onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                                />
                                <AuthInput
                                    type="password"
                                    placeholder="Password"
                                    value={loginData.password}
                                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                />

                                {authError && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        style={{ color: '#e74c3c', textAlign: 'center', fontSize: '0.9rem', marginTop: '1rem', background: '#fdeded', padding: '0.5rem', borderRadius: '8px' }}
                                    >
                                        {authError}
                                    </motion.p>
                                )}

                                <AuthButton>Enter</AuthButton>
                                <AuthButton variant="secondary" onClick={() => { setForgotStep(1); setResetMessage({ type: '', text: '' }); }}>
                                    Forgot Password?
                                </AuthButton>
                            </motion.form>
                        )}

                        {forgotStep === 1 && (
                            <motion.form
                                key="email"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                onSubmit={handleSendEmail}
                            >
                                <AuthInput
                                    type="email"
                                    placeholder="Admin Email Address"
                                    value={resetEmail}
                                    onChange={(e) => setResetEmail(e.target.value)}
                                />

                                {resetMessage.text && (
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        style={{
                                            color: resetMessage.type === 'success' ? '#27ae60' : '#e74c3c',
                                            textAlign: 'center',
                                            fontSize: '0.9rem',
                                            marginTop: '1rem',
                                            padding: '0.5rem',
                                            background: resetMessage.type === 'success' ? '#eafaf1' : '#fdeded',
                                            borderRadius: '8px'
                                        }}
                                    >
                                        {resetMessage.text}
                                    </motion.p>
                                )}

                                <AuthButton disabled={isLoading}>
                                    {isLoading ? 'Sending...' : 'Send Reset Link'}
                                </AuthButton>
                                <AuthButton variant="secondary" onClick={() => { setForgotStep(0); setResetMessage({ type: '', text: '' }); }}>
                                    Back to Login
                                </AuthButton>
                            </motion.form>
                        )}

                        {forgotStep === 2 && (
                            <motion.form
                                key="token"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                onSubmit={handleResetPassword}
                            >
                                <AuthInput
                                    type="text"
                                    placeholder="Security Token"
                                    value={resetToken}
                                    onChange={(e) => setResetToken(e.target.value)}
                                />
                                <AuthInput
                                    type="password"
                                    placeholder="New Password"
                                    value={resetData.newPassword}
                                    onChange={(e) => setResetData({ ...resetData, newPassword: e.target.value })}
                                />
                                <AuthInput
                                    type="password"
                                    placeholder="Confirm Password"
                                    value={resetData.confirmPassword}
                                    onChange={(e) => setResetData({ ...resetData, confirmPassword: e.target.value })}
                                />

                                {resetMessage.text && (
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        style={{
                                            color: resetMessage.type === 'success' ? '#27ae60' : '#e74c3c',
                                            textAlign: 'center',
                                            fontSize: '0.9rem',
                                            marginTop: '1rem',
                                            padding: '0.5rem',
                                            background: resetMessage.type === 'success' ? '#eafaf1' : '#fdeded',
                                            borderRadius: '8px'
                                        }}
                                    >
                                        {resetMessage.text}
                                    </motion.p>
                                )}

                                <AuthButton disabled={isLoading}>
                                    {isLoading ? 'Updating...' : 'Set New Password'}
                                </AuthButton>
                                <AuthButton variant="secondary" onClick={() => { setForgotStep(0); setResetMessage({ type: '', text: '' }); }}>
                                    Back to Login
                                </AuthButton>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </motion.div>

                <p style={{ position: 'absolute', bottom: '2rem', color: '#999', fontSize: '0.8rem', fontFamily: 'var(--font-body)', letterSpacing: '0.05em' }}>
                    BLOOM BRANDING STUDIOS © 2026
                </p>
            </div>
        );
    }

    return (
        <div className="section-padding container" style={{ minHeight: '80vh', marginTop: '4rem' }}>
            <AnimatePresence>
                {modal.show && (
                    <CustomModal
                        show={modal.show}
                        title={modal.title}
                        message={modal.message}
                        type={modal.type}
                        onConfirm={modal.onConfirm}
                        onCancel={modal.onCancel}
                        confirmText={modal.confirmText}
                        confirmColor={modal.confirmColor}
                    />
                )}
            </AnimatePresence>

            <div className="admin-header-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="admin-header-title">Admin Dashboard</h1>
                    <span className="admin-saved-message">
                        ✓ Changes auto-saved to Database
                    </span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {/* Undo/Redo Removed */}
                </div>
            </div>

            <div className="admin-tabs-container">
                {['enquiries', 'vibes', 'services', 'projects', 'selected work', 'founder', 'testimonials', 'instagram', 'brands', 'site-images', 'legal'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '5px',
                            backgroundColor: activeTab === tab ? 'var(--color-electric-blue)' : '#eee',
                            color: activeTab === tab ? 'white' : 'black',
                            textTransform: 'capitalize',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            whiteSpace: 'nowrap',
                            flexShrink: 0
                        }}
                    >
                        {tab}
                    </button>
                ))}
                <button
                    onClick={() => setActiveTab('clients')}
                    style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '5px',
                        backgroundColor: activeTab === 'clients' ? 'var(--color-electric-blue)' : '#eee',
                        color: activeTab === 'clients' ? 'white' : 'black',
                        textTransform: 'capitalize',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        whiteSpace: 'nowrap',
                        flexShrink: 0
                    }}
                >
                    Clients
                </button>

                <button
                    onClick={initializeDatabase}
                    disabled={isInitializing}
                    style={{
                        marginLeft: '2rem',
                        backgroundColor: isInitializing ? '#ccc' : 'var(--color-electric-blue)',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '30px',
                        cursor: isInitializing ? 'not-allowed' : 'pointer',
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        whiteSpace: 'nowrap',
                        flexShrink: 0
                    }}
                    onMouseOver={(e) => !isInitializing && (e.currentTarget.style.transform = 'translateY(-2px)', e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)')}
                    onMouseOut={(e) => !isInitializing && (e.currentTarget.style.transform = 'translateY(0)', e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)')}
                >
                    {isInitializing ? (
                        <>
                            <motion.span
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                style={{ display: 'inline-block' }}
                            >
                                ⏳
                            </motion.span>
                            Syncing...
                        </>
                    ) : 'Initialize Database'}
                </button>

                <button
                    onClick={logout}
                    style={{
                        backgroundColor: '#ff4d4f',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '30px',
                        cursor: 'pointer',
                        border: 'none',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        boxShadow: '0 4px 15px rgba(255, 77, 79, 0.2)',
                        whiteSpace: 'nowrap',
                        flexShrink: 0
                    }}
                >
                    Sign Out
                </button>
                <button
                    onClick={() => showConfirm("Reset Content", "Reset all content to defaults? This will clear your current customizations.", () => resetContent())}
                    style={{
                        backgroundColor: 'transparent',
                        color: '#5D4037',
                        padding: '0.5rem 1rem',
                        borderRadius: '30px',
                        cursor: 'pointer',
                        border: '1px solid #D7CCC8',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        transition: 'all 0.2s ease',
                        whiteSpace: 'nowrap',
                        flexShrink: 0
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#EFEBE9', e.currentTarget.style.borderColor = '#5D4037')}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent', e.currentTarget.style.borderColor = '#D7CCC8')}
                >
                    Reset Defaults
                </button>
            </div>

            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '10px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
                {activeTab === 'enquiries' && (
                    <div>
                        <div className="admin-section-header">
                            <h2 style={{ fontSize: '2.5rem', margin: 0, color: 'var(--color-electric-blue)' }}>Enquiries</h2>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                {selectedEnquiries.size > 0 && (
                                    <button onClick={handleBulkDelete} className="btn-danger" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', backgroundColor: '#ff4d4d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                        Delete Selected ({selectedEnquiries.size})
                                    </button>
                                )}
                                {content.enquiries?.length > 0 && (
                                    <button onClick={handleDeleteAllEnquiries} className="btn-danger" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                        Delete All
                                    </button>
                                )}
                            </div>
                        </div>
                        {(!content.enquiries || content.enquiries.length === 0) ? (
                            <p style={{ color: '#666', fontStyle: 'italic', fontSize: '1.2rem' }}>No enquiries received yet.</p>
                        ) : (
                            <>
                                <div className="desktop-table">
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead style={{ backgroundColor: '#f9f9f9', borderBottom: '2px solid #eee' }}>
                                            <tr>
                                                <th style={{ padding: '1rem', width: '40px', textAlign: 'center' }}>
                                                    <input
                                                        type="checkbox"
                                                        onChange={handleSelectAll}
                                                        checked={content.enquiries.length > 0 && selectedEnquiries.size === content.enquiries.length}
                                                        style={{ cursor: 'pointer', transform: 'scale(1.2)' }}
                                                    />
                                                </th>
                                                <th style={{ padding: '1rem', textAlign: 'left' }}>Date</th>
                                                <th style={{ padding: '1rem', textAlign: 'left' }}>Name</th>
                                                <th style={{ padding: '1rem', textAlign: 'left' }}>Email</th>
                                                <th style={{ padding: '1rem', textAlign: 'left' }}>Service</th>
                                                <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {content.enquiries.map((item, index) => (
                                                <React.Fragment key={item.id || index}>
                                                    <tr style={{ borderBottom: '1px solid #eee', backgroundColor: selectedEnquiries.has(item.id) ? '#e6f7ff' : 'transparent' }}>
                                                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedEnquiries.has(item.id)}
                                                                onChange={() => toggleSelect(item.id)}
                                                                style={{ cursor: 'pointer', transform: 'scale(1.2)' }}
                                                            />
                                                        </td>
                                                        <td style={{ padding: '1rem' }}>
                                                            {item.date}
                                                            <div style={{ fontSize: '0.8rem', color: '#999' }}>{item.time}</div>
                                                        </td>
                                                        <td style={{ padding: '1rem', fontWeight: 'bold' }}>{item.name}</td>
                                                        <td style={{ padding: '1rem' }}>{item.email}</td>
                                                        <td style={{ padding: '1rem' }}>{item.service}</td>
                                                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                                                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                                <button
                                                                    onClick={() => setOpenEnquiryId(openEnquiryId === item.id ? null : item.id)}
                                                                    style={{
                                                                        padding: '0.4rem 0.8rem',
                                                                        backgroundColor: 'transparent',
                                                                        color: 'var(--color-electric-blue)',
                                                                        border: '1px solid var(--color-electric-blue)',
                                                                        borderRadius: '4px',
                                                                        cursor: 'pointer',
                                                                        fontSize: '0.85rem',
                                                                        transition: 'all 0.2s'
                                                                    }}
                                                                >
                                                                    {openEnquiryId === item.id ? 'Close' : 'View'}
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteEnquiry(item.id)}
                                                                    style={{
                                                                        padding: '0.4rem 0.8rem',
                                                                        backgroundColor: 'transparent',
                                                                        color: '#ff4d4f',
                                                                        border: '1px solid #ff4d4f',
                                                                        borderRadius: '4px',
                                                                        cursor: 'pointer',
                                                                        fontSize: '0.85rem',
                                                                        transition: 'all 0.2s'
                                                                    }}
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    {openEnquiryId === item.id && (
                                                        <tr style={{ backgroundColor: '#f0f4f8' }}>
                                                            <td colSpan="6" style={{ padding: '1.5rem' }}>
                                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                                                    <div><strong>Company:</strong> {item.company || 'N/A'}</div>
                                                                    <div><strong>Budget:</strong> {item.budget || 'N/A'}</div>
                                                                    <div><strong>Timeline:</strong> {item.timeline || 'N/A'}</div>

                                                                    {/* VIBES DISPLAY */}
                                                                    {item.vibes && item.vibes.length > 0 && (
                                                                        <div style={{ gridColumn: '1 / -1' }}>
                                                                            <strong>Vibes:</strong>
                                                                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                                                                                {item.vibes.map((v, i) => (
                                                                                    <span key={i} style={{ backgroundColor: 'var(--color-electric-blue)', color: '#fff', padding: '0.2rem 0.6rem', borderRadius: '15px', fontSize: '0.8rem' }}>{v}</span>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                    {item.vibeDescription && (
                                                                        <div style={{ gridColumn: '1 / -1' }}>
                                                                            <strong>Vibe Description:</strong>
                                                                            <p style={{ fontStyle: 'italic', color: '#555' }}>"{item.vibeDescription}"</p>
                                                                        </div>
                                                                    )}

                                                                    <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                                                                        <strong>Message:</strong>
                                                                        <p style={{ marginTop: '0.5rem', lineHeight: '1.6', backgroundColor: '#fff', padding: '1rem', borderRadius: '4px' }}>{item.message}</p>
                                                                    </div>

                                                                    {/* AI GENERATION SECTION */}
                                                                    <div style={{ gridColumn: '1 / -1', marginTop: '1rem', borderTop: '1px solid #ddd', paddingTop: '1rem' }}>
                                                                        <button
                                                                            onClick={() => handleGenerateIdeas(item)}
                                                                            disabled={loadingAi === item.id}
                                                                            style={{
                                                                                background: 'var(--color-electric-blue)',
                                                                                color: '#fff',
                                                                                border: 'none',
                                                                                padding: '0.8rem 1.5rem',
                                                                                borderRadius: '50px',
                                                                                cursor: 'pointer',
                                                                                display: 'flex',
                                                                                alignItems: 'center',
                                                                                fontFamily: 'var(--font-brand)',
                                                                                fontSize: '1rem',
                                                                                marginBottom: '1rem'
                                                                            }}
                                                                        >
                                                                            {loadingAi === item.id ? 'Developing Strategy...' : '📈 Generate Marketing Strategy'}
                                                                        </button>

                                                                        {aiError[item.id] && (
                                                                            <p style={{ color: 'red', marginTop: '0.5rem', fontWeight: 'bold' }}>
                                                                                ⚠️ {aiError[item.id]}
                                                                            </p>
                                                                        )}

                                                                        {aiIdeas[item.id] && (
                                                                            <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
                                                                                <h4 style={{ margin: '0 0 1rem 0', color: 'var(--color-electric-blue)' }}>Strategic Insight</h4>
                                                                                <div style={{ whiteSpace: 'pre-line', lineHeight: '1.6' }}>
                                                                                    {aiIdeas[item.id]}
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </React.Fragment>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="mobile-cards">
                                    {content.enquiries.map((item, index) => (
                                        <div key={item.id || index} className="mobile-card">
                                            <div className="mobile-card-row">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedEnquiries.has(item.id)}
                                                    onChange={() => toggleSelect(item.id)}
                                                    style={{ transform: 'scale(1.2)' }}
                                                />
                                                <div style={{ fontSize: '0.9rem', color: '#999' }}>{item.date} {item.time}</div>
                                            </div>
                                            <div className="mobile-card-row">
                                                <div className="mobile-card-label">Name:</div>
                                                <div>{item.name}</div>
                                            </div>
                                            <div className="mobile-card-row">
                                                <div className="mobile-card-label">Service:</div>
                                                <div>{item.service}</div>
                                            </div>
                                            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                <button onClick={() => setOpenEnquiryId(openEnquiryId === item.id ? null : item.id)} style={{ padding: '0.5rem', border: '1px solid var(--color-electric-blue)', borderRadius: '4px', color: 'var(--color-electric-blue)', background: 'transparent' }}>
                                                    {openEnquiryId === item.id ? 'Close' : 'View'}
                                                </button>
                                                <button onClick={() => handleDeleteEnquiry(item.id)} style={{ padding: '0.5rem', border: '1px solid #ff4d4f', borderRadius: '4px', color: '#ff4d4f', background: 'transparent' }}>
                                                    Delete
                                                </button>
                                            </div>
                                            {openEnquiryId === item.id && (
                                                <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f0f4f8', borderRadius: '4px' }}>
                                                    <div><strong>Email:</strong> {item.email}</div>
                                                    <div><strong>Company:</strong> {item.company || 'N/A'}</div>
                                                    <div><strong>Budget:</strong> {item.budget || 'N/A'}</div>
                                                    <div><strong>Timeline:</strong> {item.timeline || 'N/A'}</div>

                                                    {/* MOBILE VIBES DISPLAY */}
                                                    {item.vibes && item.vibes.length > 0 && (
                                                        <div style={{ marginTop: '0.5rem' }}>
                                                            <strong>Vibes:</strong>
                                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '5px' }}>
                                                                {item.vibes.map(v => (
                                                                    <span key={v} style={{ backgroundColor: 'var(--color-electric-blue)', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem' }}>
                                                                        {v}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {item.vibeDescription && (
                                                        <div style={{ marginTop: '0.5rem' }}>
                                                            <strong>Vibe Details:</strong>
                                                            <p style={{ margin: '5px 0', fontSize: '0.9rem', fontStyle: 'italic', color: '#555' }}>"{item.vibeDescription}"</p>
                                                        </div>
                                                    )}

                                                    <div style={{ marginTop: '0.5rem' }}>
                                                        <strong>Message:</strong>
                                                        <p style={{ backgroundColor: 'white', padding: '0.5rem' }}>{item.message}</p>
                                                    </div>

                                                    {/* AI SECTION */}
                                                    <div style={{ marginTop: '1rem', borderTop: '1px solid #ddd', paddingTop: '1rem' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                                            <h4 style={{ margin: 0, color: 'var(--color-butter-yellow-dark)' }}>📈 Marketing Strategy</h4>
                                                            <button
                                                                onClick={() => handleGenerateIdeas(item)}
                                                                disabled={loadingAi === item.id}
                                                                style={{
                                                                    padding: '0.5rem 1rem',
                                                                    backgroundColor: 'black',
                                                                    color: 'white',
                                                                    border: 'none',
                                                                    borderRadius: '20px',
                                                                    cursor: loadingAi === item.id ? 'wait' : 'pointer',
                                                                    fontSize: '0.8rem',
                                                                    display: 'flex', alignItems: 'center', gap: '5px'
                                                                }}
                                                            >
                                                                {loadingAi === item.id ? 'Thinking...' : 'Generate Strategy'}
                                                            </button>
                                                        </div>

                                                        {aiError[item.id] && (
                                                            <p style={{ color: 'red', marginTop: '0.5rem', fontWeight: 'bold', fontSize: '0.8rem' }}>
                                                                ⚠️ {aiError[item.id]}
                                                            </p>
                                                        )}

                                                        {aiIdeas[item.id] && (
                                                            <div style={{ backgroundColor: '#fff', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid var(--color-butter-yellow)' }}>
                                                                <div style={{ whiteSpace: 'pre-line', fontSize: '0.9rem', lineHeight: '1.5' }}>
                                                                    {aiIdeas[item.id]}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* VIBES MANAGEMENT */}
                {activeTab === 'vibes' && (
                    <div>
                        <div className="admin-section-header">
                            <div>
                                <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Manage Vibes</h2>
                                <p style={{ fontSize: '1.3rem', color: '#666', margin: 0 }}>Add keywords for the "Vibe Check" in the contact form.</p>
                            </div>
                            <button
                                onClick={async () => {
                                    if (window.confirm("Initialize default vibes?")) {
                                        try {
                                            await axios.post('/api/vibes/init', {}, { headers: { Authorization: `Bearer ${userInfo.token}` } });
                                            refreshVibes();
                                            alert("Vibes initialized!");
                                        } catch (e) { alert("Failed to init: " + e.message); }
                                    }
                                }}
                                style={{ padding: '0.5rem 1rem', backgroundColor: '#666', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                            >
                                Init Defaults
                            </button>
                        </div>

                        {/* Add New Vibe */}
                        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <input
                                value={newVibeInput}
                                onChange={(e) => setNewVibeInput(e.target.value)}
                                placeholder="Enter bold new vibe..."
                                style={{ flex: 1, padding: '1rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem' }}
                                onKeyPress={(e) => e.key === 'Enter' && newVibeInput && (addVibe(newVibeInput, userInfo.token), setNewVibeInput(''))}
                            />
                            <button
                                onClick={() => {
                                    if (newVibeInput) {
                                        addVibe(newVibeInput, userInfo.token);
                                        setNewVibeInput('');
                                    }
                                }}
                                className="btn-primary"
                                style={{ padding: '1rem 2rem', fontSize: '1rem' }}
                            >
                                + Add Vibe
                            </button>
                        </div>

                        {/* Vibe List */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                            {content.vibes && content.vibes.map((v) => (
                                <div key={v._id || v.label} style={{
                                    backgroundColor: 'white',
                                    padding: '0.8rem 1.2rem',
                                    borderRadius: '50px',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.8rem',
                                    fontSize: '1rem',
                                    border: '1px solid #eee'
                                }}>
                                    <span style={{ fontWeight: '500' }}>{v.label}</span>
                                    <button
                                        onClick={() => removeVibe(v._id, userInfo.token)}
                                        style={{
                                            backgroundColor: '#ffebee',
                                            color: '#c62828',
                                            border: 'none',
                                            borderRadius: '50%',
                                            width: '24px',
                                            height: '24px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '0.8rem'
                                        }}
                                        title="Remove Vibe"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}


                {/* SERVICES MANAGEMENT */}
                {activeTab === 'services' && (
                    <div>
                        <div className="admin-section-header">
                            <div>
                                <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Manage Services</h2>
                                <p style={{ fontSize: '1.3rem', color: '#666', margin: 0 }}>Update service descriptions and imagery.</p>
                            </div>
                            <button
                                onClick={() => {
                                    if (window.confirm("Reset Services to default configuration?")) {
                                        resetServices(userInfo.token);
                                    }
                                }}
                                style={{ padding: '0.5rem 1rem', backgroundColor: '#666', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                            >
                                Reset to Defaults
                            </button>
                        </div>
                        {content.services && content.services.map((service, index) => (
                            <div key={service.id ? `service-${service.id}` : `service-idx-${index}`} style={{ border: '1px solid #eee', padding: '1.5rem', marginBottom: '1.5rem', borderRadius: '8px', background: 'white' }}>
                                <h3 style={{ margin: '0 0 1rem 0', color: service.accent || 'black' }}>{service.title}</h3>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                    <div>
                                        <div style={{ marginBottom: '1rem' }}>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Subtitle</label>
                                            <textarea
                                                value={service.subtitle || ''}
                                                onChange={(e) => {
                                                    const newServices = [...content.services];
                                                    newServices[index] = { ...newServices[index], subtitle: e.target.value };
                                                    updateServices(newServices);
                                                }}
                                                style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '4px', fontFamily: 'inherit' }}
                                            />
                                        </div>
                                        <div style={{ marginBottom: '1rem' }}>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Description (Mobile)</label>
                                            <textarea
                                                value={service.description || ''}
                                                onChange={(e) => {
                                                    const newServices = [...content.services];
                                                    newServices[index] = { ...newServices[index], description: e.target.value };
                                                    updateServices(newServices);
                                                }}
                                                style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '4px', minHeight: '80px', fontFamily: 'inherit' }}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <FileUpload
                                            label="Service Image (Services Page)"
                                            value={service.image}
                                            onFileSelect={(val) => {
                                                const newServices = [...content.services];
                                                newServices[index] = { ...newServices[index], image: val };
                                                updateServices(newServices);
                                            }}
                                            onRemove={() => {
                                                const newServices = [...content.services];
                                                newServices[index] = { ...newServices[index], image: '' };
                                                updateServices(newServices);
                                            }}
                                            onUpload={uploadFile}
                                            pathPrefix="services"
                                        />
                                        <div style={{ marginTop: '1rem' }}>
                                            <FileUpload
                                                label="Home Page Icon (Mask)"
                                                previewBg="#333"
                                                value={service.iconSrc}
                                                onFileSelect={(val) => {
                                                    const newServices = [...content.services];
                                                    newServices[index] = { ...newServices[index], iconSrc: val };
                                                    updateServices(newServices);
                                                }}
                                                onRemove={() => {
                                                    const newServices = [...content.services];
                                                    newServices[index] = { ...newServices[index], iconSrc: '' };
                                                    updateServices(newServices);
                                                }}
                                                onUpload={uploadFile}
                                                pathPrefix="services"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div style={{ marginTop: '1rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Long Text (Desktop)</label>
                                    <textarea
                                        value={service.longText || ''}
                                        onChange={(e) => {
                                            const newServices = [...content.services];
                                            newServices[index] = { ...newServices[index], longText: e.target.value };
                                            updateServices(newServices);
                                        }}
                                        style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '4px', minHeight: '150px', fontFamily: 'inherit', lineHeight: '1.5' }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* PROJECT MANAGEMENT (BRAND PROFILES) */}
                {activeTab === 'projects' && (
                    <div>
                        <div className="admin-section-header">
                            <div>
                                <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Manage All Projects</h2>
                                <p style={{ fontSize: '1.3rem', color: '#666', margin: 0 }}>Add, edit, or remove projects from the global portfolio.</p>
                            </div>
                            <button onClick={() => addItem('projects')} className="btn-primary" style={{ fontSize: '1rem', padding: '0.8rem 1.5rem', whiteSpace: 'nowrap' }}>+ Add New Project</button>
                        </div>
                        {content.allProjects?.map((item, index) => (
                            <div key={item.id} style={{ border: '1px solid #eee', padding: '1rem', marginBottom: '1rem', borderRadius: '5px' }}>
                                <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
                                    <input
                                        value={item.title}
                                        onChange={(e) => handleArrayChange(index, 'title', e.target.value, 'projects')}
                                        placeholder="Project Title"
                                        style={{ flex: 1, padding: '0.8rem', fontWeight: 'bold', fontSize: '1.1rem' }}
                                    />
                                    <button onClick={() => deleteItem(index, 'projects')} style={{ color: '#5D4037', fontSize: '1.1rem', padding: '0.5rem' }}>X</button>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
                                    <input
                                        value={item.category}
                                        onChange={(e) => handleArrayChange(index, 'category', e.target.value, 'projects')}
                                        placeholder="Category"
                                        style={{ flex: 1, padding: '0.8rem', fontSize: '1.15rem' }}
                                    />
                                </div>
                                <textarea
                                    value={item.description}
                                    onChange={(e) => handleArrayChange(index, 'description', e.target.value, 'projects')}
                                    placeholder="Project Description"
                                    style={{ width: '100%', padding: '0.8rem', marginBottom: '0.5rem', minHeight: '80px', fontSize: '1.15rem', fontFamily: 'inherit' }}
                                />
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    {[0, 1, 2, 3].map((imgIdx) => (
                                        <FileUpload
                                            key={imgIdx}
                                            label={`Media ${imgIdx + 1} ${imgIdx === 0 ? '(Main)' : ''}`}
                                            value={item.images?.[imgIdx] || (imgIdx === 0 ? item.image : '')}
                                            onFileSelect={(val) => handleProjectImageChange(index, imgIdx, val)}
                                            onRemove={() => handleProjectImageChange(index, imgIdx, '')}
                                            onUpload={uploadFile}
                                            pathPrefix="projects"
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'selected work' && (
                    <div>
                        <div className="admin-section-header">
                            <div>
                                <h2 style={{ fontSize: '2.5rem', margin: 0 }}>Selected Work</h2>
                                <p style={{ fontSize: '1.3rem', color: '#666', margin: 0 }}>Select which projects to feature on the Home page.</p>
                            </div>
                            <button onClick={() => addItem('work')} className="btn-primary" style={{ fontSize: '0.9rem', padding: '0.6rem 1.2rem', whiteSpace: 'nowrap' }}>+ Add Slot</button>
                        </div>
                        {content.selectedWork?.map((item, index) => (
                            <div key={item.id} style={{ border: '1px solid #eee', padding: '1rem', marginBottom: '1rem', borderRadius: '5px' }}>
                                <div style={{ marginBottom: '0.5rem' }}>
                                    <label style={{ display: 'block', fontSize: '1.15rem', marginBottom: '0.5rem' }}>Project</label>
                                    <select
                                        value={item.title}
                                        onChange={(e) => {
                                            const selected = content.allProjects.find(p => p.title === e.target.value);
                                            if (selected) {
                                                const newArray = [...content.selectedWork];
                                                newArray[index] = {
                                                    ...newArray[index],
                                                    title: selected.title,
                                                    category: selected.category,
                                                    image: selected.image
                                                };
                                                updateSelectedWork(newArray);
                                            }
                                        }}
                                        style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1.15rem' }}
                                    >
                                        <option value="" disabled>Select a project...</option>
                                        {content.allProjects && content.allProjects.map((proj, idx) => (
                                            <option key={proj._id || proj.id || idx} value={proj.title}>
                                                {proj.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
                                    <input
                                        value={item.category}
                                        onChange={(e) => handleArrayChange(index, 'category', e.target.value, 'work')}
                                        placeholder="Category"
                                        style={{ flex: 1, padding: '0.8rem', fontSize: '1.15rem' }}
                                    />
                                    <button onClick={() => deleteItem(index, 'work')} style={{ color: '#5D4037' }}>X</button>
                                </div>
                                <div className="admin-dual-grid">
                                    <FileUpload
                                        label="Override Image"
                                        value={item.image}
                                        onFileSelect={(val) => handleArrayChange(index, 'image', val, 'work')}
                                        onRemove={() => handleArrayChange(index, 'image', '', 'work')}
                                        onUpload={uploadFile}
                                        pathPrefix="work"
                                    />
                                    <FileUpload
                                        label="Override Video"
                                        value={item.video || ''}
                                        type="video"
                                        onFileSelect={(val) => handleArrayChange(index, 'video', val, 'work')}
                                        onRemove={() => handleArrayChange(index, 'video', '', 'work')}
                                        onUpload={uploadFile}
                                        pathPrefix="work/videos"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'testimonials' && (
                    <div>
                        <div className="admin-section-header">
                            <h2 style={{ fontSize: '2.5rem', margin: 0 }}>Testimonials</h2>
                            <button onClick={() => addItem('testimonials')} className="btn-primary" style={{ fontSize: '0.9rem', padding: '0.6rem 1.2rem', whiteSpace: 'nowrap' }}>+ Add Testimonial</button>
                        </div>
                        {content.testimonials?.map((item, index) => (
                            <div key={item.id} style={{ border: '1px solid #eee', padding: '1rem', marginBottom: '1rem', borderRadius: '5px' }}>
                                <div style={{ marginBottom: '1rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <label style={{ fontSize: '1.15rem', color: '#666' }}>Testimonial Text</label>
                                        <button onClick={() => deleteItem(index, 'testimonials')} style={{ color: '#ff4d4f', padding: '0.2rem 0.5rem', border: '1px solid #ff4d4f', borderRadius: '4px', background: 'transparent', cursor: 'pointer', fontSize: '0.9rem' }}>Remove</button>
                                    </div>
                                    <textarea value={item.text} onChange={(e) => handleArrayChange(index, 'text', e.target.value, 'testimonials')} placeholder="Testimonial Text" style={{ width: '100%', padding: '0.8rem', minHeight: '80px', fontSize: '1.15rem', fontFamily: 'inherit' }} />
                                </div>

                                <div className="admin-flex-row" style={{ marginBottom: '1rem' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', fontSize: '1.15rem', marginBottom: '0.5rem', color: '#666' }}>Reviewer Name</label>
                                        <input value={item.author} onChange={(e) => handleArrayChange(index, 'author', e.target.value, 'testimonials')} placeholder="Author" style={{ width: '100%', padding: '0.8rem', fontSize: '1.15rem' }} />
                                    </div>
                                    <div style={{ width: '100px' }}>
                                        <label style={{ display: 'block', fontSize: '1.15rem', marginBottom: '0.5rem', color: '#666' }}>Rating (1-5)</label>
                                        <input type="number" max="5" min="1" value={item.rating} onChange={(e) => handleArrayChange(index, 'rating', parseInt(e.target.value), 'testimonials')} placeholder="Rating" style={{ width: '100%', padding: '0.8rem', fontSize: '1.15rem' }} />
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>
                )}


                {activeTab === 'instagram' && (
                    <div>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Instagram Content</h2>
                        {content.instagram?.map((item, index) => (
                            <div key={item.id} style={{ border: '1px solid #eee', padding: '1rem', marginBottom: '1rem', borderRadius: '5px', position: 'relative' }}>
                                <button
                                    onClick={() => deleteItem(index, 'instagram')}
                                    style={{
                                        position: 'absolute',
                                        top: '10px',
                                        right: '10px',
                                        color: '#ff4d4f',
                                        border: '1px solid #ff4d4f',
                                        borderRadius: '50%',
                                        width: '30px',
                                        height: '30px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: 'transparent',
                                        cursor: 'pointer',
                                        zIndex: 10
                                    }}
                                >
                                    X
                                </button>
                                <div style={{ marginBottom: '1rem', paddingRight: '40px' }}>
                                    <FileUpload
                                        label="Thumbnail"
                                        value={item.image}
                                        onFileSelect={(val) => handleArrayChange(index, 'image', val, 'instagram')}
                                        onRemove={() => handleArrayChange(index, 'image', '', 'instagram')}
                                        onUpload={uploadFile}
                                        pathPrefix="instagram"
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#666' }}>Link</label>
                                    <input value={item.link} onChange={(e) => handleArrayChange(index, 'link', e.target.value, 'instagram')} placeholder="Link URL" style={{ width: '100%', padding: '0.8rem', border: '1px solid #eee', borderRadius: '4px' }} />
                                </div>
                            </div>
                        ))}
                        <button onClick={() => addItem('instagram')} className="btn-primary" style={{ fontSize: '0.8rem' }}>Add Post</button>
                    </div>
                )}

                {activeTab === 'brands' && (
                    <div>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Manage Brand Logos</h2>
                        {content.brandLogos?.map((item, index) => (
                            <div key={item.id || index} style={{ border: '1px solid #eee', padding: '1rem', marginBottom: '1rem', borderRadius: '5px' }}>
                                <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                                    <h4 style={{ margin: 0 }}>{item.name || `Brand ${index + 1}`}</h4>
                                    <button onClick={() => deleteItem(index, 'brands')} style={{ color: '#5D4037', marginLeft: 'auto' }}>X</button>
                                </div>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.3rem', color: '#666' }}>Brand Name</label>
                                    <input
                                        value={item.name || ''}
                                        onChange={(e) => handleArrayChange(index, 'name', e.target.value, 'brands')}
                                        placeholder="Enter Brand Name"
                                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
                                    />
                                </div>
                                <FileUpload
                                    label="Brand Logo"
                                    value={item.logo || ''}
                                    onFileSelect={(val) => handleArrayChange(index, 'logo', val, 'brands')}
                                    onRemove={() => handleArrayChange(index, 'logo', '', 'brands')}
                                    onUpload={uploadFile}
                                    pathPrefix="brands"
                                />
                            </div>
                        ))}
                        <button onClick={() => addItem('brands')} className="btn-primary" style={{ fontSize: '0.8rem' }}>Add Brand Logo</button>
                    </div>
                )}

                {
                    activeTab === 'founder' && (
                        <div style={{ display: 'grid', gap: '2rem' }}>
                            <div>
                                <div className="admin-section-header">
                                    <h2 style={{ fontSize: '2.5rem', margin: 0 }}>Founders</h2>
                                    <button
                                        onClick={() => {
                                            if (window.confirm("Are you sure you want to reset Founders data to defaults?")) {
                                                resetFounders(userInfo.token);
                                                alert("Founders reset to default values and synced to database.");
                                            }
                                        }}
                                        style={{ padding: '0.5rem 1rem', backgroundColor: '#666', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                                    >
                                        Reset to Defaults
                                    </button>
                                </div>
                                {/* Removed erroneous Project Image upload from Founders section */}
                                <FileUpload
                                    label="Central Image"
                                    value={content.founders.main?.image || ''}
                                    onFileSelect={(val) => handleFoundersChange('main', 'image', val)}
                                    onRemove={() => handleFoundersChange('main', 'image', '')}
                                    onUpload={uploadFile}
                                    pathPrefix="founders"
                                />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                {/* Founder 1 */}
                                <div style={{ border: '1px solid #ddd', padding: '1.5rem', borderRadius: '8px' }}>
                                    <h3>Founder 1</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <input value={content.founders.left.name} onChange={(e) => handleFoundersChange('left', 'name', e.target.value)} placeholder="Name" style={{ padding: '0.8rem', fontSize: '1.15rem' }} />
                                        <input value={content.founders.left.role} onChange={(e) => handleFoundersChange('left', 'role', e.target.value)} placeholder="Role" style={{ padding: '0.8rem', fontSize: '1.15rem' }} />
                                        <textarea value={content.founders.left.bio1} onChange={(e) => handleFoundersChange('left', 'bio1', e.target.value)} placeholder="Bio Paragraph 1" style={{ padding: '0.8rem', minHeight: '100px', fontSize: '1.15rem', fontFamily: 'inherit' }} />
                                        <textarea value={content.founders.left.bio2} onChange={(e) => handleFoundersChange('left', 'bio2', e.target.value)} placeholder="Bio Paragraph 2" style={{ padding: '0.8rem', minHeight: '100px', fontSize: '1.15rem', fontFamily: 'inherit' }} />
                                    </div>
                                </div>

                                {/* Founder 2 */}
                                <div style={{ border: '1px solid #ddd', padding: '1.5rem', borderRadius: '8px' }}>
                                    <h3>Founder 2</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <input value={content.founders.right.name} onChange={(e) => handleFoundersChange('right', 'name', e.target.value)} placeholder="Name" style={{ padding: '0.8rem', fontSize: '1.15rem' }} />
                                        <input value={content.founders.right.role} onChange={(e) => handleFoundersChange('right', 'role', e.target.value)} placeholder="Role" style={{ padding: '0.8rem', fontSize: '1.15rem' }} />
                                        <textarea value={content.founders.right.bio1} onChange={(e) => handleFoundersChange('right', 'bio1', e.target.value)} placeholder="Bio Paragraph 1" style={{ padding: '0.8rem', minHeight: '100px', fontSize: '1.15rem', fontFamily: 'inherit' }} />
                                        <textarea value={content.founders.right.bio2} onChange={(e) => handleFoundersChange('right', 'bio2', e.target.value)} placeholder="Bio Paragraph 2" style={{ padding: '0.8rem', minHeight: '100px', fontSize: '1.15rem', fontFamily: 'inherit' }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }

                {activeTab === 'site-images' && (
                    <div>
                        <div className="admin-section-header">
                            <h2 style={{ fontSize: '2.5rem', margin: 0 }}>Site Images Management</h2>
                        </div>
                        <p style={{ marginBottom: '2rem', color: '#666' }}>Manage static images across the website (Hero, Backgrounds, Service Icons, etc).</p>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                            {/* Hero Section */}
                            {/* Hero Section */}
                            <div className="admin-card">
                                <h3>Home: Hero Section</h3>
                                <FileUpload
                                    label="Hero Background"
                                    value={content.siteImages?.hero_bg || ''}
                                    onFileSelect={(val) => updateSiteImage('hero_bg', 'Home', 'Hero Background', val, userInfo.token)}
                                    onRemove={() => updateSiteImage('hero_bg', 'Home', 'Hero Background', '', userInfo.token)}
                                    onUpload={uploadFile}
                                    pathPrefix="site_assets"
                                />
                                {[1, 2, 3, 4].map(num => (
                                    <FileUpload
                                        key={`mag${num}`}
                                        label={`Magazine/Poster ${num}`}
                                        value={content.siteImages?.[`hero_page${num}`] || ''}
                                        onFileSelect={(val) => updateSiteImage(`hero_page${num}`, 'Home', `Magazine ${num}`, val, userInfo.token)}
                                        onRemove={() => updateSiteImage(`hero_page${num}`, 'Home', `Magazine ${num}`, '', userInfo.token)}
                                        onUpload={uploadFile}
                                        pathPrefix="site_assets"
                                    />
                                ))}
                                <FileUpload
                                    label="Floating Megaphone"
                                    value={content.siteImages?.hero_megaphone || ''}
                                    onFileSelect={(val) => updateSiteImage('hero_megaphone', 'Home', 'Floating Megaphone', val, userInfo.token)}
                                    onRemove={() => updateSiteImage('hero_megaphone', 'Home', 'Floating Megaphone', '', userInfo.token)}
                                    onUpload={uploadFile}
                                    pathPrefix="site_assets"
                                />
                                <FileUpload
                                    label="Floating Camera"
                                    value={content.siteImages?.hero_camera || ''}
                                    onFileSelect={(val) => updateSiteImage('hero_camera', 'Home', 'Floating Camera', val, userInfo.token)}
                                    onRemove={() => updateSiteImage('hero_camera', 'Home', 'Floating Camera', '', userInfo.token)}
                                    onUpload={uploadFile}
                                    pathPrefix="site_assets"
                                />
                                <FileUpload
                                    label="Floating Star"
                                    value={content.siteImages?.hero_star || ''}
                                    onFileSelect={(val) => updateSiteImage('hero_star', 'Home', 'Floating Star', val, userInfo.token)}
                                    onRemove={() => updateSiteImage('hero_star', 'Home', 'Floating Star', '', userInfo.token)}
                                    onUpload={uploadFile}
                                    pathPrefix="site_assets"
                                />
                            </div>

                            {/* Info Sections */}
                            <div className="admin-card">
                                <h3>Home: Info Sections</h3>
                                <FileUpload
                                    label="Blooming the Brand (Dome Image)"
                                    value={content.siteImages?.home_blooming || ''}
                                    onFileSelect={(val) => updateSiteImage('home_blooming', 'Home', 'Blooming Image', val, userInfo.token)}
                                    onRemove={() => updateSiteImage('home_blooming', 'Home', 'Blooming Image', '', userInfo.token)}
                                    onUpload={uploadFile}
                                    pathPrefix="site_assets"
                                />

                            </div>

                            {/* About Page */}
                            <div className="admin-card">
                                <h3>About Page: Our Story</h3>
                                {[
                                    { k: 'about_vision', l: 'Vision Image' },
                                    { k: 'about_values', l: 'Values Image' },
                                    { k: 'about_approach', l: 'Approach Image' }
                                ].map(s => (
                                    <FileUpload
                                        key={s.k}
                                        label={s.l}
                                        value={content.siteImages?.[s.k] || ''}
                                        onFileSelect={(val) => updateSiteImage(s.k, 'About', s.l, val, userInfo.token)}
                                        onRemove={() => updateSiteImage(s.k, 'About', s.l, '', userInfo.token)}
                                        onUpload={uploadFile}
                                        pathPrefix="site_assets"
                                    />
                                ))}
                            </div>

                            {/* Navbar / Menu Icons */}
                            <div className="admin-card">
                                <h3>Navbar / Menu Icons</h3>
                                {[
                                    { k: 'menu_home', l: 'Menu: Home Icon' },
                                    { k: 'menu_ourstory', l: 'Menu: Our Story Icon' },
                                    { k: 'menu_services', l: 'Menu: Services Icon' },
                                    { k: 'menu_work', l: 'Menu: Works Icon' },
                                    { k: 'menu_contact', l: 'Menu: Contact Icon' }
                                ].map(s => (
                                    <FileUpload
                                        key={s.k}
                                        label={s.l}
                                        value={content.siteImages?.[s.k] || ''}
                                        onFileSelect={(val) => updateSiteImage(s.k, 'Navbar', s.l, val, userInfo.token)}
                                        onRemove={() => updateSiteImage(s.k, 'Navbar', s.l, '', userInfo.token)}
                                        onUpload={uploadFile}
                                        pathPrefix="site_assets"
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'legal' && (
                    <div>
                        <div className="admin-section-header">
                            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Legal Content</h2>
                            <button
                                onClick={() => {
                                    if (window.confirm("Are you sure you want to reset Legal Content (Privacy/Terms) to defaults?")) {
                                        resetLegal(userInfo.token);
                                        setLegalForm({ privacy: '', terms: '' }); // Update local form state too
                                        showAlert("Reset", "Legal content reset to defaults.", "success");
                                    }
                                }}
                                style={{ padding: '0.5rem 1rem', backgroundColor: '#666', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                            >
                                Reset to Defaults
                            </button>
                        </div>
                        <div style={{ display: 'grid', gap: '2rem' }}>
                            {/* Privacy Policy */}
                            <div style={{ border: '1px solid #eee', padding: '1.5rem', borderRadius: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <h3 style={{ margin: 0 }}>Privacy Policy</h3>
                                    <button
                                        onClick={async () => {
                                            if (!legalForm.privacy && !window.confirm("Warning: Privacy Policy is empty. Save anyway?")) return;
                                            const result = await updateLegalContent('privacy', legalForm.privacy);
                                            if (result) showAlert("Saved", "Privacy Policy updated!", "success");
                                            else showAlert("Error", "Failed to save. Check console.", "error");
                                        }}
                                        className="btn-primary"
                                        style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                                    >
                                        Save Changes
                                    </button>
                                </div>
                                <textarea
                                    value={legalForm.privacy}
                                    onChange={(e) => setLegalForm({ ...legalForm, privacy: e.target.value })}
                                    placeholder="Enter HTML content for Privacy Policy..."
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        minHeight: '300px',
                                        fontSize: '1rem',
                                        fontFamily: 'monospace',
                                        lineHeight: '1.5',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        resize: 'vertical'
                                    }}
                                />
                            </div>

                            {/* Terms of Service */}
                            <div style={{ border: '1px solid #eee', padding: '1.5rem', borderRadius: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <h3 style={{ margin: 0 }}>Terms of Service</h3>
                                    <button
                                        onClick={async () => {
                                            const result = await updateLegalContent('terms', legalForm.terms);
                                            if (result) showAlert("Saved", "Terms updated!", "success");
                                            else showAlert("Error", "Failed to save. Check console.", "error");
                                        }}
                                        className="btn-primary"
                                        style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                                    >
                                        Save Changes
                                    </button>
                                </div>
                                <textarea
                                    value={legalForm.terms}
                                    onChange={(e) => setLegalForm({ ...legalForm, terms: e.target.value })}
                                    placeholder="Enter HTML content for Terms of Service..."
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        minHeight: '300px',
                                        fontSize: '1rem',
                                        fontFamily: 'monospace',
                                        lineHeight: '1.5',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        resize: 'vertical'
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* CLIENTS TAB */}
                {activeTab === 'clients' && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h2 style={{ fontFamily: 'var(--font-brand)', fontSize: '2rem', margin: 0 }}>Client Users</h2>
                            <input
                                type="text"
                                placeholder="Search Clients..."
                                style={{ padding: '0.8rem', width: '300px', borderRadius: '4px', border: '1px solid #ccc' }}
                                onChange={(e) => {
                                    const term = e.target.value.toLowerCase();
                                    if (!term) setFilteredClients(clients);
                                    else setFilteredClients(clients.filter(c => c.username?.toLowerCase().includes(term) || c.email?.toLowerCase().includes(term)));
                                }}
                            />
                        </div>

                        <div style={{ backgroundColor: '#fff', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#f9f9f9', fontFamily: 'var(--font-subtitle)', fontSize: '0.9rem', color: '#666' }}>
                                        <th style={{ padding: '1rem', textAlign: 'left' }}>Username</th>
                                        <th style={{ padding: '1rem', textAlign: 'left' }}>Email</th>
                                        <th style={{ padding: '1rem', textAlign: 'left' }}>Role</th>
                                        <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredClients.map((client) => (
                                        <tr key={client._id} style={{ borderBottom: '1px solid #eee' }}>
                                            <td style={{ padding: '1rem', fontWeight: 'bold' }}>{client.username}</td>
                                            <td style={{ padding: '1rem' }}>{client.email}</td>
                                            <td style={{ padding: '1rem' }}>
                                                {client.isAdmin ? <span style={{ backgroundColor: '#e6f7ff', color: '#1890ff', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>Admin</span> : 'Client'}
                                            </td>
                                            <td style={{ padding: '1rem', textAlign: 'right' }}>
                                                <button
                                                    onClick={async () => {
                                                        if (window.confirm('Delete this user?')) {
                                                            try {
                                                                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                                                                await axios.delete(`/api/users/${client._id}`, config);
                                                                const newClients = clients.filter(c => c._id !== client._id);
                                                                setClients(newClients);
                                                                setFilteredClients(newClients);
                                                            } catch (err) { alert('Failed to delete'); }
                                                        }
                                                    }}
                                                    style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                                                >
                                                    Delete
                                                </button>
                                                <button
                                                    onClick={() => openAssetManager(client)}
                                                    style={{ marginLeft: '1rem', color: 'var(--color-electric-blue)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                                                >
                                                    Manage Assets
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredClients.length === 0 && (
                                        <tr><td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>No clients found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

            </div >
            <CustomModal {...modal} />

            {/* ASSET MANAGER MODAL */}
            {assetModalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 2000,
                    display: 'flex', justifyContent: 'center', alignItems: 'center'
                }}>
                    <div style={{
                        backgroundColor: 'white', width: '80%', height: '80%',
                        borderRadius: '12px', padding: '2rem', display: 'flex', flexDirection: 'column',
                        position: 'relative'
                    }}>
                        <button
                            onClick={() => setAssetModalOpen(false)}
                            style={{ position: 'absolute', top: '20px', right: '20px', fontSize: '1.5rem', background: 'none', border: 'none', cursor: 'pointer' }}
                        >X</button>

                        <h2 style={{ fontFamily: 'var(--font-brand)', marginBottom: '0.5rem' }}>Vault Assets</h2>
                        <p style={{ fontFamily: 'var(--font-subtitle)', marginBottom: '2rem' }}>
                            Managing for: <strong>{selectedClientForAssets?.username}</strong>
                            {selectedClientForAssets?.companyName && ` (${selectedClientForAssets.companyName})`}
                        </p>

                        {/* Upload Section */}
                        <div style={{ marginBottom: '2rem', padding: '1.5rem', border: '2px dashed #eee', borderRadius: '8px', textAlign: 'center' }}>
                            <h4 style={{ margin: '0 0 1rem 0' }}>Upload New Assets (Max 100)</h4>
                            <input
                                type="file"
                                multiple
                                onChange={handleAssetUpload}
                                disabled={uploadingAssets}
                                style={{ display: 'none' }}
                                id="asset-upload-input"
                            />
                            <label
                                htmlFor="asset-upload-input"
                                className="btn-primary"
                                style={{ cursor: uploadingAssets ? 'not-allowed' : 'pointer', padding: '0.8rem 2rem', display: 'inline-block' }}
                            >
                                {uploadingAssets ? 'Uploading...' : 'Select Files'}
                            </label>
                        </div>

                        {/* Gallery Section */}
                        <div style={{ flex: 1, overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem', alignContent: 'start' }}>
                            {clientAssets.length === 0 ? (
                                <p style={{ color: '#999', gridColumn: '1/-1', textAlign: 'center', marginTop: '2rem' }}>No assets found.</p>
                            ) : (
                                clientAssets.map(asset => (
                                    <div key={asset._id} style={{ border: '1px solid #eee', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
                                        <button
                                            onClick={() => handleAssetDelete(asset._id)}
                                            style={{
                                                position: 'absolute', top: '5px', right: '5px',
                                                background: 'white', border: '1px solid red', color: 'red',
                                                borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', zIndex: 10
                                            }}
                                        >X</button>

                                        <div style={{ height: '120px', backgroundColor: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            {asset.type === 'image' ? (
                                                <img src={asset.url} alt={asset.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <span style={{ fontSize: '2rem', color: '#ccc' }}>VIDEO</span>
                                            )}
                                        </div>
                                        <div style={{ padding: '0.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.8rem' }}>
                                            {asset.title}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

        </div >
    );
};

export default Admin;
