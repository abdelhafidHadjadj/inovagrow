<script>
  import { onMount } from 'svelte';
  import ChatHeader from '$lib/components/ChatHeader.svelte';
  import ChatMessages from '$lib/components/ChatMessages.svelte';
  import ChatInput from '$lib/components/ChatInput.svelte';
  import { messages } from '$lib/stores/chatStore';
  import { uuid } from '$lib/utils/uuid';
  import { get } from 'svelte/store';

  let isThinking = false;

  onMount(async () => {
    try {
      const res = await fetch('/api/chat/history');
      const data = await res.json();

      if (data?.messages?.length) {
        messages.set(
          data.messages.map((m, i) => ({
            id: i + 1,
            user: m.role === 'user' ? 'me' : 'ai',
            text: m.content
          }))
        );
      }
    } catch (e) {
      console.error('Erreur chargement historique:', e);
    }
  });

  async function sendToAI(text) {
    const userMsg = { id: uuid(), user: 'me', text };
    messages.update(m => [...m, userMsg]);

    const aiMsg = { id: uuid(), user: 'ai', text: '...' };
    messages.update(m => [...m, aiMsg]);
    isThinking = true;

    try {
      const res = await fetch('/api/chat/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });

      const data = await res.json();
      aiMsg.text = data.reply?.trim() || 'Réponse vide';
    } catch (err) {
      console.error(err);
      aiMsg.text = 'Erreur lors de la réponse IA';
    }

    messages.update(m => {
      const all = [...m];
      all[all.length - 1] = aiMsg;
      return all;
    });

    isThinking = false;
  }
</script>

<div class="h-screen flex items-center justify-center w-full py-24 px-4">
  <div class="w-full h-full md:w-2/3 flex flex-col border border-gray-500 overflow-hidden rounded-3xl bg-white dark:bg-black/80">
    <ChatHeader {isThinking} />
    <ChatMessages />
    <ChatInput on:send={(e) => sendToAI(e.detail)} disabled={isThinking} />
  </div>
</div>
