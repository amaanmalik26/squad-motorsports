<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { fade, scale, slide } from 'svelte/transition';
    import { flip } from 'svelte/animate';
    import type { Bike } from '$lib/types';
    import { API_URL } from '$lib/config'; // Import API_URL

    // State
    let activeTab = $state('inventory');
    let inquiries: any[] = $state([]);
    let bikes: Bike[] = $state([]);
    let isLoading = $state(true);
    
    // Modal States
    let showModal = $state(false); // Add/Edit Modal
    let showDeleteModal = $state(false); // New Delete Confirmation Modal
    
    // Loading States
    let isUploading = $state(false);
    let isDeleting = $state(false);

    // Editing State
    let isEditing = $state(false);
    let editingId = $state(0);
    let deleteId = $state(0); // Track which bike to delete

    // Form Data
    let formBike = $state({
        brand: 'Ducati',
        name: '',
        price: 0,
        year: 2026,
        engine: '',
        power: '',
        kms: '',
        description: '',
        status: 'available',
        currentImage: ''
    });
    
    let imageFile: File | null = $state(null);
    let imagePreview: string = $state("");

    onMount(async () => {
        const token = localStorage.getItem('squad_token');
        if (!token) {
            goto('/admin/login');
            return;
        }
        await loadData();
        isLoading = false;
    });

    async function loadData() {
        const resInq = await fetch(`${API_URL}/api/inquiries`);
        inquiries = await resInq.json();
        const resBikes = await fetch(`${API_URL}/api/bikes`);
        bikes = await resBikes.json();
    }

    function handleFileSelect(e: Event) {
        const target = e.target as HTMLInputElement;
        if (target.files && target.files[0]) {
            imageFile = target.files[0];
            imagePreview = URL.createObjectURL(imageFile);
        }
    }

    // --- MODAL CONTROLS ---

    function openAddModal() {
        isEditing = false;
        editingId = 0;
        formBike = { brand: 'Ducati', name: '', price: 0, year: 2026, engine: '', power: '', kms: '', description: '', status: 'available', currentImage: '' };
        imageFile = null;
        imagePreview = "";
        showModal = true;
    }

    function openEditModal(bike: Bike) {
        isEditing = true;
        editingId = bike.id;
        formBike = {
            brand: bike.brand,
            name: bike.name,
            price: bike.price,
            year: bike.year,
            engine: bike.engine,
            power: bike.power,
            kms: '',
            description: bike.description,
            status: bike.status as string,
            currentImage: bike.images[0] || ''
        };
        imageFile = null;
        imagePreview = bike.images[0] || "";
        showModal = true;
    }

    // --- SAVE LOGIC ---

    async function handleSaveBike(e: Event) {
        e.preventDefault();
        isUploading = true;
        
        try {
            let finalImageUrl = formBike.currentImage;

            if (imageFile) {
                const formData = new FormData();
                formData.append('image', imageFile);
                const uploadRes = await fetch(`${API_URL}/api/upload`, { method: 'POST', body: formData });
                if (!uploadRes.ok) throw new Error('Image upload failed');
                const data = await uploadRes.json();
                finalImageUrl = data.url;
            } else if (!finalImageUrl) {
                finalImageUrl = "https://images.unsplash.com/photo-1558980394-0a06c46e60e7";
            }

            let finalDesc = formBike.description;
            if (!isEditing && formBike.kms) {
                finalDesc = `Mileage: ${formBike.kms} km. ${formBike.description}`;
            }

            const payload = { ...formBike, description: finalDesc, images: [finalImageUrl] };
            const url = isEditing ? `${API_URL}/api/bikes/${editingId}` : `${API_URL}/api/bikes`;
            const method = isEditing ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                showModal = false;
                loadData(); 
            } else {
                alert('Operation failed');
            }
        } catch (err) {
            console.error(err);
            alert('Error saving vehicle');
        } finally {
            isUploading = false;
        }
    }

    // --- DELETE LOGIC (UPDATED) ---

    // 1. Trigger the Modal
    function requestDelete(id: number) {
        deleteId = id;
        showDeleteModal = true;
    }

    // 2. Confirm and Execute
    async function confirmDelete() {
        if (!deleteId) return;
        isDeleting = true;

        const originalList = [...bikes];
        bikes = bikes.filter(b => b.id !== deleteId); // Optimistic UI update

        try {
            await fetch(`${API_URL}/api/bikes/${deleteId}`, { method: 'DELETE' });
            showDeleteModal = false;
        } catch (err) {
            bikes = originalList; // Revert if failed
            alert("Delete failed");
        } finally {
            isDeleting = false;
            deleteId = 0;
        }
    }

    function logout() {
        localStorage.removeItem('squad_token');
        goto('/admin/login');
    }
