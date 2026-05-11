"use client";

import { useCartStore } from "@/lib/store/cart";
import Link from "next/link";
import Image from "next/image";

interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  slug: string;
  category: string;
  stock: number;
}

export function ProductCard({ product, priority = false, className = "" }: { product: Product; priority?: boolean; className?: string }) {
  const addItem = useCartStore((state) => state.addItem);
  const isSold = product.stock <= 0;

  return (
    <div className={`product-card reveal ${priority ? "featured" : ""} ${className} group`}>
      {/* Product Image Container */}
      <div className="product-img">
        <Link href={`/shop/${product.slug}`} className="absolute inset-0 z-0 block">
          <Image
            src={product.image}
            alt={product.title}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            style={{ opacity: isSold ? 0.4 : 0.8 }}
          />
        </Link>

        {/* Badges */}
        {!isSold && priority && (
          <span className="product-badge">New</span>
        )}

        {isSold && (
          <div className="sold-stamp">Sold</div>
        )}

        {/* Add to Cart & Wishlist Hover Buttons (only if not sold) */}
        {!isSold && (
          <>
            <button
              onClick={(e) => {
                e.preventDefault();
                addItem({
                  id: product.id,
                  title: product.title,
                  price: product.price,
                  image: product.image,
                  slug: product.slug,
                });
              }}
              className="add-btn"
              aria-label="Add to cart"
            >
              ADD
            </button>
            <button 
              className="wishlist-btn"
              aria-label="Add to wishlist"
              onClick={(e) => e.preventDefault()}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2D2D2D" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Product Info */}
      <div className="product-info">
        <div>
          <Link href={`/shop/${product.slug}`}>
            <h3 className="product-name">{product.title}</h3>
          </Link>
          <p className="product-meta">{product.category}</p>
        </div>
        <div>
          <span className={`product-price ${isSold ? "sold" : ""}`}>
            ₹{product.price.toLocaleString("en-IN")}
          </span>
        </div>
      </div>
    </div>
  );
}
