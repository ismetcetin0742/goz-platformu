import { defineConfig } from "@prisma/config";
import "dotenv/config";

export default defineConfig({
  schema: "prisma/schema.prisma",

  datasource: {
    // .env dosyasındaki DATABASE_URL'i buraya bağlar
    url: process.env.DATABASE_URL, 
  },

  migrations: {
    // npx prisma db seed komutu için yol gösterir
    seed: "npx tsx prisma/seed.ts",
  },
});