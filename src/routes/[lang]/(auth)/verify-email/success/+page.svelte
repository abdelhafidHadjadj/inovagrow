<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { t } from '$lib/utils/i18n';
  import { locale } from '$lib/stores/locale';
  import { get } from 'svelte/store';

  const lang = get(locale);
  onMount(() => {
    const timeout = setTimeout(() => {
      goto(`/${lang}/dashboard`); 
    }, 3000);

    return () => clearTimeout(timeout);
  });
</script>

<div class="min-h-screen flex flex-col justify-center items-center text-center px-4">
  <h1 class="text-3xl font-bold text-green-500 mb-4">Email verified!</h1>
  <p class="mb-6 text-gray-300">You’ll be redirected to your dashboard shortly...</p>

  <!-- Loader spinner -->
  <div class="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
</div>
