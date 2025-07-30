<script>
  import { LayoutDashboard, Users, SlidersHorizontal, LogOut, AppWindow } from 'lucide-svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { derived } from 'svelte/store';

  const currentPath = derived(page, $page => $page.url.pathname);

  const links = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { label: 'Users', icon: Users, href: '/dashboard/users' },
    { label: 'Blogs', icon: AppWindow , href: '/dashboard/blogs' },
    { label: 'Settings', icon: SlidersHorizontal, href: '/dashboard/settings' }
  ];

  const logout = () => {
    goto('/login');
  };
</script>

<style>
  .sidebar {
    transition: width 0.3s ease;
  }
</style>

<div class="h-screen flex flex-col bg-gray-900 text-white w-64 sidebar">
  <!-- Logo -->
  <div class="p-6 flex justify-center items-center gap-2 border-b border-gray-700">
    <img src="/favicon.svg" alt="Logo" class="w-16  h-16 rounded" />
  </div>

  <!-- Navigation -->
  <nav class="flex-1 overflow-y-auto p-4">
    {#each links as { label, icon: Icon, href }}
      <a
        href={href}
        class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition
              {($currentPath.startsWith(href)) ? 'bg-gray-800 font-semibold' : ''}"
      >
        <Icon class="w-5 h-5" />
        <span>{label}</span>
      </a>
    {/each}
  </nav>

  <!-- Logout -->
  <div class="p-4 border-t border-gray-700">
    <button on:click={logout} class="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 transition">
      <LogOut class="w-5 h-5" />
      <span>Logout</span>
    </button>
  </div>
</div>
