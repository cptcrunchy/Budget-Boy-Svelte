import { deleteSessionCookie } from "$lib/server/authUtils.server";
import { lucia } from "$lib/server/luciaAuth.server";
import { LOGIN_ROUTE } from "$lib/utils/navLinks";
import { StatusCodes as HTTP } from "http-status-codes";
import { redirect, type Actions } from "@sveltejs/kit";

export const actions: Actions = {
  default: async ({ cookies, locals }) => {
    if (!locals.session?.id) {
      return;
    }
    
    await lucia.invalidateSession(locals.session.id);
    await deleteSessionCookie(lucia, cookies);
    redirect(HTTP.SEE_OTHER, LOGIN_ROUTE)
  }
}