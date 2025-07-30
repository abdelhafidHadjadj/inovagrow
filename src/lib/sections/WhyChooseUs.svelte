<script>
  import { locale } from '$lib/stores/locale';
  import { t } from '$lib/utils/i18n';
  $: lang = $locale;

  import laptop from '$lib/assets/icons/laptop.svg';
  import handshake from '$lib/assets/icons/handshake.svg';
  import rocket from '$lib/assets/icons/rocket.svg';

  const features = [
    { icon: laptop, titleKey: 'why.features.technical' },
    { icon: handshake, titleKey: 'why.features.support' },
    { icon: rocket, titleKey: 'why.features.growth' }
  ];
</script>

<section class="text-center py-16 bg-[var(--color-light)] text-black">
  <h2 class="text-2xl md:text-3xl font-semibold mb-12">
    {t(lang, 'why.title')}
  </h2>

  <div class="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-300 max-w-6xl mx-auto">
    {#each features as feature}
      <div class="flex items-center justify-center px-6 py-8 gap-4">
        <img src={feature.icon} alt={t(lang, feature.titleKey)} class="w-8 h-8" />
        <p class="font-medium text-sm md:text-base">
          {t(lang, feature.titleKey)}
        </p>
      </div>
    {/each}
  </div>

  <div class="mt-10 border-t border-gray-300 max-w-6xl mx-auto"></div>
</section>
