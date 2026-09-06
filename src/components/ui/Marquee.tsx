export function Marquee() {
  const items = [
    'Mixed Media Art',
    'Custom Commissions',
    'Handmade Gifts',
    'Wall Art',
    'Portraits',
    'Murti Painting',
    'Craft Work',
    'Made to Order',
  ];

  return (
    <div className="marquee">
      <div style={{ display: 'flex' }}>
        <div className="marquee-inner">
          {items.map((item, index) => (
            <span key={`1-${index}`}>
              <span className="marquee-item">{item}</span>
              <span className="marquee-sep">✦</span>
            </span>
          ))}
          {items.map((item, index) => (
            <span key={`2-${index}`}>
              <span className="marquee-item">{item}</span>
              <span className="marquee-sep">✦</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
