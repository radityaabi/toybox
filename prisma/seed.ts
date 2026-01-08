import { categories, toys } from "./data";
import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("Seeding database...");
  for (const category of categories) {
    await prisma.category.upsert({
      where: { id: category.id },
      update: {},
      create: category,
    });
  }

  for (const toy of toys) {
    await prisma.toy.upsert({
      where: { sku: toy.sku },
      update: {},
      create: toy,
    });
  }
  console.log("Seeding completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
