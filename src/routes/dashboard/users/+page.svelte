<script lang="ts">
  import { goto } from '$app/navigation';
  export let data;

  let users      = data.users;
  let page       = data.page;
  let pageSize   = data.pageSize;
  let totalPages = Math.ceil(data.total / pageSize);
  let error      = '';

  async function deleteUser(id: string) {
    if (!confirm('Delete this user?')) return;
    const res   = await fetch(`/api/users/${id}`, { method: 'DELETE' });
    const json  = await res.json();
    if (!res.ok) error = json.error || 'Delete failed';
    else {
      error  = '';
      users  = users.filter(u => u.id !== id);
    }
  }

  function goToPage(n: number) {
    goto(`/dashboard/users?page=${n}`);
  }
</script>

<div class="flex justify-between items-center mb-4">
  <h1 class="text-2xl font-bold">Manage Users</h1>
  <!-- Bouton éventuel pour créer un utilisateur -->
</div>

{#if error}
  <p class="text-red-600 mb-4">{error}</p>
{/if}

<table class="w-full border text-sm">
  <thead>
    <tr class="bg-gray-100">
      <th class="p-3">Name</th>
      <th class="p-3">Email</th>
      <th class="p-3">Role</th>
      <th class="p-3">Actions</th>
    </tr>
  </thead>
  <tbody>
    {#each users as user}
      <tr class="border-b hover:bg-gray-50">
        <td class="p-3">{user.name}</td>
        <td class="p-3 text-gray-500">{user.email}</td>
        <td class="p-3">{user.role}</td>
        <td class="p-3 flex gap-4">
          <!-- Ajoute /dashboard/users/edit/[id] si tu as un formulaire -->
          <button class="text-red-600 hover:underline" on:click={() => deleteUser(user.id)}>Delete</button>
        </td>
      </tr>
    {/each}
  </tbody>
</table>

{#if totalPages > 1}
  <div class="flex gap-2 justify-center mt-6">
    {#each Array(totalPages) as _, i}
      <button
        class="px-3 py-1 border rounded
               {page === i + 1 ? 'bg-black text-white' : 'hover:bg-gray-100'}"
        on:click={() => goToPage(i + 1)}
      >
        {i + 1}
      </button>
    {/each}
  </div>
{/if}
