<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import RichTextEditor from '$lib/components/RichTextEditor.svelte';
  import CategorySelect from '$lib/components/CategorySelect.svelte';
  import MultiSelect from '$lib/components/MultiSelect.svelte';
  import TagCreator from '$lib/components/TagCreator.svelte';
  let title = '';
  let desc = '';
  let html = '';
  let published = false;
  let saving = false;
  let error = '';

  let metaTitle = '';
  let metaDescription = '';
  let cover = '';

  let categories: { id: string; name: string }[] = [];
  let selectedCategories: string[] = [];
  let selectedTags: string[] = [];

  onMount(async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        categories = await res.json();
      } else {
        error = 'Failed to load categories';
      }
    } catch (err) {
      error = 'Network error while loading categories';
    }
  });

  async function save() {
    saving = true;
    error = '';

    const res = await fetch('/api/blogs', {
      method: 'POST',
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

    const data = await res.json();
    saving = false;

    if (res.ok) {
      goto(`/blog/${data.slug}`);
    } else {
      error = data.error || 'Failed to save blog post';
    }
  }

  async function uploadCover(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch('/api/upload/image', {
      method: 'POST',
      body: formData
    });

    const data = await res.json();
    if (res.ok) {
      cover = data.url;
    } else {
      error = data.error || 'Cover upload failed';
    }
  }
</script>

<h1 class="text-2xl font-bold mb-4">New blog post</h1>

<div class="space-y-6">
  <input class="w-full p-2 border rounded" bind:value={title} placeholder="Title" />
  <textarea class="w-full p-2 border rounded" rows="3" bind:value={desc} placeholder="Short description" />

  <div class="space-y-2">
    <label class="block font-semibold">Cover Image</label>
    <input type="file" accept="image/*" on:change={uploadCover} />
    {#if cover}
      <img src={cover} alt="Cover Preview" class="w-64 rounded border" />
    {/if}
  </div>

  <input class="w-full p-2 border rounded" bind:value={metaTitle} placeholder="Meta Title (SEO)" />
  <textarea class="w-full p-2 border rounded" rows="2" bind:value={metaDescription} placeholder="Meta Description (SEO)" />

  <div class="w-full flex justify-between gap-2">
    <div>
      <label class="block font-semibold mt-6">Categories</label>
      <MultiSelect
      bind:selected={selectedCategories}
      placeholder="Search categories..."
      endpoint="/api/categories"
      />
      
    </div>
    
    <div>
      <label class="block font-semibold mt-6">Tags</label>
      <TagCreator bind:tags={selectedTags} />
    </div>
  </div>

  <label class="flex items-center space-x-2">
    <input type="checkbox" bind:checked={published} />
    <span>Publish immediately</span>
  </label>

  <RichTextEditor bind:value={html} />

  {#if error}
    <p class="text-red-600 font-medium">{error}</p>
  {/if}

  <button class="px-4 py-2 bg-blue-600 text-white rounded" disabled={saving} on:click={save}>
    {saving ? 'Saving…' : 'Save'}
  </button>
</div>
