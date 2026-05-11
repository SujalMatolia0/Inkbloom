export function AboutStrip() {
  const cells = [
    { label: 'Medium', title: 'Ink & Oil', body: 'Watercolour, ink, acrylic & mixed media — every piece is one of a kind.' },
    { label: 'Location', title: 'Jaipur', body: 'Crafted in a sun-drenched studio in the Pink City of Rajasthan.' },
    { label: 'Turnaround', title: '2–4 wks', body: 'Each commission is lovingly made to order with regular progress updates.' },
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
