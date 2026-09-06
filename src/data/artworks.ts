export interface Artwork {
  id: string;
  title: string;
  category: 'Sketch' | 'Canvas' | 'Wall Art' | 'Craft';
  subcategory:
    | 'Bottle Art'
    | 'Resin Art'
    | 'Handmade Keepsake'
    | 'Portrait'
    | 'Mural'
    | 'Guestbook Canvas'
    | 'Sacred Art';
  description: string;
  price: number;
  priceFormatted: string;
  tag: string;
  image: string;
  medium: string;
  size: string;
  year: string;
  isCommissionOnly?: boolean;
  featuredIn3D?: boolean;
}

/**
 * The 8 Finest Museum-Grade Pieces Curated for the 3D Virtual Gallery Walkthrough
 * Spaced alternating along the corridor walls.
 */
export const GALLERY_3D_ARTWORKS: Artwork[] = [
  {
    id: 'gallery-01',
    title: 'Boho Bloom Muse',
    category: 'Wall Art',
    subcategory: 'Mural',
    description:
      'A monumental cafe feature mural celebrating serene mindfulness and botanical warmth. Stylized continuous linework depicts a woman cradling a warm cup, her hair flowing into an abundance of blooming chrysanthemums, tropical leaves, and cascading tea foliage.',
    price: 24000,
    priceFormatted: '₹24,000',
    tag: 'Featured Mural',
    image:
      'https://res.cloudinary.com/dcma5tbqk/image/upload/v1788711560/inkbloom/artworks/vinyas-art-053.jpg',
    medium: 'Weatherproof Acrylic & Fine Linework on Masonry',
    size: '10ft × 8ft Wall',
    year: '2025',
    isCommissionOnly: true,
    featuredIn3D: true,
  },
  {
    id: 'gallery-02',
    title: 'Silver Jubilee Luminescence',
    category: 'Craft',
    subcategory: 'Resin Art',
    description:
      'An illuminated 25th wedding anniversary heirloom platter. Real preserved bridal varmala red rose petals and baby’s breath florals cast in glass-clear crystal epoxy, illuminated from within by custom perimeter warm LED backlighting and finished with 24K gold foil calligraphy.',
    price: 6500,
    priceFormatted: '₹6,500',
    tag: 'Bestseller Keepsake',
    image:
      'https://res.cloudinary.com/dcma5tbqk/image/upload/v1788711579/inkbloom/artworks/vinyas-art-093.jpg',
    medium: 'Preserved Varmala Florals, Epoxy Resin & LED on Teak',
    size: '14" Diameter',
    year: '2026',
    isCommissionOnly: false,
    featuredIn3D: true,
  },
  {
    id: 'gallery-03',
    title: 'Celestial Geode Wall Clock',
    category: 'Craft',
    subcategory: 'Resin Art',
    description:
      'Bespoke high-gloss resin timepiece combining raw crushed royal sapphire and rose quartz crystals with a mirrored golden Roman numeral dial. Built as an eternal keepsake featuring the couple’s sacred wedding day portrait at the heart.',
    price: 4800,
    priceFormatted: '₹4,800',
    tag: 'Signature Timepiece',
    image:
      'https://res.cloudinary.com/dcma5tbqk/image/upload/v1788711582/inkbloom/artworks/vinyas-art-098.jpg',
    medium: 'Crushed Quartz Crystals, Epoxy Resin & Silent Quartz Movement',
    size: '16" Diameter',
    year: '2025',
    isCommissionOnly: false,
    featuredIn3D: true,
  },
  {
    id: 'gallery-04',
    title: 'Divine Flute of Vrindavan',
    category: 'Wall Art',
    subcategory: 'Sacred Art',
    description:
      'A monumental sacred temple mural bringing the eternal love of Radha and Lord Krishna to life. Features rich traditional Marwar colors, delicate bansuri embellishments, and a vibrant peacock crown canopy glowing under celestial moonlight.',
    price: 32000,
    priceFormatted: '₹32,000',
    tag: 'Sacred Masterpiece',
    image:
      'https://res.cloudinary.com/dcma5tbqk/image/upload/v1788711564/inkbloom/artworks/vinyas-art-051.jpg',
    medium: 'Traditional Pigments & Acrylic Mural on Lime Plaster',
    size: '12ft × 9ft Wall',
    year: '2025',
    isCommissionOnly: true,
    featuredIn3D: true,
  },
  {
    id: 'gallery-05',
    title: 'Eternal Varmala Shadowbox',
    category: 'Craft',
    subcategory: 'Handmade Keepsake',
    description:
      'Museum-grade preservation framing the actual sacred wedding varmala rose garland, bridal chooda bangles, and zardozi gota patti from the wedding ceremony. Sealed in an airtight teakwood shadowbox with anti-UV optical glass.',
    price: 7800,
    priceFormatted: '₹7,800',
    tag: 'Heirloom Commission',
    image:
      'https://res.cloudinary.com/dcma5tbqk/image/upload/v1788711595/inkbloom/artworks/vinyas-art-123.jpg',
    medium:
      'Preserved Floral Garland, Bridal Chooda & Gota Patti in Teak Frame',
    size: '18" × 24" Frame',
    year: '2025',
    isCommissionOnly: true,
    featuredIn3D: true,
  },
  {
    id: 'gallery-06',
    title: 'Serenade in Graphite',
    category: 'Sketch',
    subcategory: 'Portrait',
    description:
      'Hyper-realistic commissioned pencil & charcoal portrait demonstrating masterclass tonal control, fabric texture rendering, and intimate human warmth. Drawn using German Staedtler graphite pencils on archival 300 GSM hot-pressed paper.',
    price: 2400,
    priceFormatted: '₹2,400',
    tag: 'Custom Portrait',
    image:
      'https://res.cloudinary.com/dcma5tbqk/image/upload/v1788711528/inkbloom/artworks/vinyas-art-025.jpg',
    medium: 'Staedtler Mars Lumograph Graphite & Charcoal on Archival Sheet',
    size: 'A3 (11.7" × 16.5")',
    year: '2025',
    isCommissionOnly: false,
    featuredIn3D: true,
  },
  {
    id: 'gallery-07',
    title: 'Marwar Heritage Elder',
    category: 'Wall Art',
    subcategory: 'Mural',
    description:
      'A vibrant architectural pillar fresco celebrating the dignity and warmth of rural Rajasthan. Portrays a charismatic Marwari elder with a royal crimson safa (turban), twirled silver moustache, and golden hoop earring peeping warmly into the room.',
    price: 14500,
    priceFormatted: '₹14,500',
    tag: 'Cultural Heritage',
    image:
      'https://res.cloudinary.com/dcma5tbqk/image/upload/v1788711570/inkbloom/artworks/vinyas-art-070.jpg',
    medium: 'Fresco Secco / Acrylic & Gouache on Masonry Pillar',
    size: '7ft × 3ft Column',
    year: '2025',
    isCommissionOnly: true,
    featuredIn3D: true,
  },
  {
    id: 'gallery-08',
    title: 'Tree of Vows (Thumbprint Canvas)',
    category: 'Canvas',
    subcategory: 'Guestbook Canvas',
    description:
      'An interactive wedding guestbook canvas painting. Hand-rendered gnarled oak tree trunk with intertwining branches and a carved heart center inscribed with the couple’s names, ready for wedding guests to imprint their colourful thumbprints as blooming leaves.',
    price: 3800,
    priceFormatted: '₹3,800',
    tag: 'Wedding Canvas',
    image:
      'https://res.cloudinary.com/dcma5tbqk/image/upload/v1788711594/inkbloom/artworks/vinyas-art-125.jpg',
    medium: 'Fine Acrylic & Gold Leaf on Heavyweight Stretched Canvas',
    size: '20" × 24" Canvas',
    year: '2026',
    isCommissionOnly: false,
    featuredIn3D: true,
  },
];

