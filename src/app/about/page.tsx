"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { JourneySection } from "@/components/JourneySection";
import { ScrollReveal } from "@/components/ScrollReveal";

const skills = [
  { num: "01", name: "Watercolour Painting" },
  { num: "02", name: "Editorial Design" },
  { num: "03", name: "Digital Illustration" },
  { num: "04", name: "Brand Identity" },
  { num: "05", name: "Custom Commissions" },
  { num: "06", name: "Packaging Design" },
];

const stats = [
  { value: "120", label: "Artworks Created", suffix: "+" },
  { value: "50", label: "Happy Clients", suffix: "+" },
  { value: "5", label: "Average Rating", suffix: " Stars" },
  { value: "3", label: "Experience", suffix: " Yrs" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-linen">
      <ScrollReveal />
      <Navbar />

      <div className="hero-wrap">
        {/* HERO SPLIT */}
        <section className="about-hero">
          <div className="about-left">
            <div className="bg-type-about">ART</div>
            <div className="about-left-inner">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="sec-label">The Creator</div>
                <h1 className="about-title">About the<br /><em>Artist.</em></h1>
                <div className="divider-line"></div>
                <p className="about-body">
                  Based in the vibrant city of Jaipur, I create artwork that bridges the gap between editorial sophistication and playful doodle energy.
                </p>
              </motion.div>
            </div>
          </div>
          
          <div className="about-right">
            <div className="dark-grid"></div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="portrait-card"
            >
              <div className="portrait-dot"></div>
              <div className="portrait-img">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                  <circle cx="40" cy="28" r="16" stroke="#C17B5C" strokeWidth="1.2"/>
                  <path d="M12 72 Q40 48 68 72" stroke="#C17B5C" strokeWidth="1.2" fill="none"/>
                  <circle cx="40" cy="40" r="38" stroke="rgba(193,123,92,0.3)" strokeWidth="0.8" fill="none" strokeDasharray="3 6"/>
                </svg>
              </div>
              <div className="portrait-name">Studio Portrait</div>
              <div className="portrait-since">Since 2021</div>
            </motion.div>
          </div>
        </section>

        {/* MARQUEE */}
        <div className="marquee">
          <div className="marquee-inner">
            {[...Array(2)].map((_, i) => (
              <span key={i} className="flex">
                <span className="marquee-item">Original Paintings</span><span className="marquee-sep">✦</span>
                <span className="marquee-item">Custom Commissions</span><span className="marquee-sep">✦</span>
                <span className="marquee-item">Handmade Goods</span><span className="marquee-sep">✦</span>
                <span className="marquee-item">Watercolour Art</span><span className="marquee-sep">✦</span>
                <span className="marquee-item">Ink Illustrations</span><span className="marquee-sep">✦</span>
                <span className="marquee-item">Limited Editions</span><span className="marquee-sep">✦</span>
                <span className="marquee-item">Doodle Prints</span><span className="marquee-sep">✦</span>
                <span className="marquee-item">Mixed Media</span><span className="marquee-sep">✦</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* VISION */}
      <section className="vision-section">
        <div className="vision-left">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="sec-label">The Vision</div>
            <h2 className="vision-heading">Every stroke<br />tells a <em>story.</em></h2>
          </motion.div>
        </div>
        <div className="vision-right">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="vision-body"
          >
            <p>My journey began in the margins of college notebooks and has evolved into a full-fledged creative practice. I find inspiration in the dusty studio afternoons of Rajasthan, where the light hits the canvas just right.</p>
            <p>My work is characterized by organic linework that feels both intentional and spontaneous, and a color palette that brings the warmth of Indian craft traditions into contemporary design.</p>
          </motion.div>
        </div>
      </section>

      {/* STATS BAND */}
      <section className="stats-band">
        {stats.map((stat, i) => (
          <div key={i} className="stats-band-item">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="stat-big">{stat.value}<em style={{ fontSize: '0.6em' }}>{stat.suffix}</em></div>
              <div className="stat-sub">{stat.label}</div>
            </motion.div>
          </div>
        ))}
      </section>

      {/* SKILLS */}
      <section className="skills-section">
        <div className="sec-label">Craft & Medium</div>
        <h2 className="section-heading">Skills & <em>Expertise.</em></h2>
        <div className="skills-grid">
          {[0, 1, 2].map(colIdx => (
            <div key={colIdx} className="skill-col">
              {skills.slice(colIdx * 2, (colIdx * 2) + 2).map((skill, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: (colIdx * 0.2) + (i * 0.1) }}
                  className="skill-item"
                >
                  <span className="skill-num">{skill.num}</span>
                  <span className="skill-name">{skill.name}</span>
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* STUDIO GALLERY */}
      <section className="gallery-section">
        <div className="gallery-header">
          <div>
            <div className="sec-label">The Studio</div>
            <h2 className="section-heading !mb-8">Inside the <em>Sketchbook.</em></h2>
          </div>
        </div>
        <div className="studio-grid">
          {[
            { label: "The Desk", color: "c-te" },
            { label: "Material Study", color: "c-mo" },
            { label: "Works in Progress", color: "c-bl" },
            { label: "Pigment Wall", color: "c-warm" },
            { label: "Doodle Corner", color: "c-dp" },
            { label: "Library", color: "c-mo2" },
            { label: "Finished Works", color: "c-rust" },
            { label: "Entryway", color: "c-slate" }
          ].map((item, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="studio-cell"
            >
              <div className={`studio-cell-bg ${item.color}`}></div>
              <div className="studio-cell-label">{item.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TIMELINE */}
      <JourneySection />

      <Footer />
    </div>
  );
}
