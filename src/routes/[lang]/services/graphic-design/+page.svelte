<script>
  import { t } from '$lib/utils/i18n';
  import { locale } from '$lib/stores/locale';
  import { get } from 'svelte/store';

  import heroImage from '$lib/assets/images/graphic-design-hero.png';
  import designProcessImage from '$lib/assets/images/process-graphic-design.svg';
  import mockupImg from '$lib/assets/images/graphic-design.png';

  const lang = get(locale);

  const title = t(lang, 'services.graphic.title');
  const description = t(lang, 'services.graphic.description');
  const features = t(lang, 'services.graphic.features');
</script>

<section class="bg-black text-white">

  <!-- Hero -->
  <div class="relative h-[400px] bg-cover bg-center flex items-center justify-center">
    <img
      src={heroImage}
      alt="Graphic design hero"
      class="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none z-0"
    />
    <div class="absolute inset-0 z-0 bg-gradient-to-b from-[var(--color-dark)] via-transparent to-[var(--color-dark)]"></div>
    <h1 class="relative text-4xl md:text-5xl font-bold z-10 text-white text-center">{title}</h1>
  </div>

  <!-- Introduction -->
  <div class="bg-[var(--color-light)] text-gray-900 py-16 px-6 md:px-12 ">
    <div class="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
      <img src={mockupImg} alt="Graphic design mockup" class="rounded-xl shadow-xl w-full" />
      <div>
        <h2 class="text-2xl font-bold mb-4">{title}</h2>
        <p class="text-gray-700 mb-6">{description}</p>
        <h3 class="font-semibold mb-2">{t(lang, 'services.graphic.offerTitle')}</h3>
        <p class="text-gray-700 mb-6">{features}</p>
      </div>
    </div>
  </div>

  <!-- Process -->
  <section class="relative bg-[var(--color-dark)] text-white py-20 px-6 md:px-12 overflow-hidden bg-grid">
    <img
      src="/effect.svg"
      alt="grid background"
      class="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none z-0"
    />
    <div class="absolute inset-0 z-0 bg-gradient-to-b from-[var(--color-dark)] via-transparent to-[var(--color-dark)]"></div>

    <div class="relative z-10 max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
      <div class="w-full md:w-1/3">
        <p class="text-sm text-gray-400 mb-2">{t(lang, 'services.graphic.processTag')}</p>
        <h2 class="text-3xl md:text-4xl font-bold mb-4">{t(lang, 'services.graphic.processTitle')}</h2>
        <p class="text-gray-300 text-sm md:text-base mb-6">
          {t(lang, 'services.graphic.processDescription')}
        </p>
      </div>

      <div class="w-full md:w-2/3 flex justify-center">
        <img
          src={designProcessImage}
          alt="Graphic design process"
          class="object-cover w-full"
        />
      </div>
    </div>
  </section>

  <!-- CTA -->
  <div class="bg-[var(--color-light)] py-16 px-6 md:px-12">
    <div class="mx-auto flex gap-8 flex-col md:flex-row items-center justify-center">
      <div class="flex flex-col justify-center items-start gap-2">
        <h2 class="text-2xl text-black font-semibold">{t(lang, 'services.graphic.ctaTitle')}</h2>
        <p class="text-gray-700 mb-6">{t(lang, 'services.graphic.ctaText')}</p>
      </div>
      <a href="/{lang}/contact" class="bg-black h-fit text-white px-6 py-3 rounded-full hover:bg-gray-800 transition">
        {t(lang, 'services.graphic.ctaButton')}
      </a>
    </div>
  </div>
</section>
