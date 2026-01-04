<script lang="ts">
    import Button from "$lib/components/ui/Button.svelte";
    import BikeCard from "$lib/components/ui/BikeCard.svelte";
    import { reveal } from "$lib/actions/reveal";
    import type { PageData } from './$types';

    // 1. Receive real data from the loader
    let { data }: { data: PageData } = $props();
    
    // 2. Use the derived rune
    let featuredBikes = $derived(data.featuredBikes || []);
</script>

<svelte:head>
    <title>Squad Motorsports | Premium Superbikes</title>
</svelte:head>

<section class="relative w-full h-screen flex items-center overflow-hidden">
    
    <div class="absolute inset-0 z-0">
        <img 
            src="https://images.unsplash.com/photo-1609630875171-b1321377ee65?q=80&w=2070&auto=format&fit=crop" 
            alt="Ducati Panigale" 
            class="w-full h-full object-cover opacity-80"
        />
        <div class="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40"></div>
    </div>

    <div class="relative z-10 max-w-7xl mx-auto px-6 w-full pt-20">
        <div class="flex items-center gap-4 mb-6" use:reveal={{ delay: 0 }}>
            <div class="h-[2px] w-12 bg-squad-red"></div>
            <span class="text-squad-red font-bold tracking-[0.2em] uppercase text-sm">
                Official Dealership
            </span>
        </div>

        <h1 class="font-display font-bold text-6xl md:text-8xl lg:text-9xl leading-[0.9] text-white uppercase mb-8"
            use:reveal={{ delay: 200 }}>
            Dominate <br />
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-600">The Asphalt.</span>
        </h1>

        <p class="text-gray-400 text-lg md:text-xl max-w-xl font-light mb-10 border-l-2 border-white/20 pl-6"
           use:reveal={{ delay: 400 }}>
            Explore the world's most exclusive collection of high-performance superbikes. 
            Engineered for speed, designed for the obsessed.
        </p>

        <div class="flex flex-col sm:flex-row gap-6" use:reveal={{ delay: 600 }}>
            <Button href="/inventory" variant="primary">View Inventory</Button>
            <Button href="/contact" variant="outline">Book Consultation</Button>
        </div>

        <div class="hidden md:flex absolute bottom-12 right-6 gap-12 text-right" 
             use:reveal={{ delay: 800, y: 50 }}>
            <div>
                <p class="text-3xl font-display font-bold text-white">300+</p>
                <p class="text-xs uppercase tracking-widest text-gray-500">Bikes Sold</p>
            </div>
            <div>
                <p class="text-3xl font-display font-bold text-white">100%</p>
                <p class="text-xs uppercase tracking-widest text-gray-500">Verified</p>
            </div>
        </div>
    </div>
</section>

<section id="inventory" class="py-24 bg-squad-black relative z-10">
    <div class="max-w-7xl mx-auto px-6">
        
        <div class="flex flex-col md:flex-row justify-between items-end mb-16" use:reveal>
            <div>
                <h2 class="font-display text-5xl md:text-6xl font-bold text-white uppercase mb-2">New Arrivals</h2>
                <div class="h-1 w-24 bg-squad-red"></div>
            </div>
            <a href="/inventory" class="text-squad-silver hover:text-white uppercase tracking-widest text-sm mt-6 md:mt-0 transition-colors">
                View All Stock →
            </a>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {#each featuredBikes as bike, i}
                <BikeCard {bike} index={i} />
            {/each}
        </div>

    </div>
</section>