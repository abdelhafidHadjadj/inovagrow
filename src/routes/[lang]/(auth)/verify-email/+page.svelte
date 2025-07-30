<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { get } from 'svelte/store';

  onMount(() => {
    const { url } = get(page);
    const token = url.searchParams.get('token');
    const lang  = url.pathname.split('/')[1];   // first segment => "en", "fr", …

    // No token → straight to invalid page
    if (!token) {
      goto(`/${lang}/verify-email/invalid`);
      return;
    }

    /* Let the server handle the 302 redirect. `replaceState`
       avoids an extra entry in browser history. */
    goto(`/api/auth/verify-email?token=${token}&lang=${lang}`, {
      replaceState: true
    });
  });
</script>

<p class="text-center mt-20 font-semibold text-lg">
  Verifying your email…
</p>
