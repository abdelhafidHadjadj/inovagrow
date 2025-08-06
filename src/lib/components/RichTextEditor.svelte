<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';

  export let value = '';
  export let placeholder = 'Write your article content…';
  export let readonly = false;

  const dispatch = createEventDispatcher();
  let editorContainer: HTMLDivElement;
  let quill: any;

  /** Toolbar factory (deep-copied to avoid Rollup bug) */
  const makeToolbar = () =>
    JSON.parse(
      JSON.stringify([
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ font: [] }],
        [{ size: ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ color: [] }, { background: [] }],
        [{ script: 'sub' }, { script: 'super' }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ indent: '-1' }, { indent: '+1' }],
        [{ direction: 'rtl' }],
        [{ align: [] }],
        ['blockquote', 'code-block'],
        ['link', 'image'],      // we keep “image” button
        ['clean']
      ])
    );

  /** Upload image to backend and insert <img> */
  async function imageHandler() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      const fd = new FormData();
      fd.append('image', file);

      const res = await fetch('/api/upload/image', { method: 'POST', headers: { Accept: 'application/json' }, body: fd, credentials: 'same-origin' });
      const { url } = await res.json();
      console.log(url);
      const absolute = url.startsWith('http')
      ? url                                           // déjà absolue
      : `${window.location.origin}${
        url.startsWith('/') ? '' : '/'
      }${url}`;  
      const range = quill.getSelection(true);
      quill.insertEmbed(range.index, 'image', absolute);
      quill.setSelection(range.index + 1);
    };
  }

  onMount(async () => {
    if (typeof window === 'undefined') return;
    const { default: Quill } = await import('quill');

    quill = new Quill(editorContainer, {
      theme: 'snow',
      readOnly: readonly,
      placeholder,
      modules: {
        toolbar: {
          container: makeToolbar(),
          handlers: { image: imageHandler }
        }
      }
    });

    if (value) quill.root.innerHTML = value;

    quill.on('text-change', () => {
      value = quill.root.innerHTML;
      dispatch('change', value);
    });

    return () => quill?.off('text-change');
  });

  $: if (quill && value !== quill.root.innerHTML)
    quill.root.innerHTML = value;
</script>

<svelte:head>
  <link rel="stylesheet" href="https://cdn.quilljs.com/1.3.6/quill.snow.css" />
</svelte:head>

<div class="quill-wrapper">
  <div class="editor-container blog-content" bind:this={editorContainer}></div>
</div>

<style>
  .quill-wrapper {
    border: 1px solid #e2e8f0;
    border-radius: .5rem;
    overflow: hidden;
  }
  :global(.ql-editor)    { min-height: 300px; font-size: 16px; line-height: 1.6; }
  :global(.ql-toolbar)   { border-bottom: 1px solid #e2e8f0; background: #f8fafc; }
  :global(.ql-container) { border: none; }
</style>
