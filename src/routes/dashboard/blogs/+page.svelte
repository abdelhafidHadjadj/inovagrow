<script lang="ts">
  import { goto } from '$app/navigation';
  export let data;

  let blogs = data.blogs;
  let page = data.page;
  let total = data.total;
  let pageSize = data.pageSize;
  let totalPages = Math.ceil(total / pageSize);
  let error = '';

  async function deleteBlog(id: string) {
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    const res = await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
    const result = await res.json();
    if (!res.ok) {
      error = result.error || 'Failed to delete blog';
    } else {
      blogs = blogs.filter((b) => b.id !== id);
    }
  }

  function openPreview(slug: string) {
    goto(`/en/blog/${slug}`);
  }

  function editBlog(id: string) {
    goto(`/dashboard/blogs/edit/${id}`);
  }

  function goToPage(n: number) {
    goto(`/dashboard/blogs?page=${n}`);
  }
</script>

<div class="flex justify-between items-center mb-4">
  <h1 class="text-2xl font-bold">Manage Blogs</h1>
  <button
    class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    on:click={() => goto('/dashboard/blogs/create')}
  >
    + Create Blog
  </button>
</div>

{#if error}
  <p class="text-red-600 mb-4">{error}</p>
{/if}

<table class="w-full border text-left text-sm">
  <thead>
    <tr class="bg-gray-100">
      <th class="p-3">Title</th>
      <th class="p-3">Slug</th>
      <th class="p-3">Published</th>
      <th class="p-3">Actions</th>
    </tr>
  </thead>
  <tbody>
    {#each blogs as blog}
      <tr
        class="border-b hover:bg-gray-50 cursor-pointer"
        on:click={() => openPreview(blog.slug)}
      >
        <td class="p-3">{blog.title}</td>
        <td class="p-3 text-gray-500">{blog.slug}</td>
        <td class="p-3">{blog.published ? '✅' : '❌'}</td>
        <td class="p-3 flex gap-2" on:click|stopPropagation>
          <button class="text-blue-600 hover:underline" on:click={() => editBlog(blog.id)}>Edit</button>
          <button class="text-red-600 hover:underline" on:click={() => deleteBlog(blog.id)}>Delete</button>
        </td>
      </tr>
    {/each}
  </tbody>
</table>

{#if totalPages > 1}
  <div class="flex gap-2 justify-center mt-6">
    {#each Array(totalPages) as _, i}
      <button
        on:click={() => goToPage(i + 1)}
        class="px-3 py-1 border rounded text-sm 
               {page === i + 1 ? 'bg-black text-white' : 'hover:bg-gray-100'}"
      >
        {i + 1}
      </button>
    {/each}
  </div>
{/if}
