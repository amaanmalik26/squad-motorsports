import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import type { Bike } from '$lib/types';
import { API_URL } from '$lib/config';

export const load: PageLoad = async ({ params, fetch }) => {
    const { id } = params;
    const response = await fetch(`${API_URL}/api/bikes/${id}`);
    if (!response.ok) {
        throw error(404, 'Bike not found');
    }

    const bike: Bike = await response.json();
    return { bike };
};