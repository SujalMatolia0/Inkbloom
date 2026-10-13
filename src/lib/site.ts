export const SITE_CONFIG = {
  name: "Vinyas Studio",
  tagline: "Original Mixed Media Art, Custom Commissions & Handmade Keepsakes",
  artistName: "Anki Matolia",
  artistRole: "Master Artist & Studio Founder",
  
  // Location & Address
  studioLocation: "Ratangarh, Churu District, Rajasthan 331022, India",
  city: "Ratangarh",
  district: "Churu",
  state: "Rajasthan",
  pincode: "331022",
  country: "India",
  addressFull: "Vinyas Art Studio, Main Town, Ratangarh, Churu District, Rajasthan 331022, India",

  // Contact Information
  email: "vinyas.artist@gmail.com",
  secondaryEmail: "artistankimatolia@gmail.com",
  phone: "+91 98285 36566",

  // Social Links
  socials: {
    instagram: "https://instagram.com/vinyas_art",
    pinterest: "https://pinterest.com/vinyas_art",
  },

  // Verified Studio Stats
  stats: {
    commissionsDelivered: "250+",
    artworksCreated: "750+",
    averageRating: "4.9★",
    yearsExperience: "5+ Yrs",
    commissionSlotsAvailable: 3,
  },

  // Standardized Turnaround & Quote Timelines
  timelines: {
    quoteResponse: "24–48 hours",
    customCommissions: "2–3 weeks",
    resinPreservation: "14–21 days", // (7-10 days silica-gel dehydration + 7 days multi-layer UV curing)
    murals: "1–3 weeks",
    readyShopShipping: "3–5 business days",
  },

  // Shipping & Shipping Thresholds
  shipping: {
    freeThresholdINR: 2499,
    freeThresholdFormatted: "₹2,499",
    flatFeeINR: 150,
    flatFeeFormatted: "₹150",
    courierPartners: ["BlueDart", "Delhivery", "DTDC", "India Post Speed Post"],
    coverage: "Tracked Pan-India Delivery with declared value protection",
    internationalNotice: "International shipping available on request (subject to destination customs & plant import regulations)",
  },

  // Deposit & Payment Policies
  payments: {
    depositPercentage: "50%",
    depositPolicy: "A 50% deposit is required to lock in your slot and commence initial sketch/design work. The remaining 50% is due upon final digital preview approval prior to dispatch.",
    paymentMethods: ["Razorpay (UPI, Credit/Debit Cards, Net Banking)", "Direct Bank Transfer (NEFT/IMPS)"],
  },

  // Real Service Categories for Commissions
  services: [
    {
      id: "resin-preservation",
      title: "Resin Varmala & Flower Preservation",
      desc: "Wedding varmala, bridal bouquets, and sacred occasion flowers preserved in crystal-clear UV-inhibited resin blocks, clocks, and keepsakes.",
      startingPrice: "₹3,499",
      popularSizes: ["Hexagon Block (8\"–12\")", "Resin Wall Clock (12\"–16\")", "Grand Heirloom Plaque (16\"–24\")"],
    },
    {
      id: "wall-murals",
      title: "Wall Art & Murals",
      desc: "Custom editorial and neo-brutalist wall murals for homes, cafes, and boutique commercial spaces using UV-resistant pigments.",
      startingPrice: "₹250 / sq ft",
      popularSizes: ["Accent Wall (8ft × 6ft)", "Feature Mural (10ft × 8ft)", "Full Facade"],
    },
    {
      id: "charcoal-portraits",
      title: "Charcoal & Graphite Heirloom Portraits",
      desc: "Hand-drawn portrait sketches of couples, family heirlooms, and pets created with archival charcoal and fixative sealant.",
      startingPrice: "₹2,499",
      popularSizes: ["A4 (21×30cm)", "A3 (30×42cm)", "A2 (42×60cm)"],
    },
    {
      id: "murti-painting",
      title: "Murti Painting & Sacred Art",
      desc: "Handcrafted murti painting, gold-leaf shringar details, and traditional sacred artwork for home mandirs.",
      startingPrice: "₹3,200",
      popularSizes: ["Small Mandir Murti (6\"–12\")", "Canvas Sacred Painting"],
    },
    {
      id: "custom-canvas",
      title: "Mixed Media Canvas & Handmade Gifts",
      desc: "Original mixed media paintings on Belgian canvas, illuminated bottle art, and custom milestone hampers.",
      startingPrice: "₹1,800",
      popularSizes: ["Small (8\"×10\")", "Medium (16\"×20\")", "Large (24\"×36\")"],
    },
  ],

  // Legal & Grievance Information (E-Commerce Rules Compliance)
  legal: {
    entityName: "Vinyas Art Studio",
    grievanceOfficer: "Anki Matolia",
    grievanceEmail: "vinyas.artist@gmail.com",
    grievanceAddress: "Vinyas Art Studio, Main Town, Ratangarh, Churu District, Rajasthan 331022, India",
    dpdpDataProcessors: ["Vercel Inc. (Hosting)", "Cloudinary (Media Assets)", "Supabase Inc. (Database)", "Razorpay Software Pvt Ltd (Payments)"],
  },
};
