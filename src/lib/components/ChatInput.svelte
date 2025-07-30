<script>
  import { createEventDispatcher } from 'svelte';
  let input = '';
  const dispatch = createEventDispatcher();

  function send() {
    if (input.trim()) {
      dispatch('send', input.trim());
      input = '';
    }
  }
</script>

<div class="p-4 bg-white border-t shadow flex items-center gap-3">
  <input
    class="flex-1 px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
    placeholder="Posez une question à l'IA..."
    bind:value={input}
    on:keydown={(e) => e.key === 'Enter' && send()}
  />
  <button
    on:click={send}
    class="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
  >
    Envoyer
  </button>
</div>
