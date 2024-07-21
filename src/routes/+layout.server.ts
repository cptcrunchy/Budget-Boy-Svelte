import type { LayoutServerLoad } from './$types';

import { loadFlash } from 'sveltekit-flash-message/server';

import { createBaseMetaTags } from '$lib/utils/metaTags';

export const load: LayoutServerLoad = loadFlash(async ({ url, locals }) => {
	const baseMetaTags = createBaseMetaTags(url);
	return {
    user: locals.user,
		isUserLoggedIn: locals.session !== null,
		baseMetaTags: Object.freeze(baseMetaTags)
	};
});