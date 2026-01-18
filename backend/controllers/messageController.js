import Message from '../models/Message.js';

// @desc    Create a new message
// @route   POST /api/messages
// @access  Public
const createMessage = async (req, res) => {
    // Destructure vibes and vibeDescription as well
    const { name, email, subject, message, company, service, budget, timeline, vibes, vibeDescription } = req.body;

    try {
        const msg = new Message({
            name,
            email,
            subject,
            message,
            company,
            service,
            budget,
            timeline,
            vibes,             // Pass to model
            vibeDescription    // Pass to model
        });

        const createdMessage = await msg.save();
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
