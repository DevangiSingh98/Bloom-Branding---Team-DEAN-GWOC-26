import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import sendEmail from '../utils/sendEmail.js';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '30d',
    });
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res) => {
    const { username, password } = req.body;
    console.log(`[AUTH] Manual login attempt for: ${username}`);

    try {
        // Allow login with either username or email
        const user = await User.findOne({
            $or: [{ username }, { email: username }]
        });

        if (user && (await user.matchPassword(password))) {
            console.log(`[AUTH] Successful manual login: ${user.email}`);
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                isAdmin: user.isAdmin,
                companyName: user.companyName,
                token: generateToken(user._id),
            });
        } else {
            console.warn(`[AUTH] Failed manual login for: ${username} - ${!user ? 'User Not Found' : 'Incorrect Password'}`);
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        console.error(`[AUTH] Fatal login error: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Register a new CLIENT user (Public)
// @route   POST /api/users/register
// @access  Public
const registerClient = async (req, res) => {
    const { username, email, password } = req.body;

    const userExists = await User.findOne({ $or: [{ username }, { email }] });
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
        username,
        email,
        password,
        isAdmin: false,
        role: 'client'
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// @desc    Register a new user (Admin only)
// @route   POST /api/users
// @access  Protected (Admin)
const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    const userExists = await User.findOne({ $or: [{ username }, { email }] });
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
        username,
        email,
        password,
        isAdmin: true
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// @desc    Forgot Password - Send Email
// @route   POST /api/users/forgotpassword
// @access  Public
const forgotPassword = async (req, res) => {
    let { email } = req.body;
    if (email) email = email.toLowerCase().trim();
    console.log(`[FORGOT] Password reset requested for: ${email}`);

    try {
        const user = await User.findOne({ email });

        if (!user) {
            console.warn(`[FORGOT] User not found: ${email}`);
            return res.status(404).json({ message: 'User with this email does not exist' });
        }

        // Generate Reset Token
        const resetToken = crypto.randomBytes(20).toString('hex');

        // Hash token and save to DB
        user.resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        // Set expire (10 minutes)
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

        await user.save();

        // Create Reset URL
        const frontendUrl = (process.env.NODE_ENV === 'production' || process.env.RENDER)
            ? 'https://bloom-branding-3bdab.web.app'
            : (process.env.FRONTEND_URL || 'http://localhost:5173');

        // Check origin for different redirect paths
        const origin = req.body.origin || 'vault';
        const resetUrl = origin === 'admin'
            ? `${frontendUrl}/admin?resetToken=${resetToken}`
            : `${frontendUrl}/reset-password/${resetToken}`;

        const message = `You are receiving this email because you (or someone else) has requested the reset of a password. \n\n
Please click on the following link to reset your password:\n\n
${resetUrl}\n\n
If you did not request this, please ignore this email.`;

        console.log(`[FORGOT] Generated reset token for ${email}. Sending email...`);

        // Check if SMTP is configured
        if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
            console.error("[FORGOT] SMTP credentials missing in environment variables");
            return res.status(500).json({
                message: "Email service is not configured on the server. Please contact support.",
                debug: "SMTP_EMAIL/PASSWORD missing"
            });
        }

        try {
            await sendEmail({
                email: user.email,
                subject: 'Password Reset Token',
                message,
            });
            console.log(`[FORGOT] Reset email sent successfully to ${email}`);
            res.status(200).json({ success: true, data: 'Email sent' });
        } catch (err) {
            console.error(`[FORGOT] Email sending FAILED for ${email}:`, err);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();
            return res.status(500).json({ message: 'Email could not be sent: ' + err.message, stack: err.stack });
        }
    } catch (error) {
        console.error(`[FORGOT] Fatal error in forgotPassword: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Reset Password
// @route   PUT /api/users/resetpassword/:resettoken
// @access  Public
const resetPassword = async (req, res) => {
    const { password } = req.body;
    const { resettoken } = req.params;

    // Get hashed token
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(resettoken)
        .digest('hex');

    console.log(`[RESET] Attempting reset with token: ${resettoken.substring(0, 5)}... Hashed: ${resetPasswordToken.substring(0, 8)}...`);

    try {
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: new Date() },
        });

        if (!user) {
            console.warn(`[RESET] No user found for token or token expired. Hashed Token attempted: ${resetPasswordToken}`);
            return res.status(400).json({ message: 'Invalid token or token expired' });
        }

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(201).json({
            success: true,
            message: 'Password Updated Success',
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            await user.deleteOne();
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { authUser, registerUser, registerClient, forgotPassword, resetPassword, getUsers, deleteUser };
