import nodemailer from 'nodemailer'

export default async function sendMail(options) {
  try {
    const transport = nodemailer.createTransport({
      host: process.env.SENDINBLUE_HOST,
      port: process.env.SENDINBLUE_PORT,
      auth: {
        user: process.env.SENDINBLUE_LOGIN,
        pass: process.env.SENDINBLUE_PASS,
      },
    })

    const mailOptions = {
      from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
    }

    const result = await transport.sendMail(mailOptions)
    console.log(`Email sent...` + result)
    return result
  } catch (err) {
    return err
  }
}

// const message = `You have just requested a list of all invoices related to this account.`
// try {
//   const res = await sendMail({
//     email: 'tudadoris@gmail.com',
//     subject: 'Billing List Request',
//     message,
//   })

//   console.log('Email sent ' + res)
// } catch (err) {
//   console.log('error... ' + err)
// }
