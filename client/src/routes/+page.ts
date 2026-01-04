import type { PageLoad } from './$types';
import type { Bike } from '$lib/types';
import { API_URL } from '$lib/config';

export const load: PageLoad = async ({ fetch }) => {
    try {
        // Fetch all bikes
        const response = await fetch(API_URL + '/api/bikes');
        
        if (!response.ok) return { featuredBikes: [] };

        const allBikes: Bike[] = await response.json();

        // Let's just take the first 3 bikes for the homepage
        return { 
            featuredBikes: allBikes.slice(0, 3) 
        };
    } catch (err) {
        console.error("Homepage fetch error:", err);
        return { featuredBikes: [] };
    }
};