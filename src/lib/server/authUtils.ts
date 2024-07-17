import type { Cookies } from "@sveltejs/kit";
import type { Lucia } from "lucia";

async function createAndSetSession(
  lucia: Lucia,
  userId: string,
  cookies: Cookies
) {
  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies.set(sessionCookie.name, sessionCookie.value, {
    path: ".",
    ...sessionCookie.attributes,
  });
}

async function deleteSessionCookie(lucia: Lucia, cookies: Cookies) {
  const sessionCookie = lucia.createBlankSessionCookie();
  cookies.set(sessionCookie.name, sessionCookie.value, {
    path: ".",
    ...sessionCookie.attributes,
  });
}

export { createAndSetSession, deleteSessionCookie };