import nodemailer from 'nodemailer'

export const sendEmailReset = async(email,link)=>{
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure:true,
        auth:{
            user:'vrialdude@gmail.com',
            pass:'llmyawvfwqvrtieo'
        },
    })
    await transporter.sendMail({
        from:'Shop support Company',
        to:email,
        subject:'بازیابی رمز عبور',
        html: `
      <h3>بازیابی رمز عبور</h3>
      <p>برای تغییر رمز روی لینک زیر کلیک کنید:</p>
      <a href="${link}">تغییر رمز</a>
    `,
    })
}