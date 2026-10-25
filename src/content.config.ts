import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { sections } from "./config/site";

const calendarDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use the date format YYYY-MM-DD.")
  .refine((value) => {
    const parsed = new Date(`${value}T00:00:00Z`);
    return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
  }, "Enter a valid calendar date.");

const entries = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/entries" }),
  schema: z
    .object({
      section: z.enum(sections.map((section) => section.id)),
      title: z.string().trim().min(1),
      description: z.string().trim().min(1),
      publishedAt: calendarDate,
      updatedAt: calendarDate.optional(),
      topic: z.string().trim().min(1).optional(),
      draft: z.boolean().default(false),
      featured: z.boolean().default(false),
      cover: z.object({
        src: z.string().trim().min(1),
        alt: z.string().trim().min(1),
        width: z.number().int().positive(),
        height: z.number().int().positive(),
      }).optional(),
    })
    .refine((entry) => !entry.updatedAt || entry.updatedAt >= entry.publishedAt, {
      path: ["updatedAt"],
      message: "Updated date must be on or after the publication date.",
    }),
});

export const collections = { entries };
