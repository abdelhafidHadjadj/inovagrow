<script>
  import { goto } from '$app/navigation';
  import bg from '$lib/assets/images/bg1.png';
  import { t } from '$lib/utils/i18n';
  import { locale } from '$lib/stores/locale';
  import { get } from 'svelte/store';
  import GoogleSignIn from '$lib/components/GoogleSignIn.svelte';

  const lang = get(locale);
  let email = '';
  let password = '';
  let error = '';
  let loading = false;

  async function login() {
    loading = true;
    error   = '';

    const res  = await fetch('/api/auth/login', {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify({ email, password })
    });
    const data = await res.json();

    if (res.ok) {
      const target =
        data.user.role === 'admin'
          ? '/dashboard/admin'
          : `/${lang}/dashboard`;

      goto(target);                 
    } else {
      error = data.message || 'Login failed.';
    }

    loading = false;
  }
</script>
<!-- ... (imports inchangés) -->

<div class="md:px-16 flex justify-center gap-2 items-center min-h-screen text-white bg-[var(--color-dark)]">
  <!-- logo top-left -->
  <div class="absolute top-4 left-4 w-fit">
    <img src="/favicon.svg" alt="logo" class="h-10" />
  </div>

  <!-- left column (form) -->
  <div class="sm:w-lg bg-[var(--color-dark)] p-4  flex flex-col justify-center items-center space-y-8">
    <div class="md:p-8  text-white">
      <h2 class="text-2xl font-semibold mb-4 text-center">
        Empowering your business with innovation in a connected digital world.
      </h2>
    </div>

    <div class="w-full flex flex-col items-center">
      <h1 class="text-3xl font-bold mb-6">Sign In</h1>
      <p class="text-gray-400 text-sm text-center mb-6">
        Secure access to your personalized dashboard. Trusted by professionals worldwide.
      </p>

      <form on:submit|preventDefault={login} class="space-y-4 w-full px-4">
        <div>
          <label class="block text-sm mb-1">Email</label>
          <input
            type="email"
            bind:value={email}
            required
            class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label class="block text-sm mb-1">Password</label>
          <input
            type="password"
            bind:value={password}
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
          {loading ? 'Logging in…' : 'SIGN IN'}
        </button>

        <div class="mt-4 w-full">
          <GoogleSignIn label="Continue with Google" />
        </div>

        <div class="flex justify-between text-sm text-gray-400 mt-6">
          <a href={`/${lang}/forgot-password`} class="hover:underline">Forgot password?</a>
          <a href={`/${lang}/signup`} class="hover:underline">Create an account</a>
        </div>
      </form>
    </div>
  </div>

  <!-- right column (image) -->

<div class="hidden xl:block overflow-hidden p-[3px] w-1/2 h-2/3 rounded-3xl bg-gradient-to-r from-[var(--color-primary-from)] via-[var(--color-primary-via)] to-[var(--color-primary-to)]">
  <img src={bg} alt="Background" class=" object-cover rounded-3xl" />
</div>
</div>
