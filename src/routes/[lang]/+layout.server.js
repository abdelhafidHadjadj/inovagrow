/** @type {import('./$types').LayoutServerLoad} */
export async function load({ locals, params }) {
  return {
    lang : params.lang || 'en',     
    user : locals.user || null      
  };
}
