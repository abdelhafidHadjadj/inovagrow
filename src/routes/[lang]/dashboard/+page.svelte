<script>
  /* Les données injectées par +layout.server.js */
  export let data;                 // { user, lang }

  import { goto }   from '$app/navigation';
  import { locale } from '$lib/stores/locale';
  import { get }    from 'svelte/store';

  /* ───────── infos utilisateur & langue ───────── */
  const name = data?.user?.name ?? 'User';
  const lang = data?.lang      ?? get(locale) ?? 'en';

  /* ───────── cartes rapides ───────── */
  const cards = [
    {
      title: 'My Profile',
      description: 'View and edit your personal information.',
      icon: '👤',
      link: `/${lang}/dashboard/profile`,
      color: 'from-blue-500 to-indigo-500'
    },
    {
      title: 'Chat',
      description: 'Chat with support or team members.',
      icon: '💬',
      link: `/${lang}/dashboard/chat`,
      color: 'from-green-500 to-emerald-500'
    }
  ];

  /* ───────── déconnexion ───────── */
  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    goto(`/${lang}/login`);
  }
</script>

<!-- ─────────────────── UI ─────────────────── -->
<section class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 pt-36 px-6">
  <div class="max-w-5xl mx-auto">
    <h1 class="text-3xl md:text-4xl font-bold mb-8">
      👋 Welcome back, <span class="text-primary">{name}</span>!
    </h1>

    <div class="grid gap-6 md:grid-cols-2">
      {#each cards as card}
        <a
          href={card.link}
          class="bg-white shadow-lg rounded-xl p-6 transition
                 transform hover:scale-[1.02] hover:shadow-xl group"
        >
          <div
            class={`w-14 h-14 flex items-center justify-center rounded-full
                    text-white text-2xl bg-gradient-to-r ${card.color} mb-4`}
          >
            {card.icon}
          </div>

          <h2 class="text-xl font-semibold group-hover:text-[var(--color-primary-from)]">
            {card.title}
          </h2>
          <p class="text-gray-600 mt-2 text-sm">{card.description}</p>
        </a>
      {/each}
    </div>

    <!-- bouton logout -->
    <div class="mt-12 text-center">
      <button
        on:click={logout}
        class="px-5  py-2 rounded-full bg-red-600 hover:bg-red-700
               text-white font-medium shadow"
      >
        🔓 Logout
      </button>
    </div>
  </div>
</section>
