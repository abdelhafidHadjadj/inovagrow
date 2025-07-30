<script>
  export let title;
  export let excerpt;
  export let image;
  export let category;
  export let time;
</script>

<article class=" rounded-xl overflow-hidden">
  <div class="relative">
    <img src={image} alt={title} class="w-full h-56 object-cover rounded-xl" />
    <span
      class="absolute top-2 right-2 text-xs text-white px-3 py-1 rounded-full backdrop-blur-md bg-white/10 border border-white/20"
    >
      {category}
    </span>
  </div>
  <div class="p-4">
    <div class="flex justify-between">
        <h3 class="font-semibold text-sm">{title}</h3>
        <p class="text-xs text-right text-gray-400">{time}</p>
    </div>
    <p class="text-gray-500 text-xs mt-1">{excerpt}</p>
  </div>
</article>
