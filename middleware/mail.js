const nodemailer = require("nodemailer");
const config = require('config')
const ejs = require('ejs')
async function mail(to, cred) {
    try {
        // NODEMAILER SERVICE 
        const mailerAuth = config.get("nodemailerConfig")
        let transporter = nodemailer.createTransport({
            service: mailerAuth.service,
            secure: true,
            auth: {
                user: mailerAuth.auth.user,
                pass: mailerAuth.auth.pass,
            },
        });

        // Rendering Template for Member ID to Client
        const data = await ejs.renderFile("./views/Register.ejs", { cred });
        // 
        let info = await transporter.sendMail({
            from: mailerAuth.auth.user,
            to: to,
            subject: "Thank You for Registering to NIF",
            text: "Thank you for registrations. Please find the attached credentials for login to the NIF portal",
            html: data
        });

        // console.log("Message sent: %s", info.messageId);
        // console.log("Verification Email Sent");

    } catch (error) {
        console.log(error)
        return false
    }
}

module.exports = mail;