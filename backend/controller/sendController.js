const emptyTempFolder = require("../utils/emptyTempFolder");
const excelToJson = require("../utils/excelToJson");
const sendEmail = require("../utils/sendMail");

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const validateRecipients = (recipients) => {
    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
        throw new Error("Recipients array is required");
    }

    for (const [index, recipient] of recipients.entries()) {
        if (!recipient.email || typeof recipient.email !== 'string' || !recipient.email.trim()) {
            throw new Error(`Email is required for recipient at index ${index}`);
        }
        
        if (!recipient.username || typeof recipient.username !== 'string' || !recipient.username.trim()) {
            throw new Error(`Username is required for recipient at index ${index}`);
        }

        // Basic email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(recipient.email.trim())) {
            throw new Error(`Invalid email format for recipient at index ${index}: ${recipient.email}`);
        }
    }
};

const sendEmailsController = async (req, res) => {
    try {
        let { recipients, textMessage, htmlMessage, subject, sendingSpeed = 30000 } = req.body;
        
        // Validate required fields
        if (!subject || typeof subject !== 'string' || !subject.trim()) {
            return res.status(400).json({ error: "Subject is required" });
        }

        if (!textMessage || typeof textMessage !== 'string' || !textMessage.trim()) {
            return res.status(400).json({ error: "Text message is required" });
        }

        if(req.file){
            console.log(req.file)
            recipients = excelToJson(req.file.path)
        }

        // Validate recipients before starting to send emails
        try {
            validateRecipients(recipients);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }

        // Set up response for chunks
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Transfer-Encoding', 'chunked');

        let sent = 0;
        const total = recipients.length;

        for (const recipient of recipients) {
            try {
                const msg = `<p>Hello ${recipient.username},<br/>${textMessage}<p>${htmlMessage}`;
                await sendEmail(recipient.email.trim(), subject, msg);
                sent++;

                // Send chunk response
                res.write(JSON.stringify({
                    sent,
                    remaining: total - sent,
                    total,
                    lastSent: {
                        email: recipient.email,
                        username: recipient.username,
                        status: 'success'
                    }
                }) + '\n');

                // Apply delay if not the last email
                if (sent < total) {
                    await sleep(sendingSpeed);
                }
            } catch (error) {
                // Send error chunk but continue with next email
                res.write(JSON.stringify({
                    sent,
                    remaining: total - sent,
                    total,
                    lastSent: {
                        email: recipient.email,
                        username: recipient.username,
                        status: 'failed',
                        error: error.message
                    }
                }) + '\n');
            }
        }

        // Send final response and end
        res.write(JSON.stringify({
            sent,
            remaining: 0,
            total,
            status: 'completed'
        }));
        res.end();

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    } finally{
        await emptyTempFolder()
    }
};

module.exports = sendEmailsController;