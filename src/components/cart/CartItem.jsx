import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { formatPrice } from '../../utils/formatters.js';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const product = item.product;
  if (!product) return null;

  const price = product.discountPrice || product.price;
  const image = (product.images && product.images[0]) || '';
  const itemTotal = price * item.quantity;

  return (
    <div className="flex items-center gap-4 py-4 border-b border-stone-200">
      {/* Product Image */}
      <Link
        to={`/product/${product.slug}`}
        className="w-20 h-24 flex-shrink-0 bg-cream rounded-lg overflow-hidden border border-stone-200"
      >
        <img
          src={image}
          alt={product.name}
          className="w-full h-full object-cover object-top hover:scale-105 transition-transform"
        />
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <Link
          to={`/product/${product.slug}`}
          className="font-serif text-sm font-semibold text-brandText hover:text-primary transition line-clamp-1"
        >
          {product.name}
        </Link>
        <p className="text-xs text-stone-500 mt-0.5">
          {product.fabric} • {product.color}
        </p>
        <p className="text-xs font-semibold text-primary mt-1">
          {formatPrice(price)} each
        </p>

        {/* Quantity and Controls on Mobile */}
        <div className="flex items-center justify-between mt-3 sm:hidden">
          <div className="flex items-center border border-stone-200 rounded-md">
            <button
              onClick={() => onUpdateQuantity(product._id, item.quantity - 1)}
              className="p-1 hover:bg-cream text-stone-600"
              disabled={item.quantity <= 1}
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 text-xs font-medium">{item.quantity}</span>
            <button
              onClick={() => onUpdateQuantity(product._id, item.quantity + 1)}
              className="p-1 hover:bg-cream text-stone-600"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          <span className="text-xs font-bold text-brandText">
            {formatPrice(itemTotal)}
          </span>
          <button
            onClick={() => onRemove(product._id)}
            className="p-1 text-stone-400 hover:text-rose-600 transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Desktop Controls */}
      <div className="hidden sm:flex items-center space-x-6">
        <div className="flex items-center border border-stone-200 rounded-md bg-stone-50">
          <button
            onClick={() => onUpdateQuantity(product._id, item.quantity - 1)}
            className="p-1.5 hover:bg-cream text-stone-600"
            disabled={item.quantity <= 1}
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="px-3 text-xs font-medium">{item.quantity}</span>
          <button
            onClick={() => onUpdateQuantity(product._id, item.quantity + 1)}
            className="p-1.5 hover:bg-cream text-stone-600"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="w-24 text-right">
          <span className="text-sm font-bold text-brandText">
            {formatPrice(itemTotal)}
          </span>
        </div>

        <button
          onClick={() => onRemove(product._id)}
          className="p-1.5 text-stone-400 hover:text-rose-600 transition"
          title="Remove Item"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;

