<script>
  import { t } from '$lib/utils/i18n';
  import { locale } from '$lib/stores/locale';
  import { get } from 'svelte/store';

  const lang = get(locale);

  let name = '';
  let email = '';
  let subject = '';
  let message = '';
  let status = '';
  let error = false;
  let loading = false;

  async function handleSubmit(event) {
    event.preventDefault();
    loading = true;
    status = '';
    error = false;

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message })
      });

      const data = await res.json();
      status = data.message || 'Message sent!';
      error = !data.success;

      if (data.success) {
        name = email = subject = message = '';
      }
    } catch (err) {
      status = 'Erreur lors de l’envoi. Veuillez réessayer.';
      error = true;
    }

    loading = false;
  }
</script>

<section class="bg-[var(--color-dark)] text-white min-h-screen py-16 px-6 md:px-12">
  <div class="max-w-6xl mx-auto bg-white text-black rounded-2xl mt-16 shadow-xl p-8 grid md:grid-cols-2 gap-8 items-start">
    
    <!-- Contact Info -->
    <div>
      <h2 class="text-sm font-medium uppercase mb-2">{t(lang, 'contact.subtitle')}</h2>
      <h1 class="text-3xl md:text-4xl font-bold mb-6">{t(lang, 'contact.title')}</h1>

      <div class="mb-4">
        <p class="font-medium mb-1">{t(lang, 'contact.callCenter')}</p>
        <p class="text-sm text-gray-700">+213 000000000<br />+213 000000000</p>
      </div>

      <div class="mb-4">
        <p class="font-medium mb-1">Email</p>
        <p class="text-sm text-gray-700">contact@inovagrow.com</p>
      </div>

      <div class="mt-6">
        <p class="font-medium mb-1">{t(lang, 'contact.social')}</p>
        <div class="flex gap-4 mb-4">
          <a href="/#" aria-label="LinkedIn"><i class="ri-linkedin-fill text-lg"></i></a>
          <a href="/#" aria-label="Instagram"><i class="ri-instagram-line text-lg"></i></a>
          <a href="/#" aria-label="Facebook"><i class="ri-facebook-fill text-lg"></i></a>
          <a href="/#" aria-label="TikTok"><i class="ri-tiktok-fill text-lg"></i></a>
        </div>
      </div>
    </div>

    <!-- Contact Form -->
    <div class="bg-gray-100 p-6 rounded-xl shadow-lg w-full">
      <h3 class="text-md font-semibold mb-4">{t(lang, 'contact.formTitle')}</h3>
      <form on:submit={handleSubmit} class="flex flex-col gap-4" aria-live="polite">
        <input type="text" bind:value={name} placeholder="Fullname" class="border border-gray-300 rounded-md px-4 py-2" required />
        <input type="email" bind:value={email} placeholder="Email" class="border border-gray-300 rounded-md px-4 py-2" required />
        <input type="text" bind:value={subject} placeholder="Subject" class="border border-gray-300 rounded-md px-4 py-2" required />
        <textarea bind:value={message} placeholder="Message" rows="4" class="border border-gray-300 rounded-md px-4 py-2" required></textarea>
        
        <button
          type="submit"
          class="bg-black text-white px-6 py-2 rounded-full w-fit hover:bg-gray-800 transition disabled:opacity-50"
          disabled={loading}
        >
          {#if loading}
            {t(lang, 'contact.sending')}...
          {:else}
            {t(lang, 'contact.send')}
          {/if}
        </button>

        {#if status}
          <p class="text-sm mt-2 {error ? 'text-red-600' : 'text-green-600'}">{status}</p>
        {/if}
      </form>
    </div>
  </div>
</section>
