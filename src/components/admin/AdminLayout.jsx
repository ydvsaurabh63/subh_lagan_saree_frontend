import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  LayoutDashboard,
  Store,
  Shirt,
  Wand2,
  Coins,
  TrendingUp,
  HelpCircle,
  LifeBuoy,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

const AdminLayout = ({ children, title = 'Store Client Panel' }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Section 1: Main Tabs requested by user
  // Overview, Store, Trials, Playground, Credits, Sales
  const mainNavItems = [
    {
      to: '/admin',
      end: true,
      label: 'Overview',
      icon: LayoutDashboard,
    },
    {
      to: '/admin/store',
      label: 'Store',
      icon: Store,
    },
    {
      to: '/admin/trials',
      label: 'Trials',
      icon: Shirt,
    },
    {
      to: '/admin/playground',
      label: 'Playground',
      icon: Wand2,
    },
    {
      to: '/admin/credits',
      label: 'Credits',
      icon: Coins,
    },
    {
      to: '/admin/sales',
      label: 'Sales',
      icon: TrendingUp,
    },
  ];

  // Section 2: Secondary Tabs requested by user
  // Help, Support, Credits
  const secondaryNavItems = [
    {
      to: '/admin/help',
      label: 'Help',
      icon: HelpCircle,
    },
    {
      to: '/admin/support',
      label: 'Support',
      icon: LifeBuoy,
    },
    {
      to: '/admin/credits',
      label: 'Credits',
      icon: Coins,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Admin Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 h-screen w-72 bg-gradient-to-b from-[#2B0A13] via-[#3B0E1B] to-[#20060E] text-cream z-50 flex flex-col justify-between transition-transform duration-300 shadow-2xl select-none ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Brand Header */}
          <div className="p-5 border-b border-gold/20 flex items-center justify-between shrink-0">
            <Link to="/admin" className="flex items-center gap-3 group">
              <img
                src="/logo.png"
                alt="Subh Lagan Sarees"
                className="h-14 w-auto object-contain drop-shadow group-hover:scale-105 transition-transform"
              />
              <div>
                <p className="text-[10px] tracking-widest text-gold uppercase font-bold">
                  Client Panel
                </p>
              </div>
            </Link>

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 text-cream/70 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items (Scrollable if height is constrained) */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
            
            {/* Section 1: Main Management */}
            <div>
              <p className="px-3 text-[10px] uppercase tracking-widest text-gold font-bold mb-1.5">
                Menu
              </p>
              <nav className="space-y-1">
                {mainNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.label}
                      to={item.to}
                      end={item.end}
                      onClick={() => setSidebarOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-bold tracking-wide transition-all ${
                          isActive
                            ? 'bg-gold text-primary font-extrabold shadow-md shadow-gold/20 translate-x-1'
                            : 'text-cream/90 hover:bg-white/10 hover:text-white'
                        }`
                      }
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </nav>
            </div>

            {/* Section 2: Help, Support, Credits */}
            <div className="pt-2 border-t border-gold/15">
              <p className="px-3 text-[10px] uppercase tracking-widest text-gold/80 font-bold mb-1.5">
                Support
              </p>
              <nav className="space-y-1">
                {secondaryNavItems.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={`${item.label}-${idx}`}
                      to={item.to}
                      onClick={() => setSidebarOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold tracking-wide transition-all ${
                          isActive
                            ? 'bg-gold text-primary font-extrabold shadow-md shadow-gold/20 translate-x-1'
                            : 'text-cream/90 hover:bg-white/10 hover:text-white'
                        }`
                      }
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </nav>
            </div>

          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-gold/20 space-y-2 shrink-0">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold text-cream hover:text-gold hover:bg-white/5 border border-gold/30 transition-all"
          >
            <span className="flex items-center gap-2">
              <Store className="w-4 h-4 text-gold" />
              Live Store
            </span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </Link>

          <div className="flex items-center justify-between px-2 pt-1 border-t border-white/5">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-7 h-7 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center text-xs font-bold text-gold shrink-0">
                {(() => {
                  const displayName = (user?.name || 'Client')
                    .replace(/\(Admin\)/gi, '(Client)')
                    .replace(/\bAdmin\b/gi, 'Client');
                  return displayName.charAt(0).toUpperCase();
                })()}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-cream truncate">
                  {(user?.name || 'Client')
                    .replace(/\(Admin\)/gi, '(Client)')
                    .replace(/\bAdmin\b/gi, 'Client')}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 text-cream/80 hover:text-red-400 hover:bg-white/5 rounded-lg transition"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin Content View Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Mobile Bar */}
        <header className="lg:hidden bg-primary text-white p-3 flex items-center justify-between border-b border-gold/20 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 text-white hover:text-gold focus:outline-none"
            >
              <Menu className="w-6 h-6" />
            </button>
            <img
              src="/logo.png"
              alt="Subh Lagan Sarees"
              className="h-8 w-auto object-contain"
            />
          </div>

          <Link
            to="/"
            target="_blank"
            className="text-xs font-bold text-gold flex items-center gap-1"
          >
            <span>Live Store</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </header>

        {/* Child Pages Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
