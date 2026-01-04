<script lang="ts">
    import type { Bike } from '$lib/types';
    import { reveal } from '$lib/actions/reveal';

    let { bike, index = 0 }: { bike: Bike; index?: number } = $props();

    // Format price to currency (e.g., $25,000)
    const formattedPrice = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
    }).format(bike.price);
</script>

<a href="/inventory/{bike.id}" 
   class="group block bg-squad-gray border border-white/5 overflow-hidden relative"
   use:reveal={{ delay: index * 100 }} 
>
    <div class="h-[280px] overflow-hidden relative">
        {#if bike.status !== 'available'}
            <div class="absolute top-4 right-4 z-20 bg-squad-red text-white text-xs font-bold px-3 py-1 uppercase tracking-widest skew-x-[-10deg]">
                {bike.status}
            </div>
        {/if}

        <img 
            src={bike.images[0]}
            alt={bike.name} 
            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:opacity-80"
        />
        
        <div class="absolute inset-0 bg-gradient-to-t from-squad-gray via-transparent to-transparent opacity-80"></div>
    </div>

    <div class="p-6 relative z-10 -mt-12">
        <p class="text-squad-red text-xs font-bold tracking-widest uppercase mb-1">{bike.brand}</p>
        <h3 class="font-display text-3xl font-bold text-white uppercase leading-none mb-4 group-hover:text-squad-red transition-colors">
            {bike.name}
        </h3>

        <div class="flex items-center gap-4 text-xs font-medium text-gray-400 border-t border-white/10 pt-4 mb-4">
            <div class="flex items-center gap-1">
                <span class="text-white">ENGINE:</span> {bike.engine}
            </div>
            <div class="w-[1px] h-3 bg-white/20"></div>
            <div class="flex items-center gap-1">
                <span class="text-white">POWER:</span> {bike.power}
            </div>
        </div>

        <div class="flex justify-between items-end">
            <span class="font-display text-2xl text-white tracking-wide">{formattedPrice}</span>
            <span class="text-xs text-white border-b border-squad-red pb-0.5 group-hover:text-squad-red transition-colors uppercase tracking-widest">
                View Details
            </span>
        </div>
    </div>
</a>