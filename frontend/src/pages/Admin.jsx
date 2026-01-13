import React, { useState, useEffect } from 'react';
import { useContent } from '../context/ContentContext';
import { motion, AnimatePresence } from 'framer-motion';

const FileUpload = ({ label, value, onFileSelect, onRemove, type = "image" }) => {
    const [fileName, setFileName] = useState("No file chosen");
    const fileInputRef = React.useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name);
            const reader = new FileReader();
            reader.onloadend = () => {
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
        <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.2rem', color: '#666' }}>{label}</label>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{
                    width: '60px',
                    height: '60px',
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
                <button
                    onClick={() => fileInputRef.current.click()}
                    style={{
                        padding: '0.4rem 0.8rem',
                        fontSize: '0.9rem',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        backgroundColor: '#f0f0f0',
                        cursor: 'pointer'
                    }}
                >
                    {value ? 'Change File' : 'Choose File'}
                </button>
                {value && (
                    <button
                        onClick={() => {
                            setFileName("No file chosen");
                            if (onRemove) onRemove();
                        }}
                        style={{
                            padding: '0.4rem 0.8rem',
                            fontSize: '0.9rem',
                            border: '1px solid #ff4d4f',
                            borderRadius: '4px',
                            backgroundColor: '#fff',
                            color: '#ff4d4f',
                            cursor: 'pointer'
                        }}
                    >
                        Remove
                    </button>
                )}
                <span style={{ fontSize: '0.9rem', color: '#555' }}>{fileName}</span>
            </div>
        </div>
    );
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
                style={{
                    backgroundColor: 'white',
                    padding: '2.5rem',
                    borderRadius: '24px',
                    maxWidth: '450px',
                    width: '90%',
                    textAlign: 'center',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
                    border: '1px solid #eee'
                }}
            >
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                    {type === 'confirm' ? '❓' : type === 'success' ? '✨' : '⚠️'}
                </div>
                <h3 style={{
                    fontSize: '1.8rem',
                    marginBottom: '0.8rem',
                    color: 'var(--color-electric-blue)',
                    fontFamily: 'Bigilla, serif'
                }}>{title}</h3>
                <p style={{ color: '#666', lineHeight: 1.6, marginBottom: '2rem', fontSize: '1.1rem' }}>{message}</p>
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
        </motion.div>
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
                    fontSize: '1.1rem',
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
                fontSize: focused || value ? '0.75rem' : '1.1rem',
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

