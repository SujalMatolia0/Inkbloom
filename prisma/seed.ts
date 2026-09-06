import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

// Admin and Default Users
const USERS = [
  {
    name: 'artistankimatolia',
    email: 'artistankimatolia@inkbloom.com',
    password: '2wsx@WSX', // Will be hashed
    role: 'ADMIN',
  },
  {
    name: 'John Customer',
    email: 'customer@test.com',
    password: 'customer123', // Will be hashed
    role: 'CUSTOMER',
  },
  {
    name: 'Jane Doe',
    email: 'jane@test.com',
    password: 'customer123', // Will be hashed
    role: 'CUSTOMER',
  },
];

const PRODUCTS = [
  {
    title: 'Midnight Doodle',
    slug: 'midnight-doodle',
    description:
      'A captivating piece that explores the intersection of darkness and whimsy. Each stroke captures the spontaneous energy of late-night creativity, where inhibitions fade and pure expression emerges.',
    price: 250,
    images: ['https://picsum.photos/seed/1/800/1100'],
    stock: 1,
    category: 'Original',
  },
  {
    title: 'Terracotta Dream',
    slug: 'terracotta-dream',
    description:
      'Warm earth tones meet playful linework in this archival print. The terracotta palette evokes sun-baked clay and Mediterranean afternoons, grounding the piece in tactile reality.',
    price: 180,
    images: ['https://picsum.photos/seed/2/800/1100'],
    stock: 5,
    category: 'Print',
  },
  {
    title: 'Linen Lines',
    slug: 'linen-lines',
    description:
      'Delicate ink work on a neutral ground. This illustration celebrates the beauty of restraint, where every line serves a purpose and negative space breathes life into the composition.',
    price: 320,
    images: ['https://picsum.photos/seed/3/800/1100'],
    stock: 1,
    category: 'Illustration',
  },
  {
    title: 'Mossy Whispers',
    slug: 'mossy-whispers',
    description:
      'An original work that channels the quiet energy of forest floors and hidden gardens. Organic forms intertwine with geometric precision, creating a dialogue between nature and structure.',
    price: 210,
    images: ['https://picsum.photos/seed/4/800/1100'],
    stock: 0, // SOLD
    category: 'Original',
  },
  {
    title: 'Blush Artifact',
    slug: 'blush-artifact',
    description:
      'Soft pink hues anchor this limited edition print. The piece feels like a relic from a gentler time, where craftsmanship and patience were the only currencies that mattered.',
    price: 290,
    images: ['https://picsum.photos/seed/5/800/1100'],
    stock: 3,
    category: 'Print',
  },
  {
    title: 'Deep Horizon',
    slug: 'deep-horizon',
    description:
      'A bold illustration that pushes the boundaries of editorial doodle work. The horizon line serves as both anchor and invitation, drawing the eye into layers of intricate detail.',
    price: 350,
    images: ['https://picsum.photos/seed/6/800/1100'],
    stock: 1,
    category: 'Illustration',
  },
  {
    title: 'Urban Sketch 01',
    slug: 'urban-sketch-01',
    description:
      'Raw energy captured in ink. This original piece documents the rhythm of city life through quick, confident marks that refuse to be precious or overthought.',
    price: 150,
    images: ['https://picsum.photos/seed/7/800/1100'],
    stock: 1,
    category: 'Original',
  },
  {
    title: 'Studio Fragment',
    slug: 'studio-fragment',
    description:
      "A print that feels like a stolen moment from the artist's workspace. Unfinished edges and visible process marks remind us that perfection is overrated.",
    price: 220,
    images: ['https://picsum.photos/seed/8/800/1100'],
    stock: 0, // SOLD
    category: 'Print',
  },
];

