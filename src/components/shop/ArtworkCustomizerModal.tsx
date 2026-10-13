'use client';

import { useState, useId } from 'react';
import Image from 'next/image';
import { useCartStore, ItemCustomization } from '@/lib/store/cart';
import { submitCommission } from '@/app/actions/commissions';
import { uploadFile } from '@/lib/storage';
import {
  X,
  Upload,
  Sparkles,
  ShieldCheck,
  Package,
  CheckCircle2,
  Calendar,
  Layers,
  Palette,
  MapPin,
  Maximize2,
  AlertCircle,
  HelpCircle,
  Loader2,
} from 'lucide-react';

export interface CustomizerProduct {
  id: string;
  title: string;
  price: number;
  image: string;
  slug: string;
  category: string;
  stock: number;
  subcategory?: string;
  medium?: string;
}

interface ArtworkCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: CustomizerProduct;
}

export function ArtworkCustomizerModal({
  isOpen,
  onClose,
  product,
}: ArtworkCustomizerModalProps) {
  const addItem = useCartStore((state) => state.addItem);
  const uniqueId = useId();

  const isMural = product.category === 'Wall Art';
  const isSketch =
    product.category === 'Sketch' ||
    product.title.toLowerCase().includes('portrait') ||
    product.title.toLowerCase().includes('sketch');
  const isResinOrCraft =
    product.category === 'Craft' ||
    (product.subcategory && product.subcategory.includes('Resin')) ||
    product.title.toLowerCase().includes('resin') ||
    product.title.toLowerCase().includes('varmala') ||
    product.title.toLowerCase().includes('keepsake');
  const isCanvas =
    product.category === 'Canvas' ||
    product.title.toLowerCase().includes('canvas') ||
    product.title.toLowerCase().includes('pichwai');

  // Common fields
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [instructions, setInstructions] = useState('');
  const [referenceImgUrl, setReferenceImgUrl] = useState<string>('');
  const [fileName, setFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Mode: Mural Fields
  const [wallWidth, setWallWidth] = useState('10');
  const [wallHeight, setWallHeight] = useState('8');
  const [surfaceType, setSurfaceType] = useState(
    'Interior Drywall / Smooth Plaster',
  );
  const [muralLocation, setMuralLocation] = useState('Jaipur / Rajasthan');
  const [targetDate, setTargetDate] = useState('');

  // Mode: Sketch Fields
  const [sketchStyle, setSketchStyle] = useState(
    'Realistic Charcoal & Graphite',
  );
  const [facesCount, setFacesCount] = useState<number>(1);
  const [sketchSize, setSketchSize] = useState('A3 (12×17 in)');
  const [sketchFrame, setSketchFrame] = useState('Premium Black Gallery Frame');
  const [combinePhotos, setCombinePhotos] = useState(false);

  // Mode: Craft & Resin Fields
  const [moldShape, setMoldShape] = useState('9" Hexagon Deep Block');
  const [namesAndDate, setNamesAndDate] = useState('');
  const [includeGoldFlakes, setIncludeGoldFlakes] = useState(true);
  const [includeLedBase, setIncludeLedBase] = useState(false);
  const [includeClockMechanism, setIncludeClockMechanism] = useState(false);

  // Mode: Canvas Fields
  const [canvasSize, setCanvasSize] = useState('24×36 in (Medium Canvas)');
  const [canvasStyle, setCanvasStyle] = useState(
    'Textured Acrylic Impasto & Mixed Media',
  );

  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Handle Photo Upload with Cloudinary
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage(
          'Image file too large. Please upload an image under 10MB.',
        );
        return;
      }
      setFileName(file.name);
      setIsUploadingPhoto(true);
      setErrorMessage('');

      try {
        const cloudUrl = await uploadFile(file, 'Vinyas/custom-orders');
        setReferenceImgUrl(cloudUrl);
      } catch (err) {
        console.warn('Cloudinary upload fallback:', err);
        const reader = new FileReader();
        reader.onload = () => {
          setReferenceImgUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      } finally {
        setIsUploadingPhoto(false);
      }
    }
  };

  // Dynamic Price Calculation
  const calculateCalculatedPrice = (): number => {
    let base = product.price || 1500;

    if (isSketch) {
      let extraFaces = Math.max(0, facesCount - 1) * 800;
      let frameAdd = sketchFrame.includes('Black')
        ? 550
        : sketchFrame.includes('Wood')
          ? 850
          : 0;
      let sizeAdd = sketchSize.includes('A2')
        ? 1200
        : sketchSize.includes('A3')
          ? 500
          : 0;
      return base + extraFaces + frameAdd + sizeAdd;
    }

    if (isResinOrCraft) {
      let addOns = 0;
      if (includeGoldFlakes) addOns += 250;
      if (includeLedBase) addOns += 600;
      if (includeClockMechanism) addOns += 450;
      if (moldShape.includes('Clock') || moldShape.includes('12"'))
        addOns += 800;
      return base + addOns;
    }

    if (isCanvas) {
      let sizeAdd = canvasSize.includes('36×48')
        ? 3500
        : canvasSize.includes('24×36')
          ? 1500
          : 0;
      return base + sizeAdd;
    }

    return base;
  };

  const calculatedTotal = calculateCalculatedPrice();

  // Submission for Wall Art (Commission Mode)
  const handleMuralCommissionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientEmail.trim()) {
      setErrorMessage('Please enter your name and email.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    const brief = `
[WALL ART & BESPOKE MURAL INQUIRY]
Mural Theme: ${product.title}
Estimated Size: ${wallWidth} ft (W) × ${wallHeight} ft (H) = ${Number(wallWidth || 0) * Number(wallHeight || 0)} sq.ft
Surface Type: ${surfaceType}
Location/City: ${muralLocation}
Target Completion: ${targetDate || 'Flexible'}
Client Phone: ${clientPhone || 'Not provided'}
Concept & Vision:
${instructions || 'Follow studio piece aesthetic'}
Reference Attached: ${fileName ? `Yes (${fileName})` : 'None'}
    `.trim();

    const formData = new FormData();
    formData.append('name', clientName.trim());
    formData.append('email', clientEmail.trim());
    formData.append('instructions', brief);

    try {
      const res = await submitCommission(formData);
      if (res.success) {
        setIsSuccess(true);
      } else {
        setErrorMessage(
          res.error || 'Failed to submit mural commission inquiry.',
        );
      }
    } catch {
      setErrorMessage('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add Customized Item to Cart
  const handleAddToCartCustomized = () => {
    const customizationData: ItemCustomization = {
      categoryType: product.category,
      instructions: instructions.trim(),
      referenceImg: referenceImgUrl || undefined,
    };

    if (isSketch) {
      customizationData.style = sketchStyle;
      customizationData.facesCount = facesCount;
      customizationData.size = sketchSize;
      customizationData.frame = sketchFrame;
    } else if (isResinOrCraft) {
      customizationData.moldShape = moldShape;
      customizationData.namesDate = namesAndDate;
      customizationData.isPhysicalCourierRequired = isResinOrCraft;
    } else if (isCanvas) {
      customizationData.size = canvasSize;
      customizationData.style = canvasStyle;
    }

    const customCartItemId = `${product.id}-custom-${Date.now()}`;

    addItem({
      id: customCartItemId,
      productId: product.id,
      title: `${product.title} (Customized)`,
      price: calculatedTotal,
      image: referenceImgUrl || product.image,
      slug: product.slug,
      customization: customizationData,
    });

    setIsSuccess(true);
    setTimeout(() => {
      onClose();
      setIsSuccess(false);
    }, 1400);
  };

  if (!isOpen) return null;

  return (
    <div
      data-lenis-prevent="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-6 bg-charcoal/85 backdrop-blur-md animate-fadeIn overflow-y-auto overscroll-contain"
    >
      <div
        data-lenis-prevent="true"
        className="relative w-full max-w-3xl bg-linen border-2 border-charcoal shadow-[8px_8px_0px_0px_rgba(45,45,45,1)] my-auto max-h-[88vh] flex flex-col overflow-hidden"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 border-b-1.5 border-charcoal bg-[#EAE3D8] shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-terra text-sm">✦</span>
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-charcoal">
              {isMural
                ? 'Bespoke Mural Commission Brief'
                : isSketch
                  ? 'Custom Sketch & Portrait Studio Configurator'
                  : isResinOrCraft
                    ? 'Resin Keepsake & Floral Preservation Configurator'
                    : 'Custom Artwork Configurator'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center border-1.5 border-charcoal hover:bg-charcoal hover:text-linen transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body Container with native smooth scrolling */}
        <div
          data-lenis-prevent="true"
          className="p-5 sm:p-6 overflow-y-auto overscroll-contain space-y-6 flex-1 text-charcoal select-text"
        >
          {/* Top Product Summary */}
          <div className="flex items-center gap-4 p-3 bg-white/70 border-1.5 border-charcoal/20">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 border border-charcoal/30 overflow-hidden bg-charcoal/5">
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-mono uppercase tracking-widest text-charcoal/60">
                {product.category}{' '}
                {product.subcategory ? `· ${product.subcategory}` : ''}
              </div>
              <h3 className="font-serif text-lg font-bold text-charcoal truncate">
                {product.title}
              </h3>
              <p className="text-xs text-charcoal/70 line-clamp-1 mt-0.5">
                {product.medium ||
                  'Handcrafted by Anki Matolia at Studio Vinyas'}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <span className="text-[10px] uppercase font-bold tracking-widest text-charcoal/50 block">
                {isMural ? 'Starting Quote' : 'Base Price'}
              </span>
              <span className="font-serif text-xl font-bold text-terra">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* SUCCESS MESSAGE STATE */}
          {isSuccess ? (
            <div className="py-12 px-6 text-center space-y-4">
              <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-moss/20 text-moss border border-moss">
                <CheckCircle2 size={36} />
              </div>
              <h4 className="font-serif text-2xl font-bold text-charcoal">
                {isMural
                  ? 'Mural Brief Received!'
                  : 'Customized Item Added to Cart!'}
              </h4>
              <p className="text-xs text-charcoal/75 max-w-md mx-auto leading-relaxed">
                {isMural
                  ? 'Anki Matolia will review your wall specifications and get back to you with a custom composition sketch and quote within 24–48 hours.'
                  : 'Your custom choices and photo reference have been saved with your order item. You can continue shopping or proceed to checkout.'}
              </p>
              {isMural && (
                <button
                  onClick={onClose}
                  className="btn-primary py-2.5 px-6 text-xs font-bold tracking-wider uppercase mt-4"
                >
                  Close &amp; Explore More Works
                </button>
              )}
            </div>
          ) : (
            <>
              {/* CATEGORY A: WALL ART / MURAL COMMISSION FORM */}
              {isMural && (
                <form
                  onSubmit={handleMuralCommissionSubmit}
                  className="space-y-5"
                >
                  <div className="p-3.5 bg-terra/10 border border-terra/40 text-xs text-charcoal flex items-start gap-2.5">
                    <Sparkles
                      size={16}
                      className="text-terra flex-shrink-0 mt-0.5"
                    />
                    <div>
                      <span className="font-bold text-terra-dark block mb-0.5">
                        Direct On-Site &amp; Panel Wall Murals
                      </span>
                      <span>
                        Murals are painted on-site across India or
                        pre-fabricated on modular moisture-treated wood panels
                        for seamless studio shipping.
                      </span>
                    </div>
                  </div>

                  {/* Dimensions & Surface Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-charcoal/80 block mb-1">
                        Wall Width (Feet)
                      </label>
                      <input
                        type="number"
                        min="2"
                        max="100"
                        value={wallWidth}
                        onChange={(e) => setWallWidth(e.target.value)}
                        className="w-full px-3 py-2 bg-white border-1.5 border-charcoal/30 text-xs font-sans text-charcoal focus:border-terra outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-charcoal/80 block mb-1">
                        Wall Height (Feet)
                      </label>
                      <input
                        type="number"
                        min="2"
                        max="50"
                        value={wallHeight}
                        onChange={(e) => setWallHeight(e.target.value)}
                        className="w-full px-3 py-2 bg-white border-1.5 border-charcoal/30 text-xs font-sans text-charcoal focus:border-terra outline-none"
                      />
                    </div>
                  </div>

                  {/* Surface Type & City */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-charcoal/80 block mb-1">
                        Wall Surface &amp; Environment
                      </label>
                      <select
                        value={surfaceType}
                        onChange={(e) => setSurfaceType(e.target.value)}
                        className="w-full px-3 py-2 bg-white border-1.5 border-charcoal/30 text-xs font-sans text-charcoal focus:border-terra outline-none cursor-pointer"
                      >
                        <option value="Interior Drywall / Smooth Plaster">
                          Interior Drywall / Smooth Plaster
                        </option>
                        <option value="Exterior Weather-Resistant Masonry">
                          Exterior Weather-Resistant Masonry
                        </option>
                        <option value="Cafe / Restaurant Commercial Feature Wall">
                          Cafe / Restaurant Commercial Feature Wall
                        </option>
                        <option value="Heritage Lime Plaster / Textured Finish">
                          Heritage Lime Plaster / Textured Finish
                        </option>
                        <option value="Modular Wooden Canvas Panels">
                          Modular Wooden Canvas Panels (Shippable)
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-charcoal/80 block mb-1">
                        Location / City
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Jaipur, Ratangarh, Delhi, Mumbai"
                        value={muralLocation}
                        onChange={(e) => setMuralLocation(e.target.value)}
                        className="w-full px-3 py-2 bg-white border-1.5 border-charcoal/30 text-xs font-sans text-charcoal focus:border-terra outline-none"
                      />
                    </div>
                  </div>

                  {/* Reference Image Upload */}
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-charcoal/80 block mb-1">
                      Wall Photo / Concept Reference (Optional)
                    </label>
                    <div className="border-1.5 border-dashed border-charcoal/40 bg-white/60 p-4 text-center hover:bg-white transition-colors cursor-pointer relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      <Upload
                        size={20}
                        className="mx-auto text-charcoal/50 mb-1"
                      />
                      <span className="text-xs font-bold text-charcoal block">
                        {fileName
                          ? `Attached: ${fileName}`
                          : 'Click to upload wall photo or reference'}
                      </span>
                      <span className="text-[10px] text-charcoal/50 block mt-0.5">
                        PNG, JPG, WebP up to 8MB
                      </span>
                    </div>
                  </div>

                  {/* Concept & Vision */}
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-charcoal/80 block mb-1">
                      Theme, Color Mood &amp; Instructions
                    </label>
                    <textarea
                      rows={3}
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      placeholder="Describe what vibe, elements, or custom iconography you want in this mural..."
                      className="w-full px-3 py-2 bg-white border-1.5 border-charcoal/30 text-xs font-sans text-charcoal focus:border-terra outline-none"
                    />
                  </div>

                  {/* Client Contact Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-charcoal/15">
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-charcoal/80 block mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="e.g. Rohit Sharma"
                        className="w-full px-3 py-2 bg-white border-1.5 border-charcoal/30 text-xs font-sans text-charcoal focus:border-terra outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-charcoal/80 block mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-3 py-2 bg-white border-1.5 border-charcoal/30 text-xs font-sans text-charcoal focus:border-terra outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-charcoal/80 block mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full px-3 py-2 bg-white border-1.5 border-charcoal/30 text-xs font-sans text-charcoal focus:border-terra outline-none"
                      />
                    </div>
                  </div>

                  {errorMessage && (
                    <div className="p-3 bg-red-100 border border-red-400 text-red-700 text-xs flex items-center gap-2">
                      <AlertCircle size={14} />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t-1.5 border-charcoal">
                    <span className="text-xs text-charcoal/60">
                      No payment collected today · Free artist quote
                    </span>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary py-3 px-8 text-xs font-bold tracking-wider uppercase shadow-[3px_3px_0px_0px_rgba(45,45,45,1)]"
                    >
                      {isSubmitting
                        ? 'Submitting Inquiry...'
                        : 'Submit Mural Brief →'}
                    </button>
                  </div>
                </form>
              )}

              {/* CATEGORY B: SKETCH & PORTRAITS CONFIGURATOR */}
              {isSketch && (
                <div className="space-y-5">
                  <div className="p-3.5 bg-white border-1.5 border-charcoal/20">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-terra block mb-1">
                      Portrait Style
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        'Realistic Charcoal & Graphite',
                        'Expressive Linework / Doodle',
                        'Stylized Couple Caricature',
                        'Colored Pencil & Ink Highlight',
                      ].map((style) => (
                        <button
                          key={style}
                          type="button"
                          onClick={() => setSketchStyle(style)}
                          className={`p-2.5 text-left border-1.5 text-[10.5px] font-bold transition-all ${
                            sketchStyle === style
                              ? 'bg-charcoal text-linen border-charcoal shadow-sm'
                              : 'bg-white/80 border-charcoal/25 text-charcoal/80 hover:border-charcoal'
                          }`}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Faces Count & Size */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-charcoal/80 block mb-1">
                        Number of Faces / Subjects
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { count: 1, label: '1 Face' },
                          { count: 2, label: '2 Faces (Couple +₹800)' },
                          { count: 3, label: '3 Faces (+₹1600)' },
                          { count: 4, label: '4+ Faces (+₹2400)' },
                        ].map((item) => (
                          <button
                            key={item.count}
                            type="button"
                            onClick={() => setFacesCount(item.count)}
                            className={`p-2 text-center border-1.5 text-[10px] font-bold uppercase transition-all ${
                              facesCount === item.count
                                ? 'bg-terra text-linen border-charcoal shadow-sm'
                                : 'bg-white/80 border-charcoal/25 text-charcoal/80 hover:border-charcoal'
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-charcoal/80 block mb-1">
                        Archival Paper Size
                      </label>
                      <select
                        value={sketchSize}
                        onChange={(e) => setSketchSize(e.target.value)}
                        className="w-full px-3 py-2 bg-white border-1.5 border-charcoal/30 text-xs font-sans text-charcoal focus:border-terra outline-none cursor-pointer"
                      >
                        <option value="A4 (8.3×11.7 in)">
                          A4 (8.3×11.7 in) — Standard Desk
                        </option>
                        <option value="A3 (11.7×16.5 in)">
                          A3 (11.7×16.5 in) — Gallery Wall (+₹500)
                        </option>
                        <option value="A2 (16.5×23.4 in)">
                          A2 (16.5×23.4 in) — Statement Size (+₹1200)
                        </option>
                      </select>
                    </div>
                  </div>

                  {/* Framing Selection */}
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-charcoal/80 block mb-1">
                      Framing Option
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {[
                        {
                          name: 'No Frame (Shipped in Archival Tube)',
                          sub: '₹0',
                        },
                        { name: 'Premium Black Gallery Frame', sub: '+₹550' },
                        { name: 'Solid Natural Teak Wood Frame', sub: '+₹850' },
                      ].map((f) => (
                        <button
                          key={f.name}
                          type="button"
                          onClick={() => setSketchFrame(f.name)}
                          className={`p-2.5 text-left border-1.5 text-[11px] font-bold transition-all flex items-center justify-between ${
                            sketchFrame === f.name
                              ? 'bg-charcoal text-linen border-charcoal shadow-sm'
                              : 'bg-white/80 border-charcoal/25 text-charcoal/80 hover:border-charcoal'
                          }`}
                        >
                          <span className="truncate pr-2">{f.name}</span>
                          <span className="text-[10px] opacity-75 font-mono">
                            {f.sub}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Reference Photo Upload */}
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-charcoal/80 block mb-1">
                      Upload Reference Portrait Photo *
                    </label>
                    <div className="border-1.5 border-dashed border-charcoal/40 bg-white/70 p-4 text-center hover:bg-white transition-colors cursor-pointer relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      <Upload
                        size={20}
                        className="mx-auto text-charcoal/50 mb-1"
                      />
                      <span className="text-xs font-bold text-charcoal block">
                        {fileName
                          ? `Uploaded: ${fileName}`
                          : 'Click to select clear reference portrait'}
                      </span>
                      <span className="text-[10px] text-charcoal/50 block mt-0.5">
                        High resolution, good lighting recommended
                      </span>
                    </div>
                  </div>

                  {/* Special Customization Notes */}
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-charcoal/80 block mb-1">
                      Custom Dedication Text or Special Instructions
                    </label>
                    <textarea
                      rows={2}
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      placeholder="e.g. Combine two separate photos into one couple portrait, add handwritten date '24.11.2024' at the bottom..."
                      className="w-full px-3 py-2 bg-white border-1.5 border-charcoal/30 text-xs font-sans text-charcoal focus:border-terra outline-none"
                    />
                  </div>

                  {/* Price Summary & Add to Cart */}
                  <div className="p-4 bg-white/90 border-1.5 border-charcoal flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-charcoal/60 block">
                        Configured Custom Total
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="font-serif text-2xl font-bold text-terra">
                          ₹{calculatedTotal.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10.5px] text-charcoal/60 font-sans">
                          (Includes {sketchSize}, {sketchFrame})
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddToCartCustomized}
                      className="btn-primary py-3 px-8 text-xs font-bold tracking-wider uppercase w-full sm:w-auto shadow-[3px_3px_0px_0px_rgba(45,45,45,1)]"
                    >
                      Add Custom Portrait to Cart ➔
                    </button>
                  </div>
                </div>
              )}

              {/* CATEGORY C: CRAFT & RESIN (FLORAL VARMALA & KEEPSAKES) */}
              {isResinOrCraft && (
                <div className="space-y-5">
                  {/* Physical Courier Notice Banner */}
                  <div className="p-4 bg-amber-50 border-2 border-amber-400 text-charcoal space-y-1.5">
                    <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider">
                      <Package size={16} />
                      <span>Physical Keepsake &amp; Varmala Notice</span>
                    </div>
                    <p className="text-xs text-amber-950 leading-relaxed font-sans">
                      For marriage garland (Varmala), bridal flowers, or baby
                      milestones,{' '}
                      <strong>
                        you will courier your dried flowers and physical items
                        to Studio Vinyas in Ratangarh, Rajasthan
                      </strong>
                      . Our exact studio address and packing guide will be
                      provided upon booking.
                    </p>
                  </div>

                  {/* Mold / Shape Selection */}
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-charcoal/80 block mb-1">
                      Preservation Mold &amp; Form
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        '9" Hexagon Deep Block',
                        '10×8" Rectangular Shadow Block',
                        '12" Circular Varmala Platter Clock',
                        'Arch Romantic Silhouette',
                        'Heart Block Keepsake',
                        'Set of 4 Floral Coasters',
                      ].map((shape) => (
                        <button
                          key={shape}
                          type="button"
                          onClick={() => setMoldShape(shape)}
                          className={`p-2.5 text-left border-1.5 text-[10.5px] font-bold transition-all ${
                            moldShape === shape
                              ? 'bg-charcoal text-linen border-charcoal shadow-sm'
                              : 'bg-white/80 border-charcoal/25 text-charcoal/80 hover:border-charcoal'
                          }`}
                        >
                          {shape}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Couple Names / Dedication */}
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-charcoal/80 block mb-1">
                      Names &amp; Wedding / Event Date (Engraved / Cast In Gold
                      Foil)
                    </label>
                    <input
                      type="text"
                      value={namesAndDate}
                      onChange={(e) => setNamesAndDate(e.target.value)}
                      placeholder="e.g. Ananya &amp; Siddharth · 18th February 2025"
                      className="w-full px-3 py-2 bg-white border-1.5 border-charcoal/30 text-xs font-sans text-charcoal focus:border-terra outline-none"
                    />
                  </div>

                  {/* Add-on Checkboxes */}
                  <div className="p-3.5 bg-white border-1.5 border-charcoal/20 space-y-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-terra block mb-1">
                      Artisan Add-ons &amp; Finishes
                    </span>
                    <label className="flex items-center gap-2.5 text-xs text-charcoal cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeGoldFlakes}
                        onChange={(e) => setIncludeGoldFlakes(e.target.checked)}
                        className="accent-terra w-4 h-4 cursor-pointer"
                      />
                      <span className="font-semibold">
                        24K Gold Foil Flakes floating in resin (+₹250)
                      </span>
                    </label>

                    <label className="flex items-center gap-2.5 text-xs text-charcoal cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeLedBase}
                        onChange={(e) => setIncludeLedBase(e.target.checked)}
                        className="accent-terra w-4 h-4 cursor-pointer"
                      />
                      <span className="font-semibold">
                        Warm-Glow Wooden LED Display Stand with USB cable
                        (+₹600)
                      </span>
                    </label>

                    <label className="flex items-center gap-2.5 text-xs text-charcoal cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeClockMechanism}
                        onChange={(e) =>
                          setIncludeClockMechanism(e.target.checked)
                        }
                        className="accent-terra w-4 h-4 cursor-pointer"
                      />
                      <span className="font-semibold">
                        Silent Quartz Clock Movement &amp; Roman Numerals
                        (+₹450)
                      </span>
                    </label>
                  </div>

                  {/* Photo Upload (for casting) */}
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-charcoal/80 block mb-1">
                      Photo to Embed Inside Resin (Optional)
                    </label>
                    <div className="border-1.5 border-dashed border-charcoal/40 bg-white/70 p-4 text-center hover:bg-white transition-colors cursor-pointer relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      <Upload
                        size={20}
                        className="mx-auto text-charcoal/50 mb-1"
                      />
                      <span className="text-xs font-bold text-charcoal block">
                        {fileName
                          ? `Attached: ${fileName}`
                          : 'Click to upload wedding/couple photo to cast'}
                      </span>
                    </div>
                  </div>

                  {/* Special Instructions */}
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-charcoal/80 block mb-1">
                      Flower Colors &amp; Special Handling Notes
                    </label>
                    <textarea
                      rows={2}
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      placeholder="e.g. Rose &amp; Jasmine Varmala, please preserve green leaves and add pearl border..."
                      className="w-full px-3 py-2 bg-white border-1.5 border-charcoal/30 text-xs font-sans text-charcoal focus:border-terra outline-none"
                    />
                  </div>

                  {/* Price Summary & Add to Cart */}
                  <div className="p-4 bg-white/90 border-1.5 border-charcoal flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-charcoal/60 block">
                        Total Keepsake Order
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="font-serif text-2xl font-bold text-terra">
                          ₹{calculatedTotal.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10.5px] text-charcoal/60 font-sans">
                          (Includes {moldShape})
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddToCartCustomized}
                      className="btn-primary py-3 px-8 text-xs font-bold tracking-wider uppercase w-full sm:w-auto shadow-[3px_3px_0px_0px_rgba(45,45,45,1)]"
                    >
                      Book &amp; Add Custom Keepsake to Cart ➔
                    </button>
                  </div>
                </div>
              )}

              {/* CATEGORY D: CANVAS PAINTINGS & GENERAL ART */}
              {isCanvas && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-charcoal/80 block mb-1">
                        Canvas Size
                      </label>
                      <select
                        value={canvasSize}
                        onChange={(e) => setCanvasSize(e.target.value)}
                        className="w-full px-3 py-2 bg-white border-1.5 border-charcoal/30 text-xs font-sans text-charcoal focus:border-terra outline-none cursor-pointer"
                      >
                        <option value="12×12 in (Square Accent)">
                          12×12 in (Square Accent)
                        </option>
                        <option value="18×24 in (Standard Room)">
                          18×24 in (Standard Room)
                        </option>
                        <option value="24×36 in (Medium Canvas)">
                          24×36 in (Medium Statement +₹1500)
                        </option>
                        <option value="36×48 in (Grand Heritage Canvas)">
                          36×48 in (Grand Heritage +₹3500)
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-charcoal/80 block mb-1">
                        Texture &amp; Technique
                      </label>
                      <select
                        value={canvasStyle}
                        onChange={(e) => setCanvasStyle(e.target.value)}
                        className="w-full px-3 py-2 bg-white border-1.5 border-charcoal/30 text-xs font-sans text-charcoal focus:border-terra outline-none cursor-pointer"
                      >
                        <option value="Textured Acrylic Impasto & Mixed Media">
                          Textured Acrylic Impasto &amp; Mixed Media
                        </option>
                        <option value="Traditional Rajasthani Pichwai Gold Embellished">
                          Traditional Rajasthani Pichwai Gold Embellished
                        </option>
                        <option value="Contemporary Minimalist Earth Tones">
                          Contemporary Minimalist Earth Tones
                        </option>
                        <option value="Classical Oil on Stretched Linen">
                          Classical Oil on Stretched Linen
                        </option>
                      </select>
                    </div>
                  </div>

                  {/* Reference Image Upload */}
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-charcoal/80 block mb-1">
                      Upload Reference Image / Inspiration
                    </label>
                    <div className="border-1.5 border-dashed border-charcoal/40 bg-white/70 p-4 text-center hover:bg-white transition-colors cursor-pointer relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      <Upload
                        size={20}
                        className="mx-auto text-charcoal/50 mb-1"
                      />
                      <span className="text-xs font-bold text-charcoal block">
                        {fileName
                          ? `Attached: ${fileName}`
                          : 'Click to upload reference image'}
                      </span>
                    </div>
                  </div>

                  {/* Creative Brief */}
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-charcoal/80 block mb-1">
                      Creative Brief &amp; Dimensions Note
                    </label>
                    <textarea
                      rows={3}
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      placeholder="Specify your desired color palette, room lighting conditions, or custom symbols..."
                      className="w-full px-3 py-2 bg-white border-1.5 border-charcoal/30 text-xs font-sans text-charcoal focus:border-terra outline-none"
                    />
                  </div>

                  {/* Price & Add to Cart */}
                  <div className="p-4 bg-white/90 border-1.5 border-charcoal flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-charcoal/60 block">
                        Custom Canvas Total
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="font-serif text-2xl font-bold text-terra">
                          ₹{calculatedTotal.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10.5px] text-charcoal/60 font-sans">
                          (Stretched Wood Canvas)
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddToCartCustomized}
                      className="btn-primary py-3 px-8 text-xs font-bold tracking-wider uppercase w-full sm:w-auto shadow-[3px_3px_0px_0px_rgba(45,45,45,1)]"
                    >
                      Add Custom Canvas to Cart ➔
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
