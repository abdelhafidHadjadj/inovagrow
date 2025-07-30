<script>
  import { locale } from '$lib/stores/locale';
  import { t } from '$lib/utils/i18n';
  $: lang = $locale;

  let email = '';

  function subscribe() {
    // TODO: connecter à une API ou afficher un message de succès
    console.log('Subscribed:', email);
    email = '';
  }
</script>

<section class="text-black px-6 py-16 border-t border-gray-200">
  <div class="max-w-4xl mx-auto text-center">
    <h2 class="text-3xl md:text-4xl font-bold mb-4">
      {t(lang, 'newsletter.title')}
    </h2>
    <p class="text-gray-600 text-sm md:text-base mb-8">
      {t(lang, 'newsletter.description')}
    </p>

    <form
      on:submit|preventDefault={subscribe}
      class="flex flex-col md:flex-row items-center gap-4 justify-center max-w-xl mx-auto"
    >
      <input
        type="email"
        bind:value={email}
        placeholder={t(lang, 'newsletter.placeholder')}
        class="w-full px-4 py-3 rounded-full border border-gray-300 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
        required
      />
      <button
        type="submit"
        class="px-6 py-3 rounded-full border border-black text-black hover:bg-black hover:text-white transition text-sm font-medium"
      >
        {t(lang, 'newsletter.button')}
      </button>
    </form>
  </div>
</section>
