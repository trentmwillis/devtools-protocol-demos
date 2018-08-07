const express = require('express');
const nodemailer = require('nodemailer');
const puppeteer = require('puppeteer');

const throwError = message => { throw new Error(message); };

/**
 * Note for simplicity this demo uses a weak authentication method from Google
 * that requires your Gmail account allow "less secure app access" (which can
 * be enabled here: https://myaccount.google.com/lesssecureapps). It is
 * recommended you only enable that while messing around with the demo and
 * turning it off afterward.
 *
 * For production environments it is recommended to use a more secure and
 * dedicated email service like Mailgun.
 */

const EMAIL_USER = process.env.EMAIL_USER || throwError('Must provide EMAIL_USER environment variable that specifies a Gmail username to send emails from.');
const EMAIL_PASS = process.env.EMAIL_PASS || throwError('Must provide EMAIL_PASS environment variable that specifies the password for the Gmail account to send emails from.');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: `${EMAIL_USER}@gmail.com`,
        pass: EMAIL_PASS
    }
}, {
    from: `${EMAIL_USER}@gmail.com`
});
const app = express();
const port = process.env.PORT || 3000;

const sendEmailWithImage = async (email, url, image) => {
    return new Promise((resolve, reject) => {
        transporter.sendMail({
            to: email,
            subject: `Screenshot of ${url}`,
            attachments: [{
                filename: 'screenshot.png',
                content: image
            }]
        }, (error) => {
            if (error) {
                console.error('Error sending email', error);
                reject(error);
            } else {
                console.log(`Email sent to ${email} of ${url}`);
                resolve();
            }
        });
    });
}

const generateScreenshot = async (email, url) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: 'networkidle0' });

    const screenshot = await page.screenshot({ fullPage: true });

    await sendEmailWithImage(email, url, screenshot);

    await browser.close();

    return screenshot;
};

app.get('/screenshot', async (request, response) => {
    const url = request.query.url;
    const email = request.query.email;

    if (!url) {
        return response.status(400).send({
            message: 'Must provide a url to screenshot'
        });
    } else if (!email) {
        return response.status(400).send({
            message: 'Must provide an email to send screenshot to'
        });
    }

    response.header('Access-Control-Allow-Origin', '*');
    response.contentType('image/png');

    response.send(await generateScreenshot(email, url));
});

app.listen(port, () => console.log(`http://localhost:${port}`));
