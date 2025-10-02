import { transporter } from "../config/mail.config.js";
import crypto from "crypto"

export const generateOtp = () =>{
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const otpLength = 6;

  return Array.from(crypto.randomBytes(otpLength), byte => chars[byte % chars.length]).join('');
} 

export const sendOtp = async (email, otp) =>{

	console.log("Sending OTP to", email)
	
	try {
		const mailOptions = {
			from: process.env.MAIL_FROM,
			to: email,
			subject: "SHRINK LINK OTP",
			text: `Your OTP is ${otp}`,
		};

		const info = await transporter.sendMail(mailOptions);
		console.log("mail sent: %s", info.messageId);
		return info; 
	} catch (error) {
		console.error("Error sending mail", error);
		throw new Error("Error sending mail");

	}
}
