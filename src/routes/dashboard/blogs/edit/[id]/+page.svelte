<script lang="ts">
  import { goto } from '$app/navigation';
  import RichTextEditor   from '$lib/components/RichTextEditor.svelte';
  import CategorySelect   from '$lib/components/CategorySelect.svelte';
  import TagInput         from '$lib/components/TagCreator.svelte';

  export let data;
  const blog = data.blog;

  /* champs principaux */
  let title           = blog.title;
  let desc            = blog.description;
  let html            = blog.content_html;
  let published       = blog.published;
  let cover           = blog.cover_image_url;
  let metaTitle       = blog.meta_title;
  let metaDescription = blog.meta_description;

  /* catégories & tags */
  let categories           = data.allCategories;       // [{id,name}, …]
  let selectedCategories   = [...data.selectedCategories]; // UUID[]
  let selectedTags         = [...data.selectedTags];   // string[]

  let saving = false;
  let error  = '';

  async function save() {
    saving = true; error = '';

    const res = await fetch(`/api/blogs/${blog.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        description: desc,
        cover_image_url: cover,
        meta_title: metaTitle || title,
        meta_description: metaDescription || desc,
        content_html: html,
        published,
        categories: selectedCategories,
        tags: selectedTags
      })
    });

    const json = await res.json();
    saving = false;

    if (res.ok) goto(`/blog/${blog.slug}`);
    else error = json.error || 'Failed to update blog post';
  }

  async function uploadCover(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const fd = new FormData(); fd.append('image', file);
    const res = await fetch('/api/upload/image', { method:'POST', body:fd });
    const json = await res.json();
    cover = res.ok ? json.url : cover;               // conserve l’ancienne si KO
    if (!res.ok) error = json.error || 'Cover upload failed';
  }
</script>

<h1 class="text-2xl font-bold mb-6">Edit Blog Post</h1>

<div class="space-y-6">
  <input class="w-full p-2 border rounded" bind:value={title} placeholder="Title" />

  <textarea class="w-full p-2 border rounded" rows="3" bind:value={desc} placeholder="Short description" />

  <!-- Cover -->
  <div class="space-y-2">
    <label class="block font-semibold">Cover Image</label>
    <input type="file" accept="image/*" on:change={uploadCover} />
    {#if cover}
      <img src={cover} alt="Cover" class="w-64 rounded border" />
    {/if}
  </div>

  <!-- SEO -->
  <input class="w-full p-2 border rounded" bind:value={metaTitle} placeholder="Meta Title (SEO)" />
  <textarea class="w-full p-2 border rounded" rows="2" bind:value={metaDescription} placeholder="Meta Description (SEO)" />

  <!-- Catégories -->
  <CategorySelect {categories} bind:selected={selectedCategories} placeholder="Search categories…" />

  <!-- Tags -->
  <TagInput bind:tags={selectedTags} />

  <!-- Published -->
  <label class="flex items-center space-x-2">
    <input type="checkbox" bind:checked={published} />
    <span>Publish immediately</span>
  </label>

  <RichTextEditor bind:value={html} />

  {#if error}<p class="text-red-600">{error}</p>{/if}

  <button class="px-4 py-2 bg-blue-600 text-white rounded" disabled={saving} on:click={save}>
    {saving ? 'Saving…' : 'Save'}
  </button>
</div>
