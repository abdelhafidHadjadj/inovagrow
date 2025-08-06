<script>
  export let data;
</script>

{#if data?.user}
  <h1 class="text-2xl font-bold mb-4">Welcome back</h1>
  <p class="text-gray-600">You're logged in as <strong>{data.user.name}</strong></p>
{:else}
  <p class="text-red-600 text-center mt-10">Non connecté</p>
{/if}