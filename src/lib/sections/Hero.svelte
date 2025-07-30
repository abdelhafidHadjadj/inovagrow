<script>
  import { t } from '$lib/utils/i18n';
  import { locale } from '$lib/stores/locale';
  import { get } from 'svelte/store';

  const lang = get(locale);
</script>

<section class="relative bg-[var(--color-dark)] text-white flex flex-col justify-center px-6 md:px-12 h-screen text-center overflow-hidden">
  <img
    src="/effect.svg"
    alt="Background grid effect"
    class="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none z-0"
  />
  <div
    class="absolute inset-0 z-0 bg-gradient-to-b 
         from-[var(--color-dark)] via-transparent to-[var(--color-dark)]"
  ></div>
  
  <div class="max-w-6xl mx-auto z-10 mt-24 md:mt-32">
    <h1 class="text-4xl md:text-6xl font-bold leading-tight mb-6">
      {t(lang, 'home.title')}<br />
      <span class="text-white">{t(lang, 'home.subtitle')}</span>
    </h1>

    <p class="text-gray-300 max-w-2xl mx-auto text-base md:text-lg mb-10">
      {t(lang, 'home.description')}
    </p>

    <div class="flex justify-center gap-4 flex-wrap">
      <a
        href="/get-started"
        class="bg-white text-black font-semibold py-3 px-6 rounded-full hover:bg-gray-100 transition"
      >
        {t(lang, 'home.cta')}
      </a>
      <a
        href={`${lang}/services`}
        class="relative inline-block px-[1px] py-[1px] rounded-full bg-gradient-to-r from-[var(--color-primary-from)] via-[var(--color-primary-via)] to-[var(--color-primary-to)]"
      >
      <span class="block rounded-full bg-[var(--color-dark)] text-white font-semibold px-6 py-3 hover:opacity-90 transition">
        {t(lang, 'home.cta_services')}
      </span>
      </a>
    </div>
  </div>
</section>
