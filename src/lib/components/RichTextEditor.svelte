<script>
  import { onMount } from 'svelte';

  /* --------- props --------- */
  export let title = '';
  export let html  = '';

  /* --------- refs & états --------- */
  let editable, imageInput, preview;
  let mode = 'rich';
  let markdown = '';
  let savedRange = null;

  /* --------- sélection --------- */
  function saveSelection() {
    const sel = window.getSelection();
    if (sel && sel.rangeCount && editable && editable.contains(sel.anchorNode)) {
      savedRange = sel.getRangeAt(0).cloneRange();
    }
  }

  function restoreSelection() {
    if (!editable) return;
    
    const sel = window.getSelection();
    if (!savedRange || !sel) {
      // Placer le curseur à la fin si pas de sélection sauvée
      const range = document.createRange();
      range.selectNodeContents(editable);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
      return;
    }
    
    try {
      sel.removeAllRanges();
      sel.addRange(savedRange);
    } catch (e) {
      console.warn('Erreur restauration sélection:', e);
      // Fallback: placer à la fin
      const range = document.createRange();
      range.selectNodeContents(editable);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }

  /* --------- commandes --------- */
  const cmd = (command, value = null) => {
    if (!editable) return;
    editable.focus();
    restoreSelection();
    document.execCommand(command, false, value);
    update();
  };
  
  const formatBlock = (tag) => cmd('formatBlock', tag);
  const applyPresetSize = (v) => cmd('fontSize', v);

  /* --------- rendu markdown / preview --------- */
  function update() {
    if (!editable) return;
    html = editable.innerHTML;
    markdown = htmlToMarkdown(html);
    if (preview) preview.innerHTML = html;
  }
  
  const htmlToMarkdown = (html) =>
    html
      .replace(/<b>(.*?)<\/b>/g, '**$1**')
      .replace(/<i>(.*?)<\/i>/g, '_$1_')
      .replace(/<u>(.*?)<\/u>/g, '__$1__')
      .replace(/<h1>(.*?)<\/h1>/g, '# $1\n')
      .replace(/<h2>(.*?)<\/h2>/g, '## $1\n')
      .replace(/<ul>(.*?)<\/ul>/gs, (_, li) =>
        li.replace(/<li>(.*?)<\/li>/g, '- $1\n'))
      .replace(/<ol>(.*?)<\/ol>/gs, (_, li) =>
        li.replace(/<li>(.*?)<\/li>/g, (m, t) => `1. ${t}\n`))
      .replace(/<[^>]*>/g, '');

  /* --------- insertion image --------- */
  function openFileDialog() {
    saveSelection();
    imageInput.click();
  }

  // Convertir image en base64 (solution de fallback si pas d'API)
  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function insertImageFromFile(file) {
    try {
      console.log('📁 Insertion image:', file.name);
      
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner un fichier image');
        return;
      }

      // Essayer d'abord l'upload vers API
      let imageUrl;
      try {
        const fd = new FormData();
        fd.append('file', file);
        
        const res = await fetch('/api/upload', { 
          method: 'POST', 
          body: fd 
        });
        
        if (res.ok) {
          const data = await res.json();
          imageUrl = data.url;
          console.log('✅ Upload API réussi:', imageUrl);
        } else {
          throw new Error('API upload failed');
        }
      } catch (apiError) {
        console.warn('⚠️ API upload échoué, utilisation base64:', apiError);
        // Fallback: convertir en base64
        imageUrl = await fileToBase64(file);
      }

      // Insérer l'image
      if (imageUrl) {
        editable.focus();
        restoreSelection();
        
        // Méthode alternative si execCommand ne marche pas
        try {
          document.execCommand('insertImage', false, imageUrl);
        } catch (e) {
          console.warn('execCommand failed, using manual insertion');
          insertImageManually(imageUrl);
        }
        
        update();
        console.log('✅ Image insérée');
      }
    } catch (error) {
      console.error('❌ Erreur insertion image:', error);
      alert('Erreur lors de l\'insertion de l\'image');
    }
  }

  // Insertion manuelle si execCommand échoue
  function insertImageManually(src) {
    const sel = window.getSelection();
    if (sel && sel.rangeCount) {
      const range = sel.getRangeAt(0);
      const img = document.createElement('img');
      img.src = src;
      img.style.maxWidth = '100%';
      img.style.height = 'auto';
      
      range.deleteContents();
      range.insertNode(img);
      
      // Placer le curseur après l'image
      range.setStartAfter(img);
      range.setEndAfter(img);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }

  const handleInputFile = () => {
    console.log('📁 File input changed');
    if (imageInput?.files?.length) {
      insertImageFromFile(imageInput.files[0]);
      // Reset input pour permettre la même image
      imageInput.value = '';
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('📁 Drop event');
    
    if (e.dataTransfer.files.length) {
      insertImageFromFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  async function handlePaste(e) {
    console.log('📋 Paste event');
    const items = e.clipboardData?.items;
    if (!items) return;
    
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        e.preventDefault();
        console.log('📋 Image détectée dans le presse-papier');
        const file = item.getAsFile();
        if (file) {
          await insertImageFromFile(file);
          break;
        }
      }
    }
  }

  /* --------- helpers taille / style --------- */
  function resizeSelectedImage(prop, value) {
    const sel = window.getSelection();
    if (!sel || !sel.anchorNode) return;
    
    let node = sel.anchorNode;
    if (node.nodeType === Node.TEXT_NODE) {
      node = node.parentElement;
    }
    
    if (node?.tagName === 'IMG') {
      node.style[prop] = value;
      update();
    } else {
      alert('Veuillez sélectionner une image');
    }
  }

  function applyCustomTextSize(v) {
    if (!v) return;
    restoreSelection();
    if (!savedRange) return;
    
    const span = document.createElement('span');
    span.style.fontSize = v;
    
    try {
      span.appendChild(savedRange.extractContents());
      savedRange.insertNode(span);
      update();
    } catch (e) {
      console.warn('Erreur application taille:', e);
    }
  }

  /* --------- debug --------- */
  const extractImages = (htmlContent) =>
    [...htmlContent.matchAll(/<img[^>]+src=["']([^"']+)["']/g)].map((x) => x[1]);
    
  const logPayload = () =>
    console.log('📦 Payload:', { 
      title, 
      body_html: html, 
      images: extractImages(html) 
    });

  /* --------- mount --------- */
  onMount(() => {
    if (editable) {
      editable.innerHTML = html;
      update();
      editable.focus();
      setTimeout(saveSelection, 100);
    }
  });
</script>

<!-- ------------------ UI ------------------ -->
<div class="space-y-4">

  <!-- Titre -->
  <input class="w-full text-2xl font-bold border p-2 rounded"
         placeholder="Titre du blog" bind:value={title} />

  <!-- Toolbar -->
  {#if mode === 'rich'}
  <div class="flex flex-wrap gap-2 bg-gray-100 dark:bg-gray-800 p-2 rounded border items-center">
    <button on:click={() => cmd('bold')} class="px-2 py-1 rounded hover:bg-gray-200">🅑</button>
    <button on:click={() => cmd('italic')} class="px-2 py-1 rounded hover:bg-gray-200">🅘</button>
    <button on:click={() => cmd('underline')} class="px-2 py-1 rounded hover:bg-gray-200">🅤</button>
    <button on:click={() => cmd('insertUnorderedList')} class="px-2 py-1 rounded hover:bg-gray-200">•</button>
    <button on:click={() => cmd('insertOrderedList')} class="px-2 py-1 rounded hover:bg-gray-200">1.</button>

    <select on:change={(e) => formatBlock(e.target.value)} class="px-2 py-1 text-sm rounded">
      <option value="p">Paragraphe</option>
      <option value="h1">Titre 1</option>
      <option value="h2">Titre 2</option>
      <option value="h3">Titre 3</option>
    </select>

    <button on:click={() => {
      const url = prompt('URL de l\'image') || '';
      if (url) cmd('insertImage', url);
    }} class="px-2 py-1 rounded hover:bg-gray-200">🖼️ URL</button>

    <button on:click={openFileDialog} class="px-2 py-1 rounded hover:bg-gray-200 bg-blue-100">
      📁 Upload
    </button>
    <input type="file" accept="image/*" class="hidden" bind:this={imageInput} on:change={handleInputFile} />

    <!-- couleurs / taille -->
    <input type="color" on:input={(e)=>cmd('foreColor',e.target.value)} class="w-8 h-8 rounded"/>
    <input type="color" on:input={(e)=>cmd('hiliteColor',e.target.value)} class="w-8 h-8 rounded"/>

    <select on:change={(e)=>applyPresetSize(e.target.value)} class="px-2 py-1 text-sm rounded">
      <option value="3">Taille</option>
      <option value="1">Très petit</option>
      <option value="2">Petit</option>
      <option value="4">Grand</option>
      <option value="5">Très grand</option>
      <option value="6">Énorme</option>
    </select>

    <input type="text" placeholder="20px" class="w-20 text-sm border rounded px-1"
           on:change={(e)=>{applyCustomTextSize(e.target.value); e.target.value = ''}}/>

    <input type="text" placeholder="Largeur" class="w-20 text-sm border rounded px-1"
           on:change={(e)=>{resizeSelectedImage('width', e.target.value); e.target.value = ''}}/>
    <input type="text" placeholder="Hauteur" class="w-20 text-sm border rounded px-1"
           on:change={(e)=>{resizeSelectedImage('height', e.target.value); e.target.value = ''}}/>
  </div>
  {/if}

  <!-- Éditeur / HTML / MD -->
  {#if mode === 'rich'}
    <div bind:this={editable} contenteditable
         role="textbox" tabindex="0" aria-multiline="true"
         on:input={update} 
         on:mouseup={saveSelection} 
         on:keyup={saveSelection}
         on:focus={saveSelection} 
         on:paste={handlePaste}
         on:drop={handleDrop} 
         on:dragover={handleDragOver}
         class="min-h-60 p-4 border-2 border-dashed border-gray-300 rounded prose max-w-none dark:prose-invert bg-white dark:bg-gray-900 focus:border-blue-500 focus:outline-none">
      <p>Tapez votre contenu ici... Vous pouvez coller, glisser-déposer ou uploader des images.</p>
    </div>
  {:else if mode === 'html'}
    <textarea bind:value={html} on:input={update}
              class="w-full min-h-60 p-2 border rounded font-mono text-sm"></textarea>
  {:else}
    <textarea bind:value={markdown}
              class="w-full min-h-60 p-2 border rounded font-mono text-sm"></textarea>
  {/if}

  <!-- Switcher -->
  <div class="flex flex-wrap gap-2 mt-2">
    <button on:click={() => mode='rich'} 
            class="px-3 py-1 rounded {mode === 'rich' ? 'bg-blue-500 text-white' : 'bg-gray-200'}">
      🖋️ Éditeur
    </button>
    <button on:click={() => mode='html'} 
            class="px-3 py-1 rounded {mode === 'html' ? 'bg-blue-500 text-white' : 'bg-gray-200'}">
      🔧 HTML
    </button>
    <button on:click={() => mode='markdown'} 
            class="px-3 py-1 rounded {mode === 'markdown' ? 'bg-blue-500 text-white' : 'bg-gray-200'}">
      📄 Markdown
    </button>
    <button on:click={logPayload} class="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
      📦 Debug
    </button>
  </div>

  <!-- Instructions -->
  <div class="text-sm text-gray-600 bg-gray-50 p-3 rounded">
    <strong>💡 Comment insérer des images :</strong>
    <ul class="list-disc ml-4 mt-1">
      <li>Cliquez sur "📁 Upload" pour sélectionner un fichier</li>
      <li>Glissez-déposez une image directement dans l'éditeur</li>
      <li>Copiez/collez une image (Ctrl+V)</li>
      <li>Utilisez "🖼️ URL" pour une image en ligne</li>
    </ul>
  </div>

  <!-- Preview -->
  <div class="border-t pt-4 mt-4">
    <h3 class="font-semibold mb-2">📖 Aperçu</h3>
    <div bind:this={preview}
         class="prose dark:prose-invert max-w-none p-4 border rounded bg-gray-50 dark:bg-gray-800 min-h-32"></div>
  </div>
</div>