<script lang="ts">
  export let data;
  const blog = data.blog;
</script>

<svelte:head>
  <title>{blog.meta_title || blog.title}</title>
  <meta name="description" content={blog.meta_description || blog.description} />
</svelte:head>

<section class="relative bg-[var(--color-light)] bg-grid mb-6 flex justify-center mt-12 mx-auto">
    <div class="p-4 w-full xl:w-7xl">

        <!-- Title -->
        <div class="relative bg-[var(--color-light)] flex flex-col py-16 text-black">
       <img
       src="/effect2.svg"
       alt="Background grid effect"
       class="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none z-0"
       />
       <div
       class="absolute inset-0 z-0 bg-gradient-to-b 
       from-[var(--color-light)] via-transparent to-[var(--color-light)]"
       ></div>
       <div class="flex flex-col justify-center items-center gap-6 z-1 text-center">
        <h1 class="text-3xl md:text-5xl font-bold mb-4">{blog.title}</h1>
    </div>
</div>

<!-- Cover image -->
  {#if blog.cover_image_url}
  <img
  src={blog.cover_image_url}
  alt="Cover Image"
      class="w-full inset-0 max-h-[450px] object-cover rounded-2xl mb-10 shadow-md"
      />
      {/if}

  <div class="grid grid-cols-1 md:grid-cols-6 gap-12">
      <!-- Sidebar left -->
        <aside class="md:col-span-1 space-y-6">
      {#if data.categories.length > 0}
      <div>
          <h2 class="font-semibold text-lg mb-2">Categories</h2>
          <div class="flex flex-wrap gap-2">
            {#each data.categories as cat}
            <a
                href={`/blog/category/${cat.slug}`}
                class="bg-gray-100 text-sm px-3 py-1 rounded-full hover:bg-gray-200"
              >
              {cat.name}
            </a>
            {/each}
          </div>
        </div>
      {/if}
      
      {#if data.tags.length > 0}
        <div>
          <h2 class="font-semibold text-lg mb-2">Tags</h2>
          <div class="flex flex-wrap gap-2">
              {#each data.tags as tag}
              <a
              href={`/blog/tag/${tag.slug}`}
              class="bg-gray-200 text-sm px-3 py-1 rounded-full hover:bg-gray-300"
              >
                {tag.name}
              </a>
            {/each}
        </div>
    </div>
      {/if}
    </aside>
    
    <!-- Main content -->
    <article class="blog-content md:col-span-4 prose prose-lg max-w-none prose-p:leading-relaxed prose-li:leading-relaxed">
      {#if blog.description_html}
        <p class="italic text-gray-600">{@html blog.description_html}</p>
      {/if}
      {@html blog.content_html}
    </article>

    <!-- Social icons -->
    <div class="md:col-span-1 flex md:flex-col items-start md:items-center gap-4 text-xl text-gray-500 pt-6">
        <a href="#" aria-label="LinkedIn" class="hover:text-black">
        <img src="/linkedin-icon.svg" alt="linkedin inovagrow">
    </a>
      <a href="#" aria-label="Instagram" class="hover:text-black">
          <img src="/instagram-icon.svg" alt="instagram inovagrow">  
        </a>
        <a href="#" aria-label="Facebook" class="hover:text-black">
            <img src="/facebook-icon.svg" alt="facebook inovagrow">  
      </a>
      <a href="#" aria-label="TikTok" class="hover:text-black">
          <img src="/tiktok-icon.svg" alt="tiktok inovagrow">
      </a>
    </div>
</div>
</div>
</section>
