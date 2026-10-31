import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

const EmptyState = ({
  icon: Icon = Sparkles,
  title = 'No Sarees Found',
  description = 'We couldn’t find any drapes matching your selection. Try adjusting your search or filters.',
  buttonText = 'Browse All Sarees',
  buttonLink = '/shop',
}) => {
  return (
    <div className="text-center py-16 px-4 max-w-md mx-auto">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cream border border-gold/40 flex items-center justify-center text-primary shadow-sm">
        <Icon className="w-8 h-8 text-gold" />
      </div>
      <h3 className="font-serif text-xl font-bold text-brandText mb-2">{title}</h3>
      <p className="text-stone-500 text-xs leading-relaxed mb-6">{description}</p>
      {buttonText && buttonLink && (
        <Link
          to={buttonLink}
          className="inline-flex items-center justify-center px-6 py-2.5 bg-primary hover:bg-primary-light text-white text-xs font-semibold uppercase tracking-widest rounded-md shadow hover:shadow-md transition"
        >
          {buttonText}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;

