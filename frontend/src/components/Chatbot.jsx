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
        keywords: ["start", "project", "work", "enquiry", "hire", "process"]
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
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState([
        { role: 'bot', text: "Hi! I'm Bloom Bot. How can I help you bloom today? Type a question or pick one from the sidebar!" }
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

    const handleSendMessage = (e) => {
        if (e) e.preventDefault();
        if (!inputValue.trim()) return;

        const userText = inputValue.toLowerCase();
        setMessages(prev => [...prev, { role: 'user', text: inputValue }]);
        setInputValue('');

        setTimeout(() => {
            // Greeting Check
            const greetings = ["hello", "hi", "hey", "hola", "greetings"];
            if (greetings.some(g => userText.includes(g))) {
                setMessages(prev => [...prev, {
                    role: 'bot',
                    text: "Hi, my name is Bloom Bot. How can I help you?"
                }]);
                return;
            }

            // Keyword Scoring Logic
            let bestMatch = null;
            let maxScore = 0;

            for (const item of faqData) {
                let score = 0;
                for (const kw of item.keywords) {
                    if (userText.includes(kw)) {
                        score++;
                    }
                }
                if (score > maxScore) {
                    maxScore = score;
                    bestMatch = item;
                }
            }

            if (bestMatch) {
                setMessages(prev => [...prev, {
                    role: 'bot',
                    text: bestMatch.answer,
                    type: bestMatch.type
                }]);
            } else {
                setMessages(prev => [...prev, {
                    role: 'bot',
                    text: "I'm not quite sure about that. Try asking about our 'services', 'pricing', or how to 'start a project'!"
                }]);
            }
        }, 500);
    };

    return (
        <div style={{ position: 'fixed', bottom: '10px', right: '30px', zIndex: 1000 }}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        style={{
                            display: 'flex',
                            gap: '20px',
                            alignItems: 'flex-end',
                            marginBottom: '5px',
                            flexWrap: 'wrap-reverse',
                            justifyContent: 'flex-end'
                        }}
                    >
                        {/* FAQ Sidebar */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            style={{
                                width: '280px',
                                maxHeight: '500px',
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                backdropFilter: 'blur(15px)',
                                borderRadius: '25px',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                                padding: '25px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px',
                                border: '1px solid rgba(255, 255, 255, 0.4)',
                                overflowY: 'auto'
                            }}
                            className="hide-scrollbar"
                        >
                            <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: 'var(--color-electric-blue)', fontFamily: 'Bigilla', letterSpacing: '1px' }}>QUICK QUESTIONS</h4>
                            {faqData.map((faq, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleQuestionClick(faq)}
                                    style={{
                                        textAlign: 'left',
                                        background: 'white',
                                        border: '1px solid #eee',
                                        padding: '12px 15px',
                                        borderRadius: '18px',
                                        fontSize: '0.85rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        color: '#444',
                                        boxShadow: '0 2px 5px rgba(0,0,0,0.02)'
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.borderColor = 'var(--color-electric-blue)';
                                        e.currentTarget.style.background = 'rgba(0, 74, 173, 0.05)';
                                        e.currentTarget.style.transform = 'translateX(5px)';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.borderColor = '#eee';
                                        e.currentTarget.style.background = 'white';
                                        e.currentTarget.style.transform = 'translateX(0)';
                                    }}
                                >
                                    {faq.question}
                                </button>
                            ))}
                        </motion.div>

                        {/* Chat Window */}
                        <div
                            style={{
                                width: '380px',
                                height: '600px',
                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                backdropFilter: 'blur(25px)',
                                borderRadius: '35px',
                                boxShadow: '0 30px 80px rgba(0,0,0,0.18)',
                                display: 'flex',
                                flexDirection: 'column',
                                overflow: 'hidden',
                                border: '1px solid rgba(255, 255, 255, 0.5)',
                            }}
                        >
                            {/* Header */}
                            <div style={{
                                padding: '30px 25px',
                                background: 'var(--color-electric-blue)',
                                color: 'white',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#4ade80' }}></div>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '1.4rem', fontFamily: 'Bigilla', letterSpacing: '0.5px' }}>Bloom Bot</h3>
                                        <span style={{ fontSize: '0.75rem', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '1px' }}>Always Growing</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '2rem', lineHeight: 0.5, transition: 'transform 0.2s' }}
                                    onMouseOver={(e) => e.currentTarget.style.transform = 'rotate(90deg)'}
                                    onMouseOut={(e) => e.currentTarget.style.transform = 'rotate(0)'}
                                >
                                    ×
                                </button>
                            </div>

                            {/* Messages Area */}
                            <div style={{
                                flex: 1,
                                overflowY: 'auto',
                                padding: '25px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '15px',
                                backgroundColor: 'rgba(245, 245, 250, 0.3)'
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
                                            padding: '14px 20px',
                                            borderRadius: msg.role === 'bot' ? '22px 22px 22px 5px' : '22px 22px 5px 22px',
                                            maxWidth: '85%',
                                            fontSize: '0.95rem',
                                            lineHeight: 1.5,
                                            boxShadow: msg.role === 'bot' ? '0 4px 15px rgba(0,0,0,0.05)' : '0 4px 15px rgba(0,74,173,0.15)',
                                            position: 'relative'
                                        }}
                                    >
                                        {msg.text}
                                        {msg.type === 'contact' && (
                                            <button
                                                onClick={() => navigate('/contact')}
                                                style={{
                                                    marginTop: '15px',
                                                    backgroundColor: 'var(--color-electric-blue)',
                                                    color: 'white',
                                                    border: '1px solid rgba(255,255,255,0.3)',
                                                    padding: '10px 18px',
                                                    borderRadius: '15px',
                                                    cursor: 'pointer',
                                                    fontWeight: 'bold',
                                                    fontSize: '0.85rem',
                                                    width: '100%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '8px',
                                                    transition: 'all 0.2s'
                                                }}
                                                onMouseOver={(e) => e.currentTarget.style.filter = 'brightness(1.1)'}
                                                onMouseOut={(e) => e.currentTarget.style.filter = 'none'}
                                            >
                                                Start Chatting ×
                                            </button>
                                        )}
                                    </motion.div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <form
                                onSubmit={handleSendMessage}
                                style={{
                                    padding: '20px 25px',
                                    borderTop: '1px solid rgba(0,0,0,0.06)',
                                    backgroundColor: 'white',
                                    display: 'flex',
                                    gap: '12px'
                                }}
                            >
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Type your message..."
                                    style={{
                                        flex: 1,
                                        border: '1px solid #f0f0f0',
                                        borderRadius: '25px',
                                        padding: '12px 22px',
                                        fontSize: '0.95rem',
                                        outline: 'none',
                                        backgroundColor: '#f8f9fa',
                                        transition: 'all 0.2s'
                                    }}
                                    onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-electric-blue)'}
                                    onBlur={(e) => e.currentTarget.style.borderColor = '#f0f0f0'}
                                />
                                <button
                                    type="submit"
                                    style={{
                                        backgroundColor: 'var(--color-electric-blue)',
                                        color: 'white',
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                        border: 'none',
                                        fontSize: '1.2rem'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1) rotate(-10deg)'}
                                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1) rotate(0)'}
                                >
                                    →
                                </button>
                            </form>
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
                    position: 'relative'
                }}
            >
                {isOpen ? '×' : '💬'}
            </motion.button>
        </div>
    );
}
