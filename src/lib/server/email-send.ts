import nodemailer from 'nodemailer';
import { env } from '$env/dynamic/private';

const transporter = nodemailer.createTransport({
	host: env.SMTP_HOST,
	port: Number(env.SMTP_PORT),
	secure: Number(env.SMTP_SECURE) === 1,
	auth: {
		user: env.SMTP_USER,
		pass: env.SMTP_PASS
	}
});

export default async function sendEmail(
	email: string,
	subject: string,
	bodyHtml?: string,
	bodyText?: string
) {
	if (
		env.SMTP_HOST &&
		env.SMTP_PORT &&
		env.SMTP_USER &&
		env.SMTP_PASS &&
		env.FROM_EMAIL
	) {
		// create Nodemailer SMTP transporter
		let info;
		try {
			if (!bodyText) {
				info = await transporter.sendMail({
					from: env.FROM_EMAIL,
					to: email,
					subject: subject,
					html: bodyHtml
				});
			} else if (!bodyHtml) {
				info = await transporter.sendMail({
					from: env.FROM_EMAIL,
					to: email,
					subject: subject,
					text: bodyText
				});
			} else {
				info = await transporter.sendMail({
					from: env.FROM_EMAIL,
					to: email,
					subject: subject,
					html: bodyHtml,
					text: bodyText
				});
			}
			console.log('E-mail sent successfully!');
			console.log(info);
			return {
				statusCode: 200,
				message: 'E-mail sent successfully.'
			};
		} catch (error) {
			throw new Error(`Error sending email: ${JSON.stringify(error)}`);
		}
	} else {
		console.log(`Email in Log:\nSubject: ${subject}\nBody: ${bodyText}`);
	}
}
