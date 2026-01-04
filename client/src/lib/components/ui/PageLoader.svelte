<script lang="ts">
    import { navigating } from '$app/stores';
    import { fade } from 'svelte/transition';

    // Only show when SvelteKit is actively navigating between pages
    let isNavigating = $derived($navigating);
</script>

{#if isNavigating}
    <div 
        transition:fade={{ duration: 200 }}
        class="fixed inset-0 z-[100] bg-squad-black/90 backdrop-blur-sm flex flex-col items-center justify-center"
    >
        <div class="loader"></div>
        
        <p class="mt-8 font-display text-xl tracking-widest text-white animate-pulse">
            LOADING<span class="text-squad-red">...</span>
        </p>
    </div>
{/if}

<style>
  /* User's Custom Loader (Adapted colors for Dark Mode) */
  .loader {
    width: 60px;
    height: 60px;
    border: 5px dotted #FFF; /* Changed to White for visibility */
    border-style: solid solid dotted dotted;
    border-radius: 50%;
    display: inline-block;
    position: relative;
    box-sizing: border-box;
    animation: rotation 2s linear infinite;
  }

  .loader::after {
    content: '';
    box-sizing: border-box;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    border: 4px dotted #DC2626; /* Changed to Squad Red (#DC2626) */
    border-style: solid solid dotted;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    animation: rotationBack 1s linear infinite;
    transform-origin: center center;
  }

  @keyframes rotation {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes rotationBack {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(-360deg); }
  }
</style>