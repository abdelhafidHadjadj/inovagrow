<script>
  import { locale } from '$lib/stores/locale';
  import { t } from '$lib/utils/i18n';
  import { get } from 'svelte/store';
	import Hero from '$lib/sections/Hero.svelte';
	import WhyChooseUs from '$lib/sections/WhyChooseUs.svelte';
	import AboutUs from '$lib/sections/AboutUs.svelte';
	import Services from '$lib/sections/Services.svelte';
	import Blog from '$lib/sections/Blog.svelte';
	import ProductHighlight from '$lib/sections/ProductHighlight.svelte';
	import Newsletter from '$lib/sections/Newsletter.svelte';
    export let data; 

  const lang = get(locale);

   let body = '';

  async function save() {
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body })
    });
    // TODO : gérer succès / erreur
  }

</script>

<main class="">
  <Hero/>
  <WhyChooseUs/>
  <AboutUs/>
  <Services/>
  <Blog posts={data.posts}/>
  <ProductHighlight/>
  <Newsletter/>
</main>


<style>

</style>