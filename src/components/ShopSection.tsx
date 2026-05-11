import Link from 'next/link';
import { ProductCard } from './shop/ProductCard';

interface ProductProps {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  images: string[];
  stock: number;
  category: string;
}

export function ShopSection({ products = [] }: { products?: ProductProps[] }) {
  return (
    <section className="section">
      <div className="section-header">
        <div>
          <div className="sec-label">The Collection</div>
          <h2 className="section-heading">Ready-made <em>originals.</em></h2>
        </div>
        <Link href="/shop" className="view-all">View all →</Link>
      </div>

      <div className="product-grid">
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            product={{
              ...product,
              image: product.images[0] || '/placeholder.jpg',
            }}
            priority={index === 0}
          />
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px',paddingLeft: '60px',paddingRight: '60px', paddingTop: '24px', borderTop: '1px solid rgba(45,45,45,0.1)' }}>
        <p style={{ fontSize: '12px', color: 'rgba(45,45,45,0.5)' }}>Love a sold piece? <span style={{ color: 'var(--te)' }}>Commission a similar original</span> and I'll bring it to life.</p>
        <Link href="/#commission" className="btn-outline" style={{ fontSize: '9px' }}>Commission Similar →</Link>
      </div>
    </section>
  );
}
