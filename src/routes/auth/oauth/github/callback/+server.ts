import type { RequestHandler } from './$types';
import { OAuth2RequestError } from 'arctic';
import { route } from '$lib/ROUTES';
import {
	GITHUB_OAUTH_STATE_COOKIE_NAME,
	checkIfUserExists,
	createAndSetSession,
  getIfOAuthExits,
  insertNewGithubOAuth,
  updateGithubOAuth,
} from '$lib/server/authUtils.server';
import { githubOauth, lucia } from '$lib/server/luciaAuth.server';
import type { GitHubEmail, GitHubUser, OAuthUser } from '$lib/types';


export const GET: RequestHandler = async (event) => {
	const code = event.url.searchParams.get('code');
	const state = event.url.searchParams.get('state');
	const storedState = event.cookies.get(GITHUB_OAUTH_STATE_COOKIE_NAME);

	if (!code || !state || !storedState || state !== storedState) {
		return new Response(null, {
			status: 400
		});
	}

	try {
		// Validate the authorization code and retrieve the tokens
		const tokens = await githubOauth.validateAuthorizationCode(code);

		// Fetch the GitHub user associated with the access token
		const githubUserResponse = await fetch('https://api.github.com/user', {
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`
			}
		});

		// Fetch the primary email address of the GitHub user
		const githubEmailResponse = await fetch('https://api.github.com/user/emails', {
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`
			}
		});

		const githubUser = (await githubUserResponse.json()) as GitHubUser;
		const githubEmail = (await githubEmailResponse.json()) as GitHubEmail[];

		const primaryEmail = githubEmail.find((email) => email.primary) ?? null;

		if (!primaryEmail) {
			return new Response('No primary email address', {
				status: 400
			});
		}

		if (!primaryEmail.verified) {
			return new Response('Unverified email', {
				status: 400
			});
		}

		// Check if the user already exists
    const existingUser = await checkIfUserExists(primaryEmail.email);
		if (existingUser) {
			// Check if the user already has a GitHub OAuth account linked
      const existingOauthAccount = await getIfOAuthExits("github", existingUser);

			if (!existingOauthAccount) {
				// Add the 'github' auth provider to the user's authMethods list
        await updateGithubOAuth(existingUser);
			}
			await createAndSetSession(lucia, existingUser.id, event.cookies);
		} else {
			// Create a new user and link the GitHub OAuth account
			const newUser = await insertNewGithubOAuth(githubUser);
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