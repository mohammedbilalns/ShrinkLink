import nodemailer from "nodemailer";
import { configDotenv } from "dotenv";
configDotenv();


export const transporter = nodemailer.createTransport({

	host: process.env.SMTP_HOST,
	port: process.env.SMTP_PORT,
	secure: false,
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASS,
	},
  connectionTimeout: 60000,
  greetingTimeout: 30000,
  socketTimeout: 60000,
})
