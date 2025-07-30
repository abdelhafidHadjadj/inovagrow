<script>
  /* ────────── stores & i18n ────────── */
  import { page } from '$app/stores';          // accès à $page.data
  import { locale } from '$lib/stores/locale'; // store de langue
  import { get } from 'svelte/store';
  import { t } from '$lib/utils/i18n';

  /* ────────── icônes & composants ───── */
  import { Menu, User } from 'lucide-svelte';
  import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte';

  /* langue courante (dossier /en, /fr) */
  const lang = get(locale);

  /* liens principaux */
  const links = [
    { href: '',         labelKey: 'header.home' },
    { href: 'about',    labelKey: 'header.about' },
    { href: 'services', labelKey: 'header.services' },
    { href: 'blog',     labelKey: 'header.blog' },
    { href: 'contact',  labelKey: 'header.contact' }
  ];

  /* helper actif */
  const isActive = (href) =>
    $page.url.pathname === `/${lang}/${href}` ||
    (href === '' && $page.url.pathname === `/${lang}/`);
</script>

<nav
  class="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/85
         py-2 border-b-2 border-transparent
         before:content-[''] before:absolute before:left-0 before:right-0 before:bottom-0
         before:h-[2px] before:bg-gradient-to-r
         before:from-[var(--color-primary-from)] before:via-[var(--color-primary-via)] before:to-[var(--color-primary-to)]">
  <div class="mx-auto max-w-7xl px-6 lg:px-8 flex items-center justify-between h-16">
    <!-- Logo -->
    <a href="/" class="flex items-center gap-2 shrink-0">
      <img src="/inovagrow-logo.svg" alt="Inova Grow logo" class="h-16 w-auto" />
    </a>

    <!-- Desktop navigation -->
    <div class="hidden md:flex items-center gap-8">
      <ul class="flex items-center gap-8">
        {#each links as { href, labelKey }}
          <li>
            <a
              href={`/${lang}/${href}`}
              class="relative text-sm font-medium transition-all hover:opacity-80
                     {isActive(href)
                       ? 'text-white font-semibold after:content-[""] after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-[2px] after:bg-gradient-to-r after:from-[var(--color-primary-from)] after:via-[var(--color-primary-via)] after:to-[var(--color-primary-to)]'
                       : 'text-gray-300'}">
              {t(lang, labelKey)}
            </a>
          </li>
        {/each}
      </ul>

      <!-- Language dropdown (desktop) -->
      <LanguageSwitcher />

      <!-- Account / Sign-up -->
      {#if $page.data.user}
        <!-- connecté -->
        <a href={`/${lang}/dashboard`} class="flex items-center gap-2 text-gray-300 hover:text-white transition">
          <User class="w-5 h-5" />
          <span class="hidden lg:inline">{$page.data.user.name}</span>
        </a>
      {:else}
        <!-- non connecté -->
        <a
          href={`/${lang}/signup`}
          class="ml-4 px-4 py-1.5 text-sm font-medium rounded-full
                 bg-[var(--color-primary-via)]
                 text-white hover:opacity-90 transition">
          Sign up
        </a>
      {/if}
    </div>

    <!-- Mobile menu -->
    <details class="md:hidden relative">
      <summary
        class="list-none cursor-pointer rounded p-2 -mr-2 ring-1 ring-gray-700
               hover:bg-gray-800 transition flex items-center justify-center">
        <Menu class="w-5 h-5 text-gray-200" />
      </summary>

      <div class="absolute right-0 mt-2 w-48 bg-[#0c0c0c] shadow-lg border border-gray-800
                  rounded flex flex-col py-2 z-20">
        <ul>
          {#each links as { href, labelKey }}
            <li>
              <a
                href={`/${lang}/${href}`}
                class="block px-4 py-2 text-sm hover:bg-gray-800
                       {isActive(href)
                         ? 'bg-gradient-to-r from-[var(--color-primary-from)] via-[var(--color-primary-via)] to-[var(--color-primary-to)] text-transparent bg-clip-text font-semibold'
                         : 'text-gray-200'}">
                {t(lang, labelKey)}
              </a>
            </li>
          {/each}
        </ul>

        <!-- extra actions -->
        <div class="border-t border-gray-800 mt-2 px-2 pt-2 flex flex-col gap-2">
          <LanguageSwitcher />

          {#if $page.data.user}
            <a href="/dashboard" class="text-white text-sm px-4 py-2">Dashboard</a>
          {:else}
            <a href={`/${lang}/signup`} class="text-white text-sm px-4 py-2">Sign up</a>
          {/if}
        </div>
      </div>
    </details>
  </div>
</nav>
