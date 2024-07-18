import type { Cookies } from "@sveltejs/kit";
import { RESEND_API_KEY } from '$env/static/private';

import { TimeSpan, generateId, type Lucia } from 'lucia';
import { createDate, isWithinExpirationDate } from 'oslo';
import { alphabet, generateRandomString } from 'oslo/crypto';
import { Argon2id } from 'oslo/password';
import { Resend } from 'resend';
import { RetryAfterRateLimiter } from 'sveltekit-rate-limiter/server';

import { route } from '$lib/ROUTES';
import { EMAIL_VERIFICATION_CODE_LENGTH } from '$validations/authSchemas';
import { prisma } from './database.server';
import type { EmailParams, GoogleUser } from '$lib/types';

const resend = new Resend(RESEND_API_KEY);

export const GITHUB_OAUTH_STATE_COOKIE_NAME = 'githubOauthState';
export const GOOGLE_OAUTH_STATE_COOKIE_NAME = 'googleOauthState';
export const GOOGLE_OAUTH_CODE_VERIFIER_COOKIE_NAME = 'googleOauthCodeVerifier';
export const PENDING_USER_VERIFICATION_COOKIE_NAME = 'pendingUserVerification';

function createRateLimiter(cookieName: string, cookieSecret: string) {
	return new RetryAfterRateLimiter({
		// A rate is defined as [number, unit]
		IP: [10, 'h'], // IP address limiter, allowing up to  10 requests per hour
		IPUA: [5, 'm'], // IP + User Agent limiter, allowing up to  5 requests per minute

		cookie: {
			/* Cookie limiter. This limits the number of requests from the same browser (identified by a unique cookie) to  2 per minute.

			It helps prevent a single browser session from making too many requests in a short time, providing an extra layer of protection against abuse.
		*/
			name: cookieName, // Unique cookie name for this limiter
			secret: cookieSecret,
			rate: [2, 'm'], // Allows up to  2 requests per minute from the same browser session
			preflight: true // Require preflight call (see load function)
		}
	});
}

export const verifyCodeRateLimiter = createRateLimiter(
	'verifyCodeRateLimiterCookieId',
	'verifyCodeRateLimiterCookieSecret'
);

export const sendCodeRateLimiter = createRateLimiter(
	'sendCodeRateLimiterCookieId',
	'sendCodeRateLimiterCookieSecret'
);

export const passwordResetEmailRateLimiter = createRateLimiter(
	'passwordResetEmailRateLimiterCookieId',
	'passwordResetEmailRateLimiterCookieSecret'
);

export const passwordResetPageActionRateLimiter = createRateLimiter(
	'passwordResetPageActionRateLimiterCookieId',
	'passwordResetPageActionRateLimiterCookieSecret'
);

export const passwordResetDashboardPageActionRateLimiter = createRateLimiter(
	'passwordResetDashboardPageActionRateLimiterCookieId',
	'passwordResetDashboardPageActionRateLimiterCookieSecret'
);

export const createAndSetSession = async (lucia: Lucia, userId: string, cookies: Cookies) => {
	const session = await lucia.createSession(userId, {});
	const sessionCookie = lucia.createSessionCookie(session.id);

	cookies.set(sessionCookie.name, sessionCookie.value, {
		path: '.',
		...sessionCookie.attributes
	});
};

export const deleteSessionCookie = async (lucia: Lucia, cookies: Cookies) => {
	const sessionCookie = lucia.createBlankSessionCookie();

	cookies.set(sessionCookie.name, sessionCookie.value, {
		path: '.',
		...sessionCookie.attributes
	});
};

export const checkIfUserExists = async (email: string) => {
	const existingUser = await prisma.User.findUnique({
    where: { email: email },
  });
  return existingUser;
};

export const getIfOAuthExits = async (providerId: string, googleUser: GoogleUser) => {
  return await prisma.User.findUnique({
    where: {
      email: googleUser.email,
      oAuthAccounts: {
        some: {
          providerId,
          providerUserId: googleUser.sub,
        },
      },
    },
  });
}

export const updateUserOAuth = async (user: GoogleUser) => {
  await prisma.User.update({
    where: { email: user.email },
    data: {
      oAuthAccunts: {
        create: {
          providerId: "google",
          providerUserId: user.sub,
        },
      },
    },
    include: { oAuthAccounts: true },
  });
};

export const insertNewUser = async (user: GoogleUser) => {
	return await prisma.user.create({
    data: {
      name: user.name,
      email: user.email,
      picture: user.picture,
      oAuthAccounts: {
        create: {
          providerId: "google",
          providerUserId: user.sub,
        }
      }
    }
  })
};

export const getAllUsers = async () => {
	const users = await prisma.user.findMany();
	return users;
};

export const deleteAllUsers = async () => {
	return await prisma.user.deleteMany({});
};

