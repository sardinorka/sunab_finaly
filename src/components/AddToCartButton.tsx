"use client";
import { useState } from "react";
import { ShoppingBag, Check, Plus, Minus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import type { StoreProduct } from "@/lib/types";

export default function AddToCartButton({
  product,
  variant = "full",
}: {
  product: StoreProduct;
  variant?: "full" | "icon";
}) {
  const { addItem, items, updateQuantity } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const cartItem = items.find((i) => i.id === product.id);

  const handleAdd = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (!product.inStock) return;
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      image: product.image,
      price: product.price,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  if (variant === "icon") {
    return (
      <button
        onClick={handleAdd}
        disabled={!product.inStock}
        className="w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center hover:bg-gold hover:text-ink transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-gold"
        aria-label="افزودن به سبد خرید"
      >
        {justAdded ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
      </button>
    );
  }

  if (cartItem) {
    return (
      <div className="flex items-center gap-3 bg-ink-2 rounded-full px-2 py-2 luxury-border w-fit">
        <button
          onClick={(e) => {
            e.preventDefault();
            updateQuantity(product.id, cartItem.quantity - 1);
          }}
          className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="w-8 text-center font-bold">
          {new Intl.NumberFormat("fa-IR").format(cartItem.quantity)}
        </span>
        <button
          onClick={(e) => {
            e.preventDefault();
            updateQuantity(product.id, cartItem.quantity + 1);
          }}
          className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleAdd}
      disabled={!product.inStock}
      className="btn-gold flex-1 px-8 py-4 rounded-full inline-flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {justAdded ? <Check className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
      <span className="font-bold">
        {!product.inStock ? "ناموجود" : justAdded ? "به سبد اضافه شد" : "افزودن به سبد خرید"}
      </span>
    </button>
  );
}
