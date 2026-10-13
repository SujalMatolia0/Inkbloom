"use client";

import { useState } from "react";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/site";
import { submitCommission } from "@/app/actions/commissions";
import { 
  ChevronDown, 
  Upload, 
  Check, 
  ArrowRight,
  CheckCircle2
} from "lucide-react";

export function CommissionForm() {
  const [selectedService, setSelectedService] = useState(SITE_CONFIG.services[0].id);
  const [selectedSize, setSelectedSize] = useState("");
  const [budgetValue, setBudgetValue] = useState(5000);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // General Form Input States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [vision, setVision] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [consentGiven, setConsentGiven] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [fileError, setFileError] = useState("");
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  // Service-Specific Fields
  const [eventDate, setEventDate] = useState("");
  const [flowerType, setFlowerType] = useState("");
  const [wallDimensions, setWallDimensions] = useState("");
  const [cityLocation, setCityLocation] = useState("");

  const currentServiceObj = SITE_CONFIG.services.find(s => s.id === selectedService) || SITE_CONFIG.services[0];
  const activeSizes = currentServiceObj.popularSizes;
  const currentSize = selectedSize || activeSizes[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Spam honeypot trap check
    if (honeypot.trim().length > 0) {
      setFormStatus("success");
      setStatusMessage("Thank you! Your inquiry has been received.");
      return;
    }

    if (!consentGiven) {
      setFormStatus("error");
      setStatusMessage("Please agree to the Privacy Policy and Terms of Service to proceed.");
      return;
    }

    if (!name.trim() || !email.trim() || !phone.trim() || !vision.trim()) {
      setFormStatus("error");
      setStatusMessage("Please fill in your name, email, phone number, and brief project details.");
      return;
    }

    setFormStatus("submitting");

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("email", email.trim());
    formData.append("phone", phone.trim());
    formData.append("service", selectedService);
    formData.append("size", currentSize);
    formData.append("budgetValue", budgetValue.toString());
    formData.append("vision", vision.trim());
    formData.append("additionalNotes", additionalNotes.trim());
    formData.append("honeypot", honeypot.trim());
    formData.append("consentGiven", consentGiven ? "true" : "false");
    formData.append("eventDate", eventDate.trim());
    formData.append("flowerType", flowerType.trim());
    formData.append("wallDimensions", wallDimensions.trim());
    formData.append("cityLocation", cityLocation.trim());
    if (selectedFile) {
      formData.append("file", selectedFile);
    }

    try {
      const res = await submitCommission(formData);
      if (res.success) {
        setFormStatus("success");
        setStatusMessage(`Thank you ${name}! Your commission brief has been recorded. Anki will review your vision and email your detailed quote within ${SITE_CONFIG.timelines.quoteResponse}.`);
        // Reset form inputs & selected file
        setName("");
        setEmail("");
        setPhone("");
        setSubject("");
        setVision("");
        setAdditionalNotes("");
        setEventDate("");
        setFlowerType("");
        setWallDimensions("");
        setCityLocation("");
        setSelectedFile(null);
        setFileName("");
        setFileError("");
      } else {
        setFormStatus("error");
        setStatusMessage(res.error || `Something went wrong submitting your request. Please try again or email us at ${SITE_CONFIG.email}.`);
      }
    } catch {
      setFormStatus("error");
      setStatusMessage(`Network error submitting request. Please check your connection or email us at ${SITE_CONFIG.email}.`);
    }
  };

  const faqs = [
    { 
      q: "What is the commission process & deposit requirement?", 
      a: `Every custom commission starts with an initial consultation and digital sketch preview. We require a ${SITE_CONFIG.payments.depositPercentage} deposit to confirm your slot and begin work. The remaining ${SITE_CONFIG.payments.depositPercentage} is payable upon final approval prior to safe shipping.` 
    },
    { 
      q: "How long do custom commissions and resin flower preservation take?", 
      a: `Custom charcoal portraits and canvas art take ${SITE_CONFIG.timelines.customCommissions}. Resin varmala preservation takes ${SITE_CONFIG.timelines.resinPreservation} due to silica-gel flower dehydration, multi-layer pouring, and 7-day UV curing.` 
    },
    { 
      q: "Can I request revisions during the sketch stage?", 
      a: "Yes! Every custom portrait and canvas commission includes up to 2 rounds of complimentary revisions during the digital sketch preview stage." 
    },
    { 
      q: "How do I ship my fresh wedding Varmala for resin preservation?", 
      a: "Upon booking, we send step-by-step courier guidelines (wrapping stems in damp tissue paper and packing with cooling packs) to send your flowers to our studio in Ratangarh, Rajasthan." 
    },
    { 
      q: "How are artworks packaged and shipped?", 
      a: `All original paintings and resin pieces are wrapped in acid-free glassine paper, high-density bubble armor, and reinforced corner guards. Packages are dispatched with tracked pan-India courier delivery.` 
    },
  ];

  return (
    <div className="w-full">
      {/* HERO SECTION */}
      <section className="comm-hero">
        <div className="hero-left">
          <div className="bg-ghost opacity-[0.05]">VINYAS</div>
          <div className="hero-inner reveal">
            <div className="sec-label">Custom Handcrafted Art</div>
            <h1 className="hero-title">
              Artistry crafted<br />
              <em className="text-terracotta italic">personally</em> for<br />
              <span className="outline">your space.</span>
            </h1>
            <p className="hero-body">
              From wedding Varmala resin preservation and custom family portraits to wall murals and sacred murti painting — every piece is handcrafted by Anki in our Ratangarh studio.
            </p>
            <div className="status-pill">
              <div className="pip"></div>
              <span className="status-text font-mono text-xs">Open for Commissions · Personal Studio Consultation</span>
            </div>
          </div>

          <div className="slots-row reveal">
            <div className="slot-item">
              <div className="slot-num font-mono">24–48h</div>
              <div className="slot-label">Quote Turnaround</div>
            </div>
            <div className="slot-item">
              <div className="slot-num font-mono">2–3 wks</div>
              <div className="slot-label">Portrait Completion</div>
            </div>
            <div className="slot-item">
              <div className="slot-num font-mono">14–21d</div>
              <div className="slot-label">Resin Varmala Turnaround</div>
            </div>
          </div>
        </div>

        {/* RIGHT — Process Overview */}
        <div className="hero-right-dark">
          <div className="dark-grid"></div>
          <div className="process-preview reveal">
            <div className="mb-8">
              <div className="sec-label text-linen/40">Studio Workflow</div>
              <h2 className="font-serif text-[26px] font-bold text-linen leading-[1.1]">
                The <em className="text-terracotta italic">Commission Process.</em>
              </h2>
            </div>
            {[
              { n: 1, t: "Submit Brief & References", d: "Choose your service category, dimensions, and upload your reference photos or flower preservation details." },
              { n: 2, t: "Receive Detailed Quote", d: "Anki reviews your concept and emails a transparent quote & timeline within 24–48 hours." },
              { n: 3, t: "Approve Sketch & Deposit", d: `Confirm with a ${SITE_CONFIG.payments.depositPercentage} deposit before work starts. You receive work-in-progress previews for feedback.` },
              { n: 4, t: "Tracked Transit & Delivery", d: "Final approval, balance payment, then your artwork is packed in archival armor and delivered with tracked shipping." }
            ].map((step) => (
              <div key={step.n} className="process-item">
                <div className="process-num font-mono">{step.n}</div>
                <div>
                  <div className="process-title">{step.t}</div>
                  <div className="process-desc">{step.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICE CATEGORY SELECTOR */}
      <section className="py-16 md:py-24 bg-linen border-t-1.5 border-b-1.5 border-charcoal px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <div className="sec-label">Choose Studio Service</div>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-charcoal">
              Real Services &amp; <em className="text-terra italic">Starting Rates</em>
            </h2>
            <p className="text-xs sm:text-sm text-charcoal/70 mt-2 max-w-xl font-sans">
              Select the service you wish to commission to tailor your specifications and budget.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SITE_CONFIG.services.map((service) => {
              const isSelected = selectedService === service.id;
              return (
                <button
                  key={service.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => {
                    setSelectedService(service.id);
                    setSelectedSize(service.popularSizes[0]);
                  }}
                  className={`p-6 border-1.5 text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "bg-charcoal text-linen border-charcoal shadow-neo-lg"
                      : "bg-paper text-charcoal border-charcoal/30 hover:border-charcoal hover:bg-linen shadow-neo"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className={`text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 border ${
                        isSelected ? "bg-terra text-linen border-terra" : "bg-terra/10 text-terra border-terra/30"
                      }`}>
                        Starting {service.startingPrice}
                      </span>
                      {isSelected && <CheckCircle2 size={16} className="text-terra-pale" />}
                    </div>
                    <h3 className="font-serif font-bold text-xl leading-snug mb-2">{service.title}</h3>
                    <p className={`text-xs leading-relaxed mb-4 ${isSelected ? "text-linen/75" : "text-charcoal/70"}`}>
                      {service.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-current/15 text-[10px] font-mono">
                    <span className="opacity-60 uppercase tracking-wider block mb-1">Common Sizes:</span>
                    <span className="font-bold">{service.popularSizes.join(" · ")}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* DETAILED COMMISSION FORM */}
      <section className="form-section">
        <form onSubmit={handleSubmit} className="contents">
          {/* LEFT — Detailed Input Form */}
          <div className="form-left">
            <div className="sec-label">Commission Specifications</div>
            <h2 className="font-serif text-[clamp(28px,3.5vw,40px)] font-bold text-charcoal leading-[1.05] tracking-tight mb-8">
              Tell us about <em className="italic text-terracotta">your vision.</em>
            </h2>

            {/* Selected Service Indicator */}
            <div className="p-4 bg-paper border-1.5 border-charcoal mb-8 shadow-neo flex items-center justify-between">
              <div>
                <span className="text-[9px] font-mono uppercase tracking-widest text-charcoal/50 block">Selected Service:</span>
                <span className="font-serif font-bold text-base text-charcoal">{currentServiceObj.title}</span>
              </div>
              <span className="text-xs font-mono font-bold text-terra">Starting {currentServiceObj.startingPrice}</span>
            </div>

            {/* Name Input */}
            <div className="field-group reveal">
              <label htmlFor="name-input" className="field-label">Your Name *</label>
              <input 
                id="name-input"
                className="field-input" 
                type="text" 
                placeholder="e.g. Priya Sharma" 
                required 
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Email & Phone Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="field-group reveal">
                <label htmlFor="email-input" className="field-label">Email Address *</label>
                <input 
                  id="email-input"
                  className="field-input" 
                  type="email" 
                  placeholder="you@example.com" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="field-group reveal">
                <label htmlFor="phone-input" className="field-label">Phone *</label>
                <input 
                  id="phone-input"
                  className="field-input" 
                  type="tel" 
                  placeholder="+91 98XXX XXXXX" 
                  required 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            {/* Service Specific Fields */}
            {selectedService === "resin-preservation" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-paper border-1.5 border-charcoal mb-6">
                <div>
                  <label htmlFor="event-date-input" className="field-label">Wedding / Event Date</label>
                  <input 
                    id="event-date-input"
                    className="field-input" 
                    type="date" 
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="flower-type-input" className="field-label">Flower Type / Varmala Colors</label>
                  <input 
                    id="flower-type-input"
                    className="field-input" 
                    type="text" 
                    placeholder="e.g. Red roses & baby's breath"
                    value={flowerType}
                    onChange={(e) => setFlowerType(e.target.value)}
                  />
                </div>
              </div>
            )}

            {selectedService === "wall-murals" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-paper border-1.5 border-charcoal mb-6">
                <div>
                  <label htmlFor="wall-dim-input" className="field-label">Approx Wall Dimensions</label>
                  <input 
                    id="wall-dim-input"
                    className="field-input" 
                    type="text" 
                    placeholder="e.g. 10ft × 8ft"
                    value={wallDimensions}
                    onChange={(e) => setWallDimensions(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="city-loc-input" className="field-label">City / Site Location</label>
                  <input 
                    id="city-loc-input"
                    className="field-input" 
                    type="text" 
                    placeholder="e.g. Cafe, Jaipur / Home, Delhi"
                    value={cityLocation}
                    onChange={(e) => setCityLocation(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Subject Input */}
            <div className="field-group reveal">
              <label htmlFor="subject-input" className="field-label">Project Title / Event Occasion</label>
              <input 
                id="subject-input"
                className="field-input" 
                type="text" 
                placeholder="e.g. Wedding Varmala Preservation / Grandparents Charcoal Heirloom"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            {/* Scope / Size Selection (Derived from Selected Service) */}
            <div className="field-group reveal">
              <label className="field-label">Preferred Size / Scope for {currentServiceObj.title}</label>
              <div className="size-grid">
                {activeSizes.map((sizeOpt) => (
                  <button 
                    key={sizeOpt}
                    type="button"
                    aria-pressed={currentSize === sizeOpt}
                    className={`size-btn ${currentSize === sizeOpt ? "active" : ""}`}
                    onClick={() => setSelectedSize(sizeOpt)}
                  >
                    {sizeOpt}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget Range Slider */}
            <div className="field-group reveal">
              <label htmlFor="budget-slider" className="field-label">Target Budget (INR ₹)</label>
              <div className="budget-row">
                <span className="text-[9px] font-bold tracking-widest uppercase text-charcoal/40 font-mono">Min ₹1,800</span>
                <span className="budget-val font-mono">₹{budgetValue.toLocaleString("en-IN")}</span>
                <span className="text-[9px] font-bold tracking-widest uppercase text-charcoal/40 font-mono">Max ₹50,000+</span>
              </div>
              <input 
                id="budget-slider"
                type="range" 
                min="1800" 
                max="50000" 
                step="500" 
                value={budgetValue} 
                onChange={(e) => setBudgetValue(parseInt(e.target.value))}
              />
            </div>

            {/* Accessible Reference Upload */}
            <div className="field-group reveal">
              <label htmlFor="reference-upload" className="field-label">Upload Reference Photo / Varmala Photo (Optional)</label>
              <div className="upload-area cursor-pointer relative">
                <input 
                  id="reference-upload"
                  type="file" 
                  accept="image/*" 
                  className="sr-only focus:not-sr-only focus:absolute focus:z-20 focus:p-2 focus:bg-white" 
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      if (file.size > 10 * 1024 * 1024) {
                        setFileError("Please select an image smaller than 10MB.");
                        setSelectedFile(null);
                        setFileName("");
                        return;
                      }
                      setFileError("");
                      setSelectedFile(file);
                      setFileName(file.name);
                    }
                  }}
                />
                <label htmlFor="reference-upload" className="w-full flex flex-col items-center justify-center cursor-pointer">
                  <Upload className="mb-3 opacity-30" size={28} />
                  <div className="upload-label">
                    {fileName ? `Selected: ${fileName}` : "Click or press to select photo"}
                  </div>
                  <div className="upload-hint">PNG, JPG or WebP images up to 10MB</div>
                </label>
              </div>
              {fileError && <p className="text-xs text-red-600 font-mono mt-1">{fileError}</p>}
            </div>

            {/* Vision Textarea */}
            <div className="field-group reveal">
              <label htmlFor="vision-input" className="field-label">Describe Your Vision &amp; Concept *</label>
              <textarea 
                id="vision-input"
                className="field-input" 
                rows={5} 
                placeholder="Describe your desired mood, color palette, flower type, date of wedding, or personal stories for the artist…"
                required
                value={vision}
                onChange={(e) => setVision(e.target.value)}
              ></textarea>
            </div>

            {/* Bot Spam Trap (Honeypot) */}
            <div className="hidden" aria-hidden="true">
              <input
                type="text"
                name="website"
                tabIndex={-1}
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                autoComplete="off"
              />
            </div>

            {/* Consent Checkbox */}
            <div className="flex items-start gap-3 pt-2">
              <input
                id="consent-checkbox"
                type="checkbox"
                required
                checked={consentGiven}
                onChange={(e) => setConsentGiven(e.target.checked)}
                className="mt-1 w-4 h-4 text-terra border-charcoal focus:ring-terra cursor-pointer shrink-0"
              />
              <label htmlFor="consent-checkbox" className="text-xs text-charcoal/80 leading-normal cursor-pointer">
                I agree to the <Link href="/privacy" className="text-terra underline font-semibold" target="_blank">Privacy Policy</Link> and <Link href="/terms" className="text-terra underline font-semibold" target="_blank">Terms &amp; Conditions</Link>. I understand that custom commissions require a {SITE_CONFIG.payments.depositPercentage} deposit before work begins.
              </label>
            </div>
          </div>

          {/* RIGHT — Summary & Submit Card */}
          <div className="form-right">
            <div className="hero-right-bg opacity-[0.05]"></div>
            <div className="form-right-inner">
              <div className="sec-label text-linen/50">Submit Brief</div>
              <h2 className="font-serif text-[clamp(26px,3vw,36px)] font-bold text-linen leading-[1.05] tracking-tight mb-3">
                Request your <em className="italic text-charcoal/70">custom quote.</em>
              </h2>
              <p className="text-[12px] text-linen/60 leading-[1.7] mb-8">
                Anki personally reviews every brief and responds within {SITE_CONFIG.timelines.quoteResponse} with transparent pricing and custom artwork options.
              </p>

              <div className="mb-8">
                <div className="text-[8.5px] font-bold tracking-[0.16em] uppercase text-linen/45 mb-2">Selected Service Rate</div>
                <div className="p-3 bg-linen/10 border border-linen/20 text-linen font-serif text-lg font-bold">
                  {currentServiceObj.title} · <span className="text-terra-pale">Starting {currentServiceObj.startingPrice}</span>
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="notes-dark" className="text-[10px] uppercase font-bold tracking-wider text-linen/60 block mb-1.5">Deadline / Event Date (Optional)</label>
                <textarea 
                  id="notes-dark"
                  className="form-field-dark" 
                  rows={3} 
                  placeholder="e.g. Need delivered before wedding date on Nov 24th"
                  style={{ resize: "none" }}
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                ></textarea>
              </div>

              {formStatus === "error" && (
                <div role="alert" className="p-3 mb-4 bg-red-950/40 border border-red-500/50 text-red-200 text-xs">
                  {statusMessage}
                </div>
              )}

              {formStatus === "success" ? (
                <div role="alert" className="p-5 bg-moss/20 border-2 border-moss text-linen mb-6">
                  <div className="flex items-center gap-2 font-bold text-sm text-moss mb-2">
                    <Check size={16} /> Commission Brief Submitted!
                  </div>
                  <p className="text-xs text-linen/80 leading-relaxed">
                    {statusMessage}
                  </p>
                  <button 
                    type="button" 
                    onClick={() => setFormStatus("idle")}
                    className="mt-4 px-4 py-2 bg-linen text-charcoal text-[10px] font-bold uppercase tracking-wider cursor-pointer hover:bg-terra hover:text-linen transition-colors"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <button 
                  type="submit" 
                  disabled={formStatus === "submitting"}
                  className="w-full py-4 bg-terra text-linen font-mono text-xs uppercase font-bold tracking-widest border border-linen/20 hover:bg-linen hover:text-charcoal transition-all shadow-neo cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span>{formStatus === "submitting" ? "Sending Brief..." : "Submit Commission Brief"}</span>
                  <ArrowRight size={14} />
                </button>
              )}
            </div>
          </div>
        </form>
      </section>

      {/* ACCESSIBLE FAQ ACCORDION */}
      <section className="py-16 md:py-24 max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="text-[10px] font-mono text-terra font-bold uppercase tracking-widest mb-2">Commission FAQ</div>
          <h2 className="text-3xl font-serif font-bold text-charcoal">
            Questions About <em className="text-terra italic">Custom Work</em>
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div key={index} className="bg-paper border-1.5 border-charcoal p-5 shadow-neo">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full text-left flex items-center justify-between gap-4 font-serif font-bold text-lg text-charcoal hover:text-terra transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown size={18} className={`shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180 text-terra" : ""}`} />
                </button>
                {isOpen && (
                  <p className="mt-3 text-xs sm:text-sm font-sans text-charcoal/80 leading-relaxed border-t border-charcoal/10 pt-3">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
