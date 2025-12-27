import { z } from "zod";

export const ToySchema = z.object({
  id: z.number(),
  sku: z.string().min(3),
  name: z.string().min(3),
  slug: z.string().min(3).optional(),
  category: z
    .object({
      id: z.number(),
      name: z.string().min(3),
      slug: z.string().min(3).optional(),
    })
    .optional(),
  brand: z.string().min(2).optional(),
  price: z.number().min(100).optional(),
  ageRange: z.string().min(1).optional(),
  image: z.url().optional(),
  description: z.string().min(3).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional().nullable(),
});

export const CreateToySchema = ToySchema.pick({
  sku: true,
  name: true,
  slug: true,
  brand: true,
  price: true,
  ageRange: true,
  image: true,
  description: true,
});

export const UpdateToySchema = ToySchema.pick({
  sku: true,
  name: true,
  slug: true,
  brand: true,
  price: true,
  ageRange: true,
  image: true,
  description: true,
}).partial();

export const ReplaceToySchema = ToySchema.pick({
  sku: true,
  name: true,
  slug: true,
  brand: true,
  price: true,
  ageRange: true,
  image: true,
  description: true,
});

export type Toy = z.infer<typeof ToySchema>;
export type CreateToy = z.infer<typeof CreateToySchema>;
export type UpdateToy = z.infer<typeof UpdateToySchema>;
export type ReplaceToy = z.infer<typeof ReplaceToySchema>;
