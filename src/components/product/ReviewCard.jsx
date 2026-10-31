import React from 'react';
import { Star, CheckCircle } from 'lucide-react';
import { formatDate } from '../../utils/formatters.js';

const ReviewCard = ({ review }) => {
  if (!review) return null;

  return (
    <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-sm space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
            {review.userName?.charAt(0) || 'U'}
          </div>
          <div>
            <h5 className="text-xs font-semibold text-brandText">{review.userName}</h5>
            <div className="flex items-center text-[10px] text-emerald-700">
              <CheckCircle className="w-3 h-3 mr-0.5" />
              <span>Verified Buyer</span>
            </div>
          </div>
        </div>
        <span className="text-[11px] text-stone-400">{formatDate(review.createdAt)}</span>
      </div>

      {/* Stars */}
      <div className="flex items-center text-amber-500">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-3.5 h-3.5 ${
              i < review.rating ? 'fill-current' : 'text-stone-300'
            }`}
          />
        ))}
      </div>

      {/* Comment */}
      <p className="text-xs text-stone-600 leading-relaxed">{review.comment}</p>
    </div>
  );
};

export default ReviewCard;

