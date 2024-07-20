import { dev } from "$app/environment";
import {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} from "$env/static/private";
import { GitHub, Google } from "arctic";
import { PrismaAdapter } from '@lucia-auth/adapter-prisma';
import { Lucia } from 'lucia';
import { route } from "$lib/ROUTES";

import { prisma } from './database.server';

const dbAdapter = new PrismaAdapter(prisma.session, prisma.user);

export const googleOauth = new Google(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  route('GET /auth/oauth/google/callback')
);

export const githubOauth = new GitHub(
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET);

export const lucia = new Lucia(dbAdapter, {
	sessionCookie: {
		attributes: {
			secure: !dev
		}
	},

	getUserAttributes: (attributes) => {
		return {
			name: attributes.name,
			email: attributes.email,
			isEmailVerified: attributes.isEmailVerified,
			authMethods: attributes.authMethods,
			avatarUrl: attributes.avatarUrl
		};
	}
});

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: {
			name: string;
			email: string;
      avatar_url: string;
			isEmailVerified: boolean;
			authMethods: string[];
			avatarUrl: string;
		};
	}
}