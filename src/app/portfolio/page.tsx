"use client";

import { Suspense, useState, useEffect, useRef, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { motion, AnimatePresence } from "framer-motion";
import Player from "react-lottie-player";
import { Volume2, VolumeX, X, ShoppingCart } from "lucide-react";

// Lazy — Howler creates an AudioContext on import, keep it off other pages
let _audio: typeof import("@/lib/audio") | null = null;
const getAudio = async () => {
  if (!_audio) _audio = await import("@/lib/audio");
  return _audio.audioController;
};

import { Corridor } from "@/components/three/Corridor";
import { CameraRig } from "@/components/three/CameraRig";
import { Painting, preloadPaintingTextures } from "@/components/three/Painting";
import { CommissionDoor } from "@/components/three/CommissionDoor";

// 8 unique paintings — one per slot, no repeats
const PAINTINGS = [
  "https://picsum.photos/seed/ink1/800/1100",
  "https://picsum.photos/seed/ink2/800/1100",
  "https://picsum.photos/seed/ink3/800/1100",
  "https://picsum.photos/seed/ink4/800/1100",
  "https://picsum.photos/seed/ink5/800/1100",
  "https://picsum.photos/seed/ink6/800/1100",
  "https://picsum.photos/seed/ink7/800/1100",
  "https://picsum.photos/seed/ink8/800/1100",
];

// Corridor is 32 units long (z: 1 → -31).
// Camera travels z: 2 → -23.
// 8 painting slots spaced 3 units apart, alternating left/right walls.
// Slot z positions: -3, -6, -9, -12, -15, -18, -21, -24
const PAINTING_SLOTS = PAINTINGS.map((url, i) => ({
  url,
  z: -3 - i * 3,                          // -3 to -24, all inside corridor
  side: i % 2 === 0 ? -1 : 1,             // alternate left/right
  index: i,
}));

const LOADING_TEXTS = [
  "Curating the collection...",
  "Warming the studio...",
  "Almost there.",
];

export default function PortfolioPage() {
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState(LOADING_TEXTS[0]);
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const [selectedPainting, setSelectedPainting] = useState<any>(null);
  const [isDesktop, setIsDesktop] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const hudProgressRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset scroll to top on mount so camera always starts at entrance
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Hide global navbar and footer
    document.body.classList.add('no-navbar', 'no-footer');
    
    return () => {
      document.body.classList.remove('no-navbar', 'no-footer');
    };
  }, []);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth > 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!hudProgressRef.current) return;
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(Math.max(scrollY / maxScroll, 0), 1);
      hudProgressRef.current.style.width = `${progress * 100}%`;
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []); 

  useEffect(() => {
    preloadPaintingTextures(PAINTINGS);

    const sequence = async () => {
      for (const text of LOADING_TEXTS) {
        setLoadingText(text);
        await new Promise(r => setTimeout(r, 700));
      }
      setLoading(false);
    };
    sequence();
  }, []);

  const startExperience = async () => {
    setHasStarted(true);
    
    // Request Fullscreen on document
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(err => {
        console.warn(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    }

    const audio = await getAudio();
    audio?.playWhenReady();
    setIsAudioMuted(false);
  };

  const toggleMute = useCallback(() => {
    getAudio().then(audio => {
      audio?.toggle();
      setIsAudioMuted(s => !s);
    });
  }, []);

  const handlePaintingClick = useCallback((index: number) => {
    setSelectedPainting({
      id: index,
      url: PAINTINGS[index],
      title: `Artwork #${index + 1}`,
      price: "₹8,400",
      year: "2025",
      size: '18" x 24"',
      medium: "Oil on Canvas",
      isSold: index % 4 === 0,
    });
  }, []);

  return (
    <div ref={containerRef} className="relative w-full min-h-screen bg-linen overflow-x-hidden">
      {/* Loading & Start Overlay */}
      <AnimatePresence>
        {(loading || !hasStarted) && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-linen"
          >
            <div className="w-64 h-64 flex items-center justify-center">
              {loading ? (
                <div className="w-16 h-16 border-4 border-terra border-t-transparent rounded-full animate-spin" />
              ) : (
                <button 
                  onClick={startExperience}
                  className="btn-primary px-10 py-4 text-xs tracking-widest uppercase animate-pulse"
                >
                  Enter Gallery
                </button>
              )}
            </div>
            <p className="mt-8 text-xs font-bold text-charcoal tracking-[0.2em] uppercase">
              {loading ? loadingText : "Curated experience awaits"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {hasStarted && (
        <>
          {/* 3D Canvas — fixed, fills viewport */}
          <div className="fixed inset-0 z-0 h-screen w-screen overflow-hidden">
            {isDesktop ? (
              <Canvas
                shadows={false}
                camera={{ position: [0, 1.7, 2], fov: 65, near: 0.1, far: 50 }}
                gl={{
                  antialias: true,
                  powerPreference: "high-performance",
                  toneMapping: 4, 
                  toneMappingExposure: 1.1,
                }}
                dpr={[1, 2]}
                style={{ width: '100vw', height: '100vh', touchAction: 'none' }}
              >
                <Suspense fallback={null}>
                   <hemisphereLight args={["#FFF8F0", "#C4A882", 0.5]} />
                  <Corridor />

                  {PAINTING_SLOTS.map((slot) => (
                    <Painting
                      key={`painting-${slot.index}`}
                      url={slot.url}
                      position={[slot.side * 2.7, 1.8, slot.z]}
                      rotation={[0, slot.side === -1 ? Math.PI / 2 : -Math.PI / 2, 0]}
                      title={`Artwork #${slot.index + 1}`}
                      isSold={slot.index % 4 === 0}
                      onSelect={() => handlePaintingClick(slot.index)}
                    />
                  ))}

                  <CommissionDoor />
                  <CameraRig isReady={true} />
                </Suspense>
              </Canvas>
            ) : (
              <MobileGallery paintings={PAINTINGS} onSelect={handlePaintingClick} />
            )}
          </div>

          {/* Vignette */}
          <div
            className="fixed inset-0 pointer-events-none z-10"
            style={{ background: 'radial-gradient(ellipse at center, transparent 55%, rgba(28,20,16,0.6) 100%)' }}
          />

          {/* Scroll progress HUD */}
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[120px] h-[1px] bg-charcoal/25 z-50 pointer-events-none">
            <div ref={hudProgressRef} className="h-full bg-terra" style={{ width: '0%' }} />
          </div>

          {/* Scroll driver */}
          <div className="relative z-0 h-[400vh] w-full pointer-events-none" />

          {/* Mute button */}
          <div className="fixed top-24 right-8 z-[60]">
            <button onClick={toggleMute} className="nav-btn bg-linen/80 backdrop-blur-sm">
              {isAudioMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
          </div>

          {/* Painting info card */}
          <AnimatePresence>
            {selectedPainting && (
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed bottom-0 left-0 right-0 z-[120] p-8 bg-linen border-t-2 border-charcoal shadow-2xl md:max-w-xl md:left-1/2 md:-translate-x-1/2"
              >
                <button
                  onClick={() => setSelectedPainting(null)}
                  className="absolute top-4 right-4 text-charcoal/40 hover:text-charcoal nav-btn"
                >
                  <X size={18} />
                </button>
                <div className="flex gap-8">
                  <div className="w-32 h-44 border-1.5 border-charcoal overflow-hidden flex-shrink-0">
                    <img src={selectedPainting.url} alt={selectedPainting.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col flex-1">
                    <h2 className="text-2xl font-serif font-bold text-charcoal leading-none">
                      {selectedPainting.title}
                    </h2>
                    <p className="mt-2 text-xs font-sans text-charcoal/60 uppercase tracking-wider">
                      {selectedPainting.medium} • {selectedPainting.size} • {selectedPainting.year}
                    </p>
                    <p className="mt-4 text-[13px] text-charcoal/80 leading-relaxed line-clamp-3">
                      This piece explores the intersection of editorial cleanliness and raw joy. Crafted with passion in our Jaipur studio.
                    </p>
                    <div className="mt-auto pt-6 flex items-center justify-between">
                      <span className="text-xl font-bold text-terra">{selectedPainting.price}</span>
                      {selectedPainting.isSold ? (
                        <button className="btn-outline py-2 px-4 text-[10px]">
                          Commission Similar
                        </button>
                      ) : (
                        <button className="btn-primary flex items-center gap-2 py-2 px-4 text-[10px]">
                          <ShoppingCart size={14} /> Add to Cart
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}

function MobileGallery({ paintings, onSelect }: { paintings: string[]; onSelect: (i: number) => void }) {
  return (
    <div className="flex flex-col h-full bg-linen p-6 overflow-y-auto pb-32">
      <header className="mb-12 mt-8">
        <h1 className="text-5xl font-serif font-bold text-charcoal tracking-tighter">Portfolio</h1>
        <div className="w-12 h-1 bg-terra mt-2" />
      </header>
      <div className="grid gap-8">
        {paintings.map((url, i) => (
          <motion.div
            key={i}
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 30 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="aspect-[3/4] overflow-hidden cursor-pointer border-1.5 border-charcoal"
            onClick={() => onSelect(i)}
          >
            <img
              src={url}
              alt={`Artwork ${i + 1}`}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
