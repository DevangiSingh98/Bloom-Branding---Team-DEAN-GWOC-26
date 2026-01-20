import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
    // Robust detection of Gmail/SMTP settings
    const smtpHost = process.env.SMTP_HOST || '';
    const smtpEmail = process.env.SMTP_EMAIL || '';
    const smtpPass = process.env.SMTP_PASSWORD || '';
    const isGmail = smtpHost.toLowerCase().includes('gmail') || process.env.SMTP_SERVICE === 'gmail';

    if (!smtpEmail || !smtpPass) {
        console.error("[EMAIL] Missing SMTP credentials! Email will not be sent.");
        throw new Error("Email credentials (SMTP_EMAIL/PASSWORD) are missing on the server.");
    }

    let transporterConfigs;

    if (isGmail) {
        // Optimized for Gmail on cloud hosts like Render/Heroku
        transporterConfigs = {
            service: 'gmail',
            auth: {
                user: smtpEmail,
                pass: smtpPass,
            },
            connectionTimeout: 30000,
            greetingTimeout: 30000,
            socketTimeout: 30000,
        };
    } else {
        const port = parseInt(process.env.SMTP_PORT) || 587;
        transporterConfigs = {
            host: smtpHost,
            port: port,
            secure: port === 465,
            auth: {
                user: smtpEmail,
                pass: smtpPass,
            },
            tls: {
                rejectUnauthorized: false
            },
            connectionTimeout: 20000,
            greetingTimeout: 20000,
        };
    }

    const transporter = nodemailer.createTransport(transporterConfigs);

    console.log(`[EMAIL SETUP] Service: ${isGmail ? 'Gmail' : 'Custom'}, Host: ${smtpHost || 'N/A'}`);

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
