<script>
  import ServiceCard from '$lib/components/ServiceCard.svelte';
  import iconCmd from '$lib/assets/icons/cmd.svg';
  import iconBrain from '$lib/assets/icons/brain.svg';
  import iconMarketing from '$lib/assets/icons/marketing.svg';
  import iconDesign from '$lib/assets/icons/design.svg';

  import webdevImg from '$lib/assets/images/web-dev.png';
  import digitalMarketingImg from '$lib/assets/images/digital-marketing.png';
  import techConsultingImg from '$lib/assets/images/tech-consulting.png';
  import uxuiDesignImg from '$lib/assets/images/uxui-design.png';
  import { t } from '$lib/utils/i18n';
  import { locale } from '$lib/stores/locale';
  import { get } from 'svelte/store';

  const lang = get(locale);

  const services = [
    {
      title: t(lang, 'services.webmob.title'),
      description: t(lang, 'services.webmob.short_descript'),
      image: webdevImg,
      icon: iconCmd,
      link: `${lang}/services/web-mobile-development`
    },
    {
      title: t(lang, 'services.uiux.title'),
      description: t(lang, 'services.uiux.short_descript'),
      image: uxuiDesignImg,
      icon: iconDesign,
      link: `${lang}/services/uxui-design`
    },
    {
      title: t(lang, 'services.marketing.title'),
      description: t(lang, 'services.marketing.short_descript'),
      image: digitalMarketingImg,
      icon: iconMarketing,
      link: `${lang}/services/digital-marketing`
    },
    {
      title: t(lang, 'services.consulting.title'),
      description: t(lang, 'services.consulting.short_descript'),
      image: techConsultingImg,
      icon: iconBrain,
      link: `${lang}/services/tech-consulting`
    },
  ];
</script>

<section class="relative bg-[var(--color-dark)] bg-grid text-white mt-8 py-20 px-6 overflow-hidden">
  <!-- Background SVG and overlay -->
  <img
    src="/effect.svg"
    alt="Background grid effect"
    class="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none z-0"
  />
  <div
    class="absolute inset-0 z-0 bg-gradient-to-b 
           from-[var(--color-dark)] via-transparent to-[var(--color-dark)]"
  ></div>

  <!-- Content wrapper -->
  <div class="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row items-start gap-12">
    <!-- Left block -->
    <div class="flex-1 space-y-6">
      <div>
        <p class="text-sm text-gray-400 mb-2">{t(lang, 'services.tagline')}</p>
        <h2 class="text-3xl md:text-4xl font-bold mb-4">{t(lang, 'services.title')}</h2>
        <p class="text-gray-300 text-sm md:text-base mb-6">
            {t(lang, 'services.description')}
        </p>
      </div>
      <a
        href="/services"
        class="inline-block border border-white px-5 py-2 rounded-full hover:bg-white hover:text-black transition"
      >
        {t(lang, 'common.discover_more')}
    </a>
    </div>

    <!-- Right block: grid -->
    <div class="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
      {#each services as s}
        <ServiceCard {...s} />
      {/each}
    </div>
  </div>
</section>
