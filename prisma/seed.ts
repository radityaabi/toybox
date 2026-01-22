import { categories, toys } from "./data";
import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("🌱 Seeding database...");

  // 1️⃣ Seed Categories
  const categoryMap = new Map<string, number>();

  for (const category of categories) {
    const upsertedCategory = await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
    categoryMap.set(upsertedCategory.slug, upsertedCategory.id);
    console.log(`🏷️ Category: ${upsertedCategory.name}`);
  }

  // 2️⃣ Seed Toys
  for (const toy of toys) {
    const categoryId = categoryMap.get(toy.categorySlug);

    try {
      if (!categoryId) {
        throw new Error(
          `Toy "${toy.slug}" failed to seed with category "${toy.categorySlug}" not found`
        );
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
      console.log(`🪁 Toy: ${toy.name}`);
    } catch (error) {
      console.error(error);
    }
  }
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
