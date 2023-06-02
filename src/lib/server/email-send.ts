import nodemailer from 'nodemailer';
import {
	FROM_EMAIL,
	SMTP_HOST,
	SMTP_PORT,
	SMTP_SECURE,
	SMTP_USER,
	SMTP_PASS
} from '$env/static/private';

export default async function sendEmail(
	email: string,
	subject: string,
	bodyHtml?: string,
	bodyText?: string
) {
	if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS && FROM_EMAIL) {
		// create Nodemailer SMTP transporter
		const transporter = nodemailer.createTransport({
			// @ts-ignore
			host: SMTP_HOST,
			port: Number(SMTP_PORT),
			secure: Number(SMTP_SECURE) === 1,
			auth: {
				user: SMTP_USER,
				pass: SMTP_PASS
			}
		});

		try {
			if (!bodyText) {
				transporter.sendMail(
					{
						from: FROM_EMAIL,
						to: email,
						subject: subject,
						html: bodyHtml
					},
					(err, info) => {
						if (err) {
							throw new Error(`Error sending email: ${JSON.stringify(err)}`);
						}
					}
				);
			} else if (!bodyHtml) {
				transporter.sendMail(
					{
						from: FROM_EMAIL,
						to: email,
						subject: subject,
						text: bodyText
					},
					(err, info) => {
						if (err) {
							throw new Error(`Error sending email: ${JSON.stringify(err)}`);
						}
					}
				);
			} else {
				transporter.sendMail(
					{
						from: FROM_EMAIL,
						to: email,
						subject: subject,
						html: bodyHtml,
						text: bodyText
					},
					(err, info) => {
						if (err) {
							throw new Error(`Error sending email: ${JSON.stringify(err)}`);
						}
					}
				);
			}
			console.log('E-mail sent successfully!');
			return {
				statusCode: 200,
				message: 'E-mail sent successfully.'
			};
		} catch (error) {
			throw new Error(`Error sending email: ${JSON.stringify(error)}`);
		}
	} else {
		console.log(`Email in Log:\nSubject: ${subject}\nBody: ${bodyText}`)
	}
}
