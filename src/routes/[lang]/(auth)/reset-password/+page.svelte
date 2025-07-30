<script>
  import { page } from '$app/stores';

  let password = '';
  let confirm  = '';
  let error    = '';
  let success  = false;

  /* ───── récupérer le token dans l’URL de façon réactive ───── */
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
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify({ token, password })
    });

    const data = await res.json();
    if (res.ok && data.success) {
      success = true;
    } else {
      error = data.error || 'Something went wrong.';
    }
  }
</script>

<div class="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow text-black">
  {#if success}
    <h2 class="text-xl font-bold text-green-600 mb-4">✅ Password reset!</h2>
    <p>You can now <a href="/login" class="underline text-blue-600">log in</a> with your new password.</p>
  {:else}
    <h2 class="text-xl font-bold mb-4">🔒 Reset your password</h2>

    <form on:submit|preventDefault={submit} class="flex flex-col gap-4">
      <input type="password" placeholder="New password" bind:value={password} required class="input" />
      <input type="password" placeholder="Confirm password" bind:value={confirm} required class="input" />

      {#if error}
        <p class="text-red-600 text-sm">{error}</p>
      {/if}

      <button type="submit" class="btn btn-primary w-full">Update password</button>
    </form>
  {/if}
</div>
