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

import { prisma } from './database.server';

const dbAdapter = new PrismaAdapter(prisma.session, prisma.user);

export const googleOauth = new Google(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  'http://localhost:5173/auth/oauth/google/callback'
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
			email_verified: attributes.email_verified,
			authMethods: attributes.authMethods,
			avatar_url: attributes.avatar_url
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
			email_verified: boolean;
			authMethods: string[];
			avatarUrl: string;
		};
	}
}