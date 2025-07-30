<!-- src/lib/components/TypingIndicator.svelte -->
<style>
  .dots {
    display: flex;
    gap: 6px;
    align-items: center;
    justify-content: start;
  }
  .dot {
    width: 10px;
    height: 10px;
    background: #a0aec0;
    border-radius: 50%;
    animation: blink 1.4s infinite ease-in-out both;
  }
  .dot:nth-child(2) { animation-delay: 0.2s; }
  .dot:nth-child(3) { animation-delay: 0.4s; }

  @keyframes blink {
    0%, 80%, 100% { opacity: 0.3; transform: scale(0.9); }
    40% { opacity: 1; transform: scale(1.1); }
  }
</style>

<div class="dots px-4 py-3 rounded-2xl max-w-[75%] bg-gray-200 text-black shadow">
  <div class="dot"></div>
  <div class="dot"></div>
  <div class="dot"></div>
</div>
