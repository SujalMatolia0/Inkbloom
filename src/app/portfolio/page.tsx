"use client";

import { Suspense, useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, X, ShoppingCart, ArrowRight, RotateCcw, Check, Sparkles, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "@/lib/store/cart";

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
import { GALLERY_3D_ARTWORKS } from "@/data/artworks";

const LOADING_TEXTS = [
  "Curating the collection...",
  "Warming the studio...",
  "Almost there.",
];

export default function PortfolioPage() {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  const [galleryArtworks, setGalleryArtworks] = useState<any[]>(GALLERY_3D_ARTWORKS);
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState(LOADING_TEXTS[0]);
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const [selectedPainting, setSelectedPainting] = useState<any>(null);
  const [isDesktop, setIsDesktop] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);

  // Dynamic 8 painting slots along corridor walls based on curated gallery
  const paintingSlots = useMemo(() => {
    return galleryArtworks.slice(0, 8).map((art, i) => ({
      url: art.image,
      z: -3 - i * 3,
      side: i % 2 === 0 ? -1 : 1,
      index: i,
      title: art.title,
      art,
    }));
  }, [galleryArtworks]);

  const paintingsList = useMemo(() => {
    return galleryArtworks.slice(0, 8).map((art) => art.image);
  }, [galleryArtworks]);

  // Door interaction states
  const [isNearDoor, setIsNearDoor] = useState(false);
  const [showDoorModal, setShowDoorModal] = useState(false);
  const hasDismissedDoorRef = useRef(false);

  // Cart feedback state
  const [cartSuccessId, setCartSuccessId] = useState<number | null>(null);

  const hudProgressRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset scroll to top on mount so camera always starts at entrance
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Hide global navbar and footer
    document.body.classList.add("no-navbar", "no-footer");
    
    return () => {
      document.body.classList.remove("no-navbar", "no-footer");
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
      const progress = Math.min(Math.max(scrollY / (maxScroll || 1), 0), 1);
      hudProgressRef.current.style.width = `${progress * 100}%`;
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []); 

  useEffect(() => {
    preloadPaintingTextures(paintingsList);

    // Fetch dynamic admin-curated gallery artworks
    async function loadCuratedGallery() {
      try {
        const res = await fetch('/api/gallery');
        if (res.ok) {
          const data = await res.json();
          if (data.artworks && data.artworks.length > 0) {
            setGalleryArtworks(data.artworks);
            preloadPaintingTextures(data.artworks.map((a: any) => a.image));
          }
        }
      } catch (e) {
        console.warn('Using default curated collection fallback:', e);
      }
    }
    loadCuratedGallery();

    const sequence = async () => {
      for (const text of LOADING_TEXTS) {
        setLoadingText(text);
        await new Promise((r) => setTimeout(r, 700));
      }
      setLoading(false);
    };
    sequence();
  }, [paintingsList]);

  const startExperience = async () => {
    setHasStarted(true);
    
    // Request Fullscreen on document
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    }

    const audio = await getAudio();
    audio?.playWhenReady();
    setIsAudioMuted(false);
  };

  const toggleMute = useCallback(() => {
    getAudio().then((audio) => {
      audio?.toggle();
      setIsAudioMuted((s) => !s);
    });
  }, []);

  const handlePaintingClick = useCallback((index: number) => {
    const art = galleryArtworks[index];
    if (!art) return;
    setSelectedPainting({
      id: art.id || index,
      url: art.image,
      title: art.title,
      priceNumber: art.price,
      price: art.priceFormatted || `₹${art.price?.toLocaleString('en-IN')}`,
      year: art.year || '2025',
      size: art.size || 'Studio Original',
      medium: art.medium || 'Mixed Media Artwork',
      category: art.category,
      subcategory: art.subcategory || art.category,
      tag: art.tag || `${art.category} Piece`,
      description: art.description,
      isSold: art.isCommissionOnly,
      slug: art.slug,
    });
  }, [galleryArtworks]);

  // Door approach & leave triggers
  const handleNearDoor = useCallback(() => {
    setIsNearDoor(true);
    if (!hasDismissedDoorRef.current) {
      setShowDoorModal(true);
    }
  }, []);

  const handleLeaveDoor = useCallback(() => {
    setIsNearDoor(false);
    hasDismissedDoorRef.current = false;
    setShowDoorModal(false);
  }, []);

  const handleReturnToStart = useCallback(() => {
    setShowDoorModal(false);
    hasDismissedDoorRef.current = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleGoToCommission = useCallback(() => {
    router.push("/commission");
  }, [router]);

  const handleDismissDoorModal = useCallback(() => {
    hasDismissedDoorRef.current = true;
    setShowDoorModal(false);
  }, []);

  const handleAddToCart = (painting: any) => {
    addItem({
      id: painting.id || `gallery-artwork-${painting.slug}`,
      title: painting.title,
      price: painting.priceNumber || 8400,
      image: painting.url,
      slug: painting.slug || `artwork-${painting.id}`,
    });
    setCartSuccessId(painting.id);
    setTimeout(() => setCartSuccessId(null), 3500);
  };

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
                  className="btn-primary px-10 py-4 text-xs tracking-widest uppercase animate-pulse shadow-[6px_6px_0px_0px_rgba(45,45,45,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]"
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
                camera={{ position: [0, 1.7, 1.5], fov: 65, near: 0.1, far: 50 }}
                gl={{
                  antialias: true,
                  powerPreference: "high-performance",
                  toneMapping: 4, 
                  toneMappingExposure: 1.1,
                }}
                dpr={[1, 1.5]}
                style={{ width: "100vw", height: "100vh", touchAction: "none" }}
              >
                <Suspense fallback={null}>
                  <hemisphereLight args={["#FFF8F0", "#C4A882", 0.12]} />
                  <Corridor />

                  {paintingSlots.map((slot: any) => (
                    <Painting
                      key={`painting-${slot.index}-${slot.url}`}
                      url={slot.url}
                      position={[slot.side * 2.7, 1.8, slot.z]}
                      rotation={[0, slot.side === -1 ? Math.PI / 2 : -Math.PI / 2, 0]}
                      title={slot.title}
                      isSold={slot.art?.isCommissionOnly}
                      onSelect={() => handlePaintingClick(slot.index)}
                    />
                  ))}

                  <CommissionDoor onNearDoor={handleNearDoor} onLeaveDoor={handleLeaveDoor} />
                  <CameraRig isReady={true} />
                </Suspense>
              </Canvas>
            ) : (
              <MobileGallery 
                paintings={paintingsList} 
                onSelect={handlePaintingClick} 
                onGoToCommission={handleGoToCommission}
                onReturnToStart={handleReturnToStart}
              />
            )}
          </div>

          {/* Vignette */}
          <div
            className="fixed inset-0 pointer-events-none z-10"
            style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(28,20,16,0.6) 100%)" }}
          />

          {/* Top Left Navigation: Exit to Studio */}
          <div className="fixed top-8 left-8 z-[60] flex items-center gap-3">
            <Link
              href="/"
              className="px-4 py-2.5 bg-linen/90 backdrop-blur-md border border-charcoal/30 text-[11px] font-bold tracking-widest uppercase text-charcoal hover:border-charcoal hover:bg-linen shadow-[3px_3px_0px_0px_rgba(45,45,45,0.8)] transition-all flex items-center gap-2"
            >
              <Home size={14} />
              <span>Exit Gallery</span>
            </Link>
          </div>

          {/* Top Right Controls: Mute Audio */}
          <div className="fixed top-8 right-8 z-[60]">
            <button 
              onClick={toggleMute} 
              aria-label={isAudioMuted ? "Unmute audio" : "Mute audio"}
              className="nav-btn bg-linen/90 backdrop-blur-md border border-charcoal/30 shadow-[3px_3px_0px_0px_rgba(45,45,45,0.8)] hover:bg-linen transition-all"
            >
              {isAudioMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
          </div>

          {/* Scroll progress HUD */}
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[140px] h-[2px] bg-charcoal/20 z-50 pointer-events-none">
            <div ref={hudProgressRef} className="h-full bg-terra" style={{ width: "0%" }} />
          </div>

          {/* Scroll driver (controls 3D corridor camera trajectory) */}
          <div className="relative z-0 h-[400vh] w-full pointer-events-none" />

          {/* Floating trigger if modal was dismissed while standing near door */}
          <AnimatePresence>
            {isNearDoor && !showDoorModal && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="fixed bottom-12 right-8 z-[60]"
              >
                <button
                  onClick={() => setShowDoorModal(true)}
                  className="btn-primary py-3 px-6 text-xs font-bold tracking-widest uppercase flex items-center gap-2.5 shadow-[4px_4px_0px_0px_rgba(45,45,45,1)] hover:translate-x-[-1px] hover:translate-y-[-1px]"
                >
                  <Sparkles size={15} />
                  <span>Studio Doorway</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Studio Door Destination Screen / Modal */}
          <AnimatePresence>
            {showDoorModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-charcoal/65 backdrop-blur-md"
              >
                <motion.div
                  initial={{ scale: 0.92, y: 24, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  exit={{ scale: 0.92, y: 24, opacity: 0 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className="relative w-full max-w-lg bg-linen border-2 border-charcoal p-8 md:p-10 shadow-[10px_10px_0px_0px_rgba(45,45,45,1)]"
                >
                  {/* Close button */}
                  <button
                    onClick={handleDismissDoorModal}
                    className="absolute top-4 right-4 p-2 text-charcoal/50 hover:text-charcoal hover:bg-charcoal/5 rounded-full transition-colors"
                    aria-label="Dismiss modal"
                  >
                    <X size={20} />
                  </button>

                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-terra/10 border border-terra/30 text-terra text-[10px] font-bold tracking-widest uppercase mb-4">
                    <span>✦</span>
                    <span>Studio Doorway</span>
                  </div>

                  {/* Title */}
                  <h3 className="font-serif text-3xl md:text-4xl font-bold text-charcoal leading-tight">
                    You have reached the <em className="italic text-terra">Studio Door.</em>
                  </h3>

                  {/* Description */}
                  <p className="mt-4 text-sm text-charcoal/80 leading-relaxed font-sans">
                    You have reached the end of the gallery corridor. The doors to our private atelier stand before you. Would you like to commission a bespoke piece of art, or return to the start of the corridor to view the collection again?
                  </p>

                  {/* Action Buttons */}
                  <div className="mt-8 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleGoToCommission}
                      className="flex-1 btn-primary py-3.5 px-6 text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(45,45,45,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(45,45,45,1)] transition-all"
                    >
                      <span>Commission Art</span>
                      <ArrowRight size={15} />
                    </button>

                    <button
                      onClick={handleReturnToStart}
                      className="flex-1 btn-outline py-3.5 px-6 text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-charcoal/5 transition-colors"
                    >
                      <RotateCcw size={15} />
                      <span>Back to Start</span>
                    </button>
                  </div>

                  {/* Secondary Dismiss */}
                  <div className="mt-5 text-center">
                    <button
                      onClick={handleDismissDoorModal}
                      className="text-[11px] text-charcoal/50 hover:text-charcoal underline underline-offset-4 transition-colors"
                    >
                      Stay here &amp; look around
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

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
                  aria-label="Close details"
                >
                  <X size={18} />
                </button>
                <div className="flex flex-col sm:flex-row gap-6 md:gap-8">
                  <div className="w-full sm:w-36 h-48 sm:h-52 border-1.5 border-charcoal overflow-hidden flex-shrink-0 bg-charcoal/5">
                    <img src={selectedPainting.url} alt={selectedPainting.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 bg-terra/10 border border-terra/30 text-terra">
                        {selectedPainting.tag || selectedPainting.category}
                      </span>
                      <span className="text-[10px] font-mono text-charcoal/60 uppercase">
                        {selectedPainting.subcategory} · {selectedPainting.category}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-serif font-bold text-charcoal leading-tight">
                      {selectedPainting.title}
                    </h2>
                    <p className="mt-1.5 text-[11px] font-sans text-charcoal/60 uppercase tracking-wider">
                      {selectedPainting.medium} • {selectedPainting.size} • {selectedPainting.year}
                    </p>
                    <p className="mt-3 text-[12.5px] text-charcoal/80 leading-relaxed">
                      {selectedPainting.description}
                    </p>
                    <div className="mt-auto pt-5 flex items-center justify-between gap-4 flex-wrap">
                      <div>
                        <div className="text-[9px] uppercase tracking-wider text-charcoal/50">Artisan Valuation</div>
                        <span className="text-2xl font-bold text-terra">{selectedPainting.price}</span>
                      </div>
                      {selectedPainting.isSold ? (
                        <button 
                          onClick={handleGoToCommission}
                          className="btn-primary py-2.5 px-5 text-[10px] tracking-wider uppercase flex items-center gap-2 shadow-[3px_3px_0px_0px_rgba(45,45,45,1)] hover:translate-x-[-1px] hover:translate-y-[-1px]"
                        >
                          <span>Commission Similar Art</span>
                          <ArrowRight size={13} />
                        </button>
                      ) : (
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => handleAddToCart(selectedPainting)}
                            className="btn-primary flex items-center gap-2 py-2.5 px-5 text-[10px] tracking-wider uppercase shadow-[3px_3px_0px_0px_rgba(45,45,45,1)] hover:translate-x-[-1px] hover:translate-y-[-1px]"
                          >
                            {cartSuccessId === selectedPainting.id ? (
                              <>
                                <Check size={14} className="text-moss" />
                                <span>Added to Cart!</span>
                              </>
                            ) : (
                              <>
                                <ShoppingCart size={14} />
                                <span>Add to Cart</span>
                              </>
                            )}
                          </button>
                          {cartSuccessId === selectedPainting.id && (
                            <Link 
                              href="/cart"
                              className="text-[11px] font-bold text-terra underline underline-offset-2 hover:text-charcoal transition-colors"
                            >
                              View Cart →
                            </Link>
                          )}
                        </div>
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

function MobileGallery({ 
  paintings, 
  onSelect,
  onGoToCommission,
  onReturnToStart,
}: { 
  paintings: string[]; 
  onSelect: (i: number) => void;
  onGoToCommission: () => void;
  onReturnToStart: () => void;
}) {
  return (
    <div className="flex flex-col h-full bg-linen p-6 overflow-y-auto pb-32">
      <header className="mb-8 mt-4 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-serif font-bold text-charcoal tracking-tighter">Portfolio</h1>
          <div className="w-12 h-1 bg-terra mt-1" />
        </div>
        <Link
          href="/"
          className="px-3 py-1.5 bg-linen border border-charcoal/30 text-[10px] font-bold tracking-widest uppercase text-charcoal"
        >
          Exit
        </Link>
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

      {/* End of Gallery Card for Mobile */}
      <div className="mt-12 p-6 bg-linen border-2 border-charcoal shadow-[6px_6px_0px_0px_rgba(45,45,45,1)] text-center">
        <div className="text-[10px] font-bold tracking-widest uppercase text-terra mb-2">✦ The Studio Door</div>
        <h3 className="font-serif text-2xl font-bold text-charcoal mb-3">End of the Collection</h3>
        <p className="text-xs text-charcoal/70 mb-6 leading-relaxed">
          Commission a custom original piece from Studio Vinyas in Ratangarh, Rajasthan, or return to the beginning of the gallery.
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={onGoToCommission}
            className="btn-primary py-3 text-xs tracking-wider uppercase flex items-center justify-center gap-2"
          >
            <span>Commission Art</span>
            <ArrowRight size={14} />
          </button>
          <button
            onClick={onReturnToStart}
            className="btn-outline py-3 text-xs tracking-wider uppercase flex items-center justify-center gap-2"
          >
            <RotateCcw size={14} />
            <span>Back to Start</span>
          </button>
        </div>
      </div>
    </div>
  );
}
