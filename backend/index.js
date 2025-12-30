require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const validator = require('validator');

const app = express();
const port = process.env.PORT || 3000;

const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:8000', 'http://localhost:3000'];

app.use(cors({
    origin: function(origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));

app.use(express.json({ limit: '10kb' }));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many requests, please try again later.'
});

app.use('/send-email', limiter);
app.use('/submit-project', limiter);

// Helper to create transporter from env vars
async function createTransporter() {
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : undefined;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const secure = process.env.SMTP_SECURE === 'true';

    if (host && user && pass) {
        return { transporter: nodemailer.createTransport({ host, port, secure, auth: { user, pass } }), isTest: false };
    }

    // Fallback to provider/service if provided (e.g., Gmail)
    const service = process.env.SMTP_SERVICE;
    if (service && user && pass) {
        return { transporter: nodemailer.createTransport({ service, auth: { user, pass } }), isTest: false };
    }

    // If no SMTP configured, create and use an Ethereal test account (free, for development/testing)
    const testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: { user: testAccount.user, pass: testAccount.pass }
    });

    return { transporter, isTest: true, testAccount };
}

// Helper to send via Brevo HTTP API if API key provided
async function sendViaBrevo(apiKey, mailOptions) {
    const payload = {
        sender: { email: mailOptions.from || process.env.SMTP_USER || 'no-reply@localhost' },
        to: [{ email: mailOptions.to }],
        subject: mailOptions.subject,
        htmlContent: mailOptions.html,
        textContent: mailOptions.text || ''
    };

    const resp = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'api-key': apiKey
        },
        body: JSON.stringify(payload)
    });

    if (!resp.ok) {
        const txt = await resp.text().catch(() => '');
        const err = new Error('Brevo API error: ' + resp.status + ' ' + txt);
        err.status = resp.status;
        throw err;
    }

    return resp.json();
}

app.post('/send-email', async (req, res) => {
    const { firstName, lastName, email, phone, company, budget, services, timeline, message, newsletter } = req.body;

    if (!firstName || !lastName || !email || !message) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({ error: 'Invalid email address' });
    }

    const sanitize = (str) => validator.escape(String(str || ''));

    let transporterInfo;
    try {
        transporterInfo = await createTransporter();
    } catch (err) {
        console.error(err && err.message ? err.message : err);
        return res.status(500).json({ error: 'Server email configuration issue.' });
    }
    const transporter = transporterInfo.transporter;

    const mailOptions = {
        from: process.env.SMTP_USER,
        replyTo: email,
        to: 'elitesolutions187@gmail.com',
        subject: 'New Contact Form Submission',
        html: `
            <p><strong>Name:</strong> ${sanitize(firstName)} ${sanitize(lastName)}</p>
            <p><strong>Email:</strong> ${sanitize(email)}</p>
            <p><strong>Phone:</strong> ${sanitize(phone) || 'N/A'}</p>
            <p><strong>Company:</strong> ${sanitize(company) || 'N/A'}</p>
            <p><strong>Budget:</strong> ${sanitize(budget) || 'N/A'}</p>
            <p><strong>Services:</strong> ${Array.isArray(services) ? services.map(s => sanitize(s)).join(', ') : 'N/A'}</p>
            <p><strong>Timeline:</strong> ${sanitize(timeline) || 'N/A'}</p>
            <p><strong>Message:</strong> ${sanitize(message)}</p>
            <p><strong>Newsletter Subscription:</strong> ${newsletter ? 'Yes' : 'No'}</p>
        `
    };

    try {
        // If Brevo API key is present, use it (preferred for Brevo)
        const brevoKey = process.env.BREVO_API_KEY;
        if (brevoKey) {
            try {
                await sendViaBrevo(brevoKey, mailOptions);
                return res.status(200).json({ ok: true });
            } catch (e) {
                console.error('Brevo API send error:', e && e.message ? e.message : e);
                // Fall back to transporter below if possible
            }
        }

        const info = await transporter.sendMail(mailOptions);
        if (transporterInfo.isTest) {
            const previewUrl = nodemailer.getTestMessageUrl(info);
            return res.status(200).json({ ok: true, previewUrl });
        }
        return res.status(200).json({ ok: true });
    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ error: 'Error sending email.' });
    }
});

app.post('/submit-project', async (req, res) => {
    const { fullName, email, phone, company, projectDetails } = req.body;

    if (!fullName || !email || !projectDetails) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({ error: 'Invalid email address' });
    }

    const sanitize = (str) => validator.escape(String(str || ''));

    let transporterInfo;
    try {
        transporterInfo = await createTransporter();
    } catch (err) {
        console.error(err && err.message ? err.message : err);
        return res.status(500).json({ error: 'Server email configuration issue.' });
    }
    const transporter = transporterInfo.transporter;

    const mailOptions = {
        from: process.env.SMTP_USER,
        replyTo: email,
        to: 'elitesolutions187@gmail.com',
        subject: 'New Project Configurator Submission',
        html: `
            <p><strong>Full Name:</strong> ${sanitize(fullName)}</p>
            <p><strong>Email:</strong> ${sanitize(email)}</p>
            <p><strong>Phone:</strong> ${sanitize(phone) || 'N/A'}</p>
            <p><strong>Company:</strong> ${sanitize(company) || 'N/A'}</p>
            <p><strong>Project Details:</strong></p>
            <ul>
                <li><strong>Services:</strong> ${Array.isArray(projectDetails.services) ? projectDetails.services.map(s => sanitize(s.name || '')).join(', ') : 'N/A'}</li>
                <li><strong>Estimated Price:</strong> Ksh ${sanitize(String(projectDetails.totalPrice || 0))}</li>
                <li><strong>Timeline:</strong> ${sanitize(projectDetails.timeline || '')}</li>
                <li><strong>Team Size:</strong> ${sanitize(String(projectDetails.teamSize || ''))}</li>
                <li><strong>Description:</strong> ${sanitize(projectDetails.description || '')}</li>
            </ul>
        `
    };

    try {
        const brevoKey = process.env.BREVO_API_KEY;
        if (brevoKey) {
            try {
                await sendViaBrevo(brevoKey, mailOptions);
                return res.status(200).json({ ok: true });
            } catch (e) {
                console.error('Brevo API send error (project):', e && e.message ? e.message : e);
            }
        }

        const info = await transporter.sendMail(mailOptions);
        if (transporterInfo.isTest) {
            const previewUrl = nodemailer.getTestMessageUrl(info);
            return res.status(200).json({ ok: true, previewUrl });
        }
        return res.status(200).json({ ok: true });
    } catch (error) {
        console.error('Error submitting project details:', error);
        return res.status(500).json({ error: 'Error submitting project details.' });
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});