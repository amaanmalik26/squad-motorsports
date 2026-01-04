export interface Bike {
    id: number;
    name: string;
    brand: string;
    price: number;
    image?: string;     // Optional because we use 'images' array now
    images: string[];   // The real array from DB
    
    // Specs
    year: number;
    engine: string;
    power: string;
    torque?: string;
    weight?: string;
    
    description: string; // This fixes the 'description' error
    
    status: 'available' | 'sold' | 'reserved' | 'coming soon';
    isFeatured: boolean;
}