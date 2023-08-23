import sendEmail from '$lib/server/email-send';
import { APP_NAME } from '$lib/config/constants';

// Send an email to verify the user's address
export const sendVerificationEmail = async (baseUrl: string, email: string, token: string) => {
	const verifyEmailURL = `${baseUrl}/auth/email-verification/${token}`;
	const textEmail = `Please visit the link below to verify your email address for your ${APP_NAME} account.\n\n  
    ${verifyEmailURL} \n\nIf you did not create this account, you can disregard this email.`;
	const htmlEmail = `<p>Please click this <a href="${verifyEmailURL}">link</a> to verify your email address for your ${APP_NAME} account.</p>  <p>You can also visit the link below.</p><p>${verifyEmailURL}</p><p>If you did not create this account, you can disregard this email.</p>`;
	const subject = `Please confirm your email address for ${APP_NAME}`;
	const resultSend = await sendEmail(email, subject, htmlEmail, textEmail);
	return resultSend;
};

// Send an email to welcome the new user
export const sendWelcomeEmail = async (baseUrl: string, email: string) => {
	const textEmail = `Thanks for verifying your account with ${APP_NAME}.\nYou can now sign in to your account at the link below.\n\n${baseUrl}/auth/sign-in`;
	const htmlEmail = `<p>Thanks for verifying your account with ${APP_NAME}.</p><p>You can now <a href="${baseUrl}/auth/sign-in">sign in</a> to your account.</p>`;
	const subject = `Welcome to ${APP_NAME}`;
	const resultSend = await sendEmail(email, subject, htmlEmail, textEmail);
	return resultSend;
};

// Send an email to reset the user's password
export const sendPasswordResetEmail = async (baseUrl: string, email: string, token: string) => {
	const updatePasswordURL = `${baseUrl}/auth/password/update-${token}`;
	const textEmail = `Please visit the link below to change your password for ${APP_NAME}.\n\n  
    ${updatePasswordURL} \n\nIf you did not request to change your password, you can disregard this email.`;
	const htmlEmail = `<p>Please click this <a href="${updatePasswordURL}">link</a> to change your password for ${APP_NAME}.</p>  
	<p>You can also visit the link below.</p><p>${updatePasswordURL}</p><p>If you did not request to change your password, you can disregard this email.</p>`;
	const subject = `Change your password for ${APP_NAME}`;
	const resultSend = await sendEmail(email, subject, htmlEmail, textEmail);
	return resultSend;
};

// Send an email to confirm the user's password reset
// and also send an email to the user's old email account in case of a hijack attempt
export const updateEmailAddressSuccessEmail = async (
	baseUrl: string,
	email: string,
	oldEmail: string,
	token: string
) => {
	const verifyEmailURL = `${baseUrl}/auth/email-verification/${token}`;
	const textEmail = `Please visit the link below to verify your email address for your ${APP_NAME} account.\n\n  ${verifyEmailURL}`;
	const htmlEmail = `<p>Please click this <a href="${verifyEmailURL}">link</a> to verify your email address for your ${APP_NAME} account.</p>  <p>You can also visit the link below.</p><p>${verifyEmailURL}</p>`;
	const subject = `Please confirm your email address for ${APP_NAME}`;
	await sendEmail(email, subject, htmlEmail, textEmail);

	//send email to user about email change.
	const textEmailChange = `Your ${APP_NAME} account email has been updated from ${oldEmail} to ${email}.  If you DID NOT request this change, please contact support at: ${baseUrl} to revert the changes.`;
	const htmlEmailChange = `<p>Your ${APP_NAME} account email has been updated from ${oldEmail} to ${email}.</p><p>If you DID NOT request this change, please contact support at: <a href='${baseUrl}'>${baseUrl}</a> to revert the changes.</p>`;
	const subjectChange = `Your email address for ${APP_NAME} has changed.`;
	await sendEmail(oldEmail, subjectChange, htmlEmailChange, textEmailChange);
};
