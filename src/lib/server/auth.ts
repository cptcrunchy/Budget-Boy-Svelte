import { Lucia } from "lucia";
import { dev } from "$app/environment";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { prisma } from "./prisma";
import {
  FACEBOOK_CLIENT_ID,
  FACEBOOK_CLIENT_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} from "$env/static/private";
import { Facebook, Google } from "arctic";

const adapter = new PrismaAdapter(prisma.session, prisma.user);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      // * set to 'true' when using HTTPS
      secure: !dev,
    },
  },
  getUserAttributes(attributes) {
    return {
      name: attributes.name,
      email: attributes.email,
      picture: attributes.picture,
      passwords: attributes.passwords,
      oAuthAccounts: attributes.oAuthAccounts,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: {
      name: string;
      email: string;
      picture: string;
      passwords: string[];
      oAuthAccounts: string[];
    };
  }
}

export const google = new Google(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  dev ? "http://localhost:5173/login/google/callback" : ""
);

export const facebook = new Facebook(
  FACEBOOK_CLIENT_ID,
  FACEBOOK_CLIENT_SECRET,
  dev ? "http://localhost:5173/login/facebook/callback" : ""
);