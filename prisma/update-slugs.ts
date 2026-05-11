import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log('🔄 Updating product slugs...');

  const products = await prisma.product.findMany();

  for (const product of products) {
    const slug = product.title.toLowerCase().replace(/\s+/g, '-');
    await prisma.product.update({
      where: { id: product.id },
      data: { slug },
    });
    console.log(`✓ Updated ${product.title} -> ${slug}`);
  }

  console.log('🎉 All slugs updated!');
}

main()
  .catch((e) => {
    console.error('❌ Update failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
