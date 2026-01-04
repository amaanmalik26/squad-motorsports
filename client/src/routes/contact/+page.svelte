<script lang="ts">
    import { reveal } from "$lib/actions/reveal";
    import { API_URL } from '$lib/config';

    // Form State
    let formData = $state({
        name: "",
        email: "",
        phone: "",
        message: ""
    });

    let status = $state<'idle' | 'submitting' | 'success' | 'error'>('idle');

    // Handle Submit
    async function handleSubmit(e: Event) {
        e.preventDefault();
        status = 'submitting';

        try {
            const res = await fetch(API_URL + '/api/inquiries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!res.ok) throw new Error('Failed');

            status = 'success';
            // Reset form
            formData = { name: "", email: "", phone: "", message: "" };
        } catch (err) {
            status = 'error';
        }
    }
</script>

<svelte:head>
    <title>Contact Us | Squad Motorsports</title>
</svelte:head>

<div class="pt-52 pb-20 max-w-7xl mx-auto px-6">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        <div use:reveal>
            <h1 class="font-display text-6xl font-bold uppercase text-white mb-6">Start Your <br/> <span class="text-squad-red">Journey.</span></h1>
            <p class="text-gray-400 text-lg mb-12 max-w-md">
                Ready to own the asphalt? Our specialists are available 24/7 to assist with acquisition, financing, and global shipping.
            </p>

            <div class="space-y-8">
                <div>
                    <h3 class="font-display text-xl text-white uppercase mb-2">Showroom</h3>
                    <p class="text-gray-500">1024 Asphalt Ave, Suite 500<br/>Los Angeles, CA 90012</p>
                </div>
                <div>
                    <h3 class="font-display text-xl text-white uppercase mb-2">Direct Line</h3>
                    <p class="text-squad-red text-2xl font-bold font-display">+1 (555) 019-2834</p>
                </div>
            </div>
        </div>

        <div class="bg-squad-gray border border-white/5 p-8 md:p-12 relative overflow-hidden" use:reveal={{ delay: 200 }}>
            
            {#if status === 'success'}
                <div class="absolute inset-0 bg-squad-gray z-20 flex flex-col items-center justify-center text-center p-8">
                    <div class="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-4">
                        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <h3 class="font-display text-3xl text-white uppercase mb-2">Message Received</h3>
                    <p class="text-gray-400">A Squad specialist will contact you shortly.</p>
                    <button class="mt-8 text-squad-red underline uppercase tracking-widest text-xs" onclick={() => status = 'idle'}>Send Another</button>
                </div>
            {/if}

            <form onsubmit={handleSubmit} class="space-y-6 relative z-10">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-2">
                        <label for="name" class="text-xs font-bold uppercase tracking-widest text-gray-500">Full Name *</label>
                        <input type="text" id="name" required bind:value={formData.name} class="w-full bg-black/30 border border-white/10 p-3 text-white focus:border-squad-red focus:outline-none transition-colors" />
                    </div>
                    <div class="space-y-2">
                        <label for="phone" class="text-xs font-bold uppercase tracking-widest text-gray-500">Phone</label>
                        <input type="tel" id="phone" bind:value={formData.phone} class="w-full bg-black/30 border border-white/10 p-3 text-white focus:border-squad-red focus:outline-none transition-colors" />
                    </div>
                </div>

                <div class="space-y-2">
                    <label for="email" class="text-xs font-bold uppercase tracking-widest text-gray-500">Email Address *</label>
                    <input type="email" id="email" required bind:value={formData.email} class="w-full bg-black/30 border border-white/10 p-3 text-white focus:border-squad-red focus:outline-none transition-colors" />
                </div>

                <div class="space-y-2">
                    <label for="message" class="text-xs font-bold uppercase tracking-widest text-gray-500">Message *</label>
                    <textarea id="message" rows="4" required bind:value={formData.message} class="w-full bg-black/30 border border-white/10 p-3 text-white focus:border-squad-red focus:outline-none transition-colors"></textarea>
                </div>

                <button 
                    type="submit" 
                    disabled={status === 'submitting'}
                    class="w-full bg-squad-red text-white font-display font-bold uppercase tracking-widest py-4 hover:bg-white hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {status === 'submitting' ? 'Sending...' : 'Send Inquiry'}
                </button>
            </form>
        </div>

    </div>
</div>