import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { managementApi, userApi } from '../../services/api.js';
import toast from 'react-hot-toast';
import {
  Shield,
  Building2,
  UserCheck,
  TrendingUp,
  Package,
  Sparkles,
  Plus,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  Edit3,
  ExternalLink,
  Store,
  LogOut,
  Menu,
  X,
  Lock,
  Mail,
  Phone,
  Key,
  Database,
  Coins,
  ChevronRight,
  UserPlus,
  RefreshCw,
  Eye,
  EyeOff,
  ArrowUpRight,
  Award,
  Check,
  Cpu,
  Copy,
  Globe,
} from 'lucide-react';

const AdminPortalDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Active Tab: overview | manage-client | profile
  const activeTab = searchParams.get('tab') || 'overview';
  const setActiveTab = (tab) => {
    setSearchParams({ tab });
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Stats State
  const [loadingStats, setLoadingStats] = useState(false);
  const [stats, setStats] = useState(null);

  // Clients State
  const [loadingClients, setLoadingClients] = useState(false);
  const [clients, setClients] = useState([]);
  const [clientSearch, setClientSearch] = useState('');
  const [clientStatusFilter, setClientStatusFilter] = useState('all');

  const getStoreSlug = (storeName) => {
    return (storeName || 'subh-lagan').toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
  };

  const handleCopyStoreLink = (storeName) => {
    const slug = getStoreSlug(storeName);
    const origin = window.location.origin;
    const url = `${origin}/store/${slug}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      toast.success(`Store Link Copied: /store/${slug}`);
    }
  };

  // Password visibility toggles
  const [showClientPassword, setShowClientPassword] = useState(false);
  const [showProfilePassword, setShowProfilePassword] = useState(false);

  // Client Modal State
  const [clientModalOpen, setClientModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [clientFormData, setClientFormData] = useState({
    name: '',
    storeName: '',
    email: '',
    phone: '',
    password: '',
    credits: 100,
    accountStatus: 'active',
    notes: '',
  });
  const [savingClient, setSavingClient] = useState(false);

  // Profile Form States
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
  });
  const [updatingProfile, setUpdatingProfile] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // ==========================================
  // DATA FETCHING
  // ==========================================
  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      const res = await managementApi.getAdminStats();
      if (res.success) {
        setStats(res.stats);
      }
    } catch (err) {
      toast.error('Failed to load admin stats');
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchClients = async () => {
    try {
      setLoadingClients(true);
      const res = await managementApi.getClients({
        search: clientSearch,
        status: clientStatusFilter,
      });
      if (res.success) {
        setClients(res.clients || []);
      }
    } catch (err) {
      toast.error('Failed to load clients');
    } finally {
      setLoadingClients(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchClients();
  }, []);

  useEffect(() => {
    if (activeTab === 'manage-client') {
      fetchClients();
    } else if (activeTab === 'overview') {
      fetchStats();
    }
  }, [activeTab, clientSearch, clientStatusFilter]);

  // ==========================================
  // CLIENT CRUD HANDLERS
  // ==========================================
  const handleOpenAddClient = () => {
    setEditingClient(null);
    setShowClientPassword(false);
    setClientFormData({
      name: '',
      storeName: '',
      email: '',
      phone: '',
      password: '',
      credits: 100,
      accountStatus: 'active',
      notes: '',
    });
    setClientModalOpen(true);
  };

  const handleOpenEditClient = (client) => {
    setEditingClient(client);
    setShowClientPassword(false);
    setClientFormData({
      name: client.name || '',
      storeName: client.storeName || '',
      email: client.email || '',
      phone: client.phone || '',
      password: '',
      credits: client.credits || 100,
      accountStatus: client.accountStatus || 'active',
      notes: client.notes || '',
    });
    setClientModalOpen(true);
  };

  const handleSaveClient = async (e) => {
    e.preventDefault();
    try {
      setSavingClient(true);
      if (editingClient) {
        const res = await managementApi.updateClient(editingClient._id, clientFormData);
        if (res.success) {
          toast.success('Boutique client updated successfully');
          setClientModalOpen(false);
          fetchClients();
          fetchStats();
        }
      } else {
        const res = await managementApi.createClient(clientFormData);
        if (res.success) {
          toast.success('New boutique client registered successfully');
          setClientModalOpen(false);
          fetchClients();
          fetchStats();
        }
      }
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setSavingClient(false);
    }
  };

  const handleQuickAddCredits = async (clientId, addAmount, currentCredits) => {
    try {
      const newCredits = (Number(currentCredits) || 0) + Number(addAmount);
      const res = await managementApi.updateClient(clientId, { credits: newCredits });
      if (res.success) {
        toast.success(`Added ${addAmount} AI Credits! Total: ${newCredits}`);
        fetchClients();
        fetchStats();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to add credits');
    }
  };

  const handleDeleteClient = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove Client "${name}"?`)) {
      return;
    }
    try {
      const res = await managementApi.deleteClient(id);
      if (res.success) {
        toast.success(`Client "${name}" deleted`);
        fetchClients();
        fetchStats();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete client');
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const res = await managementApi.toggleUserStatus(id);
      if (res.success) {
        toast.success(`Client status changed to ${res.accountStatus}`);
        fetchClients();
        fetchStats();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to toggle status');
    }
  };

  // ==========================================
  // PROFILE HANDLERS
  // ==========================================
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setUpdatingProfile(true);
      const res = await userApi.updateProfile({
        name: profileData.name,
        phone: profileData.phone,
      });
      if (res.success) {
        toast.success('Admin profile updated successfully');
      }
    } catch (err) {
      toast.error(err.message || 'Profile update failed');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    try {
      setUpdatingPassword(true);
      const res = await userApi.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      if (res.success) {
        toast.success('Password changed successfully');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      }
    } catch (err) {
      toast.error(err.message || 'Password change failed');
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Derived metrics
  const activeClientsCount = clients.filter((c) => c.accountStatus === 'active').length;
  const suspendedClientsCount = clients.filter((c) => c.accountStatus === 'suspended').length;
  const totalCirculatingCredits = clients.reduce((acc, c) => acc + (Number(c.credits) || 0), 0);

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col lg:flex-row select-none antialiased">
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* ========================================================= */}
      {/* SIDEBAR: ADMIN PORTAL                                     */}
      {/* ========================================================= */}
      <aside
        className={`fixed lg:sticky top-0 h-screen w-72 bg-gradient-to-b from-[#18040A] via-[#24060F] to-[#120207] text-cream z-50 flex flex-col justify-between transition-transform duration-300 shadow-2xl border-r border-gold/25 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Header Brand */}
          <div className="p-5 border-b border-gold/20 flex items-center justify-between shrink-0 bg-black/20">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Subh Lagan Sarees"
                className="h-11 w-auto object-contain drop-shadow"
              />
              <div>
                <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-700 to-amber-900 border border-amber-400/40 text-[9px] font-black uppercase tracking-wider text-amber-200">
                  Staff Admin
                </span>
                <p className="text-[11px] tracking-widest text-gold uppercase font-black mt-1">
                  Admin Portal
                </p>
              </div>
            </div>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden p-1.5 text-cream/70 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="p-4 flex-1 overflow-y-auto space-y-6 custom-scrollbar">
            <div>
              <p className="px-3 text-[10px] uppercase tracking-widest text-gold/70 font-bold mb-2">
                Administration
              </p>
              <nav className="space-y-1.5">
                {/* 1. Overview */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('overview');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold tracking-wide transition-all ${
                    activeTab === 'overview'
                      ? 'bg-gradient-to-r from-gold via-amber-500 to-gold-dark text-stone-950 font-black shadow-lg shadow-gold/25 translate-x-1'
                      : 'text-cream/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-4 h-4" />
                    <span>Overview</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </button>

                {/* 2. Manage Client */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('manage-client');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold tracking-wide transition-all ${
                    activeTab === 'manage-client'
                      ? 'bg-gradient-to-r from-gold via-amber-500 to-gold-dark text-stone-950 font-black shadow-lg shadow-gold/25 translate-x-1'
                      : 'text-cream/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Building2 className="w-4 h-4" />
                    <span>Manage Client</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 font-bold">
                    {clients.length}
                  </span>
                </button>

                {/* 3. Profile */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('profile');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold tracking-wide transition-all ${
                    activeTab === 'profile'
                      ? 'bg-gradient-to-r from-gold via-amber-500 to-gold-dark text-stone-950 font-black shadow-lg shadow-gold/25 translate-x-1'
                      : 'text-cream/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <UserCheck className="w-4 h-4" />
                    <span>Profile</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </button>
              </nav>
            </div>
          </div>
        </div>

        {/* User Card & Logout */}
        <div className="p-3 border-t border-gold/20 shrink-0 bg-black/40">
          <div className="flex items-center justify-between px-2 py-1">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 to-gold border border-gold/60 flex items-center justify-center text-xs font-black text-stone-950 shrink-0 shadow-md">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-black text-cream truncate">
                  {user?.name || 'Staff Admin'}
                </p>
                <p className="text-[10px] text-gold font-medium">Store Administrator</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 text-cream/70 hover:text-red-400 hover:bg-white/10 rounded-xl transition"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* MAIN VIEW AREA                                            */}
      {/* ========================================================= */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Mobile Bar */}
        <header className="lg:hidden bg-[#18040A] text-white p-3.5 flex items-center justify-between border-b border-gold/20 shadow-md sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 text-white hover:text-gold focus:outline-none"
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="font-serif text-sm font-black text-gold">
              Admin Portal
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('profile')}
              className="px-2.5 py-1 rounded-full bg-amber-500/20 text-[10px] font-bold text-amber-200 border border-amber-400/40"
            >
              Profile
            </button>
          </div>
        </header>

        {/* Content Body Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* ===================================================== */}
          {/* TAB 1: OVERVIEW                                       */}
          {/* ===================================================== */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              {/* Grand Admin Welcome Card */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#20050E] via-[#350A19] to-[#1A030A] border border-gold/35 p-6 sm:p-8 shadow-xl text-white">
                <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/15 border border-gold/30 text-gold text-[10px] font-black uppercase tracking-widest">
                      <Sparkles className="w-3.5 h-3.5 text-gold" />
                      <span>Subh Lagan Store Governance</span>
                    </div>
                    <h1 className="font-serif text-2xl sm:text-4xl font-black text-white tracking-tight">
                      Welcome, {user?.name || 'Administrator'}
                    </h1>
                    <p className="text-xs sm:text-sm text-cream/80 max-w-xl font-medium leading-relaxed">
                      Overseeing boutique storefronts, TryoAI virtual fitting rooms, and saree collections for Subh Lagan Sarees.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      onClick={() => {
                        fetchStats();
                        fetchClients();
                        toast.success('Admin stats refreshed');
                      }}
                      className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-white/10 hover:bg-white/15 text-white text-xs font-bold rounded-xl border border-white/20 backdrop-blur-sm shadow-sm transition active:scale-95 cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${loadingStats ? 'animate-spin' : ''}`} />
                      <span>Sync Data</span>
                    </button>

                    <button
                      onClick={handleOpenAddClient}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-gold via-amber-500 to-gold-dark hover:brightness-105 text-stone-950 text-xs font-black uppercase tracking-wider rounded-xl shadow-lg shadow-amber-900/20 transition active:scale-95 cursor-pointer"
                    >
                      <UserPlus className="w-4 h-4 text-stone-950" />
                      <span>+ Register Client</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 3 Master Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* 1. Managed Clients */}
                <div
                  onClick={() => setActiveTab('manage-client')}
                  className="bg-white p-5 rounded-2xl border border-stone-200/90 hover:border-amber-300 shadow-sm hover:shadow-luxury transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-black uppercase tracking-wider text-stone-500">
                      Managed Boutiques
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200 group-hover:scale-110 transition-transform">
                      <Building2 className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-3xl font-serif font-black text-stone-900">
                    {stats?.assignedClientsCount || clients.length || 0}
                  </div>
                  <div className="flex items-center justify-between text-xs text-stone-500 mt-2 font-medium">
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      {activeClientsCount} active stores
                    </span>
                    <span className="text-amber-700 font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      Manage <ArrowUpRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>

                {/* 2. Client Orders */}
                <div className="bg-white p-5 rounded-2xl border border-stone-200/90 hover:border-emerald-300 shadow-sm hover:shadow-luxury transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-black uppercase tracking-wider text-stone-500">
                      Client Store Orders
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-3xl font-serif font-black text-emerald-800">
                    {stats?.totalOrders || 0}
                  </div>
                  <div className="text-xs text-stone-500 mt-2 font-medium flex items-center justify-between">
                    <span>Active client orders</span>
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full text-[10px] border border-emerald-200">
                      COD Verified
                    </span>
                  </div>
                </div>

                {/* 3. Total Sarees */}
                <div className="bg-white p-5 rounded-2xl border border-stone-200/90 hover:border-rose-300 shadow-sm hover:shadow-luxury transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-black uppercase tracking-wider text-stone-500">
                      Saree Inventory
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center border border-rose-200">
                      <Package className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-3xl font-serif font-black text-stone-900">
                    {stats?.totalProducts || 0}
                  </div>
                  <div className="text-xs text-stone-500 mt-2 font-medium flex items-center justify-between">
                    <span>Handloom & bridal catalog</span>
                    <span className="text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded-full text-[10px] border border-rose-200">
                      Live Catalog
                    </span>
                  </div>
                </div>
              </div>

              {/* TryoAI Virtual Fitting Telemetry Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-stone-900 to-stone-950 text-white border border-gold/25 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-gold/20 border border-gold/40 flex items-center justify-center text-gold shrink-0">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-sm font-black text-cream flex items-center gap-2">
                      TryoAI Virtual Fitting Engine
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[9px] uppercase font-bold">
                        Online
                      </span>
                    </h3>
                    <p className="text-xs text-stone-300 mt-0.5">
                      Client stores are allocated real-time 3D AI fitting credits. Monitor credit balances below.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <p className="text-[10px] text-stone-400 uppercase font-bold">Total In Use</p>
                    <p className="text-lg font-black text-gold">{totalCirculatingCredits} Credits</p>
                  </div>
                </div>
              </div>

              {/* Boutique Clients Showcase Grid */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/90 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center">
                      <Store className="w-4 h-4" />
                    </div>
                    <h2 className="font-serif text-base font-black text-stone-900">
                      Managed Boutique Storefronts
                    </h2>
                  </div>
                  <button
                    onClick={() => setActiveTab('manage-client')}
                    className="text-xs text-amber-700 font-bold hover:underline inline-flex items-center gap-1"
                  >
                    View All ({clients.length}) <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {clients.map((cl) => (
                    <div
                      key={cl._id}
                      className="p-4 rounded-xl bg-stone-50/70 hover:bg-amber-50/40 transition border border-stone-200/80 flex flex-col justify-between space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-sm font-black text-amber-900 shrink-0">
                            {cl.storeName ? cl.storeName.charAt(0).toUpperCase() : 'B'}
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-xs font-bold text-stone-900 truncate">
                              {cl.storeName || cl.name}
                            </p>
                            <p className="text-[11px] text-stone-500 truncate">
                              Owner: {cl.name}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 border ${
                            cl.accountStatus === 'active'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : 'bg-rose-50 text-rose-800 border-rose-300'
                          }`}
                        >
                          {cl.accountStatus}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-stone-200/60 text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-stone-800">
                          <Coins className="w-3.5 h-3.5 text-amber-500" />
                          <span>{cl.credits || 100} Credits</span>
                        </div>

                        <button
                          onClick={() => handleOpenEditClient(cl)}
                          className="px-2.5 py-1 rounded-lg bg-white hover:bg-stone-100 text-stone-700 text-xs font-bold border border-stone-200 transition"
                        >
                          Configure
                        </button>
                      </div>
                    </div>
                  ))}

                  {clients.length === 0 && (
                    <div className="col-span-full py-12 text-center text-stone-500 text-xs">
                      <Store className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                      <p className="font-bold text-stone-700">No boutique clients assigned to you yet.</p>
                      <p className="text-[11px] text-stone-400 mt-1">Click "+ Register Client" to create a new boutique store.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ===================================================== */}
          {/* TAB 2: MANAGE CLIENT                                 */}
          {/* ===================================================== */}
          {activeTab === 'manage-client' && (
            <div className="space-y-6 animate-fade-in">
              {/* Header & Metrics Strip */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h1 className="font-serif text-2xl sm:text-3xl font-black text-stone-950">
                      Manage Boutique Clients
                    </h1>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-black border border-amber-300">
                      {clients.length} Total
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 font-medium mt-1">
                    Register, configure, and manage boutique client store accounts and TryoAI fitting room credits
                  </p>
                </div>

                <button
                  onClick={handleOpenAddClient}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-gold via-amber-500 to-gold-dark hover:brightness-105 text-stone-950 text-xs font-black uppercase tracking-wider rounded-xl shadow-lg shadow-amber-900/20 transition active:scale-95 cursor-pointer shrink-0"
                >
                  <Building2 className="w-4 h-4 text-stone-950" />
                  <span>+ Register Client</span>
                </button>
              </div>

              {/* Status Chips Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-white border border-stone-200 shadow-xs flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase text-stone-400">Total Managed</p>
                    <p className="text-xl font-black text-stone-900 mt-0.5">{clients.length}</p>
                  </div>
                  <Store className="w-5 h-5 text-amber-600" />
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-stone-200 shadow-xs flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase text-stone-400">Active Boutiques</p>
                    <p className="text-xl font-black text-emerald-700 mt-0.5">{activeClientsCount}</p>
                  </div>
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-stone-200 shadow-xs flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase text-stone-400">TryoAI Credits Active</p>
                    <p className="text-xl font-black text-gold-dark mt-0.5">{totalCirculatingCredits}</p>
                  </div>
                  <Coins className="w-5 h-5 text-amber-500" />
                </div>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
                <div className="relative w-full sm:w-96">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    value={clientSearch}
                    onChange={(e) => setClientSearch(e.target.value)}
                    placeholder="Search by store name, owner, email..."
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 bg-stone-50/50"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Filter className="w-3.5 h-3.5 text-stone-400" />
                  <select
                    value={clientStatusFilter}
                    onChange={(e) => setClientStatusFilter(e.target.value)}
                    className="text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white font-medium focus:outline-none"
                  >
                    <option value="all">All Status ({clients.length})</option>
                    <option value="active">Active Only ({activeClientsCount})</option>
                    <option value="suspended">Suspended Only ({suspendedClientsCount})</option>
                  </select>
                </div>
              </div>

              {/* Clients Table */}
              <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#18040A] text-cream font-black uppercase tracking-wider text-[10px] border-b border-gold/30">
                      <tr>
                        <th className="py-4 px-4">Boutique Store</th>
                        <th className="py-4 px-4">Owner Contact</th>
                        <th className="py-4 px-4">TryoAI Credits</th>
                        <th className="py-4 px-4">Status</th>
                        <th className="py-4 px-4">Joined Date</th>
                        <th className="py-4 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {clients.map((cl) => (
                        <tr key={cl._id} className="hover:bg-amber-50/30 transition">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
                                <Store className="w-5 h-5 text-amber-800" />
                              </div>
                              <div>
                                <p className="font-bold text-stone-900 text-xs">
                                  {cl.storeName || 'Subh Lagan Boutique Store'}
                                </p>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className="text-[10px] text-amber-800 font-bold uppercase tracking-wider font-mono">
                                    /store/{getStoreSlug(cl.storeName)}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleCopyStoreLink(cl.storeName)}
                                    className="p-0.5 hover:text-amber-800 text-stone-400 transition cursor-pointer"
                                    title="Copy Store URL"
                                  >
                                    <Copy className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <p className="font-bold text-stone-900">{cl.name}</p>
                            <p className="text-[11px] text-stone-500">{cl.email}</p>
                            <p className="text-[10px] text-stone-400">{cl.phone || 'No phone'}</p>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5 font-bold text-stone-900">
                                <Coins className="w-3.5 h-3.5 text-amber-500" />
                                <span>{cl.credits || 100} Credits</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleQuickAddCredits(cl._id, 25, cl.credits)}
                                  className="px-1.5 py-0.5 rounded bg-stone-100 hover:bg-gold/20 text-[9px] font-bold text-stone-700 border border-stone-200 transition"
                                  title="Add 25 credits"
                                >
                                  +25
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleQuickAddCredits(cl._id, 50, cl.credits)}
                                  className="px-1.5 py-0.5 rounded bg-stone-100 hover:bg-gold/20 text-[9px] font-bold text-stone-700 border border-stone-200 transition"
                                  title="Add 50 credits"
                                >
                                  +50
                                </button>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <button
                              onClick={() => handleToggleStatus(cl._id)}
                              className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border cursor-pointer transition flex items-center gap-1.5 ${
                                cl.accountStatus === 'active'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                                  : 'bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-100'
                              }`}
                              title="Click to toggle status"
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  cl.accountStatus === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                                }`}
                              />
                              {cl.accountStatus}
                            </button>
                          </td>
                          <td className="py-3.5 px-4 text-stone-500 font-medium">
                            {new Date(cl.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </td>
                          <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                            <a
                              href={`/store/${getStoreSlug(cl.storeName)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-[10px] font-bold border border-amber-300 transition"
                              title="Open Live Boutique Store"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>Live Store</span>
                            </a>
                            <button
                              onClick={() => handleOpenEditClient(cl)}
                              className="p-2 rounded-xl text-stone-600 hover:text-amber-700 hover:bg-amber-50 transition"
                              title="Edit Client"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteClient(cl._id, cl.name)}
                              className="p-2 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition"
                              title="Delete Client"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {clients.length === 0 && (
                        <tr>
                          <td colSpan="6" className="py-12 text-center text-stone-500 text-xs">
                            <Store className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                            <p className="font-bold text-stone-700">No clients found matching your search.</p>
                            <p className="text-[11px] text-stone-400 mt-1">Click "+ Register Client" to add a new boutique account.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================== */}
          {/* TAB 3: PROFILE                                       */}
          {/* ===================================================== */}
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
              <div className="pb-4 border-b border-stone-200">
                <h1 className="font-serif text-2xl sm:text-3xl font-black text-stone-950">
                  Admin Profile & Settings
                </h1>
                <p className="text-xs text-stone-500 font-medium mt-1">
                  Manage your administrative credentials, security settings, and store supervision rights
                </p>
              </div>

              {/* VIP Admin Credential Card */}
              <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#20050E] via-[#350A19] to-[#1A030A] text-white border border-gold/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-600 to-gold border-2 border-gold flex items-center justify-center text-3xl font-black text-stone-950 shadow-xl shrink-0">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl sm:text-2xl font-black text-white font-serif tracking-wide">
                        {user?.name || 'Store Administrator'}
                      </h2>
                      <span className="px-2.5 py-0.5 rounded-full bg-gold/20 text-gold border border-gold/50 text-[10px] font-black uppercase tracking-wider">
                        Staff Admin
                      </span>
                    </div>
                    <p className="text-xs text-gold/90">{user?.email}</p>
                    <p className="text-[11px] text-stone-300">
                      Clearance: <span className="font-bold text-amber-400">STAFF LEVEL 2</span> • Boutique Store Supervisor
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-400/30 text-[11px] font-bold text-amber-200">
                    <Shield className="w-3.5 h-3.5 text-gold" />
                    Store Administrator
                  </span>
                </div>
              </div>

              {/* Two Column Layout for Profile Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: Edit Personal Credentials */}
                <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
                    <UserCheck className="w-4 h-4 text-primary" />
                    <h3 className="font-serif text-sm font-black text-stone-900 uppercase tracking-wide">
                      Personal Information
                    </h3>
                  </div>

                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        required
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-primary/20 bg-stone-50/50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        placeholder="+91 81475 40362"
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-primary/20 bg-stone-50/50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Email Address (Admin Login ID)
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        disabled
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 bg-stone-100 text-stone-500 font-medium cursor-not-allowed"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={updatingProfile}
                      className="w-full py-2.5 bg-primary hover:bg-primary/90 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md transition disabled:opacity-50 cursor-pointer"
                    >
                      {updatingProfile ? 'Saving...' : 'Update Details'}
                    </button>
                  </form>
                </div>

                {/* Right: Security & Password */}
                <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
                    <Key className="w-4 h-4 text-gold-dark" />
                    <h3 className="font-serif text-sm font-black text-stone-900 uppercase tracking-wide">
                      Security & Password
                    </h3>
                  </div>

                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        required
                        placeholder="••••••••"
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-primary/20 bg-stone-50/50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showProfilePassword ? 'text' : 'password'}
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          required
                          minLength={6}
                          placeholder="Min 6 characters"
                          className="w-full pl-3.5 pr-10 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-primary/20 bg-stone-50/50"
                        />
                        <button
                          type="button"
                          onClick={() => setShowProfilePassword(!showProfilePassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                        >
                          {showProfilePassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type={showProfilePassword ? 'text' : 'password'}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        required
                        minLength={6}
                        placeholder="Re-enter new password"
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-primary/20 bg-stone-50/50"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={updatingPassword}
                      className="w-full py-2.5 bg-gradient-to-r from-gold via-amber-500 to-gold-dark hover:brightness-105 text-stone-950 text-xs font-black uppercase tracking-wider rounded-xl shadow-md transition disabled:opacity-50 cursor-pointer"
                    >
                      {updatingPassword ? 'Changing Password...' : 'Change Password'}
                    </button>
                  </form>
                </div>
              </div>

              {/* Administrative Responsibilities Matrix */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
                  <Award className="w-4 h-4 text-gold" />
                  <h3 className="font-serif text-sm font-black text-stone-900 uppercase tracking-wide">
                    Admin Responsibilities & Scope
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/80 flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-amber-950">Client Store Onboarding</p>
                      <p className="text-[11px] text-amber-800">Register and configure boutique client credentials</p>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/80 flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-emerald-950">TryoAI Credit Allocation</p>
                      <p className="text-[11px] text-emerald-800">Assign fitting room trial credits to stores</p>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-200/80 flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-purple-950">Catalog & Weaves Oversight</p>
                      <p className="text-[11px] text-purple-800">Review sarees, bridal wear, and live collections</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ========================================================= */}
      {/* MODAL: ADD / EDIT CLIENT                                  */}
      {/* ========================================================= */}
      {clientModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gold/30 relative">
            <button
              onClick={() => setClientModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 pb-4 border-b border-stone-100 mb-4">
              <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center border border-amber-300 shadow-xs">
                <Store className="w-5 h-5 text-amber-800" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-black text-stone-950">
                  {editingClient ? 'Edit Boutique Client' : 'Register New Boutique Client'}
                </h3>
                <p className="text-[11px] text-stone-500">
                  Store owners who manage sarees, trials, and live orders
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveClient} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Boutique / Store Name *
                </label>
                <input
                  type="text"
                  value={clientFormData.storeName}
                  onChange={(e) => setClientFormData({ ...clientFormData, storeName: e.target.value })}
                  required
                  placeholder="e.g. Arun Vastralay or Veeraj Brand Seller"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 bg-stone-50/50"
                />
                {clientFormData.storeName && (
                  <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-amber-900 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                    <Globe className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span className="font-semibold truncate">
                      Store Link: /store/{getStoreSlug(clientFormData.storeName)}
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Owner Full Name *
                  </label>
                  <input
                    type="text"
                    value={clientFormData.name}
                    onChange={(e) => setClientFormData({ ...clientFormData, name: e.target.value })}
                    required
                    placeholder="e.g. Priya Yadav"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 bg-stone-50/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={clientFormData.phone}
                    onChange={(e) => setClientFormData({ ...clientFormData, phone: e.target.value })}
                    placeholder="+91 81475 40362"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 bg-stone-50/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Email Address (Login) *
                  </label>
                  <input
                    type="email"
                    value={clientFormData.email}
                    onChange={(e) => setClientFormData({ ...clientFormData, email: e.target.value })}
                    required
                    placeholder="client@subhlagan.com"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 bg-stone-50/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {editingClient ? 'Password (optional)' : 'Password *'}
                  </label>
                  <div className="relative">
                    <input
                      type={showClientPassword ? 'text' : 'password'}
                      value={clientFormData.password}
                      onChange={(e) => setClientFormData({ ...clientFormData, password: e.target.value })}
                      required={!editingClient}
                      minLength={6}
                      placeholder={editingClient ? 'Leave blank to keep' : '••••••••'}
                      className="w-full pl-3.5 pr-10 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 bg-stone-50/50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowClientPassword(!showClientPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                    >
                      {showClientPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    TryoAI Fitting Credits
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={clientFormData.credits}
                    onChange={(e) => setClientFormData({ ...clientFormData, credits: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 bg-stone-50/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Account Status
                  </label>
                  <select
                    value={clientFormData.accountStatus}
                    onChange={(e) => setClientFormData({ ...clientFormData, accountStatus: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 bg-white font-medium focus:outline-none"
                  >
                    <option value="active">Active (Store Open & Operational)</option>
                    <option value="suspended">Suspended (Store Inactive)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setClientModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-stone-600 hover:bg-stone-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingClient}
                  className="px-5 py-2.5 bg-gradient-to-r from-gold via-amber-500 to-gold-dark hover:brightness-105 text-stone-950 text-xs font-black uppercase tracking-wider rounded-xl shadow-md transition disabled:opacity-50 cursor-pointer"
                >
                  {savingClient ? 'Saving...' : editingClient ? 'Update Client' : 'Register Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPortalDashboard;
