import { categories, toys } from "./data";
import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("🌱 Seeding database...");

  // 1️⃣ Seed Categories
  await prisma.category.deleteMany();
  const resultCategories = await prisma.category.createManyAndReturn({
    data: categories,
    select: { id: true, slug: true },
  });
  console.log(`✅ Seeded ${resultCategories.length} categories.`);

  // 2️⃣ Seed Toys
  await prisma.toy.deleteMany();
  const toysWithCategoryId = toys.map((toy) => {
    const category = resultCategories.find(
      (category) => category.slug === toy.categorySlug
    );
    if (!category) {
      throw new Error(`Category with slug ${toy.categorySlug} not found`);
    }
    return {
      sku: toy.sku,
      name: toy.name,
      slug: toy.slug,
      categoryId: category.id,
      brand: toy.brand,
      price: toy.price,
      ageRange: toy.ageRange,
      imageUrl: toy.imageUrl,
      description: toy.description,
    };
  });

  await prisma.toy.createMany({
    data: toysWithCategoryId,
  });

  console.log(`✅ Seeded ${toys.length} toys.`);
  console.log("Toy data created");
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
