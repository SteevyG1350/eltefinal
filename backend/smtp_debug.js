require('dotenv').config();
const nodemailer = require('nodemailer');

(async () => {
  try {
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : undefined;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const secure = process.env.SMTP_SECURE === 'true';

    console.log('SMTP', { host, port, user, secure: !!secure });

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass }
    });

    const info = await transporter.sendMail({
      from: user,
      to: 'elitesolutions187@gmail.com',
      subject: 'SMTP debug test',
      text: 'This is a test from smtp_debug.js'
    });

    console.log('Send result:', info);
  } catch (err) {
    console.error('SMTP debug error:', err && err.message ? err.message : err);
    if (err && err.response) console.error('response:', err.response);
    if (err && err.responseCode) console.error('responseCode:', err.responseCode);
    process.exit(1);
  }
})();
