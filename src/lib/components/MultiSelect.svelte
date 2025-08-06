<script lang="ts">
  import { onMount } from 'svelte';

  export let selected: string[] = [];
  export let placeholder = 'Search...';
  export let endpoint = '/api/categories'; // ⬅️ default value
  let options: { id: string; name: string }[] = [];
  let search = '';

  onMount(async () => {
    try {
      const res = await fetch(endpoint);
      if (res.ok) {
        options = await res.json();
      }
    } catch (err) {
      console.error('Failed to load options:', err);
    }
  });

  $: filtered = options.filter(
    (o) =>
      o.name.toLowerCase().includes(search.toLowerCase()) &&
      !selected.includes(o.id)
  );

  function toggle(id: string) {
    if (selected.includes(id)) {
      selected = selected.filter((v) => v !== id);
    } else {
      selected = [...selected, id];
    }
    search = '';
  }

  function getName(id: string) {
    return options.find((o) => o.id === id)?.name ?? id;
  }
</script>

<div class="relative">
  <input
    type="text"
    bind:value={search}
    placeholder={placeholder}
    class="w-full p-2 border rounded"
  />

  {#if search && filtered.length > 0}
    <ul class="absolute z-10 w-full bg-white shadow rounded border mt-1 max-h-48 overflow-y-auto">
      {#each filtered as opt}
        <li
          class="px-3 py-2 hover:bg-gray-100 cursor-pointer"
          on:click={() => toggle(opt.id)}
        >
          {opt.name}
        </li>
      {/each}
    </ul>
  {/if}

  <div class="flex flex-wrap gap-2 mt-2">
    {#each selected as id}
      <span class="bg-blue-100 text-sm px-3 py-1 rounded-full flex items-center gap-2">
        {getName(id)}
        <button on:click={() => toggle(id)} class="text-red-600 font-bold">×</button>
      </span>
    {/each}
  </div>
</div>
