<script>
  import { locale } from '$lib/stores/locale';
  import "../../app.css"
  import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/sections/Footer.svelte';

  export let data;

  locale.set(data.lang); 
</script>

<Header/>
<slot />
<Footer/>


