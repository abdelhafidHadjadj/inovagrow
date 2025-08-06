<script lang="ts">
  import { onMount } from 'svelte';

  let categories = [];
  let error = '';

  let showModal = false;
  let newCategory = '';

  let editingId: string | null = null;
  let editingName = '';

  async function loadCategories() {
    const res = await fetch('/api/categories');
    categories = await res.json();
  }

  async function addCategory() {
    if (!newCategory.trim()) return;
    await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newCategory })
    });
    newCategory = '';
    showModal = false;
    await loadCategories();
  }

  async function updateCategory(id: string) {
    if (!editingName.trim()) return;
    await fetch(`/api/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editingName })
    });
    editingId = null;
    editingName = '';
    await loadCategories();
  }

  async function deleteCategory(id: string) {
    const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) {
      error = data.error;
    } else {
      error = '';
    }
    await loadCategories();
  }

  onMount(loadCategories);
</script>

<h1 class="text-2xl font-bold mb-6">Manage Categories</h1>

{#if error}
  <p class="text-red-600 mb-4">{error}</p>
{/if}

<div class="mb-4">
  <button
    on:click={() => (showModal = true)}
    class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
  >
    + Add Category
  </button>
</div>

<!-- Table -->
<table class="w-full border text-left">
  <thead>
    <tr class="bg-gray-100">
      <th class="p-3">Name</th>
      <th class="p-3">Slug</th>
      <th class="p-3 w-32">Actions</th>
    </tr>
  </thead>
  <tbody>
    {#each categories as cat}
      <tr
        class="border-b hover:bg-gray-50 cursor-pointer"
        on:click={() => {
          if (editingId !== cat.id) {
            editingId = cat.id;
            editingName = cat.name;
          }
        }}
      >
        <td class="p-3">
          {#if editingId === cat.id}
            <input
              bind:value={editingName}
              class="border rounded p-1 w-full"
              on:keydown={(e) => e.key === 'Enter' && updateCategory(cat.id)}
              on:click|stopPropagation
            />
          {:else}
            {cat.name}
          {/if}
        </td>
        <td class="p-3 text-gray-500">{cat.slug}</td>
        <td class="p-3 flex gap-2">
          {#if editingId === cat.id}
            <button
              on:click={() => updateCategory(cat.id)}
              class="text-green-600 font-semibold"
            >
              ✔
            </button>
            <button
              on:click={() => (editingId = null)}
              class="text-gray-400"
            >
              ✕
            </button>
          {:else}
            <button
              on:click|stopPropagation={() => deleteCategory(cat.id)}
              class="text-red-600 hover:text-red-800"
            >
              Delete
            </button>
          {/if}
        </td>
      </tr>
    {/each}
  </tbody>
</table>

<!-- Modal for adding category -->
{#if showModal}
  <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg w-full max-w-md shadow-xl space-y-4">
      <h2 class="text-lg font-semibold">Add New Category</h2>
      <input
        bind:value={newCategory}
        class="w-full border rounded p-2"
        placeholder="Category name"
      />
      <div class="flex justify-end gap-3">
        <button
          on:click={() => (showModal = false)}
          class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          on:click={addCategory}
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add
        </button>
      </div>
    </div>
  </div>
{/if}
