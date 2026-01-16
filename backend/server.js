import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
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
import legalContentRoutes from './routes/legalContentRoutes.js';

// Load env vars from root directory
dotenv.config({ path: '../.env' });

// Initialize App
const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Database Connection
// Check if URI is loaded
if (!process.env.MONGODB_URI) {
    console.error('FATAL ERROR: MONGODB_URI is not defined in ../.env');
    console.warn('Attempting to look for .env in current directory...');
    dotenv.config(); // Try current directory as fallback
}
connectDB();

// Routes
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
app.use('/api/hero', heroRoutes);
app.use('/api/legal-content', legalContentRoutes);
app.use('/api/chat', chatRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
