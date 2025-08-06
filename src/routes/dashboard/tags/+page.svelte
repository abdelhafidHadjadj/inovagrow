<script lang="ts">
  import { onMount } from 'svelte';

  let tags = [];
  let error = '';

  let showModal = false;
  let newTag = '';

  let editingId: string | null = null;
  let editingName = '';

  async function loadTags() {
    const res = await fetch('/api/tags');
    tags = await res.json();
  }

  async function addTag() {
    if (!newTag.trim()) return;
    await fetch('/api/tags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newTag })
    });
    newTag = '';
    showModal = false;
    await loadTags();
  }

  async function updateTag(id: string) {
    if (!editingName.trim()) return;
    await fetch(`/api/tags/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editingName })
    });
    editingId = null;
    editingName = '';
    await loadTags();
  }

  async function deleteTag(id: string) {
    const res = await fetch(`/api/tags/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) {
      error = data.error;
    } else {
      error = '';
    }
    await loadTags();
  }

  onMount(loadTags);
</script>

<h1 class="text-2xl font-bold mb-6">Manage Tags</h1>

{#if error}
  <p class="text-red-600 mb-4">{error}</p>
{/if}

<div class="mb-4">
  <button
    on:click={() => (showModal = true)}
    class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
  >
    + Add Tag
  </button>
</div>

<table class="w-full border text-left">
  <thead>
    <tr class="bg-gray-100">
      <th class="p-3">Name</th>
      <th class="p-3">Slug</th>
      <th class="p-3 w-32">Actions</th>
    </tr>
  </thead>
  <tbody>
    {#each tags as tag}
      <tr
        class="border-b hover:bg-gray-50 cursor-pointer"
        on:click={() => {
          if (editingId !== tag.id) {
            editingId = tag.id;
            editingName = tag.name;
          }
        }}
      >
        <td class="p-3">
          {#if editingId === tag.id}
            <input
              bind:value={editingName}
              class="border rounded p-1 w-full"
              on:keydown={(e) => e.key === 'Enter' && updateTag(tag.id)}
              on:click|stopPropagation
            />
          {:else}
            {tag.name}
          {/if}
        </td>
        <td class="p-3 text-gray-500">{tag.slug}</td>
        <td class="p-3 flex gap-2">
          {#if editingId === tag.id}
            <button
              on:click={() => updateTag(tag.id)}
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
              on:click|stopPropagation={() => deleteTag(tag.id)}
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

<!-- Modal for adding tag -->
{#if showModal}
  <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg w-full max-w-md shadow-xl space-y-4">
      <h2 class="text-lg font-semibold">Add New Tag</h2>
      <input
        bind:value={newTag}
        class="w-full border rounded p-2"
        placeholder="Tag name"
      />
      <div class="flex justify-end gap-3">
        <button
          on:click={() => (showModal = false)}
          class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          on:click={addTag}
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add
        </button>
      </div>
    </div>
  </div>
{/if}
