import type { RequestHandler } from './$types';
import { OAuth2RequestError } from 'arctic';
import { route } from '$lib/ROUTES';
import {
	GOOGLE_OAUTH_CODE_VERIFIER_COOKIE_NAME,
	GOOGLE_OAUTH_STATE_COOKIE_NAME,
	checkIfUserExists,
	createAndSetSession,
  getIfOAuthExits,
  insertNewGoogleOAuth,
  updateGoogleOAuth
} from '$lib/server/authUtils.server';
import { googleOauth, lucia } from '$lib/server/luciaAuth.server';
import type { GoogleUser, OAuthUser } from '$lib/types';

export const GET: RequestHandler = async (event) => {
	const code = event.url.searchParams.get('code');
	const state = event.url.searchParams.get('state');

	const storedState = event.cookies.get(GOOGLE_OAUTH_STATE_COOKIE_NAME);
	const storedCodeVerifier = event.cookies.get(GOOGLE_OAUTH_CODE_VERIFIER_COOKIE_NAME);

	// Validate OAuth state and code verifier
	if (!code || !state || !storedState || !storedCodeVerifier || state !== storedState) {
		return new Response('Invalid OAuth state or code verifier', {
			status: 400
		});
	}

	try {
		const tokens = await googleOauth.validateAuthorizationCode(code, storedCodeVerifier);

		const googleUserResponse = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`
			}
		});

		const googleUser = (await googleUserResponse.json()) as GoogleUser;

		if (!googleUser.email) {
			return new Response('No primary email address', {
				status: 400
			});
		}

		if (!googleUser.email_verified) {
			return new Response('Unverified email', {
				status: 400
			});
		}

    console.log({ googleUser })

		// Check if the user already exists
		const existingUser = await checkIfUserExists(googleUser.email);

		if (existingUser) {
			// Check if the user already has a Google OAuth account linked
			const existingOauthAccount = await getIfOAuthExits("google", existingUser);

			if (!existingOauthAccount) {
				// Add the 'google' auth provider to the user's authMethods list
				await updateGoogleOAuth(googleUser);
			}
			await createAndSetSession(lucia, existingUser.id, event.cookies);
		} else {
			// Create a new user and their OAuth account
      const newUser = await insertNewGoogleOAuth(googleUser);
			await createAndSetSession(lucia, newUser.id, event.cookies);
		}

		return new Response(null, {
			status: 302,
			headers: {
				Location: route('/dashboard')
			}
		});
	} catch (error) {
		console.error(error);

		// the specific error message depends on the provider
		if (error instanceof OAuth2RequestError) {
			// invalid code
			return new Response(null, {
				status: 400
			});
		}

		return new Response(null, {
			status: 500
		});
	}
};