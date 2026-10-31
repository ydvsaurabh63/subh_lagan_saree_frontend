import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 bg-cream/30">
      <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-gold flex items-center justify-center text-primary font-serif font-bold text-2xl mb-4">
        404
      </div>
      <h1 className="font-serif text-3xl font-bold text-primary mb-2">
        Page Not Found
      </h1>
      <p className="text-stone-500 text-xs max-w-md mb-6">
        The royal page or saree collection you are looking for has been moved, renamed, or is unavailable.
      </p>
      <div className="flex space-x-3">
        <Link
          to="/"
          className="inline-flex items-center space-x-1.5 px-5 py-2.5 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-light transition shadow"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
        <Link
          to="/shop"
          className="inline-flex items-center space-x-1.5 px-5 py-2.5 bg-cream border border-stone-300 text-brandText text-xs font-semibold rounded-lg hover:bg-white transition"
        >
          <span>Browse Sarees</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
