<script>
  import ChatHeader from '$lib/components/ChatHeader.svelte';
  import ChatMessages from '$lib/components/ChatMessages.svelte';
  import ChatInput from '$lib/components/ChatInput.svelte';
  import { messages } from '$lib/stores/chatStore';
  import { uuid } from '$lib/utils/uuid';

async function sendToAI(text) {
  // ajout message utilisateur
  messages.update(m => [...m, { id: uuid(), user: 'me', text }]);

  // placeholder IA
  const aiMsg = { id: uuid(), user: 'ai', text: '…' };
  messages.update(m => [...m, aiMsg]);

  try {
    const res = await fetch('/api/chat/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text })
    });

    const data = await res.json();
    aiMsg.text = data.reply ?? data?.choices?.[0]?.message?.content ?? 'Réponse vide';

  } catch (err) {
    console.error(err);
    aiMsg.text = 'Erreur IA';
  }

  // met à jour le dernier message IA
  messages.update(m => [...m.slice(0, -1), aiMsg]);
}

</script>


<div class="h-screen flex items-center justify-center w-full py-24 px-4">
    <div class="w-full h-full md:w-2/3 flex flex-col border border-gray-500 overflow-hidden rounded-3xl">    
        <ChatHeader />
        <ChatMessages />
        <ChatInput on:send={(e) => sendToAI(e.detail)} />
    </div>
</div>

