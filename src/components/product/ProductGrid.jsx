import React from 'react';
import ProductCard from './ProductCard.jsx';
import EmptyState from '../common/EmptyState.jsx';

const ProductGrid = ({
  products = [],
  loading = false,
  emptyTitle = 'No Sarees Available',
  emptyDescription = 'There are no sarees matching this collection right now.',
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl overflow-hidden border border-stone-200/60 p-2.5 sm:p-3 space-y-2.5 animate-pulse">
            <div className="aspect-[3/4] bg-stone-200 rounded-lg"></div>
            <div className="h-3 bg-stone-200 rounded w-1/3"></div>
            <div className="h-4 bg-stone-200 rounded w-4/5"></div>
            <div className="h-4 bg-stone-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;

