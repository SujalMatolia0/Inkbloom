"use client";

import { Suspense, useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Volume2, 
  VolumeX, 
  X, 
  ShoppingCart, 
  ArrowRight, 
  RotateCcw, 
  Check, 
  Sparkles, 
  Home, 
  Box, 
  Eye, 
  Layers 
} from "lucide-react";
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
  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const [galleryArtworks, setGalleryArtworks] = useState<any[]>(GALLERY_3D_ARTWORKS);
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState(LOADING_TEXTS[0]);
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const [selectedPainting, setSelectedPainting] = useState<any>(null);
  const [isDesktop, setIsDesktop] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [mobileView, setMobileView] = useState<"exhibition" | "3d">("exhibition");

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
  const [cartSuccessId, setCartSuccessId] = useState<any>(null);

  const hudProgressRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check if 3D should be active
  const is3DActive = isDesktop || mobileView === "3d";

  // Reset scroll to top on mount
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
        await new Promise((r) => setTimeout(r, 600));
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
      id: painting.id ? String(painting.id) : `gallery-artwork-${painting.slug || 'art'}`,
      title: painting.title,
      price: painting.priceNumber || painting.price || 8400,
      image: painting.url || painting.image,
      slug: painting.slug || `artwork-${painting.id}`,
    });
    setCartSuccessId(painting.id || painting.slug);
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
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-linen px-6 text-center"
          >
            <div className="w-48 h-48 sm:w-64 sm:h-64 flex items-center justify-center">
              {loading ? (
                <div className="w-14 h-14 border-4 border-terra border-t-transparent rounded-full animate-spin" />
              ) : (
                <button 
                  onClick={startExperience}
                  className="btn-primary px-8 sm:px-10 py-3.5 sm:py-4 text-xs tracking-widest uppercase animate-pulse shadow-[6px_6px_0px_0px_rgba(45,45,45,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]"
                >
                  Enter Gallery
                </button>
              )}
            </div>
            <p className="mt-6 text-xs font-bold text-charcoal tracking-[0.2em] uppercase">
              {loading ? loadingText : "Curated experience awaits"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {hasStarted && (
        <>
          {is3DActive ? (
            /* 3D Canvas Experience (Desktop by default, or Mobile when 3D mode enabled) */
            <>
              <div className="fixed inset-0 z-0 h-screen w-screen overflow-hidden">
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
              </div>

              {/* Vignette */}
              <div
                className="fixed inset-0 pointer-events-none z-10"
                style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(28,20,16,0.6) 100%)" }}
              />

              {/* Top Controls: Exit & View Switcher */}
              <div className="fixed top-6 left-6 z-[60] flex items-center gap-2">
                <Link
                  href="/"
                  className="px-3.5 py-2 bg-linen/95 backdrop-blur-md border border-charcoal/30 text-[10px] sm:text-[11px] font-bold tracking-widest uppercase text-charcoal hover:border-charcoal hover:bg-linen shadow-[3px_3px_0px_0px_rgba(45,45,45,0.8)] transition-all flex items-center gap-1.5"
                >
                  <Home size={13} />
                  <span>Exit</span>
                </Link>

                {!isDesktop && (
                  <button
                    onClick={() => {
                      setMobileView("exhibition");
                      window.scrollTo({ top: 0, behavior: "instant" });
                    }}
                    className="px-3.5 py-2 bg-charcoal text-linen border border-charcoal text-[10px] font-bold tracking-widest uppercase shadow-[3px_3px_0px_0px_rgba(45,45,45,0.8)] transition-all flex items-center gap-1.5"
                  >
                    <Layers size={13} />
                    <span>Cards View</span>
                  </button>
                )}
              </div>

              {/* Top Right Controls: Mute Audio */}
              <div className="fixed top-6 right-6 z-[60] flex items-center gap-2">
                <button 
                  onClick={toggleMute} 
                  aria-label={isAudioMuted ? "Unmute audio" : "Mute audio"}
                  className="nav-btn bg-linen/95 backdrop-blur-md border border-charcoal/30 shadow-[3px_3px_0px_0px_rgba(45,45,45,0.8)] hover:bg-linen transition-all"
                >
                  {isAudioMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
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
            </>
          ) : (
            /* Dedicated Mobile Exhibition View — Natural Scrolling, Rich Cards & No Overlapping Overlays */
            <MobileGallery 
              artworks={galleryArtworks.slice(0, 8)} 
              onSelect={handlePaintingClick} 
              onGoToCommission={handleGoToCommission}
              onAddToCart={handleAddToCart}
              cartSuccessId={cartSuccessId}
              cartCount={cartCount}
              isAudioMuted={isAudioMuted}
              onToggleMute={toggleMute}
              onSwitchTo3D={() => {
                setMobileView("3d");
                window.scrollTo({ top: 0, behavior: "instant" });
              }}
            />
          )}

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
                  className="relative w-full max-w-lg bg-linen border-2 border-charcoal p-6 sm:p-8 md:p-10 shadow-[10px_10px_0px_0px_rgba(45,45,45,1)] max-h-[90vh] overflow-y-auto"
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

          {/* Painting info card (Bottom Sheet) */}
          <AnimatePresence>
            {selectedPainting && (
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed bottom-0 left-0 right-0 z-[120] p-5 sm:p-8 bg-linen border-t-2 border-charcoal shadow-2xl md:max-w-xl md:left-1/2 md:-translate-x-1/2 max-h-[85vh] overflow-y-auto"
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
                            {cartSuccessId === (selectedPainting.id || selectedPainting.slug) ? (
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
                          {cartSuccessId === (selectedPainting.id || selectedPainting.slug) && (
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
  artworks, 
  onSelect,
  onGoToCommission,
  onAddToCart,
  cartSuccessId,
  cartCount,
  isAudioMuted,
  onToggleMute,
  onSwitchTo3D,
}: { 
  artworks: any[]; 
  onSelect: (i: number) => void;
  onGoToCommission: () => void;
  onAddToCart: (art: any) => void;
  cartSuccessId: any;
  cartCount: number;
  isAudioMuted: boolean;
  onToggleMute: () => void;
  onSwitchTo3D: () => void;
}) {
  return (
    <div className="w-full min-h-screen bg-linen text-charcoal pb-24">
      {/* Sticky Mobile Top Bar */}
      <header className="sticky top-0 z-40 bg-linen/95 backdrop-blur-md border-b-2 border-charcoal px-4 py-3 flex items-center justify-between shadow-sm">
        <Link href="/" className="font-serif text-lg font-bold text-charcoal flex items-center gap-1.5">
          <span>Vin<span className="text-terra italic">yas</span></span>
          <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-terra px-1.5 py-0.5 border border-terra/30 bg-terra/10 ml-1">
            Gallery
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Switch to 3D Tour */}
          <button
            onClick={onSwitchTo3D}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-charcoal text-linen text-[9.5px] font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(193,123,92,1)] active:translate-x-0.5 active:translate-y-0.5"
            title="Switch to 3D Corridor Tour"
          >
            <Box size={12} className="text-terra" />
            <span>3D Tour</span>
          </button>

          {/* Sound toggle */}
          <button
            onClick={onToggleMute}
            aria-label={isAudioMuted ? "Play ambient audio" : "Mute ambient audio"}
            className="w-8 h-8 flex items-center justify-center border border-charcoal/30 bg-linen hover:bg-charcoal/5 transition-colors"
          >
            {isAudioMuted ? <VolumeX size={14} /> : <Volume2 size={14} className="text-terra" />}
          </button>

          {/* Cart Icon */}
          <Link
            href="/cart"
            className="relative w-8 h-8 flex items-center justify-center border border-charcoal/30 bg-linen hover:bg-charcoal/5 transition-colors"
          >
            <ShoppingCart size={14} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-terra text-linen text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Exit button */}
          <Link
            href="/"
            className="px-2.5 py-1.5 border border-charcoal/40 text-[9.5px] font-bold uppercase tracking-wider text-charcoal hover:bg-charcoal hover:text-linen transition-colors"
          >
            Exit
          </Link>
        </div>
      </header>

      {/* Mobile Exhibition Intro Banner */}
      <div className="px-5 pt-8 pb-6 border-b border-charcoal/15 bg-paper/50">
        <div className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-terra mb-2">
          <span>✦</span>
          <span>Studio Atelier · Ratangarh</span>
        </div>
        <h1 className="font-serif text-3xl font-bold text-charcoal leading-tight tracking-tight">
          Curated Exhibition
        </h1>
        <p className="text-xs text-charcoal/70 mt-2 leading-relaxed max-w-md">
          Explore original mixed media, textured relief, and handmade artworks by Anki Matolia. Tap any work to view details or add to cart.
        </p>
        <div className="mt-4 flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 bg-terra/10 border border-terra/30 text-terra">
            {artworks.length} Curated Originals
          </span>
          <span className="text-[10px] text-charcoal/40 font-mono">
            Direct from Studio
          </span>
        </div>
      </div>

      {/* Artworks List */}
      <div className="px-4 pt-6 space-y-7 max-w-lg mx-auto">
        {artworks.map((art, i) => (
          <motion.div
            key={art.id || i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            className="bg-paper border-2 border-charcoal shadow-[4px_4px_0px_0px_rgba(45,45,45,1)] overflow-hidden"
          >
            {/* Artwork Image Frame */}
            <div 
              className="relative aspect-[4/3] overflow-hidden bg-charcoal/5 border-b-2 border-charcoal cursor-pointer group"
              onClick={() => onSelect(i)}
            >
              <img
                src={art.image}
                alt={art.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-3 left-3 bg-linen/95 border border-charcoal px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-terra shadow-sm">
                {art.tag || art.category}
              </div>
              {art.isCommissionOnly && (
                <div className="absolute top-3 right-3 bg-charcoal text-linen px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest">
                  Commission Only
                </div>
              )}
            </div>

            {/* Artwork Info & Actions */}
            <div className="p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3 mb-1.5">
                <h3 
                  onClick={() => onSelect(i)}
                  className="font-serif text-xl font-bold text-charcoal leading-tight cursor-pointer hover:text-terra transition-colors"
                >
                  {art.title}
                </h3>
                <span className="font-bold text-terra text-base shrink-0">
                  {art.priceFormatted || `₹${art.price?.toLocaleString('en-IN')}`}
                </span>
              </div>

              <p className="text-[10.5px] font-sans text-charcoal/60 uppercase tracking-wider mb-2">
                {art.medium || "Mixed Media"} • {art.size || "Original"} • {art.year || "2025"}
              </p>

              {art.description && (
                <p className="text-xs text-charcoal/75 line-clamp-2 leading-relaxed mb-4">
                  {art.description}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-3 border-t border-charcoal/10">
                <button
                  onClick={() => onSelect(i)}
                  className="flex-1 py-2 px-3 border border-charcoal text-[10px] font-bold uppercase tracking-wider text-charcoal hover:bg-charcoal hover:text-linen transition-colors text-center"
                >
                  View Details
                </button>

                {art.isCommissionOnly ? (
                  <button
                    onClick={onGoToCommission}
                    className="flex-1 py-2 px-3 bg-terra text-linen text-[10px] font-bold uppercase tracking-wider hover:bg-terra-dark transition-colors text-center"
                  >
                    Commission
                  </button>
                ) : (
                  <button
                    onClick={() => onAddToCart(art)}
                    className="flex-1 py-2 px-3 bg-charcoal text-linen text-[10px] font-bold uppercase tracking-wider hover:bg-charcoal/90 transition-colors text-center flex items-center justify-center gap-1.5"
                  >
                    {cartSuccessId === (art.id || art.slug) ? (
                      <>
                        <Check size={12} className="text-moss" />
                        <span>Added!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={12} />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* End of Gallery Destination Card */}
      <div className="mt-10 mx-4 max-w-lg sm:mx-auto p-6 bg-linen border-2 border-charcoal shadow-[5px_5px_0px_0px_rgba(45,45,45,1)] text-center">
        <div className="text-[10px] font-bold tracking-widest uppercase text-terra mb-2">
          ✦ The Atelier Door
        </div>
        <h3 className="font-serif text-2xl font-bold text-charcoal mb-2.5">
          End of Curated Works
        </h3>
        <p className="text-xs text-charcoal/70 mb-6 leading-relaxed">
          Looking for a custom portrait, spiritual relief, or architectural mural? Anki Matolia creates one-of-a-kind bespoke commissions.
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={onGoToCommission}
            className="btn-primary py-3 text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-[3px_3px_0px_0px_rgba(45,45,45,1)]"
          >
            <span>Commission Art</span>
            <ArrowRight size={14} />
          </button>
          <Link
            href="/shop"
            className="btn-outline py-3 text-xs tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-charcoal/5 transition-colors"
          >
            <span>Explore Live Shop</span>
          </Link>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-[11px] font-bold uppercase tracking-wider text-charcoal/50 hover:text-charcoal transition-colors py-2 flex items-center justify-center gap-1.5"
          >
            <RotateCcw size={12} />
            <span>Back to Top</span>
          </button>
        </div>
      </div>
    </div>
  );
}
