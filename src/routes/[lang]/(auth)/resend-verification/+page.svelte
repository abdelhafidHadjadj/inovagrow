<script>
  let email = '';
  let loading = false;
  let message = '';
  let error = '';

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

<div class="max-w-md mx-auto mt-20 p-4 border rounded shadow">
  <h1 class="text-xl font-bold mb-4">Resend Verification E-mail</h1>

  <form on:submit|preventDefault={resend} class="space-y-4">
    <input
      class="w-full p-2 border rounded"
      type="email"
      placeholder="Your e-mail"
      bind:value={email}
      required
    />

    <button
      class="btn btn-primary w-full"
      disabled={loading}>
      {loading ? 'Sending…' : 'Send verification link'}
    </button>

    {#if message}
      <p class="text-green-600 font-medium">{message}</p>
    {/if}
    {#if error}
      <p class="text-red-600 font-medium">{error}</p>
    {/if}
  </form>
</div>
