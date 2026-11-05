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
  Activity,
  ArrowUpRight,
  Award,
  Eye,
  EyeOff,
  Cpu,
  Globe,
  Sliders,
  Check,
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

  // Password visibility toggles
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [showClientPassword, setShowClientPassword] = useState(false);
  const [showProfilePassword, setShowProfilePassword] = useState(false);

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
    setShowAdminPassword(false);
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
    setShowAdminPassword(false);
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
        toast.success(`${type === 'admin' ? 'Admin' : 'Client'} status updated to ${res.accountStatus}`);
        if (type === 'admin') {
          fetchAdmins();
        } else {
          fetchClients();
        }
        fetchStats();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to change account status');
    }
  };

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
      assignedAdmin: '',
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
          toast.success('New Client created successfully');
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
        toast.success(`Added ${addAmount} AI Credits successfully! Total: ${newCredits}`);
        fetchClients();
        fetchStats();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to add credits');
    }
  };

  const handleDeleteClient = async (id, name) => {
    if (!window.confirm(`Are you sure you want to permanently delete Client "${name}"?`)) {
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
        toast.success('SuperAdmin profile updated successfully');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
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
        toast.success('Master password changed successfully');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      }
    } catch (err) {
      toast.error(err.message || 'Failed to change password');
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

  // Derived counts for metric bars
  const activeAdminsCount = admins.filter((a) => a.accountStatus === 'active').length;
  const suspendedAdminsCount = admins.filter((a) => a.accountStatus === 'suspended').length;
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
      {/* SIDEBAR: SUPERADMIN PORTAL                                */}
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
                <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-900 to-indigo-950 border border-purple-400/40 text-[9px] font-black uppercase tracking-wider text-purple-200">
                  SuperAdmin
                </span>
                <p className="text-[11px] tracking-widest text-gold uppercase font-black mt-1">
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

          {/* Navigation Links */}
          <div className="p-4 flex-1 overflow-y-auto space-y-6 custom-scrollbar">
            <div>
              <p className="px-3 text-[10px] uppercase tracking-widest text-gold/70 font-bold mb-2">
                Executive Modules
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

                {/* 2. Manage Admin */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('manage-admin');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold tracking-wide transition-all ${
                    activeTab === 'manage-admin'
                      ? 'bg-gradient-to-r from-gold via-amber-500 to-gold-dark text-stone-950 font-black shadow-lg shadow-gold/25 translate-x-1'
                      : 'text-cream/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4" />
                    <span>Manage Admin</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 font-bold">
                    {admins.length}
                  </span>
                </button>

                {/* 3. Manage Client */}
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

                {/* 4. Profile */}
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
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-800 to-amber-500 border border-gold/60 flex items-center justify-center text-xs font-black text-white shrink-0 shadow-md">
                S
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-black text-cream truncate">
                  {user?.name || 'Chief SuperAdmin'}
                </p>
                <p className="text-[10px] text-gold font-medium">Platform Master</p>
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
              SuperAdmin Master
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('profile')}
              className="px-2.5 py-1 rounded-full bg-purple-900/80 text-[10px] font-bold text-purple-200 border border-purple-400/40"
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
              {/* Grand Executive Welcome Banner */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#20050E] via-[#350A19] to-[#1A030A] border border-gold/35 p-6 sm:p-8 shadow-xl text-white">
                <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-purple-900/20 rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/15 border border-gold/30 text-gold text-[10px] font-black uppercase tracking-widest">
                      <Sparkles className="w-3.5 h-3.5 text-gold animate-spin-slow" />
                      <span>Subh Lagan Elite Command Center</span>
                    </div>
                    <h1 className="font-serif text-2xl sm:text-4xl font-black text-white tracking-tight">
                      Master System Telemetry
                    </h1>
                    <p className="text-xs sm:text-sm text-cream/80 max-w-xl font-medium leading-relaxed">
                      Unified governance of boutique storefronts, platform administrators, and AI fitting room infrastructure for Subh Lagan Sarees.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      onClick={() => {
                        fetchStats();
                        fetchAdmins();
                        fetchClients();
                        toast.success('System metrics refreshed');
                      }}
                      className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-white/10 hover:bg-white/15 text-white text-xs font-bold rounded-xl border border-white/20 backdrop-blur-sm shadow-sm transition active:scale-95 cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${loadingStats ? 'animate-spin' : ''}`} />
                      <span>Sync Data</span>
                    </button>

                    <button
                      onClick={handleOpenAddAdmin}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-800 to-indigo-900 hover:from-purple-700 hover:to-indigo-800 text-white text-xs font-black uppercase tracking-wider rounded-xl border border-purple-400/40 shadow-lg shadow-purple-950/40 transition active:scale-95 cursor-pointer"
                    >
                      <UserPlus className="w-3.5 h-3.5 text-purple-200" />
                      <span>+ Add Admin</span>
                    </button>

                    <button
                      onClick={handleOpenAddClient}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-gold via-amber-500 to-gold-dark hover:brightness-105 text-stone-950 text-xs font-black uppercase tracking-wider rounded-xl shadow-lg shadow-amber-900/20 transition active:scale-95 cursor-pointer"
                    >
                      <Building2 className="w-3.5 h-3.5 text-stone-950" />
                      <span>+ Add Client</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 4 Grand Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Admins */}
                <div
                  onClick={() => setActiveTab('manage-admin')}
                  className="bg-white p-5 rounded-2xl border border-stone-200/90 hover:border-purple-300 shadow-sm hover:shadow-luxury transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-black uppercase tracking-wider text-stone-500">
                      Platform Admins
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-200 group-hover:scale-110 transition-transform">
                      <Users className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-3xl font-serif font-black text-stone-900">
                    {stats?.totalAdmins || admins.length || 0}
                  </div>
                  <div className="flex items-center justify-between text-xs text-stone-500 mt-2 font-medium">
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      {activeAdminsCount} active staff
                    </span>
                    <span className="text-purple-700 font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      Manage <ArrowUpRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>

                {/* 2. Clients */}
                <div
                  onClick={() => setActiveTab('manage-client')}
                  className="bg-white p-5 rounded-2xl border border-stone-200/90 hover:border-amber-300 shadow-sm hover:shadow-luxury transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-black uppercase tracking-wider text-stone-500">
                      Boutique Clients
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200 group-hover:scale-110 transition-transform">
                      <Building2 className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-3xl font-serif font-black text-stone-900">
                    {stats?.totalClients || clients.length || 0}
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

                {/* 3. System Revenue */}
                <div className="bg-white p-5 rounded-2xl border border-stone-200/90 hover:border-emerald-300 shadow-sm hover:shadow-luxury transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-black uppercase tracking-wider text-stone-500">
                      COD Orders Value
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-3xl font-serif font-black text-emerald-800">
                    {formatPrice(stats?.totalRevenue || 0)}
                  </div>
                  <div className="text-xs text-stone-500 mt-2 font-medium flex items-center justify-between">
                    <span>{stats?.totalOrders || 0} client orders</span>
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full text-[10px] border border-emerald-200">
                      COD Verified
                    </span>
                  </div>
                </div>

                {/* 4. Total Catalog */}
                <div className="bg-white p-5 rounded-2xl border border-stone-200/90 hover:border-rose-300 shadow-sm hover:shadow-luxury transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-black uppercase tracking-wider text-stone-500">
                      Catalog Sarees
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center border border-rose-200">
                      <Package className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-3xl font-serif font-black text-stone-900">
                    {stats?.totalProducts || 0}
                  </div>
                  <div className="text-xs text-stone-500 mt-2 font-medium flex items-center justify-between">
                    <span>Handloom & Bridal Weaves</span>
                    <span className="text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded-full text-[10px] border border-rose-200">
                      Live Storefront
                    </span>
                  </div>
                </div>
              </div>

              {/* TryoAI Virtual Fitting & Cloud Status Card */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* TryoAI Telemetry */}
                <div className="lg:col-span-2 p-5 rounded-2xl bg-gradient-to-r from-stone-900 to-stone-950 text-white border border-gold/20 shadow-md flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gold/20 border border-gold/40 flex items-center justify-center text-gold">
                          <Cpu className="w-4 h-4" />
                        </div>
                        <h3 className="font-serif text-sm font-black text-cream">
                          Powered by TryoAI • Virtual Fitting Room Engine
                        </h3>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-black tracking-wider uppercase">
                        AI Model Active
                      </span>
                    </div>

                    <p className="text-xs text-stone-300 font-medium leading-relaxed">
                      Real-time interactive saree draping inference active across boutique stores. Automatically allocates GPU credits to authenticated clients.
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/10 text-center">
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                      <p className="text-[10px] uppercase font-bold text-stone-400">Total Credits</p>
                      <p className="text-lg font-black text-gold mt-0.5">{totalCirculatingCredits}</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                      <p className="text-[10px] uppercase font-bold text-stone-400">Avg Response</p>
                      <p className="text-lg font-black text-emerald-400 mt-0.5">2.1s</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                      <p className="text-[10px] uppercase font-bold text-stone-400">3D Simulation</p>
                      <p className="text-lg font-black text-purple-300 mt-0.5">Ready</p>
                    </div>
                  </div>
                </div>

                {/* Cloud Infrastructure Status */}
                <div className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-sm flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
                      <Database className="w-4 h-4 text-primary" />
                      <h3 className="font-serif text-xs font-black uppercase tracking-wider text-stone-800">
                        Cloud Health
                      </h3>
                    </div>

                    <div className="space-y-2.5 mt-3 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-stone-600 font-medium">MongoDB Atlas Cluster</span>
                        <span className="font-bold text-emerald-700 flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Connected
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-stone-600 font-medium">Cloudinary CDN</span>
                        <span className="font-bold text-emerald-700 flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Synced
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-stone-600 font-medium">Vercel Edge Global</span>
                        <span className="font-bold text-emerald-700 flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Optimal
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-stone-600 font-medium">Payments Gateway</span>
                        <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[10px] border border-amber-200">
                          COD Only
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-100 text-[10px] text-stone-400 text-center font-bold">
                    SuperAdmin Session ID: {user?._id?.slice(-8) || 'MASTER'}
                  </div>
                </div>
              </div>

              {/* Two Column Grid: Platform Admins & Boutique Clients */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: Platform Admins */}
                <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center">
                        <Users className="w-4 h-4" />
                      </div>
                      <h2 className="font-serif text-base font-black text-stone-900">
                        Platform Staff Admins
                      </h2>
                    </div>
                    <button
                      onClick={() => setActiveTab('manage-admin')}
                      className="text-xs text-primary font-bold hover:underline inline-flex items-center gap-1"
                    >
                      View All ({admins.length}) <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {admins.slice(0, 4).map((adm) => (
                      <div
                        key={adm._id}
                        className="flex items-center justify-between p-3 rounded-xl bg-stone-50/70 hover:bg-stone-100/80 transition border border-stone-200/70"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-800 to-indigo-600 border border-purple-300 flex items-center justify-center text-xs font-black text-white shrink-0 shadow-xs">
                            {adm.name?.charAt(0).toUpperCase()}
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-xs font-bold text-stone-900 truncate">
                              {adm.name}
                            </p>
                            <p className="text-[11px] text-stone-500 truncate">
                              {adm.email} • {adm.phone || 'No phone'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
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
                          <button
                            onClick={() => handleOpenEditAdmin(adm)}
                            className="p-1.5 rounded-lg hover:bg-white text-stone-600 hover:text-primary transition"
                            title="Edit Admin"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {admins.length === 0 && (
                      <p className="text-xs text-stone-500 text-center py-6">
                        No platform staff admins registered yet.
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Boutique Clients */}
                <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center">
                        <Store className="w-4 h-4" />
                      </div>
                      <h2 className="font-serif text-base font-black text-stone-900">
                        Boutique Client Stores
                      </h2>
                    </div>
                    <button
                      onClick={() => setActiveTab('manage-client')}
                      className="text-xs text-amber-700 font-bold hover:underline inline-flex items-center gap-1"
                    >
                      View All ({clients.length}) <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {clients.slice(0, 4).map((cl) => (
                      <div
                        key={cl._id}
                        className="flex items-center justify-between p-3 rounded-xl bg-stone-50/70 hover:bg-stone-100/80 transition border border-stone-200/70"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-xs font-black text-amber-900 shrink-0">
                            {cl.storeName ? cl.storeName.charAt(0).toUpperCase() : 'B'}
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-xs font-bold text-stone-900 truncate">
                              {cl.storeName || cl.name}
                            </p>
                            <p className="text-[11px] text-stone-500 truncate">
                              Owner: {cl.name} • {cl.credits || 100} Credits
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
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
                          <button
                            onClick={() => handleOpenEditClient(cl)}
                            className="p-1.5 rounded-lg hover:bg-white text-stone-600 hover:text-amber-700 transition"
                            title="Edit Client"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {clients.length === 0 && (
                      <p className="text-xs text-stone-500 text-center py-6">
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
              {/* Header & Metrics Strip */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h1 className="font-serif text-2xl sm:text-3xl font-black text-stone-950">
                      Manage Platform Staff Admins
                    </h1>
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 text-xs font-black border border-purple-300">
                      {admins.length} Total
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 font-medium mt-1">
                    Control staff permissions, assigned clients, and administrator credentials
                  </p>
                </div>

                <button
                  onClick={handleOpenAddAdmin}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-800 to-indigo-900 hover:from-purple-700 hover:to-indigo-800 text-white text-xs font-black uppercase tracking-wider rounded-xl border border-purple-400/40 shadow-lg shadow-purple-950/20 transition active:scale-95 cursor-pointer shrink-0"
                >
                  <UserPlus className="w-4 h-4 text-purple-200" />
                  <span>+ Create Admin</span>
                </button>
              </div>

              {/* Status Chips Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-white border border-stone-200 shadow-xs flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase text-stone-400">Total Staff</p>
                    <p className="text-xl font-black text-stone-900 mt-0.5">{admins.length}</p>
                  </div>
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-stone-200 shadow-xs flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase text-stone-400">Active Staff</p>
                    <p className="text-xl font-black text-emerald-700 mt-0.5">{activeAdminsCount}</p>
                  </div>
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-stone-200 shadow-xs flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase text-stone-400">Suspended</p>
                    <p className="text-xl font-black text-rose-700 mt-0.5">{suspendedAdminsCount}</p>
                  </div>
                  <XCircle className="w-5 h-5 text-rose-600" />
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-stone-200 shadow-xs flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase text-stone-400">Authority</p>
                    <p className="text-xs font-black text-purple-900 mt-1 uppercase">Staff Admin</p>
                  </div>
                  <Shield className="w-5 h-5 text-gold" />
                </div>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
                <div className="relative w-full sm:w-96">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    value={adminSearch}
                    onChange={(e) => setAdminSearch(e.target.value)}
                    placeholder="Search admin by name, email, phone..."
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-purple-600/20 bg-stone-50/50"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Filter className="w-3.5 h-3.5 text-stone-400" />
                  <select
                    value={adminStatusFilter}
                    onChange={(e) => setAdminStatusFilter(e.target.value)}
                    className="text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white font-medium focus:outline-none"
                  >
                    <option value="all">All Status ({admins.length})</option>
                    <option value="active">Active Only ({activeAdminsCount})</option>
                    <option value="suspended">Suspended Only ({suspendedAdminsCount})</option>
                  </select>
                </div>
              </div>

              {/* Admins Table */}
              <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#18040A] text-cream font-black uppercase tracking-wider text-[10px] border-b border-gold/30">
                      <tr>
                        <th className="py-4 px-4">Admin Profile</th>
                        <th className="py-4 px-4">Contact Details</th>
                        <th className="py-4 px-4">Role Clearance</th>
                        <th className="py-4 px-4">Account Status</th>
                        <th className="py-4 px-4">Registration</th>
                        <th className="py-4 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {admins.map((adm) => (
                        <tr key={adm._id} className="hover:bg-purple-50/30 transition">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-800 to-indigo-600 text-white border border-purple-300 flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
                                {adm.name?.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-bold text-stone-900 text-xs">{adm.name}</p>
                                <span className="text-[10px] text-purple-700 font-bold uppercase tracking-wider">
                                  ID: {adm._id.slice(-6)}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <p className="font-medium text-stone-800 flex items-center gap-1.5">
                              <Mail className="w-3 h-3 text-stone-400" />
                              {adm.email}
                            </p>
                            <p className="text-[11px] text-stone-500 mt-0.5 flex items-center gap-1.5">
                              <Phone className="w-3 h-3 text-stone-400" />
                              {adm.phone || 'No phone set'}
                            </p>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2.5 py-1 rounded-full bg-purple-50 text-purple-800 font-bold border border-purple-200 text-[10px] uppercase">
                              Staff Admin
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <button
                              onClick={() => handleToggleUserStatus(adm._id, adm.accountStatus, 'admin')}
                              className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border cursor-pointer transition flex items-center gap-1.5 ${
                                adm.accountStatus === 'active'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                                  : 'bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-100'
                              }`}
                              title="Click to toggle status"
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  adm.accountStatus === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                                }`}
                              />
                              {adm.accountStatus}
                            </button>
                          </td>
                          <td className="py-3.5 px-4 text-stone-500 font-medium">
                            {new Date(adm.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </td>
                          <td className="py-3.5 px-4 text-right space-x-1">
                            <button
                              onClick={() => handleOpenEditAdmin(adm)}
                              className="p-2 rounded-xl text-stone-600 hover:text-purple-700 hover:bg-purple-50 transition"
                              title="Edit Admin"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteAdmin(adm._id, adm.name)}
                              className="p-2 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition"
                              title="Delete Admin"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {admins.length === 0 && (
                        <tr>
                          <td colSpan="6" className="py-12 text-center text-stone-500 text-xs">
                            <Users className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                            <p className="font-bold text-stone-700">No admins found matching criteria.</p>
                            <p className="text-[11px] text-stone-400 mt-1">Try clearing your filters or create a new admin.</p>
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
              {/* Header & Metrics Strip */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h1 className="font-serif text-2xl sm:text-3xl font-black text-stone-950">
                      Manage Boutique Store Clients
                    </h1>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-black border border-amber-300">
                      {clients.length} Boutiques
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 font-medium mt-1">
                    Configure client boutique accounts, assigned staff admins, and TryoAI fitting room credits
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
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-white border border-stone-200 shadow-xs flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase text-stone-400">Total Boutiques</p>
                    <p className="text-xl font-black text-stone-900 mt-0.5">{clients.length}</p>
                  </div>
                  <Store className="w-5 h-5 text-amber-600" />
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-stone-200 shadow-xs flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase text-stone-400">Active Stores</p>
                    <p className="text-xl font-black text-emerald-700 mt-0.5">{activeClientsCount}</p>
                  </div>
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-stone-200 shadow-xs flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase text-stone-400">Total AI Credits</p>
                    <p className="text-xl font-black text-gold-dark mt-0.5">{totalCirculatingCredits}</p>
                  </div>
                  <Coins className="w-5 h-5 text-amber-500" />
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-stone-200 shadow-xs flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase text-stone-400">Suspended</p>
                    <p className="text-xl font-black text-rose-700 mt-0.5">{suspendedClientsCount}</p>
                  </div>
                  <XCircle className="w-5 h-5 text-rose-600" />
                </div>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-col lg:flex-row gap-3 items-center justify-between bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
                <div className="relative w-full lg:w-96">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    value={clientSearch}
                    onChange={(e) => setClientSearch(e.target.value)}
                    placeholder="Search by store name, owner, email..."
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 bg-stone-50/50"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                  <select
                    value={clientAdminFilter}
                    onChange={(e) => setClientAdminFilter(e.target.value)}
                    className="text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white font-medium focus:outline-none"
                  >
                    <option value="all">All Assigned Admins</option>
                    {admins.map((adm) => (
                      <option key={adm._id} value={adm._id}>
                        Staff Admin: {adm.name}
                      </option>
                    ))}
                  </select>

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
                        <th className="py-4 px-4">Owner & Contact</th>
                        <th className="py-4 px-4">Assigned Admin</th>
                        <th className="py-4 px-4">TryoAI Credits</th>
                        <th className="py-4 px-4">Status</th>
                        <th className="py-4 px-4">Registration</th>
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
                                <span className="text-[10px] text-amber-800 font-bold uppercase tracking-wider">
                                  ID: {cl._id.slice(-6)}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <p className="font-bold text-stone-900">{cl.name}</p>
                            <p className="text-[11px] text-stone-500">{cl.email}</p>
                            <p className="text-[10px] text-stone-400">{cl.phone || 'No phone'}</p>
                          </td>
                          <td className="py-3.5 px-4">
                            {cl.assignedAdmin?.name ? (
                              <span className="px-2.5 py-1 rounded-full bg-purple-50 font-bold text-purple-900 border border-purple-200 text-[10px]">
                                {cl.assignedAdmin.name}
                              </span>
                            ) : (
                              <span className="text-stone-400 italic text-[11px]">Unassigned</span>
                            )}
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
                              onClick={() => handleToggleUserStatus(cl._id, cl.accountStatus, 'client')}
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
                          <td className="py-3.5 px-4 text-right space-x-1">
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
                          <td colSpan="7" className="py-12 text-center text-stone-500 text-xs">
                            <Store className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                            <p className="font-bold text-stone-700">No boutique clients found matching criteria.</p>
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
          {/* TAB 4: PROFILE                                       */}
          {/* ===================================================== */}
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
              <div className="pb-4 border-b border-stone-200">
                <h1 className="font-serif text-2xl sm:text-3xl font-black text-stone-950">
                  SuperAdmin Profile & Authority
                </h1>
                <p className="text-xs text-stone-500 font-medium mt-1">
                  Master credential management, tier-1 system clearance, and platform privileges
                </p>
              </div>

              {/* VIP Master Authority Card */}
              <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#20050E] via-[#350A19] to-[#1A030A] text-white border border-gold/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-purple-800 to-amber-500 border-2 border-gold flex items-center justify-center text-3xl font-black text-white shadow-xl shrink-0">
                    S
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl sm:text-2xl font-black text-white font-serif tracking-wide">
                        {user?.name || 'Chief SuperAdmin'}
                      </h2>
                      <span className="px-2.5 py-0.5 rounded-full bg-gold/20 text-gold border border-gold/50 text-[10px] font-black uppercase tracking-wider">
                        Master Sovereign
                      </span>
                    </div>
                    <p className="text-xs text-gold/90">{user?.email}</p>
                    <p className="text-[11px] text-stone-300">
                      Clearance: <span className="font-bold text-emerald-400">TIER-1 FULL PRIVILEGES</span> • Subh Lagan Core Engine
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-900/60 border border-purple-400/40 text-[11px] font-bold text-purple-200">
                    <Shield className="w-3.5 h-3.5 text-gold" />
                    Root Access Verified
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
                      Personal Credentials
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
                        Email Address (Locked Master ID)
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
                      {updatingProfile ? 'Saving...' : 'Update Personal Info'}
                    </button>
                  </form>
                </div>

                {/* Right: Security & Master Password */}
                <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
                    <Key className="w-4 h-4 text-gold-dark" />
                    <h3 className="font-serif text-sm font-black text-stone-900 uppercase tracking-wide">
                      Security & Master Password
                    </h3>
                  </div>

                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Current Master Password
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
                        New Master Password
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
                        Confirm New Master Password
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
                      {updatingPassword ? 'Changing Password...' : 'Change Master Password'}
                    </button>
                  </form>
                </div>
              </div>

              {/* Platform Authority Matrix */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
                  <Award className="w-4 h-4 text-gold" />
                  <h3 className="font-serif text-sm font-black text-stone-900 uppercase tracking-wide">
                    SuperAdmin Master Authority Scope
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-200/80 flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-purple-950">Staff Admin Management</p>
                      <p className="text-[11px] text-purple-800">Create, edit, suspend, and delete platform admins</p>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/80 flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-amber-950">Boutique Store Governance</p>
                      <p className="text-[11px] text-amber-800">Assign stores to staff admins and control active stores</p>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/80 flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-emerald-950">TryoAI Fitting Credits Vault</p>
                      <p className="text-[11px] text-emerald-800">Allocate virtual try-on credits to client stores directly</p>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-200/80 flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-rose-950">Financial Auditing (COD)</p>
                      <p className="text-[11px] text-rose-800">Full visibility into sales volume, order numbers, and store GMV</p>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-stone-700 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-stone-950">Product & Handloom Catalog</p>
                      <p className="text-[11px] text-stone-600">Inspect total product counts and inventory catalog status</p>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-200/80 flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-indigo-700 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-indigo-950">Root System Overrides</p>
                      <p className="text-[11px] text-indigo-800">Unrestricted tier-1 governance across all microservices</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ========================================================= */}
      {/* MODAL: ADD / EDIT ADMIN                                   */}
      {/* ========================================================= */}
      {adminModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gold/30 relative">
            <button
              onClick={() => setAdminModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 pb-4 border-b border-stone-100 mb-4">
              <div className="w-11 h-11 rounded-2xl bg-purple-100 text-purple-900 flex items-center justify-center border border-purple-300 shadow-xs">
                <Users className="w-5 h-5 text-purple-700" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-black text-stone-950">
                  {editingAdmin ? 'Edit Staff Admin' : 'Create New Staff Admin'}
                </h3>
                <p className="text-[11px] text-stone-500">
                  Platform administrators manage assigned boutique stores
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
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-purple-600/20 bg-stone-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Email Address (Login) *
                </label>
                <input
                  type="email"
                  value={adminFormData.email}
                  onChange={(e) => setAdminFormData({ ...adminFormData, email: e.target.value })}
                  required
                  placeholder="admin@subhlagan.com"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-purple-600/20 bg-stone-50/50"
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
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-purple-600/20 bg-stone-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {editingAdmin ? 'Reset Password (optional)' : 'Password *'}
                </label>
                <div className="relative">
                  <input
                    type={showAdminPassword ? 'text' : 'password'}
                    value={adminFormData.password}
                    onChange={(e) => setAdminFormData({ ...adminFormData, password: e.target.value })}
                    required={!editingAdmin}
                    minLength={6}
                    placeholder={editingAdmin ? 'Leave blank to keep current' : '•••••••• (min 6 chars)'}
                    className="w-full pl-3.5 pr-10 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-purple-600/20 bg-stone-50/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPassword(!showAdminPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                  >
                    {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Account Status
                </label>
                <select
                  value={adminFormData.accountStatus}
                  onChange={(e) => setAdminFormData({ ...adminFormData, accountStatus: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 bg-white font-medium focus:outline-none"
                >
                  <option value="active">Active (Access Allowed)</option>
                  <option value="suspended">Suspended (Access Blocked)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setAdminModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-stone-600 hover:bg-stone-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingAdmin}
                  className="px-5 py-2.5 bg-gradient-to-r from-purple-800 to-indigo-900 hover:from-purple-700 hover:to-indigo-800 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md transition disabled:opacity-50 cursor-pointer"
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
                  placeholder="e.g. Subh Lagan Sarees Varanasi"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 bg-stone-50/50"
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
                    Assign to Staff Admin
                  </label>
                  <select
                    value={clientFormData.assignedAdmin}
                    onChange={(e) => setClientFormData({ ...clientFormData, assignedAdmin: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 bg-white font-medium focus:outline-none"
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

export default SuperAdminDashboard;
