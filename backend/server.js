import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import './config/passport.js';

import projectRoutes from './routes/projectRoutes.js';
import userRoutes from './routes/userRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import testimonialRoutes from './routes/testimonialRoutes.js';
import instagramRoutes from './routes/instagramRoutes.js';
import founderRoutes from './routes/founderRoutes.js';
import valueRoutes from './routes/valueRoutes.js';
import brandRoutes from './routes/brandRoutes.js';
import selectedWorkRoutes from './routes/selectedWorkRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import heroRoutes from './routes/heroRoutes.js';
import siteImageRoutes from './routes/siteImageRoutes.js';
import legalRoutes from './routes/legalRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import assetRoutes from './routes/assetRoutes.js';
import vibeRoutes from './routes/vibeRoutes.js';
dotenv.config();

connectDB();

const app = express();
app.set('trust proxy', 1); // Trust first, necessary for Render/Heroku
const FRONTEND_URL = (process.env.NODE_ENV === 'production' || process.env.RENDER)
    ? 'https://bloom-branding-3bdab.web.app'
    : (process.env.FRONTEND_URL || 'http://localhost:5173');

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174', // Sometimes vite switches ports
    'https://bloom-branding-3bdab.web.app',
    'https://bloom-branding-3bdab.firebaseapp.com',
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes(origin)) {
            callback(null, origin); // Return the origin string for credentials
        } else {
            console.warn(`Blocked by CORS: ${origin}`);
            callback(null, origin); // Temporarily allow for debugging
        }
    },
    credentials: true
}));
app.use(express.json());

// Session and Passport Middleware
app.use(session({
    secret: process.env.JWT_SECRET || 'secret',
    resave: true, // More reliable for some environments
    saveUninitialized: true, // More reliable for debugging
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
    }),
    proxy: true, // Tell session to trust the proxy
    cookie: {
        secure: true, // Force secure since we are on HTTPS
        sameSite: 'none', // Required for cross-site
        maxAge: 24 * 60 * 60 * 1000
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} - Session ID: ${req.sessionID}`);
    if (req.user) console.log(`User found in session: ${req.user.email}`);
    else console.log('No user in session');
    next();
});

app.use('/api/projects', projectRoutes);
app.use('/api/users', userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/instagram', instagramRoutes);
app.use('/api/founders', founderRoutes);
app.use('/api/values', valueRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/selected-work', selectedWorkRoutes);
app.use('/api/chat', chatRoutes);
// ... imports

app.use('/api/hero', heroRoutes);
app.use('/api/site-images', siteImageRoutes);
app.use('/api/vibes', vibeRoutes); // Register Vibes
app.use('/api/legal', legalRoutes);

app.use('/api/ai', aiRoutes);
app.use('/api/assets', assetRoutes);

// --- GOOGLE AUTH ROUTES ---
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google-callback',
    passport.authenticate('google', { failureRedirect: `${FRONTEND_URL}/vault/login?error=true` }),
    (req, res) => {
        // Successful authentication
        // Redirect to personalized vault if companyName exists
        const personalizedPath = req.user.companyName
            ? `/vault/${encodeURIComponent(req.user.companyName.toLowerCase().replace(/\s+/g, '-'))}`
            : '/vault';
        res.redirect(`${FRONTEND_URL}${personalizedPath}?login=success`);
    }
);

app.get('/auth/current_user', (req, res) => {
    console.log('CHECKING CURRENT USER. Session ID:', req.sessionID);
    if (req.user) {
        console.log('Found user in session:', req.user.email);
        import('jsonwebtoken').then(({ default: jwt }) => {
            const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET || 'secret', {
                expiresIn: '30d',
            });
            const userData = req.user.toObject();
            res.json({ ...userData, token });
        });
    } else {
        console.log('No user found in session for ID:', req.sessionID);
        res.status(401).send(null);
    }
});
app.get('/auth/logout', (req, res) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect(`${FRONTEND_URL}/`);
    });
});

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.get('/version', (req, res) => {
    res.json({ version: '1.6.4', timestamp: new Date().toISOString(), note: 'AI Resilience Update (Extended Retries)' });
});

// Error Handling Middleware (Must be last)
app.use(notFound);
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
