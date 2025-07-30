<script>
  import { t } from '$lib/utils/i18n';
  import { locale } from '$lib/stores/locale';
  import { get } from 'svelte/store';
  import blog1 from '$lib/assets/images/blog1.png';
  import blog2 from '$lib/assets/images/blog2.png';
  import blog3 from '$lib/assets/images/blog3.png';
  import BlogCard from '$lib/components/BlogCard.svelte';

  const lang = get(locale);
  const posts = [
    {
      title: 'blog title',
      excerpt: 'Lorem ipsum dolor sit amet consectetur. Leo tincidunt scelerisque quis scelerisque ultricies.',
      image: blog1,
      category: 'Technology',
      time: '1h'
    },
    {
      title: 'blog title',
      excerpt: 'Lorem ipsum dolor sit amet consectetur. Leo tincidunt scelerisque quis scelerisque ultricies.',
      image: blog2,
      category: 'Marketing',
      time: '1h'
    },
    {
      title: 'blog title',
      excerpt: 'Lorem ipsum dolor sit amet consectetur. Leo tincidunt scelerisque quis scelerisque ultricies.',
      image: blog3,
      category: 'Technology',
      time: '1h'
    }
  ];
</script>

<section class=" py-20 px-6 text-black">
  <div class="max-w-6xl mx-auto text-center mb-12">
    <h2 class="text-3xl md:text-4xl font-bold">{t(lang, 'blog.title')}</h2>
  </div>

  <div class="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
    {#each posts as post}
      <BlogCard
        title={post.title}
        excerpt={post.excerpt}
        image={post.image}
        category={post.category}
        time={post.time}
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
