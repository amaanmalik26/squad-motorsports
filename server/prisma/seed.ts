import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Clear existing data (optional, but good for testing)
  await prisma.bike.deleteMany();

  // 2. Create Bikes
  await prisma.bike.createMany({
    data: [
      {
        name: "Panigale V4 R",
        brand: "Ducati",
        price: 44995,
        year: 2024,
        engine: "998 cc",
        power: "218 HP",
        description: "The Panigale V4 R is the maximum expression of Ducati's racing DNA. A track-focused machine that brings the technology of the MotoGP directly to the street.",
        images: ["https://images.unsplash.com/photo-1616423664074-42f0da6090c2?q=80&w=2071&auto=format&fit=crop"],
        status: "available",
        isFeatured: true
      },
      {
        name: "S 1000 RR",
        brand: "BMW",
        price: 18295,
        year: 2024,
        engine: "999 cc",
        power: "205 HP",
        description: "The BMW S 1000 RR caused a revolution in the supersports category right from the start. In the current generation, it continues to define the benchmark.",
        images: ["https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?q=80&w=2070&auto=format&fit=crop"],
        status: "available",
        isFeatured: true
      },
      {
        name: "Ninja H2",
        brand: "Kawasaki",
        price: 33000,
        year: 2023,
        engine: "998 cc Supercharged",
        power: "228 HP",
        description: "The Ninja H2 is a supercharged hypersport motorcycle. It represents the pinnacle of Kawasaki engineering.",
        images: ["https://images.unsplash.com/photo-1558980394-0a06c46e60e7?q=80&w=2070&auto=format&fit=crop"],
        status: "sold",
        isFeatured: false
      },
      {
        name: "YZF-R1M",
        brand: "Yamaha",
        price: 26999,
        year: 2024,
        engine: "998 cc",
        power: "198 HP",
        description: "The R1M is the most advanced production motorcycle Yamaha has ever built. Featuring Öhlins Electronic Racing Suspension.",
        images: ["https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=2070&auto=format&fit=crop"],
        status: "available",
        isFeatured: true
      }
    ]
  });

  console.log('✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });