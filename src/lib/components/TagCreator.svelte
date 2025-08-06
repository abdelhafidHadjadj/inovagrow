<script lang="ts">
  export let tags: string[] = [];
  let input = '';
  let suggestions: string[] = [];
  let allTags: string[] = [];

  // Optionnel : auto-chargement de tous les tags depuis backend
  import { onMount } from 'svelte';
  onMount(async () => {
    const res = await fetch('/api/tags');
    if (res.ok) allTags = (await res.json()).map((t) => t.name);
  });

  $: filtered = allTags.filter(
    t => t.toLowerCase().includes(input.toLowerCase()) && !tags.includes(t)
  );

  function add(tag: string) {
    if (tag && !tags.includes(tag)) tags = [...tags, tag];
    input = '';
  }

  function remove(tag: string) {
    tags = tags.filter(t => t !== tag);
  }
</script>

<div class="space-y-2">
  <div class="relative">
    <input
      bind:value={input}
      placeholder="Add tag..."
      class="w-full p-2 border rounded"
      on:keydown={(e) => e.key === 'Enter' && (e.preventDefault(), add(input))}
    />

    {#if input && filtered.length > 0}
      <ul class="absolute z-10 w-full bg-white shadow rounded border mt-1 max-h-48 overflow-y-auto">
        {#each filtered as t}
          <li
            class="px-3 py-2 hover:bg-gray-100 cursor-pointer"
            on:click={() => add(t)}
          >
            {t}
          </li>
        {/each}
      </ul>
    {/if}
  </div>

  <div class="flex flex-wrap gap-2 mt-2">
    {#each tags as tag}
      <span class="bg-blue-100 text-sm px-3 py-1 rounded-full flex items-center gap-2">
        {tag}
        <button on:click={() => remove(tag)} class="text-red-600 font-bold">×</button>
      </span>
    {/each}
  </div>
</div>