const sendEmail = async ({ email, subject, htmlContent }: EmailParams) => {
	const { error } = await resend.emails.send({
		from: 'Lucia V3 example <onboarding@resend.dev>',
		to: [email],
		subject,
		html: htmlContent
	});

	if (error) {
		console.error({ error });
		return { success: false, message: `Failed to send email: ${error.message}` };
	}

	return {
		success: true,
		message: `An email has been sent to ${email} with the subject: ${subject}.`
	};
};

export const sendEmailVerificationCode = async (email: string, code: string) => {
	const htmlContent = `
	<div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
		<h1>Email Verification</h1>
		<p>Thank you for taking the time to verify your email address. Your verification code is:</p>
		<p style="font-size: 20px;"><strong>${code}</strong></p>
		<p>Please enter this code in the verification field to complete the process. If you did not request this verification, please ignore this email.</p>
	</div>
	`;

	return sendEmail({
		email,
		subject: 'Email Verification Code Request',
		htmlContent
	});
};

export const sendPasswordResetEmail = async (email: string, resetToken: string) => {
	const htmlContent = `
	<div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
		<h1>Password Reset Request</h1>
		<p>We've received a request to reset your password. If you didn't make the request, just ignore this email. Otherwise, you can reset your password using the link below.</p>

		<p>
		<a href="http://localhost:5173${route('/auth/reset-password')}?token=${resetToken}" style="color: #337ab7; text-decoration: none;">Reset your password</a>
		</p>

		<p>If you need help or have any questions, please contact our support team. We're here to help!</p>
	</div>
	`;

	return sendEmail({
		email,
		subject: 'Password Reset Request',
		htmlContent
	});
};

export const generateEmailVerificationCode = async (userId: string, email: string) => {
	const code = generateRandomString(EMAIL_VERIFICATION_CODE_LENGTH, alphabet('0-9'));

  try {
    // Delete any existing verification codes for the user
    await prisma.emailVerificationCode.deleteMany({
      where: { userId }, // Delete where userId matches
    });

    // Insert the new verification code
    const newCode = await prisma.emailVerificationCode.create({
      data: {
        userId,
        email,
        code,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes in milliseconds
      },
    });

    return newCode.code; // Return the generated code
  } catch (error) {
    console.error("Error generating email verification code:", error);
    throw error; // Re-throw the error for handling in the calling code
  }
};

export const verifyEmailVerificationCode = async (userId: string, code: string) => {
	try {
    // Find the verification code for the user
    const verificationCode = await prisma.emailVerificationCode.findFirst({
      where: { userId, code }, // Look for matching userId and code
    });

    // If there's no verification code
    if (!verificationCode) {
      return { success: false, message: 'Verification code not found.' };
    }

    // Check if the code has expired (assuming isWithinExpirationDate is a separate function)
    if (!isWithinExpirationDate(verificationCode.expiresAt)) {
      return {
        success: false,
        message: 'The verification code has expired, please request a new one.'
      };
    }

    // Delete the used verification code
    await prisma.emailVerificationCode.delete({
      where: { id: verificationCode.id }, // Delete by ID for efficiency
    });

    // Verification successful
    return { success: true, message: 'Email verification successful!' };
  } catch (error) {
    console.error("Error verifying email code:", error);
    throw error; // Re-throw the error for handling in the calling code
  }
};

export const createPasswordResetToken = async (userId: string) => {
  const tokenId = generateId(40); // Assuming generateId function exists

  try {
    // Delete any existing reset tokens for the user
    await prisma.passwordResetToken.deleteMany({
      where: { userId },
    });

    // Insert the new reset token
    const newToken = await prisma.passwordResetToken.create({
      data: {
        id: tokenId,
        userId,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes in milliseconds
      },
    });

    return newToken.id; // Return the token ID
  } catch (error) {
    console.error("Error creating password reset token:", error);
    throw error; // Re-throw the error for handling in the calling code
  }
};

export const verifyPasswordResetToken = async (tokenId: string) => {
  try {
    const passwordResetToken = await prisma.passwordResetToken.findUnique({
      where: { id: tokenId },
    });

    if (!passwordResetToken) {
      return {
        success: false,
        message: 'The password reset link is invalid. Please request a new one.',
      };
    }

    if (!isWithinExpirationDate(passwordResetToken.expiresAt)) {
      return {
        success: false,
        message: 'The password reset link has expired. Please request a new one.',
      };
    }

    return {
      success: true,
      userId: passwordResetToken.userId,
      message: 'Password reset token is valid.',
    };
  } catch (error) {
    console.error("Error verifying password reset token:", error);
    throw error; // Re-throw the error for handling in the calling code
  }
};

export const isSameAsOldPassword = async (userId: string, newPassword: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true }, // Select only the password field
    });

    if (!user) {
      return false;
    }

    // Assuming you have a password hashing function (e.g., Argon2id)
    const isSamePassword = await new Argon2id().verify(user.password, newPassword);

    return isSamePassword;
  } catch (error) {
    console.error("Error comparing passwords:", error);
    throw error; // Re-throw the error for handling in the calling code
  }
};