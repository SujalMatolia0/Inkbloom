import Link from 'next/link';

export function Footer() {
  return (
    <footer>
      <div className="footer-grid">
        <div>
          <div className="footer-logo">Ink<span>bloom</span></div>
          <p className="footer-tagline">Original art, custom commissions & handmade goods from a dusty studio in Jaipur.</p>
          <div className="newsletter-row">
            <input type="text" className="newsletter-input" placeholder="Your email..." />
            <button className="newsletter-btn">Join</button>
          </div>
        </div>
        <div>
          <div className="footer-col-title">Studio</div>
          <ul className="footer-links">
            <li><Link href="/portfolio">Gallery</Link></li>
            <li><Link href="/shop">Shop</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/journal">Journal</Link></li>
          </ul>
        </div>
        <div>
          <div className="footer-col-title">Support</div>
          <ul className="footer-links">
            <li><Link href="/shipping">Shipping</Link></li>
            <li><Link href="/returns">Returns</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/faq">FAQ</Link></li>
          </ul>
        </div>
        <div>
          <div className="footer-col-title">Connect</div>
          <ul className="footer-links">
            <li><a href="#">Instagram</a></li>
            <li><a href="#">Pinterest</a></li>
            <li><a href="#">Twitter</a></li>
            <li><a href="#">LinkedIn</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-copy">© 2025 Inkbloom Studio. Handmade with soul.</div>
        <div className="social-row">
          <a href="#" className="social-link">Privacy</a>
          <a href="#" className="social-link">Terms</a>
        </div>
      </div>
    </footer>
  );
}
