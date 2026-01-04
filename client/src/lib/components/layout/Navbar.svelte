<script>
    import Button from "$lib/components/ui/Button.svelte";
    
    // Simple state for mobile menu
    let isMenuOpen = $state(false);
</script>

<nav class="fixed top-0 left-0 w-full z-50 border-b border-white/10 bg-black/80 backdrop-blur-md transition-all duration-300">
    <div class="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
        
        <a href="/" class="flex flex-col leading-none group">
            <span class="font-display font-bold text-3xl tracking-widest text-white group-hover:text-squad-red transition-colors">
                SQUAD
            </span>
            <span class="font-sans text-[10px] tracking-[0.3em] text-gray-400 group-hover:text-white transition-colors">
                MOTORSPORTS
            </span>
        </a>

        <div class="hidden md:flex items-center gap-8">
            <a href="/inventory" class="text-sm font-medium uppercase tracking-widest text-gray-300 hover:text-white hover:text-glow transition-all">
                Inventory
            </a>
            <a href="/about" class="text-sm font-medium uppercase tracking-widest text-gray-300 hover:text-white hover:text-glow transition-all">
                The Garage
            </a>
            <Button href="/contact" variant="primary">Contact Us</Button>
        </div>

        <button class="md:hidden text-white" onclick={() => isMenuOpen = !isMenuOpen}>
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
    </div>

    {#if isMenuOpen}
    <div class="md:hidden bg-squad-black border-b border-white/10 p-6 flex flex-col gap-4">
        <a href="/inventory" class="text-xl font-display text-white">Inventory</a>
        <a href="/about" class="text-xl font-display text-white">The Garage</a>
        <a href="/contact" class="text-xl font-display text-squad-red">Contact Us</a>
    </div>
    {/if}
</nav>