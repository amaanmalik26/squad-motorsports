import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import type { Bike } from '$lib/types';
import { API_URL } from '$lib/config';

export const load: PageLoad = async ({ params, fetch }) => {
    const { id } = params;
    const response = await fetch(`http://localhost:5000/api/bikes/${id}`);

    if (!response.ok) {
        throw error(404, 'Bike not found');
    }

    const bike: Bike = await response.json();
    return { bike };
};