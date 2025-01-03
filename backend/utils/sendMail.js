const nodemailer = require("nodemailer")

const sendEmail = async (userEmail, sub, htmlMsg) => {
    const transport = nodemailer.createTransport({
        host: process.env.NODEMAILER_HOST,
        port: process.env.NODEMAILER_PORT,
        sender: true,
        secure: true,
        auth: {
            user: process.env.EMAIL_ID,
            pass: process.env.APP_PASS
        },
        socketTimeout: 60000,
    })
    try {
        const info = await transport.sendMail({
            from: `${process.env.NAME}<${process.env.EMAIL_ID}>`,
            to: userEmail,
            subject: sub,
            html: htmlMsg,
        })
        console.log("\nMsg send: ", `TO> ${userEmail}\nID:`, info.messageId)
        return true
    } catch (error) {
        console.log(error)
        throw Error("Error in sending mail")
    }
}

module.exports = sendEmail