<script lang="ts">
    import { goto } from '$app/navigation';
    import { API_URL } from '$lib/config';

    let email = $state("");
    let password = $state("");
    let error = $state("");
    let loading = $state(false);

    async function handleLogin(e: Event) {
        e.preventDefault();
        loading = true;
        error = "";

        try {
            const res = await fetch(API_URL + '/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Login failed');

            // Save the token to browser storage
            localStorage.setItem('squad_token', data.token);
            
            // Redirect to Dashboard
            goto('/admin/dashboard');
        } catch (err: any) {
            error = err.message;
        } finally {
            loading = false;
        }
    }
</script>

<div class="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
    <div class="absolute inset-0 opacity-20" 
         style="background-image: url('https://grainy-gradients.vercel.app/noise.svg');">
    </div>

    <div class="relative z-10 w-full max-w-md bg-squad-gray border border-white/10 p-10 shadow-2xl">
        <div class="text-center mb-8">
            <h1 class="font-display text-4xl font-bold text-white uppercase tracking-widest">
                System <span class="text-squad-red">Access</span>
            </h1>
            <p class="text-gray-500 text-xs uppercase tracking-[0.3em] mt-2">Authorized Personnel Only</p>
        </div>

        {#if error}
            <div class="bg-red-500/20 border border-red-500 text-red-500 p-3 text-sm text-center mb-6">
                {error}
            </div>
        {/if}

        <form onsubmit={handleLogin} class="space-y-6">
            <div>
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Identifier</label>
                <input type="email" bind:value={email} required class="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-squad-red focus:outline-none transition-colors" />
            </div>
            
            <div>
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Passkey</label>
                <input type="password" bind:value={password} required class="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-squad-red focus:outline-none transition-colors" />
            </div>

            <button 
                type="submit" 
                disabled={loading}
                class="w-full bg-squad-red text-white font-display font-bold uppercase tracking-widest py-4 hover:bg-white hover:text-black transition-all disabled:opacity-50"
            >
                {loading ? 'Authenticating...' : 'Enter Dashboard'}
            </button>
        </form>
    </div>
</div>