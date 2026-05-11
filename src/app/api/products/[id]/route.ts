import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * API: Get single product by ID or slug
 * Returns product details
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Try to find by slug first (most common), then by ID
    let product = await prisma.product.findUnique({
      where: { slug: id },
    });

    // If not found by slug, try by ID
    if (!product) {
      product = await prisma.product.findUnique({
        where: { id },
      });
    }

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Transform to match frontend expectations
    const transformedProduct = {
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      image: product.images[0],
      images: product.images,
      slug: product.slug,
      category: product.category,
      stock: product.stock,
      isSold: product.stock === 0,
    };

    return NextResponse.json(transformedProduct);
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}
