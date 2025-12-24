const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

app.post('/send-email', async (req, res) => {
    const { firstName, lastName, email, phone, company, budget, services, timeline, message, newsletter } = req.body;

    // Create a Nodemailer transporter using your email service details
    const transporter = nodemailer.createTransport({
        service: 'Gmail', // e.g., 'Gmail', 'Outlook'
        auth: {
            user: 'your-email@example.com', // Replace with your email
            pass: 'your-email-password' // Replace with your email password or app-specific password
        }
    });

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
        await transporter.sendMail(mailOptions);
        res.status(200).send('Email sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Error sending email.');
    }
});

app.post('/submit-project', async (req, res) => {
    const { fullName, email, phone, company, projectDetails } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'Gmail', // e.g., 'Gmail', 'Outlook'
        auth: {
            user: 'your-email@example.com', // Replace with your email
            pass: 'your-email-password' // Replace with your email password or app-specific password
        }
    });

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
        await transporter.sendMail(mailOptions);
        res.status(200).send('Project details submitted successfully!');
    } catch (error) {
        console.error('Error submitting project details:', error);
        res.status(500).send('Error submitting project details.');
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});