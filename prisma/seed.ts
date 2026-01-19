import { categories, toys } from "./data";
import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("🌱 Seeding database...");

  // 1️⃣ Seed Categories
  const categoryMap = new Map<string, number>();

  for (const category of categories) {
    const result = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
      },
      create: category,
    });
    categoryMap.set(result.slug, result.id);
  }
  console.log(`✅ Upserted ${categories.length} categories.`);

  // 2️⃣ Seed Toys
  for (const toy of toys) {
    const categoryId = categoryMap.get(toy.categorySlug);
    if (!categoryId) {
      throw new Error(`Category with slug ${toy.categorySlug} not found`);
    }

    await prisma.toy.upsert({
      where: { sku: toy.sku },
      update: {
        name: toy.name,
        slug: toy.slug,
        categoryId: categoryId,
        brand: toy.brand,
        price: toy.price,
        ageRange: toy.ageRange,
        imageUrl: toy.imageUrl,
        description: toy.description,
      },
      create: {
        sku: toy.sku,
        name: toy.name,
        slug: toy.slug,
        categoryId: categoryId,
        brand: toy.brand,
        price: toy.price,
        ageRange: toy.ageRange,
        imageUrl: toy.imageUrl,
        description: toy.description,
      },
    });
  }

  console.log(`✅ Upserted ${toys.length} toys.`);
  console.log("Toy data created/updated");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
