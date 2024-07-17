import type { Handle } from "@sveltejs/kit";
import { lucia } from "$lib/server/auth";
import { sequence } from "@sveltejs/kit/hooks";
import { deleteSessionCookie } from "$lib/server/authUtils";

const luciaGuard: Handle = async ({ event, resolve }) => {
  const sessionId = event.cookies.get(lucia.sessionCookieName);
  if (!sessionId) {
    event.locals.user = null;
    event.locals.session = null;
    return resolve(event);
  }

  const { session, user } = await lucia.validateSession(sessionId);
  if (session?.fresh) {
    const sessionCookie = lucia.createSessionCookie(session.id);
    event.cookies.set(sessionCookie.name, sessionCookie.value, {
      path: ".",
      ...sessionCookie.attributes,
    });
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
    user.oAuthAccounts = userInfo.oAuthAccounts;
  }

  return resolve(event);
};

export const handle: Handle = sequence(luciaGuard, authGuard);