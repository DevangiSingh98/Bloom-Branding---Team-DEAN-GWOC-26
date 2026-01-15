import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { motion } from 'framer-motion';

const FileUpload = ({ label, value, onFileSelect, type = "image" }) => {
    const [fileName, setFileName] = useState("No file chosen");
    const fileInputRef = React.useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name);
            const reader = new FileReader();
            reader.onloadend = () => {
                onFileSelect(reader.result);
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
                    Choose File
                </button>
                <span style={{ fontSize: '0.9rem', color: '#555' }}>{fileName}</span>
            </div>
        </div>
    );
};

const Admin = () => {
    const { content, updateHero, updateAllProjects, updateSelectedWork, updateTestimonials, updateClientLogos, updateInstagram, updateFounders, updateValues, resetContent } = useContent();
    const [activeTab, setActiveTab] = useState('enquiries');

    const [openEnquiryId, setOpenEnquiryId] = useState(null);

    const handleHeroChange = (e) => {
        updateHero({ [e.target.name]: e.target.value });
    };

    const handleFoundersChange = (section, field, value) => {
        if (section === 'main') {
            updateFounders({ [field]: value });
        } else {
            updateFounders({
                [section]: {
                    ...content.founders[section],
                    [field]: value
                }
            });
        }
    };

    // Helper to handle array updates
    const handleArrayChange = (index, field, value, type) => {
        let newArray;
        if (type === 'work') {
            newArray = [...content.selectedWork];
            newArray[index] = { ...newArray[index], [field]: value };
            updateSelectedWork(newArray);
        } else if (type === 'projects') {
            newArray = [...content.allProjects];
            newArray[index] = { ...newArray[index], [field]: value };
            updateAllProjects(newArray);
        } else if (type === 'testimonials') {
            newArray = [...content.testimonials];
            newArray[index] = { ...newArray[index], [field]: value };
            updateTestimonials(newArray);
        } else if (type === 'instagram') {
            newArray = [...content.instagram];
            newArray[index] = { ...newArray[index], [field]: value };
            updateInstagram(newArray);
        } else if (type === 'values') {
            newArray = [...content.values];
            newArray[index] = { ...newArray[index], [field]: value };
            updateValues(newArray);
        } else if (type === 'clients') {
            newArray = [...content.clientLogos];
            newArray[index] = { ...newArray[index], [field]: value };
            updateClientLogos(newArray);
        }
    };

    const addItem = (type) => {
        if (type === 'work') {
            updateSelectedWork([...content.selectedWork, { id: Date.now(), title: "New Project", category: "Category", image: "" }]);
        } else if (type === 'projects') {
            updateAllProjects([...content.allProjects, { title: "New Project", category: "Category", image: "", description: "Description" }]);
        } else if (type === 'testimonials') {
            updateTestimonials([...content.testimonials, { id: Date.now(), text: "New testimonial", author: "Author", rating: 5 }]);
        } else if (type === 'instagram') {
            updateInstagram([...content.instagram, { id: Date.now(), image: "", link: "#" }]);
        } else if (type === 'values') {
            updateValues([...content.values, { id: Date.now(), title: "New Value", text: "Description" }]);
        } else if (type === 'clients') {
            updateClientLogos([...content.clientLogos, { id: Date.now(), name: "Client Name", logo: "" }]);
        }
    };

    const deleteItem = (index, type) => {
        let newArray;
        if (type === 'work') newArray = content.selectedWork.filter((_, i) => i !== index);
        else if (type === 'projects') newArray = content.allProjects.filter((_, i) => i !== index);
        else if (type === 'testimonials') newArray = content.testimonials.filter((_, i) => i !== index);
        else if (type === 'instagram') newArray = content.instagram.filter((_, i) => i !== index);
        else if (type === 'values') newArray = content.values.filter((_, i) => i !== index);
        else if (type === 'clients') newArray = content.clientLogos.filter((_, i) => i !== index);

        if (type === 'work') updateSelectedWork(newArray);
        else if (type === 'projects') updateAllProjects(newArray);
        else if (type === 'testimonials') updateTestimonials(newArray);
        else if (type === 'instagram') updateInstagram(newArray);
        else if (type === 'values') updateValues(newArray);
        else if (type === 'clients') updateClientLogos(newArray);
    };

    return (
        <div className="section-padding container" style={{ minHeight: '80vh', marginTop: '4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ color: 'var(--color-electric-blue)', margin: 0 }}>Admin Dashboard</h1>
                <span style={{ fontSize: '0.9rem', color: 'green', backgroundColor: '#e6fffa', padding: '0.5rem 1rem', borderRadius: '20px', border: '1px solid #b2f5ea' }}>
                    ✓ Changes auto-saved to browser
                </span>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                {['enquiries', 'projects', 'selected work', 'founder', 'testimonials', 'instagram'].map(tab => (
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
                <button onClick={() => { if (window.confirm('Reset all content?')) resetContent() }} style={{ marginLeft: 'auto', backgroundColor: '#ffcccc', color: 'red' }}>Reset Defaults</button>
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
                            <div key={index} style={{ border: '1px solid #eee', padding: '1rem', marginBottom: '1rem', borderRadius: '5px' }}>
                                <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
                                    <input
                                        value={item.title}
                                        onChange={(e) => handleArrayChange(index, 'title', e.target.value, 'projects')}
                                        placeholder="Project Title"
                                        style={{ flex: 1, padding: '0.5rem', fontWeight: 'bold' }}
                                    />
                                    <button onClick={() => deleteItem(index, 'projects')} style={{ color: 'red' }}>X</button>
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
                                <FileUpload
                                    label="Project Image"
                                    value={item.image}
                                    onFileSelect={(val) => handleArrayChange(index, 'image', val, 'projects')}
                                />
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
                                            <option key={proj.title} value={proj.title}>
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
                                    <button onClick={() => deleteItem(index, 'work')} style={{ color: 'red' }}>X</button>
                                </div>
                                <FileUpload
                                    label="Override Image"
                                    value={item.image}
                                    onFileSelect={(val) => handleArrayChange(index, 'image', val, 'work')}
                                />
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
                                        <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.2rem', color: '#666' }}>Client Name</label>
                                        <input value={item.author} onChange={(e) => handleArrayChange(index, 'author', e.target.value, 'testimonials')} placeholder="Author" style={{ width: '100%', padding: '0.5rem' }} />
                                    </div>
                                    <div style={{ width: '100px' }}>
                                        <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.2rem', color: '#666' }}>Rating (1-5)</label>
                                        <input type="number" max="5" min="1" value={item.rating} onChange={(e) => handleArrayChange(index, 'rating', parseInt(e.target.value), 'testimonials')} placeholder="Rating" style={{ width: '100%', padding: '0.5rem' }} />
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                                        <button onClick={() => deleteItem(index, 'testimonials')} style={{ color: 'red', padding: '0.5rem' }}>Remove</button>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <FileUpload
                                        label="Client Photo"
                                        value={item.image}
                                        onFileSelect={(val) => handleArrayChange(index, 'image', val, 'testimonials')}
                                    />
                                    <FileUpload
                                        label="Video"
                                        value={item.video}
                                        type="video"
                                        onFileSelect={(val) => handleArrayChange(index, 'video', val, 'testimonials')}
                                    />
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
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label>Link</label>
                                    <input value={item.link} onChange={(e) => handleArrayChange(index, 'link', e.target.value, 'instagram')} placeholder="Link URL" style={{ width: '100%', padding: '0.5rem' }} />
                                </div>
                                <button onClick={() => deleteItem(index, 'instagram')} style={{ color: 'red' }}>X</button>
                            </div>
                        ))}
                        <button onClick={() => addItem('instagram')} className="btn-primary" style={{ fontSize: '0.8rem' }}>Add Post</button>
                    </div>
                )}

                {activeTab === 'founder' && (
                    <div style={{ display: 'grid', gap: '2rem' }}>
                        <div>
                            <h2>Shared Assets</h2>
                            <FileUpload
                                label="Central Image"
                                value={content.founders.image}
                                onFileSelect={(val) => handleFoundersChange('main', 'image', val)}
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
                )}


            </div>
        </div>
    );
};

export default Admin;
