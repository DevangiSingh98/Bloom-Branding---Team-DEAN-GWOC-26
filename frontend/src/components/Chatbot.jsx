import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const faqData = [
    {
        question: "What does Bloom Branding do?",
        answer: "We are storytellers, strategists, and creators dedicated to crafting meaningful connections. We take the core essence of a business and nurture it through design, strategy, and motion until it flourishes into a market leader.",
        keywords: ["bloom", "branding", "what", "do", "about", "mission"]
    },
    {
        question: "What services do you offer?",
        answer: "Our core services include Brand Strategy, Content Creation, Web & Digital Design, Social Media Management, and High-end Production.",
        keywords: ["services", "offer", "expertise", "specialise", "capabilities"]
    },
    {
        question: "How can I start a project?",
        answer: "You can reach out through our Contact page or send an enquiry directly. We'd love to hear about your vision and make your brand bloom!",
        keywords: ["start", "project", "work", "enquiry", "hire", "process"],
        type: 'contact'
    },
    {
        question: "How much do your services cost?",
        answer: "Our pricing varies depending on the scope and complexity of the project. We offer customized packages to suit different needs. Let's discuss your requirements to provide a tailored quote.",
        keywords: ["pricing", "cost", "price", "budget", "quote", "money", "expensive"]
    },
    {
        question: "What is your typical project timeline?",
        answer: "Timelines depend on the project type. A brand identity usually takes 4-6 weeks, while a full website might take 8-12 weeks. We prioritize quality and strategic depth in every project.",
        keywords: ["timeline", "duration", "how long", "time", "speed", "fast"]
    },
    {
        question: "Who is the founder?",
        answer: "Bloom Branding was founded by Jane Doe, a Creative Director with over a decade of experience in digital transformation. Her vision is to bridge the gap between aesthetic beauty and strategic growth.",
        keywords: ["founder", "owner", "jane", "doe", "who", "lead", "team"]
    },
    {
        question: "What are your core values?",
        answer: "We believe in Boldness, Empathy, Growth, and Transparency. We take risks to help you stand out and focus on design that drives results.",
        keywords: ["values", "bold", "empathy", "growth", "transparency", "philosophy"]
    },
    {
        question: "How can I contact the team?",
        answer: "We'd love to hear from you! You can use the button below to go to our contact page and fill out the form.",
        keywords: ["contact", "email", "call", "address", "phone", "reach", "talk"],
        type: 'contact'
    }
];

