<script lang="ts">
    import BikeCard from "$lib/components/ui/BikeCard.svelte";
    import { reveal } from "$lib/actions/reveal"; // Import reveal animation
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();
    
    // Use the real data
    let bikes = $derived(data.bikes || []); 
</script>

<svelte:head>
    <title>Inventory | Squad Motorsports</title>
</svelte:head>

<div class="pt-24 pb-20 max-w-7xl mx-auto px-6">
    
    <div class="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-white/10 pb-8" use:reveal>
        <div>
            <h1 class="font-display text-6xl font-bold uppercase text-white mb-2">Inventory</h1>
            <p class="text-gray-400">Current Stock: <span class="text-white font-bold">{bikes.length} Vehicles</span></p>
        </div>
        
        <div class="flex items-center gap-3">
            <span class="text-xs uppercase font-bold text-gray-500">Sort By:</span>
            <select class="bg-squad-gray text-white border border-white/20 px-4 py-2 text-sm focus:outline-none focus:border-squad-red">
                <option>Price: High to Low</option>
                <option>Price: Low to High</option>
                <option>Newest Arrivals</option>
            </select>
        </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-12">
        
        <div class="hidden lg:block lg:col-span-1 space-y-8" use:reveal={{ delay: 100 }}>
            <div>
                <h3 class="font-display text-xl font-bold text-white uppercase mb-4">Manufacturer</h3>
                <div class="space-y-2">
                    {#each ['Ducati', 'BMW', 'Kawasaki', 'Yamaha', 'Aprilia'] as brand}
                        <label class="flex items-center gap-3 cursor-pointer group">
                            <input type="checkbox" class="w-4 h-4 rounded border-gray-600 bg-squad-gray text-squad-red focus:ring-offset-black focus:ring-squad-red" />
                            <span class="text-gray-400 group-hover:text-white transition-colors">{brand}</span>
                        </label>
                    {/each}
                </div>
            </div>

            <div>
                <h3 class="font-display text-xl font-bold text-white uppercase mb-4">Price Range</h3>
                <div class="space-y-2 text-sm text-gray-400">
                    <p class="hover:text-white cursor-pointer transition-colors">Under $15,000</p>
                    <p class="hover:text-white cursor-pointer transition-colors">$15,000 - $25,000</p>
                    <p class="hover:text-white cursor-pointer transition-colors">$25,000 - $40,000</p>
                    <p class="hover:text-white cursor-pointer transition-colors">Over $40,000</p>
                </div>
            </div>
        </div>

        <div class="lg:col-span-3">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                {#each bikes as bike, i}
                    <BikeCard {bike} index={i} />
                {/each}
            </div>
            
            {#if bikes.length === 0}
                <div class="py-20 text-center text-gray-500 border border-white/10 border-dashed">
                    No bikes found in the garage.
                </div>
            {/if}
        </div>

    </div>
</div>