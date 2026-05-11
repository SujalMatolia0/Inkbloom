const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkOrders() {
  const latestOrder = await prisma.order.findFirst({
    orderBy: { createdAt: 'desc' },
    include: { items: true }
  });
  console.log('Latest Order:', JSON.stringify(latestOrder, null, 2));
  process.exit();
}

checkOrders();
