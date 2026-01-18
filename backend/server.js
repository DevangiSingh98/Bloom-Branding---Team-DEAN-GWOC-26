import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import session from 'express-session';
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

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(cors({
    origin: FRONTEND_URL,
    credentials: true
}));
app.use(express.json());

// Session and Passport Middleware
app.use(session({
    secret: process.env.JWT_SECRET || 'secret', // Use JWT_SECRET for session secret
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

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
app.use('/api/legal', legalRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/assets', assetRoutes);

// --- GOOGLE AUTH ROUTES ---
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: `${FRONTEND_URL}/vault/login?error=true` }),
    (req, res) => {
        // Successful authentication
        // In a real production app, generate a JWT token here and pass it via URL (or cookie)
        // For now, we redirect to frontend with a flag, and frontend will fetch user data
        res.redirect(`${FRONTEND_URL}/vault?login=success`);
    }
);

app.get('/auth/current_user', (req, res) => {
    if (req.user) {
        // Generate Token for the user so they can use Bearer Auth for other routes
        // We need to import generateToken logic or duplicate it.
        // It's cleaner to import. But for now, let's quick fix import or verify.
        // `userController` has `generateToken` but it's not exported.
        // We really should export `generateToken` or use `jsonwebtoken` directly here.

        import('jsonwebtoken').then(({ default: jwt }) => {
            const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET || 'secret', {
                expiresIn: '30d',
            });

            // Return user AND token
            const userData = req.user.toObject();
            res.json({ ...userData, token });
        });
    } else {
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

// Error Handling Middleware (Must be last)
app.use(notFound);
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