const Admin = () => {
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
    const [isLoading, setIsLoading] = useState(false);

    const handleSendEmail = async (e) => {
        e.preventDefault();
        setResetMessage({ type: '', text: '' });
        setIsLoading(true);

        try {
            const res = await fetch('http://localhost:5000/api/users/forgotpassword', {
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
            const res = await fetch('http://localhost:5000/api/users/resetpassword', {
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
        syncProject, removeProject,
        syncTestimonial, removeTestimonial,
        syncInstagram, removeInstagram,
        syncFounder, removeFounder,
        syncValue, removeValue,
        syncBrand, removeBrand,
        syncSelectedWork, removeSelectedWork,
        updateHero, updateAllProjects, updateSelectedWork, updateTestimonials, updateBrandLogos, updateInstagram, updateFounders, updateValues, resetContent
    } = useContent();
    const [activeTab, setActiveTab] = useState('enquiries');
    const [openEnquiryId, setOpenEnquiryId] = useState(null);
    const [isInitializing, setIsInitializing] = useState(false);

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
            const res = await fetch('http://localhost:5000/api/users/login', {
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

    const logout = () => {
        localStorage.removeItem('userInfo');
        setUserInfo(null);
        setLoginData({ username: '', password: '' });
    };



    const initializeDatabase = async () => {
        showConfirm(
            "Initialize Database",
            "This will sync all your current local content (Projects, Testimonials, etc.) to the database. Ready to bloom?",
            async () => {
                setIsInitializing(true);
                try {
                    // Sync Hero
                    if (content.hero) await updateHero(content.hero);

                    // Sync All Projects
                    if (content.allProjects) {
                        for (const item of content.allProjects) {
                            if (!item._id) await syncProject(item);
                        }
                    }

                    // Sync Selected Work (Projects on Work page)
                    if (content.selectedWork) {
                        for (const item of content.selectedWork) {
                            if (!item._id) await syncSelectedWork(item);
                        }
                    }

                    // Sync Testimonials
                    if (content.testimonials) {
                        for (const item of content.testimonials) {
                            if (!item._id) await syncTestimonial(item);
                        }
                    }

                    // Sync Instagram
                    if (content.instagram) {
                        for (const item of content.instagram) {
                            if (!item._id) await syncInstagram(item);
                        }
                    }

                    // Sync Values
                    if (content.values) {
                        for (const item of content.values) {
                            if (!item._id) await syncValue(item);
                        }
                    }

                    // Sync Brands
                    if (content.brandLogos) {
                        for (const item of content.brandLogos) {
                            if (!item._id) await syncBrand(item);
                        }
                    }

                    // Sync Founders
                    if (content.founders) {
                        if (content.founders.left) await syncFounder({ ...content.founders.left, key: 'left' });
                        if (content.founders.right) await syncFounder({ ...content.founders.right, key: 'right' });
                        if (content.founders.image) await syncFounder({ image: content.founders.image, key: 'main' });
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
        updateHero({ [e.target.name]: e.target.value });
    };

    const handleFoundersChange = (section, field, value) => {
        const newFounders = { ...content.founders };
        if (section === 'main') {
            newFounders[field] = value;
            updateFounders(newFounders);
            // If it's the central image, we might want a special sync or just use 'main' key
            syncFounder({ [field]: value, key: 'main' });
        } else {
            newFounders[section] = { ...newFounders[section], [field]: value };
            updateFounders(newFounders);
            syncFounder({ ...newFounders[section], key: section });
        }
    };

    // Helper to handle array updates
    const handleArrayChange = (index, field, value, type) => {
        let newArray;
        if (type === 'work') {
            newArray = [...content.selectedWork];
            newArray[index] = { ...newArray[index], [field]: value };
            updateSelectedWork(newArray);
            syncSelectedWork(newArray[index]);
        } else if (type === 'projects') {
            newArray = [...content.allProjects];
            newArray[index] = { ...newArray[index], [field]: value };
            updateAllProjects(newArray);
            syncProject(newArray[index]);
        } else if (type === 'testimonials') {
            newArray = [...content.testimonials];
            newArray[index] = { ...newArray[index], [field]: value };
            updateTestimonials(newArray);
            syncTestimonial(newArray[index]);
        } else if (type === 'instagram') {
            newArray = [...content.instagram];
            newArray[index] = { ...newArray[index], [field]: value };
            updateInstagram(newArray);
            syncInstagram(newArray[index]);
        } else if (type === 'values') {
            newArray = [...content.values];
            newArray[index] = { ...newArray[index], [field]: value };
            updateValues(newArray);
            syncValue(newArray[index]);
        } else if (type === 'brands') {
            newArray = [...content.brandLogos];
            newArray[index] = { ...newArray[index], [field]: value };
            updateBrandLogos(newArray);
            syncBrand(newArray[index]);
        }
    };

    const addItem = async (type) => {
        const tempId = Date.now() + Math.random();
        if (type === 'work') {
            const newItem = { id: tempId, title: "New Project", category: "Category", image: "" };
            updateSelectedWork([...content.selectedWork, newItem]);
        } else if (type === 'projects') {
            const newProject = { id: tempId, title: "New Project", category: "Category", image: "", description: "Description" };
            updateAllProjects([...content.allProjects, newProject]);
        } else if (type === 'testimonials') {
            const newItem = { id: tempId, text: "New testimonial", author: "Author", rating: 5 };
            updateTestimonials([...content.testimonials, newItem]);
        } else if (type === 'instagram') {
            const newItem = { id: tempId, image: "", link: "#" };
            updateInstagram([...content.instagram, newItem]);
        } else if (type === 'values') {
            const newItem = { id: tempId, title: "New Value", text: "Description" };
            updateValues([...content.values, newItem]);
        } else if (type === 'brands') {
            const newItem = { id: tempId, logo: "" };
            updateBrandLogos([...content.brandLogos, newItem]);
        }
    };

    const deleteItem = async (index, type) => {
        showConfirm(
            "Confirm Deletion",
            `Are you sure you want to delete this ${type.slice(0, -1)}? This cannot be undone.`,
            async () => {
                let newArray;
                if (type === 'projects') {
                    const item = content.allProjects[index];
                    if (item._id) await removeProject(item._id);
                } else if (type === 'testimonials') {
                    const item = content.testimonials[index];
                    if (item._id) await removeTestimonial(item._id);
                } else if (type === 'instagram') {
                    const item = content.instagram[index];
                    if (item._id) await removeInstagram(item._id);
                } else if (type === 'work') {
                    const item = content.selectedWork[index];
                    if (item._id) await removeSelectedWork(item._id);
                } else if (type === 'values') {
                    const item = content.values[index];
                    if (item._id) await removeValue(item._id);
                } else if (type === 'brands') {
                    const item = content.brandLogos[index];
                    if (item._id) await removeBrand(item._id);
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
                    style={{
                        background: 'rgba(255, 255, 255, 0.85)',
                        backdropFilter: 'blur(12px)',
                        padding: '3.5rem',
                        borderRadius: '24px',
                        boxShadow: '0 20px 50px -12px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.05)',
                        width: '100%',
                        maxWidth: '460px',
                        border: '1px solid rgba(255,255,255,0.6)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'linear-gradient(90deg, var(--color-electric-blue), #4ecdc4)' }} />

                    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <h2 style={{ fontFamily: 'Bigilla, serif', fontSize: '2.8rem', marginBottom: '0.5rem', color: '#1a1a1a', letterSpacing: '-0.02em' }}>
                            {forgotStep === 1 ? 'Forgot Password' : forgotStep === 2 ? 'Reset Access' : 'Admin Access'}
                        </h2>
                        <p style={{ fontFamily: 'var(--font-body)', color: '#666', fontSize: '1rem' }}>
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

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ color: 'var(--color-electric-blue)', margin: 0 }}>Admin Dashboard</h1>
                <span style={{ fontSize: '0.9rem', color: 'green', backgroundColor: '#e6fffa', padding: '0.5rem 1rem', borderRadius: '20px', border: '1px solid #b2f5ea' }}>
                    ✓ Changes auto-saved to Database
                </span>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                {['enquiries', 'projects', 'selected work', 'founder', 'testimonials', 'instagram', 'brands'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '5px',
                            backgroundColor: activeTab === tab ? 'var(--color-electric-blue)' : '#eee',
                            color: activeTab === tab ? 'white' : 'black',
                            textTransform: 'capitalize',
                            cursor: 'pointer'
                        }}
                    >
                        {tab}
                    </button>
                ))}
                <button
                    onClick={initializeDatabase}
                    disabled={isInitializing}
                    style={{
                        marginLeft: 'auto',
                        backgroundColor: isInitializing ? '#ccc' : 'var(--color-electric-blue)',
                        color: 'white',
                        border: 'none',
                        padding: '0.6rem 1.5rem',
                        borderRadius: '30px',
                        cursor: isInitializing ? 'not-allowed' : 'pointer',
                        fontWeight: '600',
                        fontSize: '0.85rem',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
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
                        padding: '0.6rem 1.2rem',
                        borderRadius: '30px',
                        cursor: 'pointer',
                        border: 'none',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        boxShadow: '0 4px 15px rgba(255, 77, 79, 0.2)'
                    }}
                >
                    Sign Out
                </button>
                <button
                    onClick={() => showConfirm("Reset Content", "Reset all content to defaults? This will clear your current customizations.", () => resetContent())}
                    style={{
                        backgroundColor: 'transparent',
                        color: '#5D4037',
                        padding: '0.6rem 1.2rem',
                        borderRadius: '30px',
                        cursor: 'pointer',
                        border: '1px solid #D7CCC8',
                        fontSize: '0.8rem',
                        fontWeight: '500',
                        transition: 'all 0.2s ease'
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
                        <h2>Enquiries</h2>
                        {(!content.enquiries || content.enquiries.length === 0) ? (
                            <p style={{ color: '#666', fontStyle: 'italic' }}>No enquiries received yet.</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {content.enquiries.map((item) => (
                                    <div key={item.id} style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
                                        {/* Header Row */}
                                        <div
                                            onClick={() => setOpenEnquiryId(openEnquiryId === item.id ? null : item.id)}
                                            style={{
                                                padding: '1.5rem',
                                                backgroundColor: '#f9f9f9',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
                                                    <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--color-electric-blue)' }}>{item.service || 'General Enquiry'}</span>
                                                    <span style={{ fontSize: '0.9rem', color: '#666', fontFamily: 'monospace' }}>
                                                        {item.date} &nbsp;|&nbsp; {(() => {
                                                            try {
                                                                // Attempt to parse time string by appending to a dummy date
                                                                // Handles "20:30:00" -> "8:30 PM"
                                                                // Handles "8:30 PM" -> "8:30 PM" (idempotent-ish)
                                                                const timeString = item.time.trim();
                                                                const dummyDate = new Date('2000-01-01 ' + timeString);

                                                                if (isNaN(dummyDate.getTime())) return timeString; // Fallback if invalid

                                                                return dummyDate.toLocaleTimeString('en-US', {
                                                                    hour: 'numeric',
                                                                    minute: '2-digit',
                                                                    hour12: true
                                                                });
                                                            } catch (e) {
                                                                return item.time;
                                                            }
                                                        })()}
                                                    </span>
                                                </div>
                                                <div style={{ fontSize: '1.1rem' }}>{item.name}</div>
                                            </div>
                                            <div style={{ marginLeft: '1.5rem', transform: openEnquiryId === item.id ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s', fontSize: '1.5rem', color: '#888' }}>
                                                ▼
                                            </div>
                                        </div>

                                        {/* Expanded Details */}
                                        {openEnquiryId === item.id && (
                                            <div style={{ padding: '1.5rem', borderTop: '1px solid #ddd', backgroundColor: 'white' }}>
                                                <div style={{ marginBottom: '1rem' }}>
                                                    <strong>Email:</strong> <a href={`mailto:${item.email}`} style={{ color: 'var(--color-electric-blue)' }}>{item.email}</a>
                                                </div>
                                                <div>
                                                    <strong>Message:</strong>
                                                    <p style={{ backgroundColor: '#f4f4f4', padding: '1rem', borderRadius: '5px', marginTop: '0.5rem', whiteSpace: 'pre-wrap' }}>{item.message}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* PROJECT MANAGEMENT (BRAND PROFILES) */}
                {activeTab === 'projects' && (
                    <div>
                        <h2>Manage All Projects</h2>
                        <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>Add, edit, or remove projects from the global portfolio.</p>
                        {content.allProjects.map((item, index) => (
                            <div key={item.id} style={{ border: '1px solid #eee', padding: '1rem', marginBottom: '1rem', borderRadius: '5px' }}>
                                <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
                                    <input
                                        value={item.title}
                                        onChange={(e) => handleArrayChange(index, 'title', e.target.value, 'projects')}
                                        placeholder="Project Title"
                                        style={{ flex: 1, padding: '0.5rem', fontWeight: 'bold' }}
                                    />
                                    <button onClick={() => deleteItem(index, 'projects')} style={{ color: '#5D4037' }}>X</button>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
                                    <input
                                        value={item.category}
                                        onChange={(e) => handleArrayChange(index, 'category', e.target.value, 'projects')}
                                        placeholder="Category"
                                        style={{ flex: 1, padding: '0.5rem' }}
                                    />
                                </div>
                                <textarea
                                    value={item.description}
                                    onChange={(e) => handleArrayChange(index, 'description', e.target.value, 'projects')}
                                    placeholder="Project Description"
                                    style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem', minHeight: '80px' }}
                                />
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <FileUpload
                                        label="Project Image"
                                        value={item.image}
                                        onFileSelect={(val) => handleArrayChange(index, 'image', val, 'projects')}
                                        onRemove={() => handleArrayChange(index, 'image', '', 'projects')}
                                    />
                                    <FileUpload
                                        label="Project Video"
                                        value={item.video || ''}
                                        type="video"
                                        onFileSelect={(val) => handleArrayChange(index, 'video', val, 'projects')}
                                        onRemove={() => handleArrayChange(index, 'video', '', 'projects')}
                                    />
                                </div>
                            </div>
                        ))}
                        <button onClick={() => addItem('projects')} className="btn-primary" style={{ fontSize: '0.8rem' }}>Add New Project</button>
                    </div>
                )}

                {activeTab === 'selected work' && (
                    <div>
                        <h2>Selected Work (Home Page)</h2>
                        <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>Select which projects to feature on the Home page.</p>
                        {content.selectedWork.map((item, index) => (
                            <div key={item.id} style={{ border: '1px solid #eee', padding: '1rem', marginBottom: '1rem', borderRadius: '5px' }}>
                                <div style={{ marginBottom: '0.5rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.2rem' }}>Project</label>
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
                                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                                    >
                                        <option value="" disabled>Select a project...</option>
                                        {content.allProjects && content.allProjects.map((proj) => (
                                            <option key={proj.title || proj.id} value={proj.title}>
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
                                        style={{ flex: 1, padding: '0.5rem' }}
                                    />
                                    <button onClick={() => deleteItem(index, 'work')} style={{ color: '#5D4037' }}>X</button>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <FileUpload
                                        label="Override Image"
                                        value={item.image}
                                        onFileSelect={(val) => handleArrayChange(index, 'image', val, 'work')}
                                        onRemove={() => handleArrayChange(index, 'image', '', 'work')}
                                    />
                                    <FileUpload
                                        label="Override Video"
                                        value={item.video || ''}
                                        type="video"
                                        onFileSelect={(val) => handleArrayChange(index, 'video', val, 'work')}
                                        onRemove={() => handleArrayChange(index, 'video', '', 'work')}
                                    />
                                </div>
                            </div>
                        ))}
                        <button onClick={() => addItem('work')} className="btn-primary" style={{ fontSize: '0.8rem' }}>Add Project Slot</button>
                    </div>
                )}

                {activeTab === 'testimonials' && (
                    <div>
                        <h2>Testimonials</h2>
                        {content.testimonials.map((item, index) => (
                            <div key={item.id} style={{ border: '1px solid #eee', padding: '1rem', marginBottom: '1rem', borderRadius: '5px' }}>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.2rem', color: '#666' }}>Testimonial Text</label>
                                    <textarea value={item.text} onChange={(e) => handleArrayChange(index, 'text', e.target.value, 'testimonials')} placeholder="Testimonial Text" style={{ width: '100%', padding: '0.5rem', minHeight: '80px' }} />
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.2rem', color: '#666' }}>Reviewer Name</label>
                                        <input value={item.author} onChange={(e) => handleArrayChange(index, 'author', e.target.value, 'testimonials')} placeholder="Author" style={{ width: '100%', padding: '0.5rem' }} />
                                    </div>
                                    <div style={{ width: '100px' }}>
                                        <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.2rem', color: '#666' }}>Rating (1-5)</label>
                                        <input type="number" max="5" min="1" value={item.rating} onChange={(e) => handleArrayChange(index, 'rating', parseInt(e.target.value), 'testimonials')} placeholder="Rating" style={{ width: '100%', padding: '0.5rem' }} />
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                                        <button onClick={() => deleteItem(index, 'testimonials')} style={{ color: '#5D4037', padding: '0.5rem' }}>Remove</button>
                                    </div>
                                </div>

                            </div>
                        ))}
                        <button onClick={() => addItem('testimonials')} className="btn-primary" style={{ fontSize: '0.8rem' }}>Add Testimonial</button>
                    </div>
                )}


                {activeTab === 'instagram' && (
                    <div>
                        <h2>Instagram Content</h2>
                        {content.instagram.map((item, index) => (
                            <div key={item.id} style={{ border: '1px solid #eee', padding: '1rem', marginBottom: '1rem', borderRadius: '5px', display: 'flex', gap: '1rem' }}>
                                <div style={{ flex: 1 }}>
                                    <FileUpload
                                        label="Thumbnail"
                                        value={item.image}
                                        onFileSelect={(val) => handleArrayChange(index, 'image', val, 'instagram')}
                                        onRemove={() => handleArrayChange(index, 'image', '', 'instagram')}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label>Link</label>
                                    <input value={item.link} onChange={(e) => handleArrayChange(index, 'link', e.target.value, 'instagram')} placeholder="Link URL" style={{ width: '100%', padding: '0.5rem' }} />
                                </div>
                                <button onClick={() => deleteItem(index, 'instagram')} style={{ color: '#5D4037' }}>X</button>
                            </div >
                        ))}
                        <button onClick={() => addItem('instagram')} className="btn-primary" style={{ fontSize: '0.8rem' }}>Add Post</button>
                    </div >
                )}

                {activeTab === 'brands' && (
                    <div>
                        <h2>Manage Brand Logos</h2>
                        {content.brandLogos && content.brandLogos.map((item, index) => (
                            <div key={item.id} style={{ border: '1px solid #eee', padding: '1rem', marginBottom: '1rem', borderRadius: '5px' }}>
                                <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
                                    <button onClick={() => deleteItem(index, 'brands')} style={{ color: '#5D4037', marginLeft: 'auto' }}>X</button>
                                </div>
                                <FileUpload
                                    label="Brand Logo"
                                    value={item.logo || ''}
                                    onFileSelect={(val) => handleArrayChange(index, 'logo', val, 'brands')}
                                    onRemove={() => handleArrayChange(index, 'logo', '', 'brands')}
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
                                <h2>Shared Assets</h2>
                                <FileUpload
                                    label="Central Image"
                                    value={content.founders.image}
                                    onFileSelect={(val) => handleFoundersChange('main', 'image', val)}
                                    onRemove={() => handleFoundersChange('main', 'image', '')}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                {/* Founder 1 */}
                                <div style={{ border: '1px solid #ddd', padding: '1.5rem', borderRadius: '8px' }}>
                                    <h3>Founder 1</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <input value={content.founders.left.name} onChange={(e) => handleFoundersChange('left', 'name', e.target.value)} placeholder="Name" style={{ padding: '0.5rem' }} />
                                        <input value={content.founders.left.role} onChange={(e) => handleFoundersChange('left', 'role', e.target.value)} placeholder="Role" style={{ padding: '0.5rem' }} />
                                        <textarea value={content.founders.left.bio1} onChange={(e) => handleFoundersChange('left', 'bio1', e.target.value)} placeholder="Bio Paragraph 1" style={{ padding: '0.5rem', minHeight: '100px' }} />
                                        <textarea value={content.founders.left.bio2} onChange={(e) => handleFoundersChange('left', 'bio2', e.target.value)} placeholder="Bio Paragraph 2" style={{ padding: '0.5rem', minHeight: '100px' }} />
                                    </div>
                                </div>

                                {/* Founder 2 */}
                                <div style={{ border: '1px solid #ddd', padding: '1.5rem', borderRadius: '8px' }}>
                                    <h3>Founder 2</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <input value={content.founders.right.name} onChange={(e) => handleFoundersChange('right', 'name', e.target.value)} placeholder="Name" style={{ padding: '0.5rem' }} />
                                        <input value={content.founders.right.role} onChange={(e) => handleFoundersChange('right', 'role', e.target.value)} placeholder="Role" style={{ padding: '0.5rem' }} />
                                        <textarea value={content.founders.right.bio1} onChange={(e) => handleFoundersChange('right', 'bio1', e.target.value)} placeholder="Bio Paragraph 1" style={{ padding: '0.5rem', minHeight: '100px' }} />
                                        <textarea value={content.founders.right.bio2} onChange={(e) => handleFoundersChange('right', 'bio2', e.target.value)} placeholder="Bio Paragraph 2" style={{ padding: '0.5rem', minHeight: '100px' }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }

            </div >
            <CustomModal {...modal} />
        </div >
    );
};

export default Admin;
