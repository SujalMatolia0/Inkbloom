'use client';

import { useState } from 'react';
import { Minus, Plus, Flower2, ShoppingBag, Check, Sparkles } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/Toast';

export interface AddOnOption {
  id: string;
  label: string;
  pricePerUnit: number;
  unit: string; // e.g. "flower", "stem", "photo"
  emoji?: string;
  max?: number; // max quantity
}

interface ProductAddOnsProps {
  product: {
    id: string;
    title: string;
    price: number;
    image: string;
    slug: string;
    category?: string;
    stock?: number;
  };
  addOns: AddOnOption[];
  isSold?: boolean;
}

export function ProductAddOns({ product, addOns, isSold = false }: ProductAddOnsProps) {
  const addItem = useCartStore((s) => s.addItem);
  const router = useRouter();
  const [quantities, setQuantities] = useState<Record<string, number>>(
    Object.fromEntries(addOns.map((a) => [a.id, 0])),
  );
  const [customerNote, setCustomerNote] = useState('');
  const [isAdded, setIsAdded] = useState(false);

  const setQty = (id: string, delta: number) => {
    setQuantities((prev) => {
      const addon = addOns.find((a) => a.id === id)!;
      const next = Math.max(0, Math.min(prev[id] + delta, addon.max ?? 20));
      return { ...prev, [id]: next };
    });
  };

  const addOnsTotal = addOns.reduce(
    (sum, a) => sum + quantities[a.id] * a.pricePerUnit,
    0,
  );
  const grandTotal = product.price + addOnsTotal;

  const selectedAddOns = addOns.filter((a) => quantities[a.id] > 0);

  const handleAddToCart = () => {
    // Build a customization note from the selected add-ons + optional comment
    const addOnNote = selectedAddOns
      .map((a) => `${quantities[a.id]}× ${a.label}`)
      .join(', ');
    const trimmedNote = customerNote.trim();
    const combinedNote = [
      addOnNote ? `Add-ons: ${addOnNote}` : '',
      trimmedNote,
    ]
      .filter(Boolean)
      .join(' · ');

    // Use a unique cart id when add-ons or note differ so it doesn't merge with another variant
    const cartId =
      selectedAddOns.length > 0 || trimmedNote
        ? `${product.id}__${selectedAddOns.map((a) => `${a.id}_${quantities[a.id]}`).join('-')}${trimmedNote ? `_${Date.now()}` : ''}`
        : product.id;

    addItem({
      id: cartId,
      productId: product.id,
      title: product.title,
      price: grandTotal,
      image: product.image,
      slug: product.slug,
      selectedAddOns: selectedAddOns.map((a) => ({
        id: a.id,
        label: a.label,
        quantity: quantities[a.id],
        pricePerUnit: a.pricePerUnit,
        unit: a.unit,
        emoji: a.emoji,
      })),
      customization: combinedNote ? { instructions: combinedNote } : undefined,
    });

    setIsAdded(true);
    toast.success(
      'Added to Cart!',
      selectedAddOns.length > 0
        ? `${product.title} with ${addOnNote} — ₹${grandTotal.toLocaleString('en-IN')}`
        : `${product.title} — ₹${grandTotal.toLocaleString('en-IN')}`,
    );

    setTimeout(() => {
      router.push('/cart');
    }, 700);
  };

  if (addOns.length === 0) return null;

  return (
    <div className="border border-terra/30 bg-terra/5 p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Sparkles size={14} className="text-terra" />
        <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-charcoal">
          Customise Your Order
        </h4>
      </div>

      {/* Base price */}
      <div className="text-xs text-charcoal/70 font-sans">
        Base price:{' '}
        <span className="font-semibold text-charcoal">
          ₹{product.price.toLocaleString('en-IN')}
        </span>
      </div>

      {/* Add-on rows */}
      <div className="space-y-3">
        {addOns.map((addon) => (
          <div
            key={addon.id}
            className="flex items-center justify-between gap-4 py-2.5 px-3 bg-white/80 border border-charcoal/15"
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {addon.emoji && (
                <span className="text-base">{addon.emoji}</span>
              )}
              <div>
                <p className="text-xs font-semibold text-charcoal leading-tight">
                  {addon.label}
                </p>
                <p className="text-[10px] text-charcoal/50 font-mono">
                  +₹{addon.pricePerUnit.toLocaleString('en-IN')}/{addon.unit}
                </p>
              </div>
            </div>

            {/* Stepper */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQty(addon.id, -1)}
                disabled={quantities[addon.id] === 0}
                className="w-7 h-7 border border-charcoal/30 flex items-center justify-center hover:bg-charcoal hover:text-linen transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Minus size={11} />
              </button>
              <span className="w-6 text-center text-sm font-bold text-charcoal tabular-nums">
                {quantities[addon.id]}
              </span>
              <button
                type="button"
                onClick={() => setQty(addon.id, 1)}
                disabled={quantities[addon.id] >= (addon.max ?? 20)}
                className="w-7 h-7 border border-charcoal/30 flex items-center justify-center hover:bg-terra hover:text-linen hover:border-terra transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Plus size={11} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Optional Comment / Expectations */}
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal/70 mb-1">
          Comments / Expectations (Optional)
        </label>
        <textarea
          rows={2}
          value={customerNote}
          onChange={(e) => setCustomerNote(e.target.value)}
          placeholder="e.g. Color preferences, wrapping style, or special note..."
          className="w-full px-3 py-2 bg-white border border-charcoal/20 text-xs font-sans text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:border-terra"
        />
      </div>

      {/* Price summary */}
      <div className="pt-3 border-t border-terra/20 flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-charcoal/50 font-mono">
            Total
          </p>
          <p className="font-serif text-2xl font-bold text-terra leading-none">
            ₹{grandTotal.toLocaleString('en-IN')}
          </p>
          {addOnsTotal > 0 && (
            <p className="text-[10px] text-charcoal/50 font-sans mt-0.5">
              Base ₹{product.price.toLocaleString('en-IN')} + Add-ons ₹{addOnsTotal.toLocaleString('en-IN')}
            </p>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isSold || isAdded}
          className="btn-primary py-3 px-6 text-xs font-bold tracking-wider uppercase flex items-center gap-2 shadow-[3px_3px_0px_0px_rgba(45,45,45,1)] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isAdded ? (
            <>
              <Check size={14} />
              <span>Added!</span>
            </>
          ) : (
            <>
              <ShoppingBag size={14} />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

