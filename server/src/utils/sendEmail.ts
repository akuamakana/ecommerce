/* istanbul ignore file */
import nodemailer from 'nodemailer';

export const sendEmail = async (email: string, message: string, link: string) => {
  let testAccount;
  testAccount = await nodemailer.createTestAccount();
  let transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount ? testAccount.user : 'q5zfgwjlkb6lasxk@ethereal.email', // generated ethereal user
      pass: testAccount ? testAccount.pass : 'aw9U25zM5H8Bg8s437', // generated ethereal password
    },
  });

  const results = await transporter.sendMail({
    to: email,
    html: `<a href="${link}">${message}</a>`,
    subject: message,
  });

  console.log('Preview URL: ' + nodemailer.getTestMessageUrl(results));
};
