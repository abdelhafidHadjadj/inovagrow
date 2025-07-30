<script>
  import { messages } from '$lib/stores/chatStore';
  import MessageBubble from './MessageBubble.svelte';
  import TypingIndicator from './TypingIndicator.svelte';
  export let isTyping = false;
  let scrollRef;
  $: scrollRef?.scrollIntoView({ behavior: 'smooth' });
</script>

<div class="p-4 flex flex-col gap-2 overflow-y-auto flex-1">
  {#each $messages as msg (msg.id)}
    <MessageBubble {msg} />
  {/each}
  {#if isTyping}
    <TypingIndicator />
  {/if}
  <div bind:this={scrollRef}></div>
</div>
