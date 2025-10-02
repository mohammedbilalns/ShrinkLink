import axios from "axios";
import crypto from "crypto"

export const generateOtp = () =>{
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const otpLength = 6;

  return Array.from(crypto.randomBytes(otpLength), byte => chars[byte % chars.length]).join('');
} 

export const sendOtp = async (email, otp) =>{	
	try {
		const response = await axios.post(
			process.env.BREVO_API_URL,
			{
				sender: {
					name: "LinkShrink",
					email: process.env.MAIL_FROM,
				},
				to: [
					{
						email: email,
					}
				],
				subject: "OTP for LinkShrink",
				textContent: `Your OTP is ${otp}`,
			},{
				headers: {
					Accept:"application/json",
					"api-key": process.env.BREVO_API_KEY,
				}
			}
		)
	
		console.log("mail sent: %s", response.data.messageId);
		return response.data 
	} catch (error) {
		console.error("Error sending mail", error);
		throw new Error("Error sending mail");

	}
}

