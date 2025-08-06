<script lang="ts">
  export let categories: { id: string; name: string }[] = [];
  export let selected: string[] = [];

  let search = '';

  function toggle(id: string) {
    if (selected.includes(id)) {
      selected = selected.filter((c) => c !== id);
    } else {
      selected = [...selected, id];
    }
  }

  function getFiltered() {
    return categories.filter((cat) =>
      cat.name.toLowerCase().includes(search.toLowerCase()) &&
      !selected.includes(cat.id)
    );
  }
</script>

<div class="space-y-2">
  <label class="block font-semibold">Categories</label>

  <!-- Input + Dropdown -->
  <input
    type="text"
    bind:value={search}
    placeholder="Search categories..."
    class="w-full p-2 border rounded"
  />

  {#if getFiltered().length > 0}
    <ul class="border rounded max-h-40 overflow-y-auto bg-white shadow text-sm mt-1">
      {#each getFiltered() as cat}
        <li
          class="px-3 py-2 cursor-pointer hover:bg-gray-100"
          on:click={() => toggle(cat.id)}
        >
          {cat.name}
        </li>
      {/each}
    </ul>
  {/if}

  <!-- Selected badges -->
  <div class="flex flex-wrap gap-2 mt-2">
    {#each selected as id}
      {#if categories.find(c => c.id === id)}
        <span class="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full flex items-center gap-2">
          {categories.find(c => c.id === id)?.name}
          <button
            on:click={() => toggle(id)}
            class="text-red-600 hover:text-red-800 font-bold"
          >
            ×
          </button>
        </span>
      {/if}
    {/each}
  </div>
</div>
