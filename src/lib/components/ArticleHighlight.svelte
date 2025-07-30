<script>
  export let imageUrl = '';
  export let altText = 'Article image';
  export let title = '';
  export let description = '';
  export let link = '#';
  export let buttonText = 'Read Article';
</script>

<section class=" py-16">
  <div class="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center gap-10">
    
    <!-- Image -->
    <div class="flex-shrink-0 w-full md:w-1/2">
      <img
        src={imageUrl}
        alt={altText}
        class="rounded-xl shadow-lg w-full object-cover aspect-video"
      />
    </div>

    <!-- Content -->
    <div class="w-full md:w-1/2">
      <h2 class="text-2xl md:text-3xl font-semibold text-gray-900 leading-snug mb-4">
        {title}
      </h2>
      <p class="text-gray-600 mb-6">
        {description}
      </p>
      <a
        href={link}
        class="inline-flex items-center gap-2 px-5 py-2 border border-black rounded-full text-sm text-black hover:bg-black hover:text-white transition"
      >
        {buttonText} →
      </a>
    </div>

  </div>
</section>
