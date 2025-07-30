<script>
  export let title;
  export let description;
  export let image;
  export let icon; // chemin vers un SVG dans /assets/icons
  export let link = '#';
</script>

<a
  href={link}
  class="relative group bg-gradient-to-r from-[var(--color-primary-from)] via-[var(--color-primary-via)] to-[var(--color-primary-to)]
         p-[2px] rounded-full transition-transform hover:scale-[1.015]"
>
  <div class="relative rounded-full overflow-hidden bg-black aspect-[2/1.2]">
    <!-- Background Image -->
    <img
      src={image}
      alt={title}
      class="w-full h-full object-cover opacity-40"
    />

    <!-- Default content -->
    <div
      class="absolute inset-0 flex flex-col justify-center items-center text-center px-6
             transition-opacity duration-300 group-hover:opacity-0"
    >
      <img src={icon} alt="" class="w-6 h-6 mb-2" />
      <h3 class="text-base font-semibold text-white">{title}</h3>
    </div>

    <!-- Hover content -->
    <div
      class="absolute inset-0 flex flex-col justify-center items-center text-center px-6 opacity-0
             group-hover:opacity-100 transition-opacity duration-300"
    >
      <h3 class="text-base font-semibold mb-2 text-white">{title}</h3>
      <p class="text-sm text-gray-300 leading-snug">{description}</p>
    </div>
  </div>
</a>
