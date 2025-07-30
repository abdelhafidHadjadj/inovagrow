<script>
  import { onMount } from 'svelte';

  const languages = ['en', 'fr'];
  let isOpen = false;

  /** Langue courante extraite du cookie (par défaut : 'en') */
  let current = 'en';
  onMount(() => {
    const match = document.cookie.match(/(?:^|;\s*)lang=(\w+)/);
    current = match ? match[1] : 'en';
  });

  function setLanguage(lang) {
    document.cookie = `lang=${lang}; path=/; max-age=31536000`; // 1 an
    window.location.href = `/${lang}`;                         // recharge la page
  }

  /** Ferme le menu si clic hors composant */
  function closeIfOutside(e) {
    if (!e.target.closest('.lang-switcher')) isOpen = false;
  }
</script>

<svelte:window on:click={closeIfOutside} />

<div class="relative inline-block lang-switcher select-none">
  <!-- Bouton déclencheur -->
  <button
    class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-[#0c0c0c] border border-gray-600 rounded-full hover:bg-gray-800 focus:outline-none"
    on:click={() => (isOpen = !isOpen)}
  >
    {current.toUpperCase()}
    <svg class="ml-2 w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.44l3.71-4.2a.75.75 0 011.14.98l-4.25 4.8a.75.75 0 01-1.1 0l-4.25-4.8a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
    </svg>
  </button>

  <!-- Menu déroulant -->
  {#if isOpen}
    <ul class="absolute right-0 mt-2 w-24 bg-[#0c0c0c] border border-gray-700 rounded-md shadow-lg z-30">
      {#each languages as lang}
        <li>
          <button
            class="block w-full px-4 py-2 text-sm text-white hover:bg-gray-700 transition"
            on:click={() => setLanguage(lang)}
          >
            {lang.toUpperCase()}
          </button>
        </li>
      {/each}
    </ul>
  {/if}
</div>
