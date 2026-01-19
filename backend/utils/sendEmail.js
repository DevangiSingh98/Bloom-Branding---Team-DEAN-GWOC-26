import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
    const port = process.env.SMTP_PORT || 587;
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: port,
        secure: port == 465, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    console.log(`[EMAIL SETUP] Host: ${process.env.SMTP_HOST}, Port: ${port}, Secure: ${port == 465}`);

    const message = {
        from: `${process.env.FROM_NAME || 'Bloom Admin'} <${process.env.FROM_EMAIL || process.env.SMTP_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        // html: options.html // Optional: if you want HTML emails later
    };

    const info = await transporter.sendMail(message);

    console.log('Message sent: %s', info.messageId);
};

export default sendEmail;
