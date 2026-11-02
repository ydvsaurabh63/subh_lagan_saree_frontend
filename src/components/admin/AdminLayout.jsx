import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  LayoutDashboard,
  ShoppingBag,
  PackageCheck,
  Tags,
  MessageSquare,
  Mail,
  Store,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

const AdminLayout = ({ children, title = 'Store Administration' }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    {
      to: '/admin',
      end: true,
      label: 'Dashboard Overview',
      icon: LayoutDashboard,
    },
    {
      to: '/admin/products',
      label: 'Saree Inventory',
      icon: ShoppingBag,
    },
    {
      to: '/admin/orders',
      label: 'Orders & COD Dispatch',
      icon: PackageCheck,
    },
    {
      to: '/admin/categories',
      label: 'Categories',
      icon: Tags,
    },
    {
      to: '/admin/enquiries',
      label: 'Customer Inquiries',
      icon: MessageSquare,
    },
    {
      to: '/admin/subscribers',
      label: 'Newsletter Leads',
      icon: Mail,
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
        className={`fixed lg:sticky top-0 h-screen w-72 bg-gradient-to-b from-[#2B0A13] via-[#3B0E1B] to-[#20060E] text-cream z-50 flex flex-col justify-between transition-transform duration-300 shadow-2xl ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-gold/20 flex items-center justify-between">
            <Link to="/admin" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center text-gold shadow-inner">
                <Sparkles className="w-5 h-5 text-gold animate-pulse" />
              </div>
              <div>
                <h1 className="font-serif text-lg tracking-wider text-gold font-bold leading-tight">
                  SUBH LAGAN
                </h1>
                <p className="text-[10px] tracking-widest text-cream/60 uppercase">
                  Client Control Panel
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

          {/* Navigation Items */}
          <nav className="p-4 space-y-1.5 mt-2">
            <p className="px-3 text-[10px] uppercase tracking-widest text-gold/60 font-semibold mb-2">
              Website Management
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3.5 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-gold text-primary font-bold shadow-md shadow-gold/20 translate-x-1'
                        : 'text-cream/80 hover:bg-white/10 hover:text-white'
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

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gold/20 space-y-3">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3.5 py-2 rounded-lg text-xs font-medium text-cream/80 hover:text-gold hover:bg-white/5 border border-gold/20 transition-all"
          >
            <span className="flex items-center gap-2">
              <Store className="w-4 h-4 text-gold" />
              Live Boutique Store
            </span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
          </Link>

          <div className="flex items-center justify-between px-2 pt-2 border-t border-white/5">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center text-xs font-bold text-gold">
                {user?.name?.[0]?.toUpperCase() || 'A'}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-cream truncate">
                  {user?.name || 'Administrator'}
                </p>
                <p className="text-[10px] text-cream/50 flex items-center gap-1">
                  <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
                  Store Owner
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Logout from Admin"
              className="p-1.5 text-cream/60 hover:text-rose-400 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-gold/20 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-primary hover:bg-cream/50 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-primary tracking-wide">
                {title}
              </h2>
              <p className="text-[11px] text-stone-500 hidden sm:block">
                Subh Lagan Sarees • Executive Administrative Suite
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary border border-primary/30 rounded-md hover:bg-primary hover:text-cream transition-all shadow-sm"
            >
              <Store className="w-3.5 h-3.5" />
              <span>View Customer Website</span>
            </Link>

            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping mr-1.5" />
              Live Store Active
            </span>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
