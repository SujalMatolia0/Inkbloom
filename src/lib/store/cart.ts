import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface ItemCustomization {
  categoryType?: string;
  style?: string;
  facesCount?: number;
  size?: string;
  frame?: string;
  referenceImg?: string;
  moldShape?: string;
  namesDate?: string;
  instructions?: string;
  isPhysicalCourierRequired?: boolean;
}

export interface CartItem {
  id: string;
  productId?: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  slug: string;
  customization?: ItemCustomization;
}

export interface AppliedCoupon {
  code: string;
  description: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  discountAmount: number;
  festivalName?: string;
  minOrderAmount?: number;
}

interface CartState {
  items: CartItem[];
  appliedCoupon: AppliedCoupon | null;
  addItem: (product: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (coupon: AppliedCoupon) => void;
  removeCoupon: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getDiscountAmount: () => number;
  getFinalTotal: () => number;
}

/**
 * Global Cart Store for Studio Vinyas
 * Persistence: localStorage ('vinyas-cart')
 */
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      appliedCoupon: null,

      addItem: (product) => {
        set((state) => {
          // If customized or regular, find match by matching id
          const existingItem = state.items.find((item) => item.id === product.id)
          let newItems: CartItem[]
          if (existingItem) {
            newItems = state.items.map((item) =>
              item.id === product.id 
                ? { ...item, quantity: item.quantity + 1 } 
                : item
            )
          } else {
            newItems = [...state.items, { ...product, quantity: 1 }]
          }

          // Recalculate coupon discount if applied
          let updatedCoupon = state.appliedCoupon
          if (updatedCoupon) {
            const subtotal = newItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
            if (updatedCoupon.minOrderAmount && subtotal < updatedCoupon.minOrderAmount) {
              updatedCoupon = null
            } else if (updatedCoupon.discountType === 'PERCENTAGE') {
              updatedCoupon = {
                ...updatedCoupon,
                discountAmount: Math.round((subtotal * updatedCoupon.discountValue) / 100),
              }
            }
          }

          return { 
            items: newItems,
            appliedCoupon: updatedCoupon
          }
        })
      },

      removeItem: (id) => {
        set((state) => {
          const newItems = state.items.filter((item) => item.id !== id)
          const subtotal = newItems.reduce((acc, item) => acc + item.price * item.quantity, 0)

          let updatedCoupon = state.appliedCoupon
          if (updatedCoupon) {
            if (updatedCoupon.minOrderAmount && subtotal < updatedCoupon.minOrderAmount) {
              updatedCoupon = null
            } else if (updatedCoupon.discountType === 'PERCENTAGE') {
              updatedCoupon = {
                ...updatedCoupon,
                discountAmount: Math.round((subtotal * updatedCoupon.discountValue) / 100),
              }
            }
          }

          return {
            items: newItems,
            appliedCoupon: updatedCoupon,
          }
        })
      },

      updateQuantity: (id, quantity) => {
        set((state) => {
          let newItems: CartItem[]
          if (quantity <= 0) {
            newItems = state.items.filter((item) => item.id !== id)
          } else {
            newItems = state.items.map((item) =>
              item.id === id ? { ...item, quantity } : item
            )
          }

          const subtotal = newItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
          let updatedCoupon = state.appliedCoupon
          if (updatedCoupon) {
            if (updatedCoupon.minOrderAmount && subtotal < updatedCoupon.minOrderAmount) {
              updatedCoupon = null
            } else if (updatedCoupon.discountType === 'PERCENTAGE') {
              updatedCoupon = {
                ...updatedCoupon,
                discountAmount: Math.round((subtotal * updatedCoupon.discountValue) / 100),
              }
            }
          }

          return {
            items: newItems,
            appliedCoupon: updatedCoupon,
          }
        })
      },

      clearCart: () => set({ items: [], appliedCoupon: null }),

      applyCoupon: (coupon) => {
        set({ appliedCoupon: coupon })
      },

      removeCoupon: () => {
        set({ appliedCoupon: null })
      },

      getTotalItems: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0)
      },

      getTotalPrice: () => {
        return get().items.reduce((acc, item) => acc + item.price * item.quantity, 0)
      },

      getDiscountAmount: () => {
        const coupon = get().appliedCoupon
        if (!coupon) return 0
        const subtotal = get().getTotalPrice()
        if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) return 0
        if (coupon.discountType === 'PERCENTAGE') {
          return Math.round((subtotal * coupon.discountValue) / 100)
        }
        return Math.min(coupon.discountValue, subtotal)
      },

      getFinalTotal: () => {
        const subtotal = get().getTotalPrice()
        const discount = get().getDiscountAmount()
        return Math.max(0, subtotal - discount)
      },
    }),
    {
      name: 'vinyas-cart',
    }
  )
)
