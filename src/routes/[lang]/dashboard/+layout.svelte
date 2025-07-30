<script>
  import { locale } from '$lib/stores/locale';
  import "../../../app.css"


  export let data;

  locale.set(data.lang); 
</script>

<slot />


