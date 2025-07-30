<script>
  export let user;

  async function logout() {
    await fetch('/api/logout', { method: 'POST' });
    window.location.href = '/login';
  }
</script>

<header class="bg-white shadow-md px-6 py-4 flex justify-between items-center">
  <div class="text-lg font-semibold">
    👋 Hello, {user.name}
  </div>

  <button
    on:click={logout}
    class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
  >
    Logout
  </button>
</header>
