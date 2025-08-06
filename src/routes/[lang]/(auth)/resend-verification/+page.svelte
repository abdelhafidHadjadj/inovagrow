<script>
  import bg from '$lib/assets/images/bg3.png';
  let email = '';
  let loading = false;
  let message = '';
  let error = '';
  let success = false;

  async function resend() {
    loading = true;
    message = '';
    error = '';
    try {
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok) {
        message = data.message;
        success = true;
      } else {
        error = data.message || 'Error.';
      }
    } catch (err) {
      error = 'Network error.';
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
        Didn't receive your verification link? We’ve got you covered.
      </h2>
    </div>

    {#if success}
      <div class="text-center p-8">
        <h1 class="text-2xl font-bold text-green-400 mb-4">Verification Sent</h1>
        <p class="text-white">{message}</p>
      </div>
    {:else}
      <div class="w-full flex flex-col items-center">
        <h1 class="text-3xl font-bold mb-6">Resend Verification</h1>
        <p class="text-gray-400 text-sm text-center mb-6">
          Enter your email to get a new verification link.
        </p>

        <form on:submit|preventDefault={resend} class="space-y-4 w-full px-4">
          <div>
            <label class="block text-sm mb-1">Email</label>
            <input
              class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="email"
              placeholder="Your email"
              bind:value={email}
              required
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
            {loading ? 'Sending…' : 'Send verification link'}
          </button>
        </form>
      </div>
    {/if}
  </div>

  <!-- image -->
  <div class="hidden xl:block overflow-hidden p-[3px] w-1/2 h-2/3 rounded-3xl bg-gradient-to-r from-[var(--color-primary-from)] via-[var(--color-primary-via)] to-[var(--color-primary-to)]">
    <img src={bg} alt="Background" class="object-cover rounded-3xl" />
  </div>
</div>
