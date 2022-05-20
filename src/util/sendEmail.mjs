import nodeMailer from 'nodemailer'
import signupConfig from "../../signup.config.mjs";
import {email} from "../config/email.mjs";
import {merge} from "./tool.mjs";

export const sendEmailFromQQ = async (subject, html, platform) => {
    if (!platform.emailTo || !signupConfig || !signupConfig.email || !signupConfig.email.qq) return;
    let cfg = merge(email.qq, signupConfig.email.qq)
    if (!cfg || !cfg.pass || !cfg.user) return;
    console.log(subject, html);
    const transporter = nodeMailer.createTransport({service: 'qq', auth: {user: cfg.user, pass: cfg.pass}});
    transporter.sendMail({
        from: cfg.from,
        to: platform.emailTo,
        subject: subject,
        html: html
    }, (err) => {
        if (err) return console.log(`发送邮件失败：${err}`, true);
        console.log('发送邮件成功')
    })
}