/**
 * Full Categorized Inventory of Studio Vinyas Artworks
 */
export const VINYAS_CATALOG: Artwork[] = [
  // ==========================================
  // 1. SKETCHES & PORTRAITS
  // ==========================================
  {
    id: 'sketch-01',
    title: 'Serenade in Graphite',
    category: 'Sketch',
    subcategory: 'Portrait',
    description:
      'Hyper-realistic commissioned graphite and charcoal portrait capturing fine sweatshirt knit textures, lifelike hair detail, and striking emotional presence.',
    price: 2400,
    priceFormatted: '₹2,400',
    tag: 'Custom Portrait',
    image:
      'https://res.cloudinary.com/dcma5tbqk/image/upload/v1788711528/inkbloom/artworks/vinyas-art-025.jpg',
    medium: 'Staedtler Graphite & Compressed Charcoal on 300 GSM Paper',
    size: 'A3 (11.7" × 16.5")',
    year: '2025',
    featuredIn3D: true,
  },
  {
    id: 'sketch-02',
    title: 'Patriarch of Churu (Distinguished Elder)',
    category: 'Sketch',
    subcategory: 'Portrait',
    description:
      'A framed masterwork portrait capturing deep character lines, wisdom, and dignity. Shaded with multi-grade graphite pencils and subtle white highlights.',
    price: 2800,
    priceFormatted: '₹2,800',
    tag: 'Fine Art Sketch',
    image:
      'https://res.cloudinary.com/dcma5tbqk/image/upload/v1788711504/inkbloom/artworks/vinyas-art-002.jpg',
    medium: 'Graphite & Charcoal with Glass Framing',
    size: '12" × 16" Framed',
    year: '2025',
  },
  {
    id: 'sketch-03',
    title: 'Golden Days Childhood Portrait',
    category: 'Sketch',
    subcategory: 'Portrait',
    description:
      'Vibrant coloured pencil and charcoal mixed media portrait of a young boy in a mustard-yellow quilted jacket and denim shirt set against a velvety midnight background.',
    price: 2600,
    priceFormatted: '₹2,600',
    tag: 'Coloured Pencil',
    image:
      'https://res.cloudinary.com/dcma5tbqk/image/upload/v1788711516/inkbloom/artworks/vinyas-art-020.jpg',
    medium: 'Faber-Castell Polychromos & Charcoal on Archival Board',
    size: 'A3 (11.7" × 16.5")',
    year: '2025',
  },
  {
    id: 'sketch-04',
    title: 'Solitary Muse (Charcoal Portrait)',
    category: 'Sketch',
    subcategory: 'Portrait',
    description:
      'Soft expressive charcoal portrait capturing flowing natural hair, contemplative gaze, and dramatic chiaroscuro light.',
    price: 2200,
    priceFormatted: '₹2,200',
    tag: 'Charcoal Study',
    image:
      'https://res.cloudinary.com/dcma5tbqk/image/upload/v1788711504/inkbloom/artworks/vinyas-art-003.jpg',
    medium: 'Willow & Vine Charcoal on Textured Sheet',
    size: 'A3 (11.7" × 16.5")',
    year: '2025',
  },
  {
    id: 'sketch-05',
    title: 'The Scholar (Spectacled Portrait)',
    category: 'Sketch',
    subcategory: 'Portrait',
    description:
      'Detailed portrait study focusing on reflective glass lens rendering, clean beard contouring, and modern minimalist framing.',
    price: 2000,
    priceFormatted: '₹2,000',
    tag: 'Custom Portrait',
    image:
      'https://res.cloudinary.com/dcma5tbqk/image/upload/v1788711504/inkbloom/artworks/vinyas-art-004.jpg',
    medium: 'Graphite Pencil on Heavyweight Cartridge Paper',
    size: 'A4 (8.3" × 11.7")',
    year: '2025',
  },
  {
    id: 'sketch-06',
    title: 'Eternal Bond (Couple Anniversary Sketch)',
    category: 'Sketch',
    subcategory: 'Portrait',
    description:
      'Custom commissioned couple portrait celebrating a marriage milestone, intricately blending two personalities into a balanced, loving composition.',
    price: 3200,
    priceFormatted: '₹3,200',
    tag: 'Couple Portrait',
    image:
      'https://res.cloudinary.com/dcma5tbqk/image/upload/v1788711505/inkbloom/artworks/vinyas-art-001.jpg',
    medium: 'Graphite & Charcoal on Archival Sheet',
    size: 'A3 (11.7" × 16.5")',
    year: '2025',
  },
  {
    id: 'sketch-07',
    title: 'Marwari Bride (Ghoonghat & Maang Tikka)',
    category: 'Sketch',
    subcategory: 'Portrait',
    description:
      'Intricate Rajasthani bridal portrait capturing shimmering jewellery, ornate maang tikka, kundan earrings, and sheer embroidered veil.',
    price: 3500,
    priceFormatted: '₹3,500',
    tag: 'Bridal Heritage',
    image:
      'https://res.cloudinary.com/dcma5tbqk/image/upload/v1788711506/inkbloom/artworks/vinyas-art-007.jpg',
    medium: 'Fine-Point Graphite & White Gel Accents',
    size: 'A3 (11.7" × 16.5")',
    year: '2025',
  },

  // ==========================================
  // 2. CANVAS ARTWORKS
  // ==========================================
  {
    id: 'canvas-01',
    title: 'Tree of Vows (Wedding Thumbprint Canvas)',
    category: 'Canvas',
    subcategory: 'Guestbook Canvas',
    description:
      'Hand-painted rustic oak tree on stretched cotton canvas with a custom carved heart inscribed with the couple’s names. Guests imprint their colourful thumbs as leaves.',
    price: 3800,
    priceFormatted: '₹3,800',
    tag: 'Wedding Canvas',
    image:
      'https://res.cloudinary.com/dcma5tbqk/image/upload/v1788711594/inkbloom/artworks/vinyas-art-125.jpg',
    medium: 'Acrylic & Archival Sealant on Stretched Cotton Canvas',
    size: '20" × 24"',
    year: '2026',
    featuredIn3D: true,
  },
  {
    id: 'canvas-02',
    title: 'Paridhi Milestone Baby Moon Canvas',
    category: 'Canvas',
    subcategory: 'Handmade Keepsake',
    description:
      'A round custom canvas birth chronicle celebrating newborn baby Paridhi. Embellished with 360-degree pearl bead rim, silver metallic bow, clock time, scale weight, and golden script.',
    price: 2800,
    priceFormatted: '₹2,800',
    tag: 'Baby Milestone',
    image:
      'https://res.cloudinary.com/dcma5tbqk/image/upload/v1788711594/inkbloom/artworks/vinyas-art-124.jpg',
    medium: 'Acrylic, Gold Leaf, Faux Pearls & Fabric on Circular Board',
    size: '14" Round',
    year: '2026',
  },
  {
    id: 'canvas-03',
    title: 'Salasar Balaji Sacred Altar Plaque',
    category: 'Canvas',
    subcategory: 'Sacred Art',
    description:
      'Handcrafted sacred altar plaque of Salasar Balaji Maharaj, decorated with shimmering golden pearl beads and miniature wooden easel for pooja spaces.',
    price: 2400,
    priceFormatted: '₹2,400',
    tag: 'Devotional',
    image:
      'https://res.cloudinary.com/dcma5tbqk/image/upload/v1788711596/inkbloom/artworks/vinyas-art-128.jpg',
    medium: 'Sacred Iconography, Gold Pearl Beads & Wooden Easel',
    size: '10" Round',
    year: '2026',
  },

  // ==========================================
  // 3. WALL ART & MURALS
  // ==========================================
  {
    id: 'wall-01',
    title: 'Boho Bloom Muse',
    category: 'Wall Art',
    subcategory: 'Mural',
    description:
      'A cafe centerpiece mural with botanical floral hair and coffee steam silhouettes. Expresses peaceful modern cafe culture.',
    price: 24000,
    priceFormatted: '₹24,000',
    tag: 'Featured Mural',
    image:
      'https://res.cloudinary.com/dcma5tbqk/image/upload/v1788711560/inkbloom/artworks/vinyas-art-053.jpg',
    medium: 'Acrylic & Brush Linework on Cafe Wall',
    size: '10ft × 8ft',
    year: '2025',
    isCommissionOnly: true,
    featuredIn3D: true,
  },
  {
    id: 'wall-02',
    title: 'Divine Flute of Vrindavan',
    category: 'Wall Art',
    subcategory: 'Sacred Art',
    description:
      'Large-scale devotional wall mural of Radha Krishna in an enchanted forest glade with bansuri, peacock feathers, and lotus halos.',
    price: 32000,
    priceFormatted: '₹32,000',
    tag: 'Sacred Masterpiece',
    image:
      'https://res.cloudinary.com/dcma5tbqk/image/upload/v1788711564/inkbloom/artworks/vinyas-art-051.jpg',
    medium: 'High-Pigment Exterior/Interior Acrylic on Wall',
    size: '12ft × 9ft',
    year: '2025',
    isCommissionOnly: true,
    featuredIn3D: true,
  },
  {
    id: 'wall-03',
    title: 'Pichwai Lotus Serenity',
    category: 'Wall Art',
    subcategory: 'Sacred Art',
    description:
      'Nathdwara Pichwai-inspired lotus blossom fresco featuring layered pink petals, deep emerald leaves, and traditional Rajasthani sacred beauty.',
    price: 18000,
    priceFormatted: '₹18,000',
    tag: 'Heritage Pichwai',
    image:
      'https://res.cloudinary.com/dcma5tbqk/image/upload/v1788711560/inkbloom/artworks/vinyas-art-052.jpg',
    medium: 'Acrylic Pigment on Lime-Finished Wall',
    size: '8ft × 7ft',
    year: '2025',
    isCommissionOnly: true,
  },
  {
    id: 'wall-04',
    title: 'Marwar Heritage Elder',
    category: 'Wall Art',
    subcategory: 'Mural',
    description:
      'Architectural doorway fresco depicting a Rajasthani man in a crimson safa and handlebar moustache peeping into the living space with warm humor.',
    price: 14500,
    priceFormatted: '₹14,500',
    tag: 'Cultural Heritage',
    image:
      'https://res.cloudinary.com/dcma5tbqk/image/upload/v1788711570/inkbloom/artworks/vinyas-art-070.jpg',
    medium: 'Wall Acrylic & Linework on Architectural Arch',
    size: '7ft × 3ft Column',
    year: '2025',
    isCommissionOnly: true,
    featuredIn3D: true,
  },
  {
    id: 'wall-05',
    title: 'Dali in the Dunes (Surrealist Doodle Wall)',
    category: 'Wall Art',
    subcategory: 'Mural',
    description:
      'Playful surrealist studio mural paying tribute to Salvador Dali with swirling paintbrushes, artist palette, and expressive monochrome typography.',
    price: 16000,
    priceFormatted: '₹16,000',
    tag: 'Studio Doodle',
    image:
      'https://res.cloudinary.com/dcma5tbqk/image/upload/v1788711560/inkbloom/artworks/vinyas-art-055.jpg',
    medium: 'Acrylic Linework & Shading on Studio Wall',
    size: '9ft × 6ft',
    year: '2025',
    isCommissionOnly: true,
  },
  {
    id: 'wall-06',
    title: 'Anu’s Artisan Bakery Doodle Facade',
    category: 'Wall Art',
    subcategory: 'Mural',
    description:
      'Commercial bakery storefront pillars transformed with handcrafted bakery doodles, croissants, coffee carafes, cupcakes, and bakery typography.',
    price: 18000,
    priceFormatted: '₹18,000',
    tag: 'Commercial Mural',
    image:
      'https://res.cloudinary.com/dcma5tbqk/image/upload/v1788711565/inkbloom/artworks/vinyas-art-059.jpg',
    medium: 'Weather-Resistant Masonry Acrylics',
    size: 'Two 9ft Entrance Pillars',
    year: '2025',
    isCommissionOnly: true,
  },
  {
    id: 'wall-07',
    title: 'Taekwondo Warriors Arena Mural',
    category: 'Wall Art',
    subcategory: 'Mural',
    description:
      'High-energy full-wall sports mural featuring dynamic sparring Taekwondo martial artists with red & blue chest protectors and bold typography.',
    price: 22000,
    priceFormatted: '₹22,000',
    tag: 'Sports Academy',
    image:
      'https://res.cloudinary.com/dcma5tbqk/image/upload/v1788711595/inkbloom/artworks/vinyas-art-121.jpg',
    medium: 'Bold Dynamic Acrylic on Academy Hall Wall',
    size: '14ft × 8ft',
    year: '2025',
    isCommissionOnly: true,
  },
  {
    id: 'wall-08',
    title: 'Ann Hi Jeevan Hai (Community Dining Mural)',
    category: 'Wall Art',
    subcategory: 'Mural',
    description:
      'Circular philosophical dining hall mural: "अन्न ही जीवन है, अन्न ही ईश्वर है, इसका सम्मान करे।" celebrating communal dining, gratitude, and food sanctity.',
    price: 15000,
    priceFormatted: '₹15,000',
    tag: 'Cultural Mural',
    image:
      'https://res.cloudinary.com/dcma5tbqk/image/upload/v1788711576/inkbloom/artworks/vinyas-art-089.jpg',
    medium: 'Monochrome Shading & Hindi Calligraphy on Hall Wall',
    size: '6ft × 6ft Circular Medallion',
    year: '2025',
    isCommissionOnly: true,
  },
  {
    id: 'wall-09',
    title: 'Wings of Radiance (Photo-Op Wall)',
    category: 'Wall Art',
    subcategory: 'Mural',
    description:
      'Interactive angel wings mural designed as an engaging photo backdrop for cafe patrons, with feather gradients and uplifting quotes.',
    price: 12000,
    priceFormatted: '₹12,000',
    tag: 'Photo Wall',
    image:
      'https://res.cloudinary.com/dcma5tbqk/image/upload/v1788711568/inkbloom/artworks/vinyas-art-064.jpg',
    medium: 'Acrylic Feather Gradients on Accent Wall',
    size: '8ft × 7ft',
    year: '2025',
    isCommissionOnly: true,
  },

  // ==========================================
  // 4. CRAFT - RESIN ART & FLORAL PRESERVATION
  // ==========================================
  {
    id: 'craft-resin-01',
    title: 'Silver Jubilee Luminescence',
    category: 'Craft',
    subcategory: 'Resin Art',
    description:
      'Backlit illuminated 25th wedding anniversary resin platter encapsulating real preserved rose petals, warm LED perimeter glow, and gold lettering.',
    price: 6500,
    priceFormatted: '₹6,500',
    tag: 'Bestseller Keepsake',
    image:
      'https://res.cloudinary.com/dcma5tbqk/image/upload/v1788711579/inkbloom/artworks/vinyas-art-093.jpg',
    medium: 'Preserved Roses, Crystal Epoxy Resin & Integrated LED',
    size: '14" Round Platter',
    year: '2026',
    featuredIn3D: true,
  },
  {
    id: 'craft-resin-02',
    title: 'Celestial Geode Wall Clock',
    category: 'Craft',
    subcategory: 'Resin Art',
    description:
      'Navy blue & rose quartz crushed crystal geode clock with golden Roman numerals and custom couple photo centerpiece.',
    price: 4800,
    priceFormatted: '₹4,800',
    tag: 'Signature Timepiece',
    image:
      'https://res.cloudinary.com/dcma5tbqk/image/upload/v1788711582/inkbloom/artworks/vinyas-art-098.jpg',
    medium:
      'Crushed Quartz Crystals, Epoxy Resin, Roman Dial & Quartz Movement',
    size: '16" Diameter',
    year: '2025',
    featuredIn3D: true,
  },
  {
    id: 'craft-resin-03',
    title: 'Rose Quartz Blossom Geode Clock',
    category: 'Craft',
    subcategory: 'Resin Art',
    description:
      'Shimmering baby pink geode clock crafted with pink crushed stones, pearl dust pigments, and gold-leaf dial markers.',
    price: 4200,
    priceFormatted: '₹4,200',
    tag: 'Geode Clock',
    image:
      'https://res.cloudinary.com/dcma5tbqk/image/upload/v1788711585/inkbloom/artworks/vinyas-art-101.jpg',
    medium: 'Pink Crystals, Pearl Pigment & Epoxy Resin',
    size: '14" Diameter',
    year: '2025',
  },
  {
    id: 'craft-resin-04',
    title: 'Sacred Ganesha Resin Pooja Thali',
    category: 'Craft',
    subcategory: 'Resin Art',
    description:
      'Handcrafted spiritual pooja thali featuring Lord Ganesha, 24K gold foil flakes, pearl inlays, metallic golden branches, and twin roli-chawal katoris.',
    price: 2800,
    priceFormatted: '₹2,800',
    tag: 'Sacred Craft',
    image:
      'https://res.cloudinary.com/dcma5tbqk/image/upload/v1788711585/inkbloom/artworks/vinyas-art-104.jpg',
    medium: 'Epoxy Resin, 24K Gold Leaf, Brass Katoris & Pearls',
    size: '11" Round',
    year: '2025',
  },
  {
    id: 'craft-resin-05',
    title: 'Jayawardhan Newborn Keepsake Frame',
    category: 'Craft',
    subcategory: 'Resin Art',
    description:
      'Precious birth memory plaque encapsulating the baby’s first sonogram photo, hospital ID band, birth date/weight/time, and gold pearl borders.',
    price: 3600,
    priceFormatted: '₹3,600',
    tag: 'Baby Keepsake',
    image:
      'https://res.cloudinary.com/dcma5tbqk/image/upload/v1788711585/inkbloom/artworks/vinyas-art-105.jpg',
    medium: 'Clear Epoxy Resin, Baby Mementos, Gold Leaf & Pearls',
    size: '12" Round',
    year: '2025',
  },
  {
    id: 'craft-resin-06',
    title: 'Royal Rajputana Wedding Shadowbox',
    category: 'Craft',
    subcategory: 'Handmade Keepsake',
    description:
      'Regal heirloom shadowbox featuring the original golden wedding sehra mukut, royal crimson velvet, zardozi borders, wedding invitation, and portrait.',
    price: 8500,
    priceFormatted: '₹8,500',
    tag: 'Royal Keepsake',
    image:
      'https://res.cloudinary.com/dcma5tbqk/image/upload/v1788711595/inkbloom/artworks/vinyas-art-122.jpg',
    medium: 'Velvet, Golden Sehra, Zardozi Trim & Solid Teak Frame',
    size: '20" × 28" Shadowbox',
    year: '2025',
  },
  {
    id: 'craft-resin-07',
    title: 'Eternal Varmala Shadowbox',
    category: 'Craft',
    subcategory: 'Handmade Keepsake',
    description:
      'Preserved bridal garland roses, bridal bangles (chooda), and pearls encased in a timeless teakwood glass shadowbox.',
    price: 7800,
    priceFormatted: '₹7,800',
    tag: 'Heirloom Commission',
    image:
      'https://res.cloudinary.com/dcma5tbqk/image/upload/v1788711595/inkbloom/artworks/vinyas-art-123.jpg',
    medium: 'Preserved Roses, Bridal Chooda, Teak Frame & Optical Glass',
    size: '18" × 24"',
    year: '2025',
    featuredIn3D: true,
  },
  {
    id: 'craft-resin-08',
    title: 'Shimmering Rose Bookmark & Paperweight',
    category: 'Craft',
    subcategory: 'Resin Art',
    description:
      'Crystal-clear resin bookmark casting a real preserved red rose petal, gold leaf flakes, and a delicate silk tassel.',
    price: 499,
    priceFormatted: '₹499',
    tag: 'Floral Gift',
    image:
      'https://res.cloudinary.com/dcma5tbqk/image/upload/v1788711582/inkbloom/artworks/vinyas-art-100.jpg',
    medium: 'Casting Resin, Natural Rose Petals & Silk Tassel',
    size: '5.5" × 1.2"',
    year: '2025',
  },
  {
    id: 'craft-resin-09',
    title: 'Pearl Wristlet Monogram Keychain',
    category: 'Craft',
    subcategory: 'Resin Art',
    description:
      'Custom pearl beaded wristlet keychain with resin encased personalized photo, white satin ribbon bow, and golden ring clasp.',
    price: 599,
    priceFormatted: '₹599',
    tag: 'Custom Accessory',
    image:
      'https://res.cloudinary.com/dcma5tbqk/image/upload/v1788711596/inkbloom/artworks/vinyas-art-127.jpg',
    medium: 'Faux Pearl Beads, Encased Resin Photo Charm & Golden Hardware',
    size: '7" Wristlet',
    year: '2026',
  },
  {
    id: 'craft-resin-10',
    title: 'Enchanted Botanical Engagement Ring Platter',
    category: 'Craft',
    subcategory: 'Handmade Keepsake',
    description:
      'Natural rustic tree slice platter with woven grapevine floral wreath, white silk roses, pearls, and dual ring velvet slots.',
    price: 3200,
    priceFormatted: '₹3,200',
    tag: 'Ring Ceremony',
    image:
      'https://res.cloudinary.com/dcma5tbqk/image/upload/v1788711596/inkbloom/artworks/vinyas-art-129.jpg',
    medium: 'Natural Wood Slice, Grapevine Wreath, Faux Florals & Pearls',
    size: '12" Wood Base',
    year: '2026',
  },

  // ==========================================
  // 5. CRAFT - BOTTLE ART
  // ==========================================
  {
    id: 'craft-bottle-01',
    title: 'Warm Glow Fairy Light Memory Bottle (Pair)',
    category: 'Craft',
    subcategory: 'Bottle Art',
    description:
      'Pair of upcycled emerald green glass bottles wrapped in rustic jute rope at the neck, containing warm LED fairy lights and custom photo memories.',
    price: 1599,
    priceFormatted: '₹1,599',
    tag: 'Bestseller Gift',
    image:
      'https://res.cloudinary.com/dcma5tbqk/image/upload/v1788711531/inkbloom/artworks/vinyas-art-030.jpg',
    medium:
      'Upcycled Wine Bottles, Jute Cord, LED Cork String & Waterproof Prints',
    size: 'Pair of 750ml Bottles',
    year: '2025',
  },
  {
    id: 'craft-bottle-02',
    title: 'Festive Botanical Fairy Bottle',
    category: 'Craft',
    subcategory: 'Bottle Art',
    description:
      'Decorative illuminated bottle adorned with woven faux ivy vines, rustic jute twine, satin rosette flower, and internal fairy illumination.',
    price: 999,
    priceFormatted: '₹999',
    tag: 'Ambient Decor',
    image:
      'https://res.cloudinary.com/dcma5tbqk/image/upload/v1788711536/inkbloom/artworks/vinyas-art-035.jpg',
    medium: 'Green Glass, Faux Ivy, Satin Flowers & Micro-LED String',
    size: '750ml Bottle (12" Height)',
    year: '2025',
  },
  {
    id: 'craft-bottle-03',
    title: 'Golden Confetti Birthday Bottle',
    category: 'Craft',
    subcategory: 'Bottle Art',
    description:
      'Celebration photo bottle with gold glitter ombre coating, festive red satin ribbon, miniature pastel base foam spheres, and polaroid photo prints.',
    price: 1199,
    priceFormatted: '₹1,199',
    tag: 'Birthday Special',
    image:
      'https://res.cloudinary.com/dcma5tbqk/image/upload/v1788711552/inkbloom/artworks/vinyas-art-045.jpg',
    medium: 'Glitter Sealing, Satin Ribbon, Polaroid Collages & Glass',
    size: '750ml Champagne Bottle',
    year: '2025',
  },
  {
    id: 'craft-bottle-04',
    title: 'Illuminated Love Hamper Box',
    category: 'Craft',
    subcategory: 'Handmade Keepsake',
    description:
      'Handcrafted luxury wooden keepsake box featuring internal micro-fairy lights, mini bunting banner, polaroid photo memories, plush bear, and gourmet treats.',
    price: 2499,
    priceFormatted: '₹2,499',
    tag: 'Anniversary Hamper',
    image:
      'https://res.cloudinary.com/dcma5tbqk/image/upload/v1788711596/inkbloom/artworks/vinyas-art-126.jpg',
    medium: 'Wooden Keepsake Chest, Micro-LEDs, Bunting & Satin Ribbon',
    size: '12" × 8" × 4" Box',
    year: '2025',
  },
];
