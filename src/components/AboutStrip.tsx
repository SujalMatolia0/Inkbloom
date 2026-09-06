export function AboutStrip() {
  const cells = [
    { label: 'Medium', title: 'Mixed Media', body: 'From wall art and portraits to murti painting and handcrafted gifts — every piece is made with intention and heart.' },
    { label: 'Location', title: 'Ratangarh', body: "Crafted in a warm studio in Ratangarh, Churu — where Rajasthan's earthy spirit finds its way into every stroke." },
    { label: 'Turnaround', title: 'Made to Order', body: 'Each commission is crafted personally by Anki, with progress shared along the way.' },
  ];

  return (
    <div className="features-strip reveal">
      {cells.map((cell, index) => (
        <div className="features-cell" key={index}>
          <div className="features-cell-label">{cell.label}</div>
          <div className="features-cell-title">{cell.title}</div>
          <div className="features-cell-body">{cell.body}</div>
        </div>
      ))}
    </div>
  );
}