</script>

<div class="min-h-screen bg-squad-black pt-48 px-6 pb-20 relative">
    
    {#if showDeleteModal}
        <div 
            transition:fade={{ duration: 150 }}
            class="fixed inset-0 z-[60] bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
        >
            <div 
                transition:scale={{ duration: 200, start: 0.95 }}
                class="bg-squad-gray border border-red-500/50 p-8 max-w-md w-full text-center shadow-[0_0_50px_rgba(220,38,38,0.2)]"
            >
                <div class="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg class="w-8 h-8 text-squad-red" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </div>
                
                <h3 class="font-display text-2xl text-white uppercase tracking-wider mb-2">Confirm Deletion</h3>
                <p class="text-gray-400 text-sm mb-8">
                    Are you sure you want to remove this vehicle from the database? <br/> 
                    <span class="text-red-400">This action cannot be undone.</span>
                </p>

                <div class="flex gap-4">
                    <button 
                        onclick={() => showDeleteModal = false}
                        class="flex-1 border border-white/10 py-3 text-white font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onclick={confirmDelete}
                        disabled={isDeleting}
                        class="flex-1 bg-squad-red py-3 text-white font-bold uppercase tracking-widest hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    {/if}

    {#if showModal}
        <div 
            transition:fade={{ duration: 200 }}
            class="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
        >
            <div 
                transition:scale={{ duration: 300, start: 0.9 }}
                class="bg-squad-gray border border-white/10 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
                <h2 class="font-display text-3xl text-white uppercase mb-6">
                    {isEditing ? 'Edit Machine' : 'Add New Machine'}
                </h2>
                
                <form onsubmit={handleSaveBike} class="space-y-6">
                    <div class="grid grid-cols-2 gap-6">
                        <div>
                            <label class="text-xs font-bold text-gray-500 uppercase">Brand</label>
                            <select bind:value={formBike.brand} class="w-full bg-black/50 border border-white/10 p-3 text-white">
                                <option>Ducati</option><option>BMW</option><option>Kawasaki</option><option>Yamaha</option><option>Aprilia</option><option>Honda</option><option>Suzuki</option><option>MV Agusta</option>
                            </select>
                        </div>
                        <div>
                            <label class="text-xs font-bold text-gray-500 uppercase">Model Name</label>
                            <input bind:value={formBike.name} class="w-full bg-black/50 border border-white/10 p-3 text-white" required />
                        </div>
                    </div>
                    <div class="grid grid-cols-3 gap-4">
                        <div>
                            <label class="text-xs font-bold text-gray-500 uppercase">Price ($)</label>
                            <input type="number" bind:value={formBike.price} class="w-full bg-black/50 border border-white/10 p-3 text-white" required />
                        </div>
                        <div>
                            <label class="text-xs font-bold text-gray-500 uppercase">Year</label>
                            <input type="number" bind:value={formBike.year} class="w-full bg-black/50 border border-white/10 p-3 text-white" required />
                        </div>
                         <div>
                            <label class="text-xs font-bold text-gray-500 uppercase">Status</label>
                            <select bind:value={formBike.status} class="w-full bg-black/50 border border-white/10 p-3 text-white">
                                <option value="available">Available</option><option value="sold">Sold</option><option value="coming soon">Coming Soon</option>
                            </select>
                        </div>
                    </div>
                    <div class="grid grid-cols-3 gap-4">
                        <div>
                            <label class="text-xs font-bold text-gray-500 uppercase">Engine (CC)</label>
                            <input bind:value={formBike.engine} class="w-full bg-black/50 border border-white/10 p-3 text-white" required />
                        </div>
                        <div>
                            <label class="text-xs font-bold text-gray-500 uppercase">Power (HP)</label>
                            <input bind:value={formBike.power} class="w-full bg-black/50 border border-white/10 p-3 text-white" required />
                        </div>
                        {#if !isEditing}
                        <div>
                            <label class="text-xs font-bold text-gray-500 uppercase">KMs Driven</label>
                            <input bind:value={formBike.kms} class="w-full bg-black/50 border border-white/10 p-3 text-white" />
                        </div>
                        {/if}
                    </div>
                    <div class="border border-white/10 bg-black/30 p-4">
                        <label class="text-xs font-bold text-gray-500 uppercase mb-2 block">{isEditing ? 'Update Image (Optional)' : 'Vehicle Image'}</label>
                        <input type="file" accept="image/*" onchange={handleFileSelect} class="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-squad-red file:text-white file:font-bold file:uppercase cursor-pointer" />
                        {#if imagePreview}
                            <div class="mt-4 relative h-40 w-full overflow-hidden border border-white/20"><img src={imagePreview} alt="Preview" class="w-full h-full object-cover" /></div>
                        {/if}
                    </div>
                    <div>
                        <label class="text-xs font-bold text-gray-500 uppercase">Description / Notes</label>
                        <textarea bind:value={formBike.description} rows="3" class="w-full bg-black/50 border border-white/10 p-3 text-white" required></textarea>
                    </div>
                    <div class="flex gap-4 pt-4">
                        <button type="button" onclick={() => showModal = false} class="w-full border border-white/20 text-white py-3 font-bold uppercase hover:bg-white hover:text-black transition-colors">Cancel</button>
                        <button type="submit" disabled={isUploading} class="w-full bg-squad-red text-white py-3 font-bold uppercase hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                            {#if isUploading}<span class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>{isEditing ? 'Updating...' : 'Uploading...'}{:else}{isEditing ? 'Save Changes' : 'Add to Inventory'}{/if}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    {/if}

    <div class="max-w-7xl mx-auto">
        <div class="flex justify-between items-end mb-12 border-b border-white/10 pb-6">
            <div>
                <h1 class="font-display text-4xl text-white uppercase tracking-widest">Command Center</h1>
                <p class="text-gray-500 text-sm mt-2">Welcome back, Admin.</p>
            </div>
            <div class="flex gap-6 items-center">
                <button onclick={openAddModal} class="bg-squad-red text-white px-6 py-2 font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all">+ Add Vehicle</button>
                <button onclick={logout} class="text-gray-500 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors">Log Out</button>
            </div>
        </div>

        {#if isLoading}
            <div class="text-white font-display text-2xl animate-pulse">Accessing Secure Database...</div>
        {:else}
            <div class="flex gap-8 mb-8">
                <button class="text-xl font-display uppercase tracking-widest transition-colors {activeTab === 'inquiries' ? 'text-white border-b-2 border-squad-red' : 'text-gray-600 hover:text-white'}" onclick={() => activeTab = 'inquiries'}>
                    Inquiries <span class="text-xs align-top bg-white/10 px-2 py-0.5 rounded-full ml-2">{inquiries.length}</span>
                </button>
                <button class="text-xl font-display uppercase tracking-widest transition-colors {activeTab === 'inventory' ? 'text-white border-b-2 border-squad-red' : 'text-gray-600 hover:text-white'}" onclick={() => activeTab = 'inventory'}>
                    Inventory <span class="text-xs align-top bg-white/10 px-2 py-0.5 rounded-full ml-2">{bikes.length}</span>
                </button>
            </div>

            {#if activeTab === 'inquiries'}
                <div class="grid gap-4">
                    {#each inquiries as item (item.id)}
                        <div transition:slide class="bg-squad-gray border border-white/5 p-6 flex justify-between items-start">
                            <div>
                                <h3 class="text-white font-bold uppercase tracking-wide text-sm mb-1">{item.name}</h3>
                                <div class="flex gap-4 text-xs text-gray-500 mb-4">
                                    <span>{item.email}</span><span>{new Date(item.createdAt).toLocaleDateString()}</span>
                                </div>
                                <p class="text-gray-300 text-sm bg-black/30 p-4 border-l-2 border-squad-red max-w-2xl">"{item.message}"</p>
                            </div>
                            {#if item.bikeId}<span class="bg-white/5 text-gray-400 text-xs px-3 py-1 uppercase">Ref: Bike #{item.bikeId}</span>{/if}
                        </div>
                    {/each}
                    {#if inquiries.length === 0}
                        <div class="p-12 text-center text-gray-600 border border-white/5 border-dashed">No messages.</div>
                    {/if}
                </div>

            {:else if activeTab === 'inventory'}
                <div class="space-y-4">
                    {#each bikes as bike (bike.id)}
                        <div animate:flip={{ duration: 400 }} transition:scale={{ duration: 300 }} class="bg-squad-gray p-4 flex items-center justify-between border border-white/5 group">
                            <div class="flex items-center gap-6">
                                <img src={bike.images[0]} alt="thumb" class="w-16 h-16 object-cover bg-black" />
                                <div>
                                    <h4 class="text-white font-bold uppercase">{bike.name}</h4>
                                    <p class="text-xs text-gray-500 uppercase tracking-widest">{bike.status}</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-8">
                                <span class="text-white font-mono">${bike.price}</span>
                                <div class="flex gap-4">
                                    <button onclick={() => openEditModal(bike)} class="text-gray-400 hover:text-white uppercase text-xs font-bold tracking-widest transition-colors">Edit</button>
                                    <button onclick={() => requestDelete(bike.id)} class="text-red-500 hover:text-red-400 uppercase text-xs font-bold tracking-widest transition-colors">Delete</button>
                                </div>
                            </div>
                        </div>
                    {/each}
                </div>
            {/if}
        {/if}
    </div>
</div>