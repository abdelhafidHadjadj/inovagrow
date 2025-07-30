<script>
  import "../../../app.css";
  import SidebarDashboard from '$lib/components/Sidebar.svelte'; // adapte le chemin selon ton projet
  export let data;
</script>

{#if data?.user}
  <div class="flex min-h-screen bg-gray-100">
    <SidebarDashboard />

    <main class="flex-1 p-6 h-screen overflow-auto">
      <slot />
    </main>
  </div>
{:else}
  <div class="min-h-screen flex items-center justify-center">
    <p class="text-red-600 text-lg font-semibold">⛔ Accès non autorisé</p>
  </div>
{/if}
