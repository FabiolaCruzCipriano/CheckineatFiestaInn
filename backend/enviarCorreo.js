const nodemailer = require('nodemailer');
const base64Img = require('base64-img');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const enviarCorreo = async (to, subject, text, html, qrDataUrl) => {
    const imagePath = base64Img.imgSync(qrDataUrl, '', 'qrcode');

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
        html,
        attachments: [
            {
                filename: 'qrcode.png',
                path: imagePath,
                cid: 'unique@qr.code'
            }
        ]
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Correo enviado exitosamente.');
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        throw error;
    }
};

module.exports = enviarCorreo;
