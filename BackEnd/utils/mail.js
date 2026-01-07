import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL, 
    pass: process.env.PASS,
  },
});


export const sendOtpMail=async(to,otp)=>{
  await transporter.sendMail({
    from : process.env.EMAIL,
    to,
    subject:"Reset your Password",
    html:`<p>Your OTP for reseting password is <b>${otp}</b>. This OTP is valid for 5 minutes</p>`
  })
}
