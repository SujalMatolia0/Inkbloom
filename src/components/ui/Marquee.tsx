export function Marquee() {
  const items = [
    'Original Paintings',
    'Custom Commissions',
    'Handmade Goods',
    'Watercolour Art',
    'Ink Illustrations',
    'Limited Editions',
    'Doodle Prints',
    'Mixed Media',
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
