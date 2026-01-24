import { categories, brands, toys } from "./data";
import { prisma } from "../src/lib/prisma";
import { toyRoute } from "../src/modules/toy/route";

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

  // 2️⃣ Seed Brands
  const brandMap = new Map<string, number>();

  for (const brand of brands) {
    const upsertedBrand = await prisma.brand.upsert({
      where: { slug: brand.slug },
      update: brand,
      create: brand,
    });
    brandMap.set(upsertedBrand.slug, upsertedBrand.id);
    console.log(`🔖 Brand: ${upsertedBrand.name}`);
  }

  // 3️⃣ Seed Toys
  for (const toy of toys) {
    const categoryId = toy.categorySlug
      ? categoryMap.get(toy.categorySlug)
      : null;
    const brandId = toy.brandSlug ? brandMap.get(toy.brandSlug) : null;

    try {
      await prisma.toy.upsert({
        where: { sku: toy.sku },
        update: {
          name: toy.name,
          slug: toy.slug,
          categoryId: categoryId,
          brandId: brandId,
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
          brandId: brandId,
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
