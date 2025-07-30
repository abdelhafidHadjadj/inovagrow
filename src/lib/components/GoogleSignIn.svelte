<script>
  export let redirect = '/api/auth/google/redirect';
  export let label    = 'Sign in with Google';
</script>

<a
  href={redirect}
  class="flex items-center gap-2 justify-center
         border border-gray-300 hover:bg-gray-100 hover:text-black
         px-4 py-4 rounded-full w-full text-sm transition"
>
  <img src="/google-icon.svg" alt="Google" class="h-5 w-5" />
  {label}
</a>
