<script>
	import "../app.css";
	import Navbar from "$lib/components/layout/Navbar.svelte";
	import Footer from "$lib/components/layout/Footer.svelte";
    import PageLoader from "$lib/components/ui/PageLoader.svelte"; // Import here

	let { children } = $props();
</script>

<div class="min-h-screen flex flex-col relative bg-squad-black text-white selection:bg-squad-red selection:text-white">
    
    <PageLoader />

    <div class="fixed inset-0 z-0 pointer-events-none opacity-[0.03]" 
         style="background-image: url('https://grainy-gradients.vercel.app/noise.svg');">
    </div>

	<Navbar />
	
	<main class="flex-grow relative z-10">
		{@render children()}
	</main>

	<Footer />
</div>