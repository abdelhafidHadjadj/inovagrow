<script>
  import bg from '$lib/assets/images/bg3.png';
  import { locale } from '$lib/stores/locale';
  import { get } from 'svelte/store';

  const lang = get(locale);

  let email = '';
  let success = false;
  let error = '';
  let loading = false;

  async function submit() {
    loading = true;
    error = '';
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        success = true;
      } else {
        error = data.error || 'An error occurred.';
      }
    } catch (err) {
      error = 'Server error.';
    } finally {
      loading = false;
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
        Secure your access to continue your journey.
      </h2>
    </div>

    {#if success}
      <div class="text-center p-8">
        <h1 class="text-2xl font-bold text-green-400 mb-4">Email Sent</h1>
        <p class="text-white">
           If <strong>{email}</strong> exists in our system, a password reset link has been sent.
        </p>
      </div>
    {:else}
      <div class="w-full flex flex-col items-center">
        <h1 class="text-3xl font-bold mb-6">Forgot Password?</h1>
        <p class="text-gray-400 text-sm text-center mb-6">
          Enter your email address to receive a reset link.
        </p>

        <form on:submit|preventDefault={submit} class="space-y-4 w-full px-4">
          <div>
            <label class="block text-sm mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              bind:value={email}
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
            disabled={loading}
          >
            {loading ? 'Sending link…' : 'Send Reset Link'}
          </button>

          <div class="flex justify-between text-sm text-gray-400 mt-6">
            <a href={`/${lang}/login`} class="hover:underline">← Back to login</a>
          </div>
        </form>
      </div>
    {/if}
  </div>

  <!-- image with gradient border -->
  <div class="hidden xl:block overflow-hidden p-[3px] w-1/2 h-2/3 rounded-3xl bg-gradient-to-r from-[var(--color-primary-from)] via-[var(--color-primary-via)] to-[var(--color-primary-to)]">
    <img src={bg} alt="Background" class="object-cover rounded-3xl" />
  </div>
</div>
