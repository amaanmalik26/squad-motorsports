<script lang="ts">
    import Button from "$lib/components/ui/Button.svelte";
    import { reveal } from "$lib/actions/reveal";
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();
    
    // We expect SINGULAR 'bike' here
    let bike = $derived(data.bike);
    // Use the first image from the array, or a fallback
    let activeImage = $state(data.bike.images?.[0] || "");
</script>

<svelte:head>
    <title>{bike.name} | Squad Motorsports</title>
</svelte:head>

<div class="pt-24 pb-20 max-w-7xl mx-auto px-6">
    <div class="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-500 mb-8">
        <a href="/" class="hover:text-white">Home</a> / 
        <a href="/inventory" class="hover:text-white">Inventory</a> / 
        <span class="text-squad-red">{bike.name}</span>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div class="lg:col-span-8">
            <div class="relative aspect-[4/3] bg-squad-gray border border-white/10 overflow-hidden mb-4 group" use:reveal>
                <img src={activeImage} alt={bike.name} class="w-full h-full object-cover transition-all duration-500" />
            </div>
            
            <div class="mt-12" use:reveal={{ delay: 200 }}>
                <h3 class="font-display text-3xl font-bold uppercase mb-6 text-white">Vehicle Overview</h3>
                <p class="text-gray-400 leading-relaxed mb-12 font-light text-lg">{bike.description}</p>
            </div>
        </div>

        <div class="lg:col-span-4">
            <div class="sticky top-32 bg-squad-gray border border-white/10 p-8" use:reveal={{ delay: 400 }}>
                <p class="text-squad-red font-bold tracking-widest uppercase text-xs mb-2">{bike.brand}</p>
                <h1 class="font-display text-5xl font-bold uppercase text-white leading-none mb-6">{bike.name}</h1>
                
                <div class="flex items-baseline gap-2 mb-8">
                    <span class="text-4xl font-bold text-white tracking-tight">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(bike.price)}
                    </span>
                    <span class="text-gray-500 text-sm font-medium">PKR</span>
                </div>

                <div class="flex flex-col gap-4 mb-8">
                    <Button variant="primary" href="/contact">Request Information</Button>
                </div>
            </div>
        </div>
    </div>
</div>