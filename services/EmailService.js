
import nodemailer from 'nodemailer';

export const sendMail = (to,subject,active) => {
    const mailHost = 'smtp.gmail.com'
// 587 là một cổng tiêu chuẩn và phổ biến trong giao thức SMTP
const mailPort = 587
    var transporter = nodemailer.createTransport({ // config mail server
        service: 'Gmail',
        host: mailHost,
    port: mailPort,
    secure: false,
        auth: {
            user: 'server10.noreply@gmail.com',
            pass: '123456789a.'
        }
    });
    var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
        from: 'Thích truyện chữ',
        to: to,
        subject: subject,
        text: active,
        //html: '<p>You have got a new message</b><ul><li>Username:' + req.body.name + '</li><li>Email:' + req.body.email + '</li><li>Username:' + req.body.message + '</li></ul>'
    }
    return transporter.sendMail(mainOptions);
}