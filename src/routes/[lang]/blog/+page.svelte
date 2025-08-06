<script>
  import { t } from '$lib/utils/i18n';
  import { locale } from '$lib/stores/locale';
  import { get } from 'svelte/store';
  import articlehighlight from '$lib/assets/images/articlehighlight.png';
  import BlogCard from '$lib/components/BlogCard.svelte';
  import ArticleHighlight from '$lib/components/ArticleHighlight.svelte';

  export let data;
  let posts = data.blogs;

  const lang = get(locale);

  const article = {
    imageUrl: articlehighlight,
    altText: 'Earth view from space',
    title: 'Unlocking the Potential of Cloud Computing: How Businesses Can Leverage the Latest Technologies for Scalability and Growth in 2024',
    description:
      'In today’s rapidly evolving digital landscape, cloud computing has emerged as a cornerstone of modern business strategies. This blog explores how companies of all sizes can harness the power of cloud technologies to scale…',
    link: '/blog/cloud-computing',
    buttonText: 'Read Article'
  };

  let page = 1;
  let loadingMore = false;

  async function loadMore() {
    loadingMore = true;
    page += 1;

    const res = await fetch(`/api/blogs?page=${page}`);
    const data = await res.json();
    posts = [...posts, ...data.blogs];
    loadingMore = false;
  }

</script>

<section class="relative bg-[var(--color-light)] bg-grid mb-6 mt-12">
  <div class="relative bg-[var(--color-light)] flex flex-col py-16 text-black">
    <img
      src="/effect2.svg"
      alt="Background grid effect"
      class="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none z-0"
    />
    <div class="absolute inset-0 z-0 bg-gradient-to-b from-[var(--color-light)] via-transparent to-[var(--color-light)]"></div>
    <div class="flex flex-col justify-center items-center gap-6 z-1 text-center">
      <h1 class="text-3xl md:text-5xl font-bold mb-4">{t(lang, 'blog.title')}</h1>
      <p class="text-sm md:text-base text-gray-700 leading-relaxed max-w-prose">{t(lang, 'services.description')}</p>
    </div>
  </div>

  <div class="relative z-10 max-w-7xl mx-auto flex flex-col items-center gap-12">
    <ArticleHighlight 
      imageUrl={article.imageUrl}
      altText={article.altText}
      title={article.title}
      description={article.description}
      link={article.link}
      buttonText={article.buttonText}
    />

    <div class="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto px-4">
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
     <button
       on:click={loadMore}
       class="inline-block border border-black px-6 py-2 rounded-full text-sm hover:bg-black hover:text-white transition disabled:opacity-50"
       disabled={loadingMore}
     >
       {loadingMore ? 'Loading…' : t(lang, 'common.load_more')}
     </button>
  </div>
  </div>
</section>
