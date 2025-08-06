<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { get } from 'svelte/store';

  onMount(() => {
    const { url } = get(page);
    const token = url.searchParams.get('token');
    const lang = url.pathname.split('/')[1];

    if (!token) {
      goto(`/${lang}/verify-email/invalid`);
      return;
    }

    goto(`/api/auth/verify-email?token=${token}&lang=${lang}`, {
      replaceState: true
    });
  });
</script>

<div class="min-h-screen flex flex-col justify-center items-center bg-[var(--color-dark)] text-white px-6 py-24 space-y-6">
  <!-- Logo -->
  <div class="absolute top-4 left-4">
    <img src="/favicon.svg" alt="logo" class="h-10" />
  </div>

  <!-- Message -->
  <div class="w-full max-w-md text-center space-y-4">
    <h1 class="text-3xl font-bold">Verifying your email…</h1>
    <p class="text-gray-400">Please wait a few seconds while we confirm your email address.</p>
    <div class="text-blue-400 animate-pulse">⏳ Redirecting securely…</div>
  </div>
</div>
