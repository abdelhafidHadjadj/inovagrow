<script>
  import { t } from '$lib/utils/i18n';
  import { locale } from '$lib/stores/locale';
  import { get } from 'svelte/store';  
  import process from '$lib/assets/images/process-dev.png'; 
  
  const lang = get(locale);

</script>

<section class="relative bg-[var(--color-dark)] text-white py-20 px-6 md:px-12 overflow-hidden bg-grid">
  <!-- Overlay SVG -->
  <img
    src="/effect.svg"
    alt="grid background"
    class="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none z-0"
  />
  <div class="absolute inset-0 z-0 bg-gradient-to-b from-[var(--color-dark)] via-transparent to-[var(--color-dark)]"></div>

  <!-- Content -->
  <div class="relative z-10 max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
    <!-- Text -->
    <div class="w-full md:w-1/2">
      <p class="text-sm text-gray-400 mb-2">{t(lang, 'products.tagline')}</p>
      <h2 class="text-3xl md:text-4xl font-bold mb-4">
        {t(lang, 'products.title')}
      </h2>
      <p class="text-gray-300 text-sm md:text-base mb-6">
        {t(lang, 'products.description')}
      </p>
      <a
        href="/products"
        class="inline-block border border-white text-white px-6 py-3 rounded-full text-sm hover:bg-white hover:text-black transition"
      >
        {t(lang, 'products.cta')}
      </a>
    </div>

    <!-- Image with gradient border -->
    <div class="w-full md:w-1/2 flex justify-center">
        <img src={process} alt="Product preview" class="rounded-full object-cover w-full max-w-md aspect-video bg-black" />
    </div>
  </div>
</section>