export default function Chatbot() {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'bot', text: "Hi! I'm Bloom Bot. How can I help you bloom today? Pick a question from the sidebar!" }
    ]);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleQuestionClick = (faq) => {
        const newMessages = [
            ...messages,
            { role: 'user', text: faq.question },
            { role: 'bot', text: faq.answer, type: faq.type }
        ];
        setMessages(newMessages);
    };



    // const [inputValue, setInputValue] = useState(''); // Removed Gemini
    // const [isLoading, setIsLoading] = useState(false); // Removed Gemini

    /* Removed Gemini Logic
    const handleSend = async () => { ... }
    const handleKeyPress = (e) => { ... }
    */

    return (
        <div className="chatbot-container">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="chatbot-wrapper"
                        style={{
                            position: 'fixed',
                            bottom: '100px',
                            right: '20px',
                            width: '350px',
                            maxWidth: '90vw',
                            height: '500px',
                            maxHeight: '70vh',
                            zIndex: 1000,
                            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                            borderRadius: '20px',
                            overflow: 'hidden',
                            backgroundColor: '#fff',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >




                        <div className="chatbot-window" style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', position: 'relative' }}>
                            {/* Header */}
                            <div style={{
                                padding: '20px',
                                background: 'var(--color-electric-blue)',
                                color: 'white',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#4ade80' }}></div>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '1.2rem', fontFamily: 'Bigilla', letterSpacing: '0.5px' }}>Bloom Bot</h3>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.5rem', lineHeight: 0.5 }}
                                >
                                    ×
                                </button>
                            </div>

                            {/* Messages Area */}
                            <div style={{
                                flex: 1,
                                overflowY: 'auto',
                                padding: '20px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '15px',
                                backgroundColor: '#f5f5fa'
                            }} className="hide-scrollbar">
                                {messages.map((msg, i) => (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        key={i}
                                        style={{
                                            alignSelf: msg.role === 'bot' ? 'flex-start' : 'flex-end',
                                            backgroundColor: msg.role === 'bot' ? 'white' : 'var(--color-electric-blue)',
                                            color: msg.role === 'bot' ? '#222' : 'white',
                                            padding: '12px 16px',
                                            borderRadius: msg.role === 'bot' ? '12px 12px 12px 2px' : '12px 12px 2px 12px',
                                            maxWidth: '85%',
                                            fontSize: '0.9rem',
                                            lineHeight: 1.5,
                                            boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                                            position: 'relative'
                                        }}
                                    >
                                        {msg.text}
                                        {msg.type === 'contact' && (
                                            <button
                                                onClick={() => navigate('/contact')}
                                                style={{
                                                    marginTop: '10px',
                                                    backgroundColor: 'var(--color-electric-blue)',
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '8px 15px',
                                                    borderRadius: '20px',
                                                    cursor: 'pointer',
                                                    fontWeight: 'bold',
                                                    fontSize: '0.8rem',
                                                    width: '100%',
                                                    display: 'block'
                                                }}
                                            >
                                                Go to Contact
                                            </button>
                                        )}
                                    </motion.div>
                                ))}
                                {/* Question Overlay */}
                                <AnimatePresence>
                                    {showSidebar && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            style={{
                                                position: 'absolute',
                                                top: '70px',
                                                bottom: '60px',
                                                left: '10px',
                                                right: '10px',
                                                backgroundColor: 'white',
                                                borderRadius: '20px',
                                                padding: '20px',
                                                zIndex: 10,
                                                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                                border: '1px solid #eee',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                overflowY: 'auto'
                                            }}
                                            className="hide-scrollbar"
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                                <h3 style={{ margin: 0, color: 'var(--color-electric-blue)', fontSize: '1.2rem', fontFamily: 'Bigilla' }}>Common Questions</h3>
                                                <button onClick={() => setShowSidebar(false)} style={{ color: '#999', fontSize: '1.5rem', background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                {faqData.map((faq, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => {
                                                            handleQuestionClick(faq);
                                                            setShowSidebar(false);
                                                        }}
                                                        style={{
                                                            textAlign: 'left',
                                                            padding: '12px 16px',
                                                            borderRadius: '12px',
                                                            border: '1px solid #f0f0f0',
                                                            background: '#fafafa',
                                                            fontSize: '0.9rem',
                                                            color: '#333',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s'
                                                        }}
                                                        onMouseOver={(e) => {
                                                            e.currentTarget.style.backgroundColor = 'var(--color-electric-blue)';
                                                            e.currentTarget.style.color = 'white';
                                                            e.currentTarget.style.borderColor = 'var(--color-electric-blue)';
                                                        }}
                                                        onMouseOut={(e) => {
                                                            e.currentTarget.style.backgroundColor = '#fafafa';
                                                            e.currentTarget.style.color = '#333';
                                                            e.currentTarget.style.borderColor = '#f0f0f0';
                                                        }}
                                                    >
                                                        {faq.question}
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Footer */}
                            <div style={{
                                padding: '15px',
                                borderTop: '1px solid #eee',
                                backgroundColor: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                fontSize: '0.8rem',
                                color: '#999'
                            }}>
                                <button
                                    onClick={() => setShowSidebar(!showSidebar)}
                                    style={{
                                        background: showSidebar ? 'var(--color-electric-blue)' : 'white',
                                        border: '2px solid var(--color-electric-blue)',
                                        borderRadius: '12px',
                                        width: '40px',
                                        height: '40px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        color: showSidebar ? 'white' : 'var(--color-electric-blue)',
                                        transition: 'all 0.2s',
                                        fontWeight: 'bold',
                                        fontSize: '1rem',
                                        fontFamily: 'var(--font-brand)'
                                    }}
                                    title="Show/Hide Questions"
                                    onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#f0f0f5'; }}
                                    onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                                >
                                    {showSidebar ? '«' : 'Ask Bloom'}
                                </button>
                                <span style={{ opacity: 0.7 }}>Powered by Bloom Branding</span>
                                <div style={{ width: '30px' }}></div> {/* Spacer for balance */}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '70px',
                    height: '70px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-electric-blue)',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 10px 30px rgba(0,74,173,0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '30px',
                    zIndex: 1001,
                    position: 'fixed',
                    right: '20px',
                    bottom: '20px'
                }}
            >
                {isOpen ? '×' : '💬'}
            </motion.button>
        </div >
    );
}
