<script lang="ts">
  import type { Snippet } from 'svelte';

  // 1. Define allowed variants
  type ButtonVariant = 'primary' | 'outline';

  interface Props {
    href?: string | null;
    variant?: ButtonVariant; 
    children: Snippet;
  }

  let { 
    href = null, 
    variant = 'primary', 
    children 
  }: Props = $props();

  const base = "relative inline-flex items-center justify-center px-8 py-3 font-display font-bold tracking-widest uppercase transition-all duration-300 transform skew-x-[-10deg] group overflow-hidden cursor-pointer";
  
  // 2. Define the lookup object with strict typing
  const variants: Record<ButtonVariant, string> = {
    primary: "bg-squad-red text-white hover:bg-white hover:text-black border border-transparent",
    outline: "bg-transparent text-white border border-white hover:bg-white hover:text-black"
  };
</script>

{#if href}
  <a {href} class="{base} {variants[variant]}">
    <span class="skew-x-[10deg]">{@render children()}</span>
    <div class="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10"></div>
  </a>
{:else}
  <button class="{base} {variants[variant]}">
    <span class="skew-x-[10deg]">{@render children()}</span>
  </button>
{/if}

<style>
  @keyframes shimmer { 100% { transform: translateX(100%); } }
</style>