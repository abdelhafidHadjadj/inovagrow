// src/routes/api/chat/ai/+server.js
import { json } from '@sveltejs/kit';
import { query } from '$lib/utils/db';

export async function POST({ request, locals }) {
	try {
		const { message } = await request.json();
		if (!message?.trim()) return json({ error: 'Message vide' }, { status: 400 });

		// 1. Récupérer l'utilisateur depuis hooks
		const user = locals.user;
		if (!user) return json({ error: 'Utilisateur non connecté' }, { status: 401 });

		// 2. Conversation existante ou nouvelle
		let convoRes = await query(
			`SELECT id FROM conversations WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1`,
			[user.id]
		);

		let convo_id = convoRes.rows[0]?.id;
		if (!convo_id) {
			const newConvo = await query(
				`INSERT INTO conversations (user_id) VALUES ($1) RETURNING id`,
				[user.id]
			);
			convo_id = newConvo.rows[0].id;
		}

		// 3. Charger l'historique
		const historyRes = await query(
			`SELECT role, content FROM chat_messages WHERE convo_id = $1 ORDER BY created_at`,
			[convo_id]
		);
		const history = historyRes.rows.map(m => ({
			role: m.role,
			content: m.content
		}));
		console.log(JSON.stringify({ userMessage: message, history }));
		

		// 4. Sauvegarder le message utilisateur
		await query(
			`INSERT INTO chat_messages (convo_id, role, content) VALUES ($1, 'user', $2)`,
			[convo_id, message]
		);

		// 5. Appel à l'agent n8n
		const endpoint = process.env.URL_AGENT_AI;
		if (!endpoint) return json({ error: 'URL_AGENT_AI manquant' }, { status: 500 });

		const res = await fetch(endpoint, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ userMessage: message, history })
		});

		if (!res.ok) {
			const txt = await res.text();
			console.error('Erreur depuis n8n :', txt);
			return json({ error: 'Agent indisponible' }, { status: 502 });
		}

		const data = await res.json();
		const reply = data?.choices?.[0]?.message?.content?.trim();
			
		if (!reply) {
		  console.warn('Réponse IA vide ou invalide.', data);
		  return json({
		    reply: "Je suis désolé, je n’ai pas compris. Pouvez-vous reformuler ou préciser votre demande ?"
		  });
		}


		// 6. Sauvegarder la réponse IA si elle est valide
		await query(
			`INSERT INTO chat_messages (convo_id, role, content) VALUES ($1, 'assistant', $2)`,
			[convo_id, reply]
		);

		// 7. Retour au frontend
		return json({ reply });

	} catch (err) {
		console.error('Erreur serveur:', err);
		return json({ error: 'Erreur serveur' }, { status: 500 });
	}
}
