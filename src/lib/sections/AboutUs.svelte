<script>
  import laptop from '$lib/assets/images/laptop.png'; 
  import { t } from '$lib/utils/i18n';
  import { locale } from '$lib/stores/locale';
  import { get } from 'svelte/store';

  const lang = get(locale);
</script>

<section class="bg-[var(--color-light)] py-20 px-6">
  <div class="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
    <!-- Image -->
    <div class="flex-shrink-0 w-full md:w-1/3">
        <div class="p-1 rounded-full bg-gradient-to-r from-[var(--color-primary-from)] via-[var(--color-primary-via)] to-[var(--color-primary-to)] shadow-xl">
          <img
            src={laptop}
            alt="About Us"
            class="rounded-full w-full object-cover aspect-video"
          />
        </div>
    </div>

    <!-- Text -->
    <div class="w-full md:w-1/2 text-center md:text-left">
      <h2 class="text-2xl md:text-3xl font-semibold mb-4">{t(lang, 'about.title')}</h2>
      <p class="text-sm md:text-base text-gray-700 leading-relaxed max-w-prose">
        {t(lang, 'about.description')}
      </p>
    </div>
  </div>
</section>
