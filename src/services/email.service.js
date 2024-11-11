import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    // Cấu hình email service của bạn
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, 
    auth: {
        user: 'isp1804cardweb3@gmail.com', 
        pass: 'utqp mcfy muyz qtxu' 
    }
});

const sendEmail = async (to, subject, html) => {
    const mailOptions = {
        from: process.env.SMTP_FROM,
        to,
        subject,
        html
    };

    await transporter.sendMail(mailOptions);
};

export const emailService = {
    sendEmail
};