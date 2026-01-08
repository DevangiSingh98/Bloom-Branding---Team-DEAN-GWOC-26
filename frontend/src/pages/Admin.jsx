import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { motion } from 'framer-motion';

const Admin = () => {
    const { content, updateHero, updateSelectedWork, updateTestimonials, updateInstagram, updateFounder, updateValues, resetContent } = useContent();
    const [activeTab, setActiveTab] = useState('hero');

    const [openEnquiryId, setOpenEnquiryId] = useState(null);

    const handleHeroChange = (e) => {
        updateHero({ [e.target.name]: e.target.value });
    };

    const handleFounderChange = (e) => {
        updateFounder({ [e.target.name]: e.target.value });
    };

    // Helper to handle array updates
    const handleArrayChange = (index, field, value, type) => {
        let newArray;
        if (type === 'work') {
            newArray = [...content.selectedWork];
            newArray[index] = { ...newArray[index], [field]: value };
            updateSelectedWork(newArray);
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
        }
    };

    const addItem = (type) => {
        if (type === 'work') {
            updateSelectedWork([...content.selectedWork, { id: Date.now(), title: "New Project", category: "Category", image: "" }]);
        } else if (type === 'testimonials') {
            updateTestimonials([...content.testimonials, { id: Date.now(), text: "New testimonial", author: "Author", rating: 5 }]);
        } else if (type === 'instagram') {
            updateInstagram([...content.instagram, { id: Date.now(), image: "", link: "#" }]);
        } else if (type === 'values') {
            updateValues([...content.values, { id: Date.now(), title: "New Value", text: "Description" }]);
        }
    };

    const deleteItem = (index, type) => {
        let newArray;
        if (type === 'work') newArray = content.selectedWork.filter((_, i) => i !== index);
        else if (type === 'testimonials') newArray = content.testimonials.filter((_, i) => i !== index);
        else if (type === 'instagram') newArray = content.instagram.filter((_, i) => i !== index);
        else if (type === 'values') newArray = content.values.filter((_, i) => i !== index);

        if (type === 'work') updateSelectedWork(newArray);
        else if (type === 'testimonials') updateTestimonials(newArray);
        else if (type === 'instagram') updateInstagram(newArray);
        else if (type === 'values') updateValues(newArray);
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
                {['hero', 'enquiries', 'founder', 'values', 'work', 'testimonials', 'instagram'].map(tab => (
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
                {activeTab === 'hero' && (
                    <div>
                        <h2>Hero Section</h2>
                        <div style={{ marginTop: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Subtitle / Tagline</label>
                            <textarea
                                name="subtitle"
                                value={content.hero.subtitle}
                                onChange={handleHeroChange}
                                style={{ width: '100%', padding: '0.5rem', minHeight: '100px' }}
                            />
                        </div>
                    </div>
                )}

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
                                                    <span style={{ fontSize: '0.9rem', color: '#666', fontFamily: 'monospace' }}>{item.date} &nbsp;|&nbsp; {item.time}</span>
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

                {activeTab === 'work' && (
                    <div>
                        <h2>Selected Work</h2>
                        {content.selectedWork.map((item, index) => (
                            <div key={item.id} style={{ border: '1px solid #eee', padding: '1rem', marginBottom: '1rem', borderRadius: '5px' }}>
                                <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
                                    <input value={item.title} onChange={(e) => handleArrayChange(index, 'title', e.target.value, 'work')} placeholder="Title" style={{ flex: 1, padding: '0.5rem' }} />
                                    <input value={item.category} onChange={(e) => handleArrayChange(index, 'category', e.target.value, 'work')} placeholder="Category" style={{ flex: 1, padding: '0.5rem' }} />
                                    <button onClick={() => deleteItem(index, 'work')} style={{ color: 'red' }}>X</button>
                                </div>
                                <input value={item.image} onChange={(e) => handleArrayChange(index, 'image', e.target.value, 'work')} placeholder="Image URL (optional)" style={{ width: '100%', padding: '0.5rem' }} />
                            </div>
                        ))}
                        <button onClick={() => addItem('work')} className="btn-primary" style={{ fontSize: '0.8rem' }}>Add Project</button>
                    </div>
                )}

                {activeTab === 'testimonials' && (
                    <div>
                        <h2>Testimonials</h2>
                        {content.testimonials.map((item, index) => (
                            <div key={item.id} style={{ border: '1px solid #eee', padding: '1rem', marginBottom: '1rem', borderRadius: '5px' }}>
                                <textarea value={item.text} onChange={(e) => handleArrayChange(index, 'text', e.target.value, 'testimonials')} placeholder="Testimonial Text" style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }} />
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <input value={item.author} onChange={(e) => handleArrayChange(index, 'author', e.target.value, 'testimonials')} placeholder="Author" style={{ flex: 1, padding: '0.5rem' }} />
                                    <input type="number" max="5" min="1" value={item.rating} onChange={(e) => handleArrayChange(index, 'rating', parseInt(e.target.value), 'testimonials')} placeholder="Rating" style={{ width: '60px', padding: '0.5rem' }} />
                                    <button onClick={() => deleteItem(index, 'testimonials')} style={{ color: 'red' }}>X</button>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                                    <input value={item.image || ''} onChange={(e) => handleArrayChange(index, 'image', e.target.value, 'testimonials')} placeholder="Client Photo URL" style={{ flex: 1, padding: '0.5rem' }} />
                                    <input value={item.video || ''} onChange={(e) => handleArrayChange(index, 'video', e.target.value, 'testimonials')} placeholder="Client Video URL (optional)" style={{ flex: 1, padding: '0.5rem' }} />
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
                                    <label>Post Label / Image</label>
                                    <input value={item.image} onChange={(e) => handleArrayChange(index, 'image', e.target.value, 'instagram')} placeholder="Image Label or URL" style={{ width: '100%', padding: '0.5rem' }} />
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
                    <div>
                        <h2>Founder Details</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <input name="name" value={content.founder.name} onChange={handleFounderChange} placeholder="Name" style={{ padding: '0.5rem' }} />
                            <input name="role" value={content.founder.role} onChange={handleFounderChange} placeholder="Role" style={{ padding: '0.5rem' }} />
                            <input name="image" value={content.founder.image} onChange={handleFounderChange} placeholder="Image URL / Placeholder Text" style={{ padding: '0.5rem' }} />
                            <textarea name="bio1" value={content.founder.bio1} onChange={handleFounderChange} placeholder="Bio Paragraph 1" style={{ padding: '0.5rem', minHeight: '100px' }} />
                            <textarea name="bio2" value={content.founder.bio2} onChange={handleFounderChange} placeholder="Bio Paragraph 2" style={{ padding: '0.5rem', minHeight: '100px' }} />
                        </div>
                    </div>
                )}

                {activeTab === 'values' && (
                    <div>
                        <h2>Core Values</h2>
                        {content.values.map((item, index) => (
                            <div key={item.id} style={{ border: '1px solid #eee', padding: '1rem', marginBottom: '1rem', borderRadius: '5px' }}>
                                <input value={item.title} onChange={(e) => handleArrayChange(index, 'title', e.target.value, 'values')} placeholder="Title" style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem', fontWeight: 'bold' }} />
                                <textarea value={item.text} onChange={(e) => handleArrayChange(index, 'text', e.target.value, 'values')} placeholder="Description" style={{ width: '100%', padding: '0.5rem' }} />
                                <button onClick={() => deleteItem(index, 'values')} style={{ color: 'red', marginTop: '0.5rem' }}>Remove Value</button>
                            </div>
                        ))}
                        <button onClick={() => addItem('values')} className="btn-primary" style={{ fontSize: '0.8rem' }}>Add Value</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admin;
