import Message from '../models/Message.js';
import sendEmail from '../utils/sendEmail.js';

// @desc    Create a new message
// @route   POST /api/messages
// @access  Public
const createMessage = async (req, res) => {
    const { name, email, phone, message } = req.body;

    try {
        const msg = new Message({
            name,
            email,
            phone,
            message
        });

        const createdMessage = await msg.save();

        const emailMessage = `You have a new contact form submission!

Name: ${name}
Phone NO: ${phone}
Email: ${email}

Query/Help Needed:
${message}`;

        try {
            await sendEmail({
                email: 'akshayabalagopalan14@gmail.com',
                subject: `New Query from ${name}`,
                message: emailMessage
            });
        } catch (emailError) {
            console.error("Email failed to send:", emailError);
        }

        res.status(201).json(createdMessage);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all messages
// @route   GET /api/messages
// @access  Private/Admin
const getMessages = async (req, res) => {
    try {
        const messages = await Message.find({}).sort({ createdAt: -1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a message
// @route   DELETE /api/messages/:id
// @access  Private/Admin
const deleteMessage = async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);
        if (message) {
            await message.deleteOne();
            res.json({ message: 'Message removed' });
        } else {
            res.status(404).json({ message: 'Message not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete multiple messages (Bulk or All)
// @route   DELETE /api/messages
// @access  Private/Admin
const deleteMessages = async (req, res) => {
    try {
        const { ids, all } = req.body;

        if (all) {
            await Message.deleteMany({});
            res.json({ message: 'All messages removed' });
        } else if (ids && ids.length > 0) {
            await Message.deleteMany({ _id: { $in: ids } });
            res.json({ message: 'Selected messages removed' });
        } else {
            res.status(400).json({ message: 'No messages selected' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { createMessage, getMessages, deleteMessage, deleteMessages };
