import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumb = ({ items = [] }) => {
  return (
    <nav className="flex items-center space-x-1.5 text-xs text-stone-500 py-3 overflow-x-auto whitespace-nowrap">
      <Link to="/" className="flex items-center hover:text-primary transition">
        <Home className="w-3.5 h-3.5 mr-1" />
        <span>Home</span>
      </Link>

      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={idx}>
            <ChevronRight className="w-3 h-3 text-stone-400 flex-shrink-0" />
            {isLast || !item.link ? (
              <span className="font-semibold text-primary truncate max-w-[200px]">
                {item.label}
              </span>
            ) : (
              <Link to={item.link} className="hover:text-primary transition truncate max-w-[150px]">
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;

