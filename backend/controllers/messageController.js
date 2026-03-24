import Message from '../models/Message.js';
import sendEmail from '../utils/sendEmail.js';

// @desc    Create a new message
// @route   POST /api/messages
// @access  Public
const createMessage = async (req, res) => {
    const { name, email, subject, message, company, service, budget, timeline, phone } = req.body;

    try {
        const msg = new Message({
            name,
            email,
            phone,
            subject,
            message,
            company,
            service,
            budget,
            timeline
        });

        const createdMessage = await msg.save();

        // Prepare email content
        const emailMessage = `
            Name: ${name}
            Phone NO: ${phone || 'N/A'}
            Email: ${email}
            Subject: ${subject}
            Message: ${message}
            Company: ${company || 'N/A'}
            Service: ${service || 'N/A'}
            Budget: ${budget || 'N/A'}
            Timeline: ${timeline || 'N/A'}
        `;

        // Attempt to send email
        try {
            await sendEmail({
                email: 'akshayabalagopalan14@gmail.com', // Recipient email
                subject: `New Query from ${name}`,
                message: emailMessage
            });
        } catch (emailError) {
            console.error("Email failed to send:", emailError);
            // If email fails, respond with 500 but still return the created message if database save was successful
            // Or, if the instruction means to fail the entire request if email fails, then return here.
            // The instruction "Throw 500 status on email failure instead of eating the error" implies failing the request.
            return res.status(500).json({ message: 'Message saved, but failed to send notification email via SMTP', error: emailError.message, createdMessage });
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