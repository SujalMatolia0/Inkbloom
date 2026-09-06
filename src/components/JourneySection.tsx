"use client";

export function JourneySection() {
  const milestones = [
    { num: 1, year: '2021', title: 'First Stroke', desc: "It started quietly — a brush, some colour, and a wall in Ratangarh. What began as curiosity slowly became something she couldn't stop." },
    { num: 2, year: '2022', title: 'First Commission', desc: 'Someone trusted her with their vision, and she delivered it by hand. That first paid piece confirmed everything — this was her path.' },
    { num: 3, year: '2023', title: 'Studio Takes Shape', desc: 'A dedicated space, her own rules, her own hours. The Vinyas studio became the place where ideas stopped being dreams.' },
    { num: 4, year: '2024', title: '50 Commissions', desc: 'Portraits, murals, gifts, murti paintings — fifty pieces later, each one still made with the same care as the first.' },
    { num: 5, year: '2025', title: 'Going Online', desc: "Vinyas went digital, bringing Anki's handcrafted world to collectors and art lovers beyond Rajasthan." },
    { num: 6, year: '2025', title: 'Vinyas Launch', desc: 'An online home for every piece, every commission, every story. Vinyas is now open to the world.' },
  ];

  return (
    <section className="timeline-section">
      <div className="sec-label">The Timeline</div>
      <h2 className="section-heading">Artist <em>Journey.</em></h2>
      
      <div className="timeline-grid">
        {milestones.map((m, i) => {
          const isSecondRow = i >= 3;
          
          return (
            <div 
              className={`timeline-item reveal ${isSecondRow ? 'timeline-row-2' : ''}`} 
              key={i}
            >
              <div className="timeline-num">{m.num}</div>
              <div className="timeline-year">{m.year}</div>
              <div className="timeline-title">{m.title}</div>
              <div className="timeline-desc">{m.desc}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
