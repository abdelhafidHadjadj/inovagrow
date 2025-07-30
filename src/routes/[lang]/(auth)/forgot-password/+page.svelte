<script>
  let email = '';
  let success = false;
  let error = '';

  async function submit() {
    error = '';
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
  }
</script>

<div class="max-w-md mx-auto mt-20 p-6 rounded shadow bg-white text-black">
  <h1 class="text-2xl font-bold mb-4">🔐 Forgot your password?</h1>

  {#if success}
    <p class="text-green-600">✅ If your email exists, a reset link has been sent.</p>
  {:else}
    <form on:submit|preventDefault={submit} class="space-y-4">
      <input
        type="email"
        placeholder="Enter your email"
        bind:value={email}
        required
        class="w-full px-4 py-2 border rounded"
      />
      {#if error}
        <p class="text-red-600">{error}</p>
      {/if}
      <button
        type="submit"
        class="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded w-full hover:opacity-90"
      >
        Send Reset Link
      </button>
    </form>
  {/if}
</div>
