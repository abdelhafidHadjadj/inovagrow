import { json } from '@sveltejs/kit';

/**
 * POST /api/chat
 * Expose : { message: string }
 * Retour : { reply: string }
 */
export async function POST({ request }) {
	// 1 – Récupère le message envoyé depuis le front
	const { message } = await request.json();

	// 2 – Appelle ton webhook n8n (URL définie dans .env)
	const res = await fetch(`${process.env.URL_AGENT_AI}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
			// ➜ si tu protèges le webhook avec x-api-key, ajoute‐la ici
			// 'x-api-key': import.meta.env.VITE_CHATBOT_TOKEN
		},
		// n8n attend { userMessage: "…" }
		body: JSON.stringify({ message: message })
	});

	if (!res.ok) {
		const errText = await res.text();
		console.error('n8n error:', errText);
		return json({ error: 'Agent unavailable' }, { status: 502 });
	}

	const data = await res.json();           // { reply: "..." } (selon ton Webhook Response)
	return json(data);
}
