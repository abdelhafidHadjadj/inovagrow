<script>
  export let msg;
  import { fade } from 'svelte/transition';
</script>

<div
  transition:fade
  class="flex {msg.user === 'me' ? 'justify-end' : 'justify-start'}"
>
  <div
    class="
      px-4 py-3 rounded-2xl max-w-[75%] text-sm leading-relaxed shadow 
      {msg.user === 'me' 
        ? 'bg-blue-600 text-white rounded-br-none' 
        : 'bg-gray-200 text-gray-900 rounded-bl-none'}
    "
  >
    {msg.text}
  </div>
</div>
