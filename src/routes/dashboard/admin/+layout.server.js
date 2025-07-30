// +layout.server.js
import { redirect } from '@sveltejs/kit';

/** @type {import('../$types').LayoutServerLoad} */
export async function load({ locals }) {
	// Pas de session → hop, on part sur /login
	if (!locals.user) {
		throw redirect(303, '/login');
	}

	return {
		user: locals.user
	};
}
