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

    console.log(`[EMAIL SETUP] Attempting connection via: ${isGmail ? 'Gmail Service' : (smtpHost + ':' + (parseInt(process.env.SMTP_PORT) || 587))}`);

    // Optional: Verify connection before sending in debug mode
    if (process.env.DEBUG_EMAIL === 'true') {
        try {
            await transporter.verify();
            console.log("[EMAIL] Connection verified successfully");
        } catch (vErr) {
            console.error("[EMAIL] Connection verification FAILED:", vErr.message);
            console.warn("[EMAIL TIP] Render often blocks 465. Use 587 or 2525. Ensure SMTP_HOST is reachable from outside your local network.");
        }
    }

    const message = {
        from: `${process.env.FROM_NAME || 'Bloom Admin'} <${process.env.FROM_EMAIL || smtpEmail}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    try {
        const info = await transporter.sendMail(message);
        console.log('Message sent: %s', info.messageId);
    } catch (sendErr) {
        console.error(`[EMAIL SEND FAILED] Error: ${sendErr.message}`);
        if (sendErr.code === 'ETIMEDOUT') {
            console.error("[EMAIL TIP] Connection timeout usually means the SMTP server is blocking the request or the port is closed on the hosting provider.");
        }
        throw sendErr; // re-throw for the controller to catch
    }
};

export default sendEmail;
