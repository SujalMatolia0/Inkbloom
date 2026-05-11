"use client";

export function JourneySection() {
  const milestones = [
    { num: 1, year: '2021', title: 'First Sketch', desc: 'Picked up a brush and ink for the first time. What started as casual doodles became a passion that would define my artistic journey.' },
    { num: 2, year: '2023', title: 'First Commission', desc: 'Completed my first paid commission — a custom pet portrait. The joy of creating something personal for someone was addictive.' },
    { num: 3, year: '2024', title: 'Studio Setup', desc: 'Established my permanent studio in Jaipur. Filled it with plants, good light, and endless inspiration from the Pink City.' },
    { num: 4, year: '2024', title: 'First Collection', desc: "Launched 'Dusty Studio' — my first curated collection that defined the warm, dusty aesthetic I'm known for today." },
    { num: 5, year: '2025', title: 'Going Digital', desc: 'Expanded into digital illustrations and editorial work. Started collaborating with brands while maintaining my hand-drawn aesthetic.' },
    { num: 6, year: '2025', title: 'Inkbloom Launch', desc: 'Opened my online studio to the world. A platform where every piece tells a story and every stroke has meaning.' },
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
