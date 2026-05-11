import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * API: Get all products
 * Returns all products with their details
 */
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Transform to match frontend expectations
    const transformedProducts = products.map((product) => ({
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      image: product.images[0], // Use first image
      images: product.images,
      slug: product.slug,
      category: product.category,
      stock: product.stock,
      isSold: product.stock === 0,
    }));

    return NextResponse.json(transformedProducts);
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
