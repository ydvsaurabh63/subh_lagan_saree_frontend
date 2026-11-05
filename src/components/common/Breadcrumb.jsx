import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumb = ({ items = [], light = false }) => {
  return (
    <nav className={`flex items-center space-x-1.5 text-xs ${light ? 'text-stone-300' : 'text-stone-500'} py-3 overflow-x-auto whitespace-nowrap`}>
      <Link to="/" className={`flex items-center ${light ? 'text-stone-200 hover:text-white' : 'hover:text-primary'} transition`}>
        <Home className="w-3.5 h-3.5 mr-1" />
        <span>Home</span>
      </Link>

      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={idx}>
            <ChevronRight className={`w-3 h-3 ${light ? 'text-stone-400' : 'text-stone-400'} flex-shrink-0`} />
            {isLast || !item.link ? (
              <span className={`font-semibold ${light ? 'text-white' : 'text-primary'} truncate max-w-[200px]`}>
                {item.label}
              </span>
            ) : (
              <Link to={item.link} className={`${light ? 'text-stone-200 hover:text-white' : 'hover:text-primary'} transition truncate max-w-[150px]`}>
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

