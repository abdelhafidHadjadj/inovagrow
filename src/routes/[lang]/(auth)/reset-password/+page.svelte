<script>
  import bg from '$lib/assets/images/bg3.png';
  import { page } from '$app/stores';
  import { locale } from '$lib/stores/locale';
  import { get } from 'svelte/store';

  let password = '';
  let confirm = '';
  let error = '';
  let success = false;

  const lang = get(locale);
  $: token = $page.url.searchParams.get('token');

  async function submit() {
    error = '';

    if (!token) {
      error = 'Invalid or missing token.';
      return;
    }

    if (password !== confirm) {
      error = 'Passwords do not match.';
      return;
    }

    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password })
    });

    const data = await res.json();
    if (res.ok && data.success) {
      success = true;
    } else {
      error = data.error || 'Something went wrong.';
    }
  }
</script>

<div class="md:px-16 flex justify-center gap-2 items-center min-h-screen text-white bg-[var(--color-dark)]">
  <!-- logo -->
  <div class="absolute top-4 left-4 w-fit">
    <img src="/favicon.svg" alt="logo" class="h-10" />
  </div>

  <!-- form container -->
  <div class="sm:w-lg bg-[var(--color-dark)] p-4 flex flex-col justify-center items-center space-y-8">
    <div class="md:p-8 text-white">
      <h2 class="text-2xl font-semibold mb-4 text-center">
        Set a new secure password to continue your journey.
      </h2>
    </div>

    {#if success}
      <div class="text-center p-8">
        <h1 class="text-2xl font-bold text-green-400 mb-4">Password Reset</h1>
        <p class="text-white">
          You can now <a href={`/${lang}/login`} class="underline text-blue-400">log in</a> with your new password.
        </p>
      </div>
    {:else}
      <div class="w-full flex flex-col items-center">
        <h1 class="text-3xl font-bold mb-6">Reset Password</h1>
        <p class="text-gray-400 text-sm text-center mb-6">
          Enter your new password below.
        </p>

        <form on:submit|preventDefault={submit} class="space-y-4 w-full px-4">
          <div>
            <label class="block text-sm mb-1">New Password</label>
            <input
              type="password"
              bind:value={password}
              required
              class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm mb-1">Confirm Password</label>
            <input
              type="password"
              bind:value={confirm}
              required
              class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {#if error}
            <p class="text-red-500 text-sm">{error}</p>
          {/if}

          <button
            type="submit"
            class="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-full text-white font-semibold transition"
          >
            Update Password
          </button>
        </form>
      </div>
    {/if}
  </div>

  <!-- image with gradient border -->
  <div class="hidden xl:block overflow-hidden p-[3px] w-1/2 h-2/3 rounded-3xl bg-gradient-to-r from-[var(--color-primary-from)] via-[var(--color-primary-via)] to-[var(--color-primary-to)]">
    <img src={bg} alt="Background" class="object-cover rounded-3xl" />
  </div>
</div>
