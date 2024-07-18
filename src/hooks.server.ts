import type { Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";
import { createAndSetSession, deleteSessionCookie } from "$lib/server/authUtils.server";
import { lucia } from "$lib/server/luciaAuth.server";

const luciaGuard: Handle = async ({ event, resolve }) => {
  const sessionId = event.cookies.get(lucia.sessionCookieName);
  if (!sessionId) {
    event.locals.user = null;
    event.locals.session = null;
    return resolve(event);
  }

  const { session, user } = await lucia.validateSession(sessionId);
  if (session?.fresh) {
    createAndSetSession(lucia, session.id, event.cookies);
  }
  if (!session) {
    await deleteSessionCookie(lucia, event.cookies);
  }
  event.locals.user = user;
  event.locals.session = session;
  return resolve(event);
};

const authGuard: Handle = async ({ event, resolve }) => {
  const { user } = event.locals;

  if (user) {
    const userInfo = await prisma.user.findUnique({
      where: { id: user.id },
      include: { oAuthAccounts: true },
    });
    user.OAuthAccounts = userInfo.oAuthAccounts;
  }

  return resolve(event);
};

export const handle: Handle = sequence(luciaGuard, authGuard);