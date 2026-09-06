import Link from "next/link";
import Image from "next/image";

export function Hero() {
  return (
    <section className="hero" id="hero">
      {/* LEFT */}
      <div className="hero-left">
        <div className="bg-type-hero">VINYAS</div>
        <div className="hero-left-inner reveal">
          <div className="eyebrow">Mixed Media · Handmade · Ratangarh</div>
          <h1 className="hero-headline">
            Where<br />
            <em>colour</em><br />
            <span className="outline">speaks.</span>
          </h1>
          <p className="hero-body">
            Original mixed media art, custom commissions &amp; handmade gifts — from a soulful little studio in the heartland of Rajasthan.
          </p>
          <div className="btn-row">
            <Link href="/portfolio" className="btn-primary">Enter Gallery</Link>
            <Link href="/#commission" className="btn-outline">Commission Now</Link>
          </div>
        </div>
        <div className="hero-stats reveal">
          <div>
            <div className="stat-num">50+</div>
            <div className="stat-label">Commissions</div>
          </div>
          <div>
            <div className="stat-num">786</div>
            <div className="stat-label">Works</div>
          </div>
          <div>
            <div className="stat-num">5★</div>
            <div className="stat-label">Rating</div>
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="hero-right">
        <div className="dark-grid"></div>

        {/* Top Header */}
        <div className="hero-right-header">
          <div className="gallery-label">Studio Original</div>
          <Link href="/portfolio" className="btn-visit">
            View Gallery →
          </Link>
        </div>

        {/* Single Featured Artwork */}
        <div className="hero-featured-art reveal">
          <Link
            href="/portfolio"
            className="featured-art-card group"
            aria-label="Explore Desert Soul in 3D Gallery"
          >
            <div className="featured-art-frame">
              <div className="featured-art-mat">
                <div className="featured-art-img-wrap">
                  <Image
                    src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=900&auto=format&fit=crop&q=85"
                    alt="Desert Soul - Mixed Media on Canvas"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="featured-art-img"
                  />
                  <div className="featured-art-badge">Original · No. 01</div>

                  <div className="featured-art-overlay">
                    <span className="featured-art-pill">Enter 3D Gallery ✦</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="featured-art-info">
              <div className="featured-art-meta-top">
                <div>
                  <h2 className="featured-art-title">Desert Soul</h2>
                  <p className="featured-art-medium">
                    Mixed Media on Canvas · Ratangarh Studio
                  </p>
                </div>
                <div className="featured-art-price">₹3,500</div>
              </div>
              <div className="featured-art-meta-bottom">
                <span className="featured-art-tag">30 × 40 cm</span>
                <span className="featured-art-tag">Handcrafted Frame</span>
                <span className="featured-art-action">Experience in 3D Space →</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Bottom CTA */}
        <div className="gallery-cta">
          <span className="gallery-cta-text">✦ 8 Unique Artworks in 3D Salon</span>
          <Link href="/portfolio">Explore Full Gallery →</Link>
        </div>
      </div>
    </section>
  );
}
