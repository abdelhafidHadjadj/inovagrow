
<script>
  import { goto } from '$app/navigation';
  import bg from '$lib/assets/images/bg3.png';
  import { t } from '$lib/utils/i18n';
  import { locale } from '$lib/stores/locale';
  import { get } from 'svelte/store';
  import GoogleSignIn from '$lib/components/GoogleSignIn.svelte';

  const lang = get(locale);
  let firstName = '';
  let lastName = '';
  let email = '';
  let password = '';
  let error = '';
  let loading = false;
  let successMessage = '';


  async function register() {
    loading = true;
    error = '';

    const fullName = `${firstName} ${lastName}`;

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: fullName, email, password })
    });

    const data = await res.json();

    if (res.ok) {
      successMessage = `Account created! Please check your email ${email} to verify your account.`;
      // Ne redirige pas, l'utilisateur reste sur la page
    } else {
      error = data.message || 'Registration failed.';
    }

    loading = false;
}

</script>

<div class="pt-20 sm:pt-6 md:px-16 flex justify-center gap-2 items-center min-h-screen text-white bg-[var(--color-dark)]">
  <!-- logo -->
  <div class="absolute top-4 left-4 w-fit">
    <img src="/favicon.svg" alt="logo" class="h-10" />
  </div>


  <!-- form -->
  <div class="sm:w-lg bg-[var(--color-dark)] p-4 flex flex-col justify-center items-center space-y-8">
    <div class="md:p-8 text-white">
      <h2 class="text-2xl font-semibold mb-4 text-center">
        Empowering your business with innovation in a connected digital world.
      </h2>
    </div>
  
    {#if successMessage}
      <!-- ✅ Message après inscription -->
      <div class="text-center p-8">
        <h1 class="text-2xl font-bold text-green-400 mb-4">Account Created</h1>
        <p class="text-white">{successMessage}</p>
      </div>
    {:else}
      <!-- 🧾 Formulaire d'inscription -->
      <div class="w-full flex flex-col items-center px-2">
        <h1 class="text-3xl font-bold mb-6">Create an account</h1>
        <p class="text-gray-400 text-sm text-center mb-6">
          Join professionals worldwide and start your journey today.
        </p>
      
        <form on:submit|preventDefault={register} class="space-y-4 w-full"> 
          <div class="grid md:grid-cols-2 gap-4"> 
            <div> 
              <label class="block text-sm mb-1">First Name</label>
               <input type="text" bind:value={firstName} required class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" /> 
            </div> 
            <div> 
              <label class="block text-sm mb-1">Last Name</label> 
              <input type="text" bind:value={lastName} required class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" /> 
            </div> 
          </div> 
          <div> 
            <label class="block text-sm mb-1">Email</label> 
            <input type="email" bind:value={email} required class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" /> 
          </div> 
          <div> 
            <label class="block text-sm mb-1">Password</label> 
            <input type="password" bind:value={password} required class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
           </div> 
           {#if error} 
           <p class="text-red-500 text-sm">{error}</p> 
           {/if} 
           <button type="submit" class="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-full text-white font-semibold transition" disabled={loading} > 
            {loading ? 'Creating account…' : 'SIGN UP'} 
          </button> <div class="mt-4 w-full"> 
            <GoogleSignIn label="Continue with Google" /> 
          </div> 
          <div class="flex justify-between text-sm text-gray-400 mt-6">
             <a href={`/${lang}/login`} class="hover:underline">Already have an account?</a> 
            </div> 
          </form>

      </div>
    {/if}
  </div>


  <!-- image with gradient border -->
  <div class="hidden xl:block overflow-hidden p-[3px] w-1/2 h-2/3 rounded-3xl bg-gradient-to-r from-[var(--color-primary-from)] via-[var(--color-primary-via)] to-[var(--color-primary-to)]">
    <img src={bg} alt="Background" class="object-cover rounded-3xl" />
  </div>
</div>
