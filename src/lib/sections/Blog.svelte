<script lang="ts">
  import { t } from '$lib/utils/i18n';
  import { locale } from '$lib/stores/locale';
  import { get } from 'svelte/store';
  import BlogCard from '$lib/components/BlogCard.svelte';

  export let posts = [];          // ← vient de la page
  const lang = get(locale);
</script>

<section class="py-20 px-6 text-black">
  <div class="max-w-6xl mx-auto text-center mb-12">
    <h2 class="text-3xl md:text-4xl font-bold">
      {t(lang, 'blog.title')}
    </h2>
  </div>

  <div class="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
    {#each posts as post}
      <BlogCard
        title={post.title}
        excerpt={post.excerpt}
        image={post.image}
        category={post.category}
        time={post.time}
        slug={post.slug}            
      />
    {/each}
  </div>

  <div class="text-center mt-10">
    <a
      href="/blog"
      class="inline-block border border-black px-6 py-2 rounded-full text-sm hover:bg-black hover:text-white transition"
    >
      {t(lang, 'common.view_more')}
    </a>
  </div>
</section>
