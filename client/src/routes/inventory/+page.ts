import type { PageLoad } from './$types';
import type { Bike } from '$lib/types';
import { API_URL } from '$lib/config';

export const load: PageLoad = async ({ fetch }) => {
    const response = await fetch(API_URL + '/api/bikes');
    // If fail, return empty array to prevent crash
    if (!response.ok) return { bikes: [] };
    
    const bikes: Bike[] = await response.json();
    return { bikes };
};