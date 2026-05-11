import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Globe, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/ui/Navbar";
import { ProductCard } from "@/components/shop/ProductCard";
import { AddToCartButton } from "@/components/shop/AddToCartButton";

export const dynamic = 'force-dynamic';

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
  });

  if (!product) {
    notFound();
  }

  // Fetch recommendations (random 3 other products)
  const recommendations = await prisma.product.findMany({
    where: { id: { not: product.id } },
    take: 3,
    orderBy: { createdAt: "desc" },
  });

  const isSold = product.stock <= 0;

  return (
    <div className="min-h-screen bg-linen">
      <Navbar />

      <div className="product-wrap">
        {/* LEFT — Image Column */}
        <div className="product-image-col">
          <div className="breadcrumb">
            <Link href="/shop">Shop</Link>
            <span className="sep">›</span>
            <span className="current">{product.title}</span>
          </div>

          <div className="main-image-wrap">
            <div className="main-image-placeholder">
              <Image
                src={product.images[0] || "/placeholder.jpg"}
                alt={product.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
              {isSold && <div className="sold-stamp scale-125">Sold Out</div>}
            </div>
          </div>
          <div className="img-accent"></div>

          <div className="thumb-strip">
            {product.images.map((img, i) => (
              <div key={i} className={`thumb ${i === 0 ? "active" : ""}`}>
                <div className="relative w-full h-full">
                  <Image src={img} alt={`${product.title} view ${i}`} fill className="object-cover" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Info Column */}
        <div className="product-info-col">
          <div className="info-breadcrumb">
            <Link href="/shop">{product.category}</Link>
            <span className="sep">›</span>
            <span className="current">Original</span>
          </div>

          <div className="info-main reveal">
            <h1 className="product-title">{product.title}</h1>
            <div className="product-price">₹{product.price.toLocaleString("en-IN")}</div>

            <AddToCartButton
              product={{
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.images[0] || "/placeholder.jpg",
                slug: product.slug,
              }}
              isSold={isSold}
            />

            <Link href="/#commission" className="btn-commission-alt">
              Request Commission Similar →
            </Link>

            <div className="trust-row">
              <div className="trust-badge">
                <ShieldCheck size={13} />
                Authenticity Certificate
              </div>
              <div className="trust-badge">
                <Globe size={13} />
                Ships Worldwide
              </div>
            </div>
          </div>

          <div className="info-about reveal">
            <div className="info-section-label">About this Piece</div>
            <p className="info-desc">{product.description}</p>
          </div>

          <div className="info-details reveal">
            <div className="details-grid">
              <div className="detail-cell">
                <div className="detail-key">Medium</div>
                <div className="detail-val">{product.category} on Canvas</div>
              </div>
              <div className="detail-cell">
                <div className="detail-key">Dimensions</div>
                <div className="detail-val">24" × 36" (60 × 91 cm)</div>
              </div>
              <div className="detail-cell">
                <div className="detail-key">Creation Year</div>
                <div className="detail-val">2024</div>
              </div>
              <div className="detail-cell">
                <div className="detail-key">Availability</div>
                <div className="detail-val" style={{ color: "var(--mo)", display: "flex", alignItems: "center" }}>
                  <span className="pip"></span>
                  {isSold ? "Sold Out" : "Ready to ship"}
                </div>
              </div>
            </div>
          </div>

          <div className="info-shipping reveal">
            <ArrowRight size={16} />
            <p>
              Ships within <strong>3–5 business days</strong> from Jaipur. Fully insured, rolled in archival tube. Free
              shipping on orders above ₹2000.
            </p>
          </div>

          <div className="info-commission-link reveal">
            <div className="commission-note">
              Love this piece but want it <strong>customised</strong>? Commission a similar original in your preferred
              size and palette.
            </div>
            <Link href="/#commission" className="commission-cta-link">
              Commission →
            </Link>
          </div>
        </div>
      </div>

      {/* MORE FROM STUDIO */}
      <section className="more-section">
        <div className="more-header reveal">
          <h2 className="more-title">
            More <em>from the Studio</em>
          </h2>
          <Link href="/shop" className="view-all-link">
            View All Collection →
          </Link>
        </div>
        <div className="product-grid">
          {recommendations.map((p, i) => (
            <ProductCard key={p.id} product={{ ...p, image: p.images[0] || "/placeholder.jpg" }} priority={i === 0} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-deep border-t border-linen/10 py-12 px-16">
        <div className="footer-inner">
          <div className="footer-logo">
            Ink<span>bloom</span>
          </div>
          <div className="footer-copy">© {new Date().getFullYear()} Inkbloom Studio. All rights reserved.</div>
          <div className="footer-links-row">
            <a href="#">IG</a>
            <a href="#">PI</a>
            <a href="#">TW</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
