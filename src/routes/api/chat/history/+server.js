import { json } from '@sveltejs/kit';
import { query } from '$lib/utils/db';

export async function GET({ locals }) {
	try {
		const user = locals.user;
		if (!user) return json({ error: 'Utilisateur non connecté' }, { status: 401 });

		// 1. Dernière conversation
		const convoRes = await query(
			`SELECT id FROM conversations WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1`,
			[user.id]
		);

		if (convoRes.rows.length === 0) {
			return json({ messages: [] });
		}

		const convo_id = convoRes.rows[0].id;

		// 2. Messages de la conversation
		const messagesRes = await query(
			`SELECT role, content FROM chat_messages WHERE convo_id = $1 ORDER BY created_at ASC`,
			[convo_id]
		);

		return json({ messages: messagesRes.rows });

	} catch (err) {
		console.error('Erreur lors de la récupération de l’historique :', err);
		return json({ error: 'Erreur serveur' }, { status: 500 });
	}
}
