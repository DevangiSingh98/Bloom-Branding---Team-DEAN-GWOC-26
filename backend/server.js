import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import projectRoutes from './routes/projectRoutes.js';
import userRoutes from './routes/userRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import messageRoutes from './routes/messageRoutes.js';


// Load env vars from root directory
dotenv.config({ path: '../.env' });

// Initialize App
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

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

app.get('/', (req, res) => {
    res.send('API is running...');
});


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
