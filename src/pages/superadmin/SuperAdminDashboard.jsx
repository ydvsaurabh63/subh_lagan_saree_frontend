import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { managementApi, userApi } from '../../services/api.js';
import toast from 'react-hot-toast';
import {
  ShieldAlert,
  Users,
  Building2,
  UserCheck,
  TrendingUp,
  Package,
  Layers,
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
  Shield,
  Key,
  Database,
  Server,
  RefreshCw,
  Coins,
  ChevronRight,
  UserPlus,
} from 'lucide-react';

const SuperAdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Active Tab: overview | manage-admin | manage-client | profile
  const activeTab = searchParams.get('tab') || 'overview';
  const setActiveTab = (tab) => {
    setSearchParams({ tab });
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ==========================================
  // SHARED STATE & LOADERS
  // ==========================================
  const [loadingStats, setLoadingStats] = useState(false);
  const [stats, setStats] = useState(null);

  const [loadingAdmins, setLoadingAdmins] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [adminSearch, setAdminSearch] = useState('');
  const [adminStatusFilter, setAdminStatusFilter] = useState('all');

  const [loadingClients, setLoadingClients] = useState(false);
  const [clients, setClients] = useState([]);
  const [clientSearch, setClientSearch] = useState('');
  const [clientStatusFilter, setClientStatusFilter] = useState('all');
  const [clientAdminFilter, setClientAdminFilter] = useState('all');

  // Modal States
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [adminFormData, setAdminFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    accountStatus: 'active',
    notes: '',
  });
  const [savingAdmin, setSavingAdmin] = useState(false);

  const [clientModalOpen, setClientModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [clientFormData, setClientFormData] = useState({
    name: '',
    storeName: '',
    email: '',
    phone: '',
    password: '',
    credits: 100,
    assignedAdmin: '',
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
      const res = await managementApi.getSuperAdminStats();
      if (res.success) {
        setStats(res.stats);
      }
    } catch (err) {
      toast.error('Failed to load system stats');
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchAdmins = async () => {
    try {
      setLoadingAdmins(true);
      const res = await managementApi.getAdmins({
        search: adminSearch,
        status: adminStatusFilter,
      });
      if (res.success) {
        setAdmins(res.admins || []);
      }
    } catch (err) {
      toast.error('Failed to load admins');
    } finally {
      setLoadingAdmins(false);
    }
  };

  const fetchClients = async () => {
    try {
      setLoadingClients(true);
      const res = await managementApi.getClients({
        search: clientSearch,
        status: clientStatusFilter,
        assignedAdmin: clientAdminFilter,
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
    fetchAdmins();
    fetchClients();
  }, []);

  useEffect(() => {
    if (activeTab === 'manage-admin') {
      fetchAdmins();
    } else if (activeTab === 'manage-client') {
      fetchClients();
    } else if (activeTab === 'overview') {
      fetchStats();
    }
  }, [activeTab, adminSearch, adminStatusFilter, clientSearch, clientStatusFilter, clientAdminFilter]);

  // ==========================================
  // ADMIN CRUD HANDLERS
  // ==========================================
  const handleOpenAddAdmin = () => {
    setEditingAdmin(null);
    setAdminFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      accountStatus: 'active',
      notes: '',
    });
    setAdminModalOpen(true);
  };

  const handleOpenEditAdmin = (admin) => {
    setEditingAdmin(admin);
    setAdminFormData({
      name: admin.name || '',
      email: admin.email || '',
      phone: admin.phone || '',
      password: '',
      accountStatus: admin.accountStatus || 'active',
      notes: admin.notes || '',
    });
    setAdminModalOpen(true);
  };

  const handleSaveAdmin = async (e) => {
    e.preventDefault();
    try {
      setSavingAdmin(true);
      if (editingAdmin) {
        const res = await managementApi.updateAdmin(editingAdmin._id, adminFormData);
        if (res.success) {
          toast.success('Admin updated successfully');
          setAdminModalOpen(false);
          fetchAdmins();
          fetchStats();
        }
      } else {
        const res = await managementApi.createAdmin(adminFormData);
        if (res.success) {
          toast.success('New Admin created successfully');
          setAdminModalOpen(false);
          fetchAdmins();
          fetchStats();
        }
      }
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setSavingAdmin(false);
    }
  };

  const handleDeleteAdmin = async (id, name) => {
    if (!window.confirm(`Are you sure you want to permanently delete Admin "${name}"?`)) {
      return;
    }
    try {
      const res = await managementApi.deleteAdmin(id);
      if (res.success) {
        toast.success(`Admin "${name}" deleted`);
        fetchAdmins();
        fetchStats();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete admin');
    }
  };

  const handleToggleUserStatus = async (id, currentStatus, type = 'user') => {
    try {
      const res = await managementApi.toggleUserStatus(id);
      if (res.success) {
        toast.success(`Account status changed to ${res.accountStatus}`);
        if (type === 'admin') {
          fetchAdmins();
        } else {
          fetchClients();
        }
        fetchStats();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to change status');
    }
  };

  // ==========================================
  // CLIENT CRUD HANDLERS
  // ==========================================
  const handleOpenAddClient = () => {
    setEditingClient(null);
    setClientFormData({
      name: '',
      storeName: '',
      email: '',
      phone: '',
      password: '',
      credits: 100,
      assignedAdmin: admins[0]?._id || '',
      accountStatus: 'active',
      notes: '',
    });
    setClientModalOpen(true);
  };

  const handleOpenEditClient = (client) => {
    setEditingClient(client);
    setClientFormData({
      name: client.name || '',
      storeName: client.storeName || '',
      email: client.email || '',
      phone: client.phone || '',
      password: '',
      credits: client.credits || 100,
      assignedAdmin: client.assignedAdmin?._id || client.assignedAdmin || '',
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
          toast.success('Client updated successfully');
          setClientModalOpen(false);
          fetchClients();
          fetchStats();
        }
      } else {
        const res = await managementApi.createClient(clientFormData);
        if (res.success) {
          toast.success('Client registered successfully');
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

  const handleDeleteClient = async (id, name) => {
    if (!window.confirm(`Are you sure you want to permanently delete Client "${name}"?`)) {
      return;
    }
    try {
      const res = await managementApi.deleteClient(id);
      if (res.success) {
        toast.success(`Client "${name}" removed`);
        fetchClients();
        fetchStats();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete client');
    }
  };

  // ==========================================
  // PROFILE UPDATE HANDLERS
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
        toast.success('Superadmin profile updated');
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
      toast.error('New passwords do not match');
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
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      toast.error(err.message || 'Password update failed');
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col lg:flex-row select-none">
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* ========================================================= */}
      {/* SIDEBAR: SUPERADMIN PORTAL                                */}
      {/* ========================================================= */}
      <aside
        className={`fixed lg:sticky top-0 h-screen w-72 bg-gradient-to-b from-[#1E060D] via-[#2A0913] to-[#150409] text-cream z-50 flex flex-col justify-between transition-transform duration-300 shadow-2xl border-r border-gold/20 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Header Brand */}
          <div className="p-5 border-b border-gold/20 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Subh Lagan Sarees"
                className="h-12 w-auto object-contain drop-shadow"
              />
              <div>
                <span className="px-1.5 py-0.5 rounded bg-purple-900/60 border border-purple-400/40 text-[9px] font-black uppercase tracking-wider text-purple-200">
                  Superadmin
                </span>
                <p className="text-[11px] tracking-widest text-gold uppercase font-bold mt-0.5">
                  Master Portal
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

          {/* Navigation 4 Tabs */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <div>
              <p className="px-3 text-[10px] uppercase tracking-widest text-gold/80 font-bold mb-2">
                Main Console
              </p>
              <nav className="space-y-1.5">
                {/* 1. Overview */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('overview');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all ${
                    activeTab === 'overview'
                      ? 'bg-gradient-to-r from-gold to-amber-600 text-primary font-black shadow-lg shadow-gold/20 translate-x-1'
                      : 'text-cream/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-4 h-4" />
                    <span>Overview</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </button>

                {/* 2. Manage Admin */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('manage-admin');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all ${
                    activeTab === 'manage-admin'
                      ? 'bg-gradient-to-r from-gold to-amber-600 text-primary font-black shadow-lg shadow-gold/20 translate-x-1'
                      : 'text-cream/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4" />
                    <span>Manage Admin</span>
                  </div>
                  {stats?.totalAdmins !== undefined && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 font-bold">
                      {stats.totalAdmins}
                    </span>
                  )}
                </button>

                {/* 3. Manage Client */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('manage-client');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all ${
                    activeTab === 'manage-client'
                      ? 'bg-gradient-to-r from-gold to-amber-600 text-primary font-black shadow-lg shadow-gold/20 translate-x-1'
                      : 'text-cream/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Building2 className="w-4 h-4" />
                    <span>Manage Client</span>
                  </div>
                  {stats?.totalClients !== undefined && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 font-bold">
                      {stats.totalClients}
                    </span>
                  )}
                </button>

                {/* 4. Profile */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('profile');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all ${
                    activeTab === 'profile'
                      ? 'bg-gradient-to-r from-gold to-amber-600 text-primary font-black shadow-lg shadow-gold/20 translate-x-1'
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

            {/* Quick Switch Links */}
            <div className="pt-4 border-t border-gold/15 space-y-2">
              <p className="px-3 text-[10px] uppercase tracking-widest text-gold/70 font-bold mb-1">
                Portals & Links
              </p>
              <Link
                to="/admin-portal"
                className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-cream/75 hover:text-gold hover:bg-white/5 transition"
              >
                <span className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-gold" />
                  Admin Dashboard
                </span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </Link>
              <Link
                to="/admin"
                className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-cream/75 hover:text-gold hover:bg-white/5 transition"
              >
                <span className="flex items-center gap-2">
                  <Store className="w-3.5 h-3.5 text-gold" />
                  Client Store Panel
                </span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </Link>
              <Link
                to="/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-cream/75 hover:text-gold hover:bg-white/5 transition"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-gold" />
                  Live Website
                </span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </Link>
            </div>
          </div>
        </div>

        {/* User Card & Logout */}
        <div className="p-3 border-t border-gold/20 shrink-0 bg-black/25">
          <div className="flex items-center justify-between px-2 py-1">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-800 to-amber-500 border border-gold/60 flex items-center justify-center text-xs font-black text-white shrink-0 shadow-md">
                S
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-black text-cream truncate">
                  {user?.name || 'Chief SuperAdmin'}
                </p>
                <p className="text-[10px] text-gold/80 font-medium">superadmin</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 text-cream/70 hover:text-red-400 hover:bg-white/10 rounded-lg transition"
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
        <header className="lg:hidden bg-[#1E060D] text-white p-3 flex items-center justify-between border-b border-gold/20 shadow-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 text-white hover:text-gold focus:outline-none"
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="font-serif text-sm font-black text-gold">
              SuperAdmin Master
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('profile')}
              className="px-2.5 py-1 rounded bg-purple-900/60 text-[10px] font-bold text-purple-200 border border-purple-400/30"
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
              {/* Header Title & Refresh */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="font-serif text-2xl sm:text-3xl font-black text-stone-950">
                      System Overview
                    </h1>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black border border-emerald-300">
                      LIVE
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 font-medium mt-1">
                    Master platform metrics for Subh Lagan Sarees
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      fetchStats();
                      fetchAdmins();
                      fetchClients();
                      toast.success('Stats refreshed');
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold rounded-xl border border-stone-200 shadow-xs transition"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingStats ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                  </button>

                  <button
                    onClick={handleOpenAddAdmin}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-primary hover:bg-primary/90 text-white text-xs font-bold rounded-xl shadow-md transition active:scale-95"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-gold" />
                    <span>+ Add Admin</span>
                  </button>

                  <button
                    onClick={handleOpenAddClient}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-700 text-white text-xs font-bold rounded-xl shadow-md transition active:scale-95"
                  >
                    <Building2 className="w-3.5 h-3.5 text-white" />
                    <span>+ Add Client</span>
                  </button>
                </div>
              </div>

              {/* 4 Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Admins */}
                <div
                  onClick={() => setActiveTab('manage-admin')}
                  className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-sm hover:shadow-md transition cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black uppercase tracking-wider text-stone-500">
                      Total Admins
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-200 group-hover:scale-110 transition-transform">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-3xl font-serif font-black text-stone-900">
                    {stats?.totalAdmins || admins.length || 0}
                  </div>
                  <div className="flex items-center justify-between text-xs text-stone-500 mt-2 font-medium">
                    <span className="text-emerald-700 font-bold">
                      {stats?.activeAdmins || 0} active
                    </span>
                    <span className="text-purple-700 font-bold group-hover:translate-x-1 transition-transform">
                      Manage →
                    </span>
                  </div>
                </div>

                {/* 2. Clients */}
                <div
                  onClick={() => setActiveTab('manage-client')}
                  className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-sm hover:shadow-md transition cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black uppercase tracking-wider text-stone-500">
                      Total Clients
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200 group-hover:scale-110 transition-transform">
                      <Building2 className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-3xl font-serif font-black text-stone-900">
                    {stats?.totalClients || clients.length || 0}
                  </div>
                  <div className="flex items-center justify-between text-xs text-stone-500 mt-2 font-medium">
                    <span className="text-emerald-700 font-bold">
                      {stats?.activeClients || 0} active stores
                    </span>
                    <span className="text-amber-700 font-bold group-hover:translate-x-1 transition-transform">
                      Manage →
                    </span>
                  </div>
                </div>

                {/* 3. System Revenue */}
                <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black uppercase tracking-wider text-stone-500">
                      Total Sales (COD)
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-3xl font-serif font-black text-emerald-800">
                    {formatPrice(stats?.totalRevenue || 0)}
                  </div>
                  <div className="text-xs text-stone-500 mt-2 font-medium">
                    Across {stats?.totalOrders || 0} total client orders
                  </div>
                </div>

                {/* 4. Total Catalog */}
                <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black uppercase tracking-wider text-stone-500">
                      Catalog Sarees
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center border border-rose-200">
                      <Package className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-3xl font-serif font-black text-stone-900">
                    {stats?.totalProducts || 0}
                  </div>
                  <div className="text-xs text-stone-500 mt-2 font-medium">
                    Handloom & Bridal Weaves active
                  </div>
                </div>
              </div>

              {/* System Health Status Bar */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#20060E] to-[#3B0E1B] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md border border-gold/30">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gold/20 flex items-center justify-center border border-gold/40 text-gold">
                    <Database className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-cream">
                      Subh Lagan Core Infrastructure Active
                    </p>
                    <p className="text-[11px] text-stone-300">
                      MongoDB Atlas Connected • Cloudinary Storage Synced • Vercel Edge Fast
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                    All Microservices Operational
                  </span>
                </div>
              </div>

              {/* Two Column Grid: Recent Admins & Recent Clients */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: Recent Admins */}
                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-primary" />
                      <h2 className="font-serif text-base font-bold text-stone-900">
                        Platform Admins
                      </h2>
                    </div>
                    <button
                      onClick={() => setActiveTab('manage-admin')}
                      className="text-xs text-primary font-bold hover:underline"
                    >
                      View All ({admins.length})
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {admins.slice(0, 4).map((adm) => (
                      <div
                        key={adm._id}
                        className="flex items-center justify-between p-3 rounded-xl bg-stone-50 hover:bg-stone-100 transition border border-stone-200/70"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="w-8 h-8 rounded-full bg-purple-100 border border-purple-300 flex items-center justify-center text-xs font-bold text-purple-900 shrink-0">
                            {adm.name?.charAt(0).toUpperCase()}
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-xs font-bold text-stone-900 truncate">
                              {adm.name}
                            </p>
                            <p className="text-[11px] text-stone-500 truncate">
                              {adm.email}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              adm.accountStatus === 'active'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {adm.accountStatus}
                          </span>
                          <button
                            onClick={() => handleOpenEditAdmin(adm)}
                            className="p-1 hover:text-primary transition"
                            title="Edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {admins.length === 0 && (
                      <p className="text-xs text-stone-500 text-center py-4">
                        No admins registered yet.
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Recent Clients */}
                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-amber-600" />
                      <h2 className="font-serif text-base font-bold text-stone-900">
                        Client Boutique Stores
                      </h2>
                    </div>
                    <button
                      onClick={() => setActiveTab('manage-client')}
                      className="text-xs text-amber-700 font-bold hover:underline"
                    >
                      View All ({clients.length})
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {clients.slice(0, 4).map((cl) => (
                      <div
                        key={cl._id}
                        className="flex items-center justify-between p-3 rounded-xl bg-stone-50 hover:bg-stone-100 transition border border-stone-200/70"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="w-8 h-8 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-xs font-bold text-amber-900 shrink-0">
                            {cl.storeName ? cl.storeName.charAt(0).toUpperCase() : 'C'}
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-xs font-bold text-stone-900 truncate">
                              {cl.storeName || cl.name}
                            </p>
                            <p className="text-[11px] text-stone-500 truncate">
                              Owner: {cl.name} • {cl.email}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              cl.accountStatus === 'active'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {cl.accountStatus}
                          </span>
                          <button
                            onClick={() => handleOpenEditClient(cl)}
                            className="p-1 hover:text-amber-700 transition"
                            title="Edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {clients.length === 0 && (
                      <p className="text-xs text-stone-500 text-center py-4">
                        No clients registered yet.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================== */}
          {/* TAB 2: MANAGE ADMIN                                  */}
          {/* ===================================================== */}
          {activeTab === 'manage-admin' && (
            <div className="space-y-6 animate-fade-in">
              {/* Header & Add Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200">
                <div>
                  <h1 className="font-serif text-2xl sm:text-3xl font-black text-stone-950">
                    Manage Platform Admins
                  </h1>
                  <p className="text-xs text-stone-500 font-medium mt-1">
                    Configure staff administrators, permissions, and managed accounts
                  </p>
                </div>

                <button
                  onClick={handleOpenAddAdmin}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md transition active:scale-95 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-gold" />
                  <span>Add New Admin</span>
                </button>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    value={adminSearch}
                    onChange={(e) => setAdminSearch(e.target.value)}
                    placeholder="Search admin by name, email, phone..."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Filter className="w-3.5 h-3.5 text-stone-400" />
                  <select
                    value={adminStatusFilter}
                    onChange={(e) => setAdminStatusFilter(e.target.value)}
                    className="text-xs px-3 py-2 rounded-xl border border-stone-200 bg-white font-medium focus:outline-none"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active Only</option>
                    <option value="suspended">Suspended Only</option>
                  </select>
                </div>
              </div>

              {/* Admins Table */}
              <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-50/90 text-stone-600 font-black uppercase tracking-wider border-b border-stone-200 text-[10px]">
                      <tr>
                        <th className="py-3.5 px-4">Admin Profile</th>
                        <th className="py-3.5 px-4">Contact</th>
                        <th className="py-3.5 px-4">Managed Clients</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4">Joined Date</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {admins.map((adm) => (
                        <tr key={adm._id} className="hover:bg-stone-50/60 transition">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-900 border border-purple-300 flex items-center justify-center font-black text-xs shrink-0">
                                {adm.name?.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-bold text-stone-900">{adm.name}</p>
                                <span className="text-[10px] text-purple-700 font-bold uppercase tracking-wider">
                                  {adm.role}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <p className="font-medium text-stone-700">{adm.email}</p>
                            <p className="text-[11px] text-stone-400">{adm.phone || 'No phone'}</p>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded-full bg-stone-100 font-bold text-stone-700 border border-stone-200 text-[11px]">
                              {adm.managedClientsCount || 0} clients
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => handleToggleUserStatus(adm._id, adm.accountStatus, 'admin')}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border cursor-pointer transition ${
                                adm.accountStatus === 'active'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                                  : 'bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-100'
                              }`}
                              title="Click to toggle status"
                            >
                              {adm.accountStatus}
                            </button>
                          </td>
                          <td className="py-3 px-4 text-stone-500 font-medium">
                            {new Date(adm.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </td>
                          <td className="py-3 px-4 text-right space-x-1">
                            <button
                              onClick={() => handleOpenEditAdmin(adm)}
                              className="p-1.5 rounded-lg text-stone-600 hover:text-primary hover:bg-stone-100 transition"
                              title="Edit Admin"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteAdmin(adm._id, adm.name)}
                              className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition"
                              title="Delete Admin"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {admins.length === 0 && (
                        <tr>
                          <td colSpan="6" className="py-8 text-center text-stone-500 text-xs">
                            No admins found matching your criteria.
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
          {/* TAB 3: MANAGE CLIENT                                 */}
          {/* ===================================================== */}
          {activeTab === 'manage-client' && (
            <div className="space-y-6 animate-fade-in">
              {/* Header & Add Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200">
                <div>
                  <h1 className="font-serif text-2xl sm:text-3xl font-black text-stone-950">
                    Manage Boutique Clients
                  </h1>
                  <p className="text-xs text-stone-500 font-medium mt-1">
                    Manage client boutique stores, assigned admins, and fitting room credits
                  </p>
                </div>

                <button
                  onClick={handleOpenAddClient}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-700 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md transition active:scale-95 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-white" />
                  <span>Register New Client</span>
                </button>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-col lg:flex-row gap-3 items-center justify-between bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs">
                <div className="relative w-full lg:w-80">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    value={clientSearch}
                    onChange={(e) => setClientSearch(e.target.value)}
                    placeholder="Search by store name, owner, email..."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                  <select
                    value={clientAdminFilter}
                    onChange={(e) => setClientAdminFilter(e.target.value)}
                    className="text-xs px-3 py-2 rounded-xl border border-stone-200 bg-white font-medium focus:outline-none"
                  >
                    <option value="all">All Assigned Admins</option>
                    {admins.map((adm) => (
                      <option key={adm._id} value={adm._id}>
                        Admin: {adm.name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={clientStatusFilter}
                    onChange={(e) => setClientStatusFilter(e.target.value)}
                    className="text-xs px-3 py-2 rounded-xl border border-stone-200 bg-white font-medium focus:outline-none"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active Only</option>
                    <option value="suspended">Suspended Only</option>
                  </select>
                </div>
              </div>

              {/* Clients Table */}
              <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-50/90 text-stone-600 font-black uppercase tracking-wider border-b border-stone-200 text-[10px]">
                      <tr>
                        <th className="py-3.5 px-4">Boutique Store</th>
                        <th className="py-3.5 px-4">Owner Contact</th>
                        <th className="py-3.5 px-4">Assigned Admin</th>
                        <th className="py-3.5 px-4">AI Credits</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4">Joined</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {clients.map((cl) => (
                        <tr key={cl._id} className="hover:bg-stone-50/60 transition">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 flex items-center justify-center font-black text-xs shrink-0">
                                <Store className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="font-bold text-stone-900">
                                  {cl.storeName || 'Subh Lagan Boutique Store'}
                                </p>
                                <span className="text-[10px] text-amber-800 font-bold">
                                  ID: {cl._id.slice(-6)}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <p className="font-bold text-stone-800">{cl.name}</p>
                            <p className="text-[11px] text-stone-500">{cl.email}</p>
                            <p className="text-[10px] text-stone-400">{cl.phone || 'No phone'}</p>
                          </td>
                          <td className="py-3 px-4">
                            {cl.assignedAdmin ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-50 text-purple-900 border border-purple-200 text-[10px] font-bold">
                                <Users className="w-3 h-3" />
                                {cl.assignedAdmin.name || 'Assigned'}
                              </span>
                            ) : (
                              <span className="text-stone-400 text-[11px] italic">Unassigned</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1.5 font-bold text-stone-800">
                              <Coins className="w-3.5 h-3.5 text-amber-500" />
                              <span>{cl.credits || 100}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => handleToggleUserStatus(cl._id, cl.accountStatus, 'client')}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border cursor-pointer transition ${
                                cl.accountStatus === 'active'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                                  : 'bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-100'
                              }`}
                              title="Click to toggle status"
                            >
                              {cl.accountStatus}
                            </button>
                          </td>
                          <td className="py-3 px-4 text-stone-500 font-medium">
                            {new Date(cl.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </td>
                          <td className="py-3 px-4 text-right space-x-1">
                            <Link
                              to="/admin"
                              className="p-1.5 inline-block rounded-lg text-stone-500 hover:text-gold hover:bg-stone-100 transition"
                              title="View Client Store Dashboard"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleOpenEditClient(cl)}
                              className="p-1.5 rounded-lg text-stone-600 hover:text-amber-700 hover:bg-stone-100 transition"
                              title="Edit Client"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteClient(cl._id, cl.name)}
                              className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition"
                              title="Delete Client"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {clients.length === 0 && (
                        <tr>
                          <td colSpan="7" className="py-8 text-center text-stone-500 text-xs">
                            No clients found. Click "Register New Client" to add one.
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
          {/* TAB 4: PROFILE                                       */}
          {/* ===================================================== */}
          {activeTab === 'profile' && (
            <div className="max-w-3xl space-y-6 animate-fade-in">
              <div className="pb-4 border-b border-stone-200">
                <h1 className="font-serif text-2xl sm:text-3xl font-black text-stone-950">
                  Superadmin Profile
                </h1>
                <p className="text-xs text-stone-500 font-medium mt-1">
                  Manage master administrative credentials and account settings
                </p>
              </div>

              {/* Profile Card Header */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-[#20060E] to-[#3B0E1B] text-white flex items-center justify-between border border-gold/40 shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-800 to-amber-500 border-2 border-gold flex items-center justify-center text-2xl font-black text-white shadow-md">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-black text-white">{user?.name || 'Chief SuperAdmin'}</h2>
                      <span className="px-2 py-0.5 rounded bg-purple-500/30 border border-purple-400/50 text-[10px] font-black uppercase text-purple-200">
                        SuperAdmin
                      </span>
                    </div>
                    <p className="text-xs text-gold/90 mt-0.5">{user?.email || 'superadmin@subhlagansarees.com'}</p>
                    <p className="text-[11px] text-stone-300 mt-1">Full Root Master Platform Access</p>
                  </div>
                </div>
              </div>

              {/* Form 1: Edit Details */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
                  <Shield className="w-4 h-4 text-primary" />
                  <h3 className="font-serif text-base font-bold text-stone-900">
                    Administrative Details
                  </h3>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        required
                        className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
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
                        className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Email Address (Login ID)
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      disabled
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 text-stone-500 cursor-not-allowed"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={updatingProfile}
                    className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md transition disabled:opacity-50"
                  >
                    {updatingProfile ? 'Saving...' : 'Save Profile Changes'}
                  </button>
                </form>
              </div>

              {/* Form 2: Change Password */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
                  <Key className="w-4 h-4 text-amber-600" />
                  <h3 className="font-serif text-base font-bold text-stone-900">
                    Change Master Password
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
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, currentPassword: e.target.value })
                      }
                      required
                      placeholder="••••••••"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, newPassword: e.target.value })
                        }
                        required
                        minLength={6}
                        placeholder="••••••••"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                        }
                        required
                        minLength={6}
                        placeholder="••••••••"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={updatingPassword}
                    className="px-5 py-2.5 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-700 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md transition disabled:opacity-50"
                  >
                    {updatingPassword ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ========================================================= */}
      {/* MODAL: ADD / EDIT ADMIN                                   */}
      {/* ========================================================= */}
      {adminModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 relative">
            <button
              onClick={() => setAdminModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 pb-4 border-b border-stone-100 mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-900 flex items-center justify-center border border-purple-200">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-black text-stone-950">
                  {editingAdmin ? 'Edit Platform Admin' : 'Add New Platform Admin'}
                </h3>
                <p className="text-[11px] text-stone-500">
                  Admins manage boutique clients and store operations
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveAdmin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={adminFormData.name}
                  onChange={(e) => setAdminFormData({ ...adminFormData, name: e.target.value })}
                  required
                  placeholder="e.g. Ramesh Sharma"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={adminFormData.email}
                    onChange={(e) => setAdminFormData({ ...adminFormData, email: e.target.value })}
                    required
                    placeholder="admin@subhlagan.com"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={adminFormData.phone}
                    onChange={(e) => setAdminFormData({ ...adminFormData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {editingAdmin ? 'Reset Password (optional)' : 'Password *'}
                </label>
                <input
                  type="password"
                  value={adminFormData.password}
                  onChange={(e) => setAdminFormData({ ...adminFormData, password: e.target.value })}
                  required={!editingAdmin}
                  minLength={6}
                  placeholder={editingAdmin ? 'Leave blank to keep current' : '•••••••• (min 6 chars)'}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Account Status
                </label>
                <select
                  value={adminFormData.accountStatus}
                  onChange={(e) => setAdminFormData({ ...adminFormData, accountStatus: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white font-medium focus:outline-none"
                >
                  <option value="active">Active (Access Allowed)</option>
                  <option value="suspended">Suspended (Access Blocked)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setAdminModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-stone-600 hover:bg-stone-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingAdmin}
                  className="px-5 py-2 bg-primary hover:bg-primary/90 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md transition disabled:opacity-50"
                >
                  {savingAdmin ? 'Saving...' : editingAdmin ? 'Update Admin' : 'Create Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ADD / EDIT CLIENT                                  */}
      {/* ========================================================= */}
      {clientModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 relative">
            <button
              onClick={() => setClientModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 pb-4 border-b border-stone-100 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-900 flex items-center justify-center border border-amber-200">
                <Building2 className="w-5 h-5 text-amber-600" />
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
                  placeholder="e.g. Subh Lagan Sarees Varanasi"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
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
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
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
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
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
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {editingClient ? 'Password (optional)' : 'Password *'}
                  </label>
                  <input
                    type="password"
                    value={clientFormData.password}
                    onChange={(e) => setClientFormData({ ...clientFormData, password: e.target.value })}
                    required={!editingClient}
                    minLength={6}
                    placeholder={editingClient ? 'Leave blank' : '••••••••'}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Assign to Admin
                  </label>
                  <select
                    value={clientFormData.assignedAdmin}
                    onChange={(e) => setClientFormData({ ...clientFormData, assignedAdmin: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white font-medium focus:outline-none"
                  >
                    <option value="">Unassigned</option>
                    {admins.map((adm) => (
                      <option key={adm._id} value={adm._id}>
                        {adm.name} ({adm.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Virtual Try-on Credits
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={clientFormData.credits}
                    onChange={(e) => setClientFormData({ ...clientFormData, credits: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Account Status
                </label>
                <select
                  value={clientFormData.accountStatus}
                  onChange={(e) => setClientFormData({ ...clientFormData, accountStatus: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white font-medium focus:outline-none"
                >
                  <option value="active">Active (Store Open)</option>
                  <option value="suspended">Suspended (Store Inactive)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setClientModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-stone-600 hover:bg-stone-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingClient}
                  className="px-5 py-2 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-700 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md transition disabled:opacity-50"
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

export default SuperAdminDashboard;
