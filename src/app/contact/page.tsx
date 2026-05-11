'use client';

import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Clock, Send } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-linen">
      {/* Hero */}
      <section className="h-[40vh] bg-charcoal flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="font-serif text-[48px] md:text-[64px] font-bold text-linen mb-4">
            Get in <em className="text-terra italic">Touch</em>
          </h1>
          <p className="text-[14px] text-linen/40">
            Have a project in mind? Let's collaborate
          </p>
        </motion.div>
      </section>

      <div className="max-w-[1100px] mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-serif text-[32px] font-bold text-charcoal mb-8">
              Contact <em className="text-terra italic">Info</em>
            </h2>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 border border-charcoal flex items-center justify-center flex-shrink-0">
                  <MapPin size={18} className="text-terra" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-charcoal/40 mb-1">
                    Studio Location
                  </p>
                  <p className="text-[14px] text-charcoal/70 leading-relaxed">
                    123 Artist Colony<br />
                    Jaipur, Rajasthan 302001<br />
                    India
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 border border-charcoal flex items-center justify-center flex-shrink-0">
                  <Mail size={18} className="text-terra" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-charcoal/40 mb-1">
                    Email
                  </p>
                  <p className="text-[14px] text-charcoal/70">
                    hello@inkbloom.art
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 border border-charcoal flex items-center justify-center flex-shrink-0">
                  <Phone size={18} className="text-terra" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-charcoal/40 mb-1">
                    Phone
                  </p>
                  <p className="text-[14px] text-charcoal/70">
                    +91 12345 67890
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 border border-charcoal flex items-center justify-center flex-shrink-0">
                  <Clock size={18} className="text-terra" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-charcoal/40 mb-1">
                    Studio Hours
                  </p>
                  <p className="text-[14px] text-charcoal/70 leading-relaxed">
                    Monday - Friday: 10:00 AM - 6:00 PM<br />
                    Saturday: 11:00 AM - 4:00 PM<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="mt-12">
              <h3 className="font-serif text-[24px] font-bold text-charcoal mb-6">
                FAQ
              </h3>
              <div className="space-y-4">
                {[
                  {
                    q: "What's the turnaround time for commissions?",
                    a: "Typically 2-3 weeks depending on complexity and current queue.",
                  },
                  {
                    q: "Do you ship internationally?",
                    a: "Yes! We ship worldwide. Shipping costs are calculated at checkout.",
                  },
                  {
                    q: "Can I request revisions?",
                    a: "Absolutely. Each commission includes up to 2 rounds of revisions.",
                  },
                ].map((faq, i) => (
                  <details
                    key={i}
                    className="border border-charcoal/20 p-4 cursor-pointer"
                  >
                    <summary className="text-[13px] font-semibold text-charcoal marker:text-terra">
                      {faq.q}
                    </summary>
                    <p className="text-[12px] text-charcoal/60 mt-2 leading-relaxed">
                      {faq.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-serif text-[32px] font-bold text-charcoal mb-8">
              Send a <em className="text-terra italic">Message</em>
            </h2>

            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-charcoal/60 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full h-[44px] px-4 border border-charcoal bg-transparent text-[13px] text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-terra transition-colors"
                    placeholder="Jane Doe"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-charcoal/60 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full h-[44px] px-4 border border-charcoal bg-transparent text-[13px] text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-terra transition-colors"
                    placeholder="jane@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-charcoal/60 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  className="w-full h-[44px] px-4 border border-charcoal bg-transparent text-[13px] text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-terra transition-colors"
                  placeholder="Commission Inquiry"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-charcoal/60 mb-2">
                  Message
                </label>
                <textarea
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-charcoal bg-transparent text-[13px] text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-terra transition-colors resize-vertical"
                  placeholder="Tell me about your project..."
                />
              </div>

              <button
                type="submit"
                className="w-full h-[48px] bg-charcoal text-linen font-bold text-[11px] uppercase tracking-[0.14em] hover:bg-charcoal/90 transition-colors flex items-center justify-center gap-2"
              >
                <Send size={14} />
                Send Message
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
