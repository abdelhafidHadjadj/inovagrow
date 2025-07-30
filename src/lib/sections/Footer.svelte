<script>
  import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte';
import { locale } from '$lib/stores/locale';
  import { t } from '$lib/utils/i18n';
  import { get } from 'svelte/store';
  const year = new Date().getFullYear();
  const lang = get(locale);

</script>

<footer class="bg-[var(--color-dark)] text-white px-6 py-12 border-t border-gray-800">
  <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
    <!-- Left: Logo & mission -->
    <div>
      <img src="/inovagrow-logo.svg" alt="Inova Grow" class="h-20 mb-4" />
      <p class="text-sm text-gray-400 max-w-sm">
        {t(lang, 'footer.mission')}
      </p>
    </div>

    <!-- Center: navigation -->
    <div class="flex justify-between md:col-span-2 text-sm">
      <div class="flex flex-col gap-2">
        <a href="/get-started">{t(lang, 'footer.gettingStarted')}</a>
        <a href="/faq">{t(lang, 'footer.faq')}</a>
        <a href="/privacy-policy">{t(lang, 'footer.privacy')}</a>
        <a href="/terms">{t(lang, 'footer.terms')}</a>
      </div>
      <div class="flex flex-col gap-2">
        <a href="/services">{t(lang, 'header.services')}</a>
        <a href="/products">{t(lang, 'footer.products')}</a>
        <a href="/blog">{t(lang, 'header.blog')}</a>
        <a href="/contact">{t(lang, 'header.contact')}</a>
      </div>
      <div>
        <LanguageSwitcher/>
      </div>
    </div>
  </div>

  <!-- Bottom -->
  <div class="border-t border-gray-800 mt-10 pt-6 text-center text-sm text-gray-400">
    <div class="flex justify-center gap-4 mb-4">
      <a href="/#" aria-label="LinkedIn"><i class="ri-linkedin-fill text-lg"></i></a>
      <a href="/#" aria-label="Instagram"><i class="ri-instagram-line text-lg"></i></a>
      <a href="/#" aria-label="Facebook"><i class="ri-facebook-fill text-lg"></i></a>
      <a href="/#" aria-label="TikTok"><i class="ri-tiktok-fill text-lg"></i></a>
    </div>
    <p>©{year}, All rights reserved</p>
  </div>
</footer>
