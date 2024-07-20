import { redirect } from '@sveltejs/kit';
import { StatusCodes as HTTP } from 'http-status-codes'
import type { Actions, PageServerLoad } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { generateId } from 'lucia';
import { Argon2id } from 'oslo/password';
import { route } from '$lib/ROUTES';
import {
	PENDING_USER_VERIFICATION_COOKIE_NAME,
	checkIfUserExists,
	generateEmailVerificationCode,
	insertNewUser,
	sendEmailVerificationCode
} from '$lib/server/authUtils.server';
import { prisma } from '$lib/server/database.server';
import { logError } from '$lib/utils';
import { RegisterUserZodSchema } from '$validations/authSchemas';

export const load: PageServerLoad = async({ request }) => {
	return {
		registerUserFormData: await superValidate(request, zod(RegisterUserZodSchema))
	};
}

export const actions: Actions = {
	registerUser: async ({ request, cookies }) => {
		const registerUserForm = await superValidate(request, zod(RegisterUserZodSchema));

		if (!registerUserForm.valid) {
			return message(registerUserForm, {
				alertType: 'error',
				alertText: 'Please check your entries, the form contains invalid data'
			});
		}

		try {
			const userEmail = registerUserForm.data.email;
			const existingUser = await checkIfUserExists(userEmail);

			// If there is a user and they're using email auth, we don't want to create a new user
			if (existingUser?.authMethods.includes('email')) {
				return message(registerUserForm, {
					alertType: 'error',
					alertText: 'This email is already in use. Please use a different email address.'
				});
			}

			const userId = existingUser?.id ?? generateId(15);
			const hashedPassword = await new Argon2id().hash(registerUserForm.data.password);

			// if theres no user with the email, create a new user
			if (!existingUser) {
				await insertNewUser({
					sub: userId,
					name: registerUserForm.data.name,
					email: userEmail,
					isEmailVerified: false,
					password: hashedPassword
				});
			} else {
				await prisma
          .user
					.update({
            where: {
              email: userEmail
            },
            data: {
              password: hashedPassword
            }
          });
			}

			const emailVerificationCode = await generateEmailVerificationCode(userId, userEmail);

			const sendEmailVerificationCodeResult = await sendEmailVerificationCode(
				userEmail,
				emailVerificationCode
			);

			if (!sendEmailVerificationCodeResult.success) {
				return message(registerUserForm, {
					alertType: 'error',
					alertText: sendEmailVerificationCodeResult.message
				});
			}

			const pendingVerificationUserData = JSON.stringify({ id: userId, email: userEmail });

			cookies.set(PENDING_USER_VERIFICATION_COOKIE_NAME, pendingVerificationUserData, {
				path: route('/auth/email-verification')
			});
		} catch (error) {
			logError(error);

			return message(registerUserForm, {
				alertType: 'error',
				alertText: 'An error occurred while processing your request. Please try again.'
			});
		}

		throw redirect(HTTP.SEE_OTHER, route('/auth/email-verification'));
	}
};