const POSTS = [
  {
    title: 'How I built my colour palette — the "Dusty Studio" system',
    slug: 'dusty-studio-palette',
    coverImage: 'https://picsum.photos/seed/p1/800/400',
    body: 'Every artist eventually develops a visual language. Mine started with a tube of burnt sienna and an obsession with warm, dusty afternoon light filtering through a studio window. In this post, I break down the core pigments that make up my signature look.',
    tags: ['Process', 'Behind the Scenes'],
    readTime: 6,
    published: true,
  },
  {
    title: 'Watercolour basics: wet-on-wet blending for soft skies',
    slug: 'watercolour-basics-skies',
    coverImage: 'https://picsum.photos/seed/p2/800/400',
    body: 'Capturing the weightless feel of a Jaipur morning sky requires a delicate touch. Wet-on-wet technique is my go-to for these gradients. Here is a step-by-step guide on managing water tension and pigment load.',
    tags: ['Tutorial'],
    readTime: 4,
    published: true,
  },
  {
    title: "Summer 2025 collection drop — what's coming next",
    slug: 'summer-2025-collection',
    coverImage: 'https://picsum.photos/seed/p3/800/400',
    body: 'The studio is currently a mess of half-finished canvases and experimental doodles. I am excited to share a sneak peek of the upcoming collection, which focuses on urban textures and local botanical life.',
    tags: ['New Collection'],
    readTime: 3,
    published: true,
  },
];

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data (in correct order due to foreign keys)
  console.log('Clearing existing data...');
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.commission.deleteMany();
  await prisma.post.deleteMany();
  await prisma.product.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();
  console.log('✓ Cleared existing data');

  // Create users
  console.log('Creating users...');
  const createdUsers = [];
  for (const userData of USERS) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: userData.role as any,
      },
    });
    createdUsers.push(user);
    console.log(
      `✓ Created ${userData.role}: ${userData.email} (password: ${userData.password})`,
    );
  }

  // Create products
  console.log('Creating products...');
  const createdProducts = [];
  for (const product of PRODUCTS) {
    const created = await prisma.product.create({
      data: product,
    });
    createdProducts.push(created);
  }
  console.log(`✓ Created ${PRODUCTS.length} products`);

  // Create posts
  console.log('Creating posts...');
  for (const post of POSTS) {
    await prisma.post.create({
      data: post,
    });
  }
  console.log(`✓ Created ${POSTS.length} posts`);

  // Create sample orders for customer users
  console.log('Creating sample orders...');
  const customerUsers = createdUsers.filter((u) => u.role === 'CUSTOMER');

  if (customerUsers.length > 0 && createdProducts.length > 0) {
    // Order 1: Completed order
    const order1 = await prisma.order.create({
      data: {
        userId: customerUsers[0].id,
        total: createdProducts[0].price + createdProducts[1].price,
        status: 'DELIVERED',
        address: '123 Test Street, Jaipur, Rajasthan, 302001',
        items: {
          create: [
            {
              productId: createdProducts[0].id,
              quantity: 1,
              price: createdProducts[0].price,
            },
            {
              productId: createdProducts[1].id,
              quantity: 1,
              price: createdProducts[1].price,
            },
          ],
        },
      },
    });
    console.log(`✓ Created completed order for ${customerUsers[0].email}`);

    // Order 2: Pending order
    if (createdProducts.length > 2) {
      const order2 = await prisma.order.create({
        data: {
          userId: customerUsers[0].id,
          total: createdProducts[2].price,
          status: 'PENDING',
          address: '123 Test Street, Jaipur, Rajasthan, 302001',
          items: {
            create: [
              {
                productId: createdProducts[2].id,
                quantity: 1,
                price: createdProducts[2].price,
              },
            ],
          },
        },
      });
      console.log(`✓ Created pending order for ${customerUsers[0].email}`);
    }

    // Order 3: In progress order for second customer
    if (customerUsers.length > 1 && createdProducts.length > 4) {
      const order3 = await prisma.order.create({
        data: {
          userId: customerUsers[1].id,
          total: createdProducts[4].price,
          status: 'IN_PROGRESS',
          address: '456 Art Lane, Mumbai, Maharashtra, 400001',
          items: {
            create: [
              {
                productId: createdProducts[4].id,
                quantity: 1,
                price: createdProducts[4].price,
              },
            ],
          },
        },
      });
      console.log(`✓ Created in-progress order for ${customerUsers[1].email}`);
    }
  }

  // Create sample commissions
  console.log('Creating sample commissions...');
  if (customerUsers.length > 0) {
    await prisma.commission.create({
      data: {
        userId: customerUsers[0].id,
        referenceImg: 'https://picsum.photos/seed/cat/600/600',
        instructions:
          'I would like a custom watercolor portrait of my pet cat. Size: 12x16 inches. Soft, warm colors preferred.',
        status: 'PENDING',
        price: 500,
      },
    });
    console.log(`✓ Created pending commission for ${customerUsers[0].email}`);

    if (customerUsers.length > 1) {
      await prisma.commission.create({
        data: {
          userId: customerUsers[1].id,
          referenceImg: 'https://picsum.photos/seed/book/600/600',
          instructions:
            'Custom illustration for my book cover. Theme: Urban landscape with botanical elements. Need by end of month.',
          status: 'REVIEWING',
          price: 800,
        },
      });
      console.log(
        `✓ Created reviewing commission for ${customerUsers[1].email}`,
      );
    }
  }

  console.log('\n🎉 Seeding complete!\n');
  console.log('📝 Test Accounts Created:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('👤 ADMIN ACCOUNT:');
  console.log('   Email:    admin@Vinyas.com');
  console.log('   Password: admin123');
  console.log('   Access:   http://localhost:3000/admin');
  console.log('');
  console.log('👤 CUSTOMER ACCOUNT 1:');
  console.log('   Email:    customer@test.com');
  console.log('   Password: customer123');
  console.log('   Access:   http://localhost:3000/profile');
  console.log('');
  console.log('👤 CUSTOMER ACCOUNT 2:');
  console.log('   Email:    jane@test.com');
  console.log('   Password: customer123');
  console.log('   Access:   http://localhost:3000/profile');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  console.log('📊 Sample Data Created:');
  console.log(`   • ${PRODUCTS.length} products`);
  console.log(`   • ${POSTS.length} blog posts`);
  console.log(`   • 3 sample orders (various statuses)`);
  console.log(`   • 2 sample commissions`);
  console.log('');
  console.log('🚀 Ready to test! Run: npm run dev');
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
