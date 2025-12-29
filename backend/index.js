require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

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

app.post('/send-email', async (req, res) => {
    const { firstName, lastName, email, phone, company, budget, services, timeline, message, newsletter } = req.body;

    let transporterInfo;
    try {
        transporterInfo = await createTransporter();
    } catch (err) {
        console.error(err && err.message ? err.message : err);
        return res.status(500).json({ error: 'Server email configuration issue.' });
    }
    const transporter = transporterInfo.transporter;

    const mailOptions = {
        from: email,
        to: 'elitesolutions187@gmail.com', // Replace with your recipient email
        subject: 'New Contact Form Submission',
        html: `
            <p><strong>Name:</strong> ${firstName} ${lastName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
            <p><strong>Company:</strong> ${company || 'N/A'}</p>
            <p><strong>Budget:</strong> ${budget || 'N/A'}</p>
            <p><strong>Services:</strong> ${services.join(', ') || 'N/A'}</p>
            <p><strong>Timeline:</strong> ${timeline || 'N/A'}</p>
            <p><strong>Message:</strong> ${message}</p>
            <p><strong>Newsletter Subscription:</strong> ${newsletter ? 'Yes' : 'No'}</p>
        `
    };

    try {
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

    let transporterInfo;
    try {
        transporterInfo = await createTransporter();
    } catch (err) {
        console.error(err && err.message ? err.message : err);
        return res.status(500).json({ error: 'Server email configuration issue.' });
    }
    const transporter = transporterInfo.transporter;

    const mailOptions = {
        from: email,
        to: 'elitesolutions187@gmail.com', // Replace with your recipient email
        subject: 'New Project Configurator Submission',
        html: `
            <p><strong>Full Name:</strong> ${fullName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
            <p><strong>Company:</strong> ${company || 'N/A'}</p>
            <p><strong>Project Details:</strong></p>
            <ul>
                <li><strong>Services:</strong> ${projectDetails.services.map(s => s.name).join(', ')}</li>
                <li><strong>Estimated Price:</strong> Ksh ${projectDetails.totalPrice.toLocaleString()}</li>
                <li><strong>Timeline:</strong> ${projectDetails.timeline}</li>
                <li><strong>Team Size:</strong> ${projectDetails.teamSize}</li>
                <li><strong>Description:</strong> ${projectDetails.description}</li>
            </ul>
        `
    };

    try {
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