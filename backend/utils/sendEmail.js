import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
    const isGmail = process.env.SMTP_HOST && process.env.SMTP_HOST.includes('gmail');

    let transporterConfigs;

    if (isGmail) {
        // Optimized for Gmail on cloud hosts like Render/Heroku
        transporterConfigs = {
            service: 'gmail',
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD,
            },
            connectionTimeout: 30000, // 30 seconds
            greetingTimeout: 30000,
            socketTimeout: 30000,
        };
    } else {
        const port = process.env.SMTP_PORT || 587;
        transporterConfigs = {
            host: process.env.SMTP_HOST,
            port: port,
            secure: port == 465,
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD,
            },
            tls: {
                rejectUnauthorized: false
            },
            connectionTimeout: 20000,
            greetingTimeout: 20000,
        };
    }

    const transporter = nodemailer.createTransport(transporterConfigs);

    console.log(`[EMAIL SETUP] Service: ${isGmail ? 'Gmail' : 'Custom'}, Host: ${process.env.SMTP_HOST}`);

    const message = {
        from: `${process.env.FROM_NAME || 'Bloom Admin'} <${process.env.FROM_EMAIL || process.env.SMTP_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    const info = await transporter.sendMail(message);

    console.log('Message sent: %s', info.messageId);
};

export default sendEmail;
