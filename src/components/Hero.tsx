import Link from "next/link";

export function Hero() {
  return (
    <section className="hero" id="hero">
      {/* LEFT */}
      <div className="hero-left">
        <div className="bg-type-hero">WHERE</div>
        <div className="hero-left-inner reveal">
          <div className="eyebrow">Original Art · Handmade · Jaipur</div>
          <h1 className="hero-headline">
            Where<br />
            <em>ink</em><br />
            <span className="outline">blooms.</span>
          </h1>
          <p className="hero-body">Original paintings, custom commissions & handmade goods — from a dusty little studio in the Pink City.</p>
          <div className="btn-row">
            <Link href="/portfolio" className="btn-primary">Enter Gallery</Link>
            <Link href="/shop" className="btn-outline">Shop Now</Link>
          </div>
        </div>
        <div className="hero-stats reveal">
          <div>
            <div className="stat-num">120+</div>
            <div className="stat-label">Works</div>
          </div>
          <div>
            <div className="stat-num">48</div>
            <div className="stat-label">Commissions</div>
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <div className="gallery-label">In-Studio Gallery</div>
          <Link href="/portfolio" className="btn-visit">Visit Now →</Link>
        </div>

        <div className="artwork-stack">
          <div className="art-card">
            <div className="art-thumb">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="15" r="9" stroke="#C17B5C" strokeWidth="1" />
                <path d="M8 36 Q20 24 32 36" stroke="#C17B5C" strokeWidth="1" fill="none" />
              </svg>
            </div>
            <div>
              <div className="art-name">Monsoon Portrait</div>
              <div className="art-type">Watercolour · Original</div>
            </div>
            <div className="art-price">₹4,400</div>
            <span className="art-badge">New</span>
          </div>
          <div className="art-card">
            <div className="art-thumb">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <rect x="8" y="8" width="24" height="24" stroke="#7B9E87" strokeWidth="1" fill="none" />
                <line x1="8" y1="20" x2="32" y2="20" stroke="#7B9E87" strokeWidth="0.8" />
                <line x1="20" y1="8" x2="20" y2="32" stroke="#7B9E87" strokeWidth="0.8" />
              </svg>
            </div>
            <div>
              <div className="art-name">Ink Study No. 7</div>
              <div className="art-type">Ink · Limited Edition</div>
            </div>
            <div className="art-price">₹2,800</div>
          </div>
          <div className="art-card">
            <div className="art-thumb">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <ellipse cx="20" cy="20" rx="14" ry="10" stroke="#D4A5A5" strokeWidth="1" fill="none" />
                <ellipse cx="20" cy="20" rx="8" ry="5" stroke="#D4A5A5" strokeWidth="0.8" fill="none" strokeDasharray="2 3" />
              </svg>
            </div>
            <div>
              <div className="art-name">Jaipur Dusk</div>
              <div className="art-type">Oil · Original</div>
            </div>
            <div className="art-price">₹6,200</div>
          </div>
        </div>

        <div className="gallery-cta">
          <span className="gallery-cta-text">↑ Scroll to gallery</span>
          <Link href="/portfolio">View all artworks →</Link>
        </div>
      </div>
    </section>
  );
}
