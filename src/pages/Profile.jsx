import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { userApi, orderApi } from '../services/api.js';
import { formatPrice, formatDate } from '../utils/formatters.js';

import Breadcrumb from '../components/common/Breadcrumb.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import {
  User,
  Package,
  MapPin,
  Lock,
  LogOut,
  Save,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle,
  Truck,
  Clock,
} from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'profile';

  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();

  // Tab State
  const [profileData, setProfileData] = useState({ name: '', phone: '' });
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Change Password State
  const [passData, setPassData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [changingPass, setChangingPass] = useState(false);

  // New Address State
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: '',
    phone: '',
    houseNo: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false,
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  // Load orders if on orders tab
  useEffect(() => {
    if (activeTab === 'orders') {
      const fetchOrders = async () => {
        setLoadingOrders(true);
        try {
          const res = await orderApi.getMyOrders();
          if (res.success) {
            setOrders(res.orders || []);
          }
        } catch (err) {
          console.error('Error fetching orders:', err);
        } finally {
          setLoadingOrders(false);
        }
      };
      fetchOrders();
    } else if (activeTab === 'addresses') {
      const fetchAddresses = async () => {
        setLoadingAddresses(true);
        try {
          const res = await userApi.getAddresses();
          if (res.success) {
            setAddresses(res.addresses || []);
          }
        } catch (err) {
          console.error('Error fetching addresses:', err);
        } finally {
          setLoadingAddresses(false);
        }
      };
      fetchAddresses();
    }
  }, [activeTab]);

  const handleTabChange = (tab) => {
    setSearchParams({ tab });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setUpdatingProfile(true);
    try {
      const res = await userApi.updateProfile(profileData);
      if (res.success) {
        updateProfile(res.user);
        toast.success('Profile updated successfully!');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passData.newPassword !== passData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    setChangingPass(true);
    try {
      const res = await userApi.changePassword({
        currentPassword: passData.currentPassword,
        newPassword: passData.newPassword,
      });
      if (res.success) {
        toast.success(res.message);
        setPassData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      toast.error(err.message || 'Failed to change password');
    } finally {
      setChangingPass(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await userApi.addAddress(newAddress);
      if (res.success) {
        setAddresses(res.addresses);
        setShowAddressModal(false);
        setNewAddress({
          fullName: '',
          phone: '',
          houseNo: '',
          street: '',
          city: '',
          state: '',
          pincode: '',
          isDefault: false,
        });
        toast.success('Address added successfully!');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to add address');
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      const res = await userApi.deleteAddress(id);
      if (res.success) {
        setAddresses(res.addresses);
        toast.success('Address removed');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete address');
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this Cash on Delivery order?')) {
      return;
    }
    try {
      const res = await orderApi.cancelOrder(orderId);
      if (res.success) {
        toast.success(res.message);
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, orderStatus: 'Cancelled' } : o))
        );
      }
    } catch (err) {
      toast.error(err.message || 'Failed to cancel order');
    }
  };

  return (
    <div className="bg-cream/20 min-h-screen pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <Breadcrumb items={[{ label: 'Customer Account' }]} />

        <div className="pb-4 border-b border-stone-200 mt-2">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-primary">
            My Account & Orders
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage your personal profile, delivery addresses, and track Cash on Delivery sarees.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-6">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1 space-y-2">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-gold text-primary font-serif font-bold text-2xl mx-auto flex items-center justify-center mb-2">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <h3 className="font-serif text-base font-bold text-brandText">{user?.name}</h3>
              <p className="text-xs text-stone-400 truncate">{user?.email}</p>
            </div>

            <div className="bg-white p-2 rounded-2xl border border-stone-200 shadow-sm space-y-1">
              <button
                onClick={() => handleTabChange('profile')}
                className={`w-full flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'profile'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-stone-700 hover:bg-cream hover:text-primary'
                }`}
              >
                <User className="w-4 h-4" />
                <span>My Profile</span>
              </button>

              <button
                onClick={() => handleTabChange('orders')}
                className={`w-full flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'orders'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-stone-700 hover:bg-cream hover:text-primary'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>My Orders</span>
              </button>

              <button
                onClick={() => handleTabChange('addresses')}
                className={`w-full flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'addresses'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-stone-700 hover:bg-cream hover:text-primary'
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span>Saved Addresses</span>
              </button>

              <button
                onClick={() => handleTabChange('password')}
                className={`w-full flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'password'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-stone-700 hover:bg-cream hover:text-primary'
                }`}
              >
                <Lock className="w-4 h-4" />
                <span>Change Password</span>
              </button>

              <div className="border-t border-stone-100 my-1"></div>

              <button
                onClick={logout}
                className="w-full flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-700 hover:bg-rose-50 transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          </div>

          {/* Tab Content Panes */}
          <div className="lg:col-span-3">
            {/* 1. Profile Details Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm space-y-6">
                <h2 className="font-serif text-lg font-bold text-primary border-b border-stone-100 pb-3">
                  Personal Information
                </h2>
                <form onSubmit={handleProfileSubmit} className="space-y-4 text-xs max-w-lg">
                  <div>
                    <label className="font-medium text-stone-600 block mb-1">Full Name</label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      required
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-gold focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="font-medium text-stone-600 block mb-1">Email Address</label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full p-2.5 bg-stone-100 text-stone-500 border border-stone-200 rounded-lg cursor-not-allowed"
                    />
                    <span className="text-[10px] text-stone-400">Email cannot be changed directly</span>
                  </div>
                  <div>
                    <label className="font-medium text-stone-600 block mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-gold focus:bg-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={updatingProfile}
                    className="px-6 py-2.5 bg-primary hover:bg-primary-light text-white text-xs font-semibold uppercase tracking-wider rounded-lg shadow transition flex items-center space-x-1.5 disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{updatingProfile ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                </form>
              </div>
            )}

            {/* 2. My Orders Tab */}
            {activeTab === 'orders' && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm space-y-6">
                <h2 className="font-serif text-lg font-bold text-primary border-b border-stone-100 pb-3">
                  My Saree Orders ({orders.length})
                </h2>

                {loadingOrders ? (
                  <LoadingSpinner text="Loading order history..." />
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-12 h-12 text-stone-300 mx-auto mb-2" />
                    <p className="text-xs text-stone-500">You haven't placed any orders yet.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((ord) => (
                      <div
                        key={ord._id}
                        className="p-5 rounded-2xl border border-stone-200 bg-cream/20 space-y-4"
                      >
                        {/* Order Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-200 gap-2 text-xs">
                          <div>
                            <span className="text-stone-500">Order ID: </span>
                            <strong className="text-primary font-mono">{ord.orderNumber}</strong>
                            <span className="text-stone-400 ml-2">• Placed on {formatDate(ord.createdAt)}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                                ord.orderStatus === 'Placed'
                                  ? 'bg-amber-100 text-amber-800'
                                  : ord.orderStatus === 'Shipped'
                                  ? 'bg-blue-100 text-blue-800'
                                  : ord.orderStatus === 'Delivered'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-stone-200 text-stone-700'
                              }`}
                            >
                              {ord.orderStatus}
                            </span>
                            {ord.orderStatus === 'Placed' && (
                              <button
                                onClick={() => handleCancelOrder(ord._id)}
                                className="text-[11px] text-rose-600 hover:underline font-medium"
                              >
                                Cancel Order
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-3">
                          {ord.items?.map((item, idx) => (
                            <div key={idx} className="flex items-center space-x-3 text-xs">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-12 h-14 object-cover object-top rounded border border-stone-200 flex-shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-brandText">{item.name}</p>
                                <p className="text-stone-400">Qty: {item.quantity} • {formatPrice(item.price)} each</p>
                              </div>
                              <span className="font-bold text-brandText">{formatPrice(item.price * item.quantity)}</span>
                            </div>
                          ))}
                        </div>

                        {/* Order Footer */}
                        <div className="pt-3 border-t border-stone-200 flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs gap-2">
                          <p className="text-stone-500">
                            Deliver to: <strong>{ord.shippingAddress?.city}, {ord.shippingAddress?.state}</strong>
                          </p>
                          <div className="text-right">
                            <span className="text-stone-500">Total COD Amount: </span>
                            <span className="text-sm font-bold text-primary font-sans">{formatPrice(ord.totalAmount)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. Saved Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm space-y-6">
                <div className="flex justify-between items-center border-b border-stone-100 pb-3">
                  <h2 className="font-serif text-lg font-bold text-primary">
                    Saved Delivery Addresses
                  </h2>
                  <button
                    onClick={() => setShowAddressModal(true)}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-light transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Address</span>
                  </button>
                </div>

                {loadingAddresses ? (
                  <LoadingSpinner text="Loading addresses..." />
                ) : addresses.length === 0 ? (
                  <p className="text-xs text-stone-500 py-6 text-center">No addresses saved yet.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                      <div
                        key={addr._id}
                        className="p-4 rounded-xl border border-stone-200 bg-cream/30 space-y-2 text-xs relative"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <strong className="text-brandText font-semibold">{addr.fullName}</strong>
                            <p className="text-stone-500">{addr.phone}</p>
                          </div>
                          <button
                            onClick={() => handleDeleteAddress(addr._id)}
                            className="text-stone-400 hover:text-rose-600 transition"
                            title="Delete Address"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-stone-600">
                          {addr.houseNo}, {addr.street}, {addr.city}, {addr.state} - {addr.pincode}
                        </p>
                        {addr.isDefault && (
                          <span className="inline-block px-2 py-0.5 bg-gold/20 text-gold-dark text-[10px] font-bold rounded">
                            Default Address
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Modal for adding address */}
                {showAddressModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
                      <h3 className="font-serif text-base font-bold text-primary">Add New Delivery Address</h3>
                      <form onSubmit={handleAddAddress} className="space-y-3 text-xs">
                        <div>
                          <label className="font-medium text-stone-600 block mb-1">Full Name</label>
                          <input
                            type="text"
                            required
                            value={newAddress.fullName}
                            onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                            className="w-full p-2 border rounded"
                          />
                        </div>
                        <div>
                          <label className="font-medium text-stone-600 block mb-1">Phone</label>
                          <input
                            type="tel"
                            required
                            value={newAddress.phone}
                            onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                            className="w-full p-2 border rounded"
                          />
                        </div>
                        <div>
                          <label className="font-medium text-stone-600 block mb-1">Flat / House No.</label>
                          <input
                            type="text"
                            required
                            value={newAddress.houseNo}
                            onChange={(e) => setNewAddress({ ...newAddress, houseNo: e.target.value })}
                            className="w-full p-2 border rounded"
                          />
                        </div>
                        <div>
                          <label className="font-medium text-stone-600 block mb-1">Street Address</label>
                          <input
                            type="text"
                            required
                            value={newAddress.street}
                            onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                            className="w-full p-2 border rounded"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="font-medium text-stone-600 block mb-1">City</label>
                            <input
                              type="text"
                              required
                              value={newAddress.city}
                              onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                              className="w-full p-2 border rounded"
                            />
                          </div>
                          <div>
                            <label className="font-medium text-stone-600 block mb-1">State</label>
                            <input
                              type="text"
                              required
                              value={newAddress.state}
                              onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                              className="w-full p-2 border rounded"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="font-medium text-stone-600 block mb-1">Pincode</label>
                          <input
                            type="text"
                            required
                            value={newAddress.pincode}
                            onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                            className="w-full p-2 border rounded"
                          />
                        </div>

                        <div className="flex justify-end space-x-2 pt-2">
                          <button
                            type="button"
                            onClick={() => setShowAddressModal(false)}
                            className="px-4 py-2 text-stone-500 hover:text-stone-800"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-5 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-light"
                          >
                            Save Address
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 4. Change Password Tab */}
            {activeTab === 'password' && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm space-y-6">
                <h2 className="font-serif text-lg font-bold text-primary border-b border-stone-100 pb-3">
                  Change Password
                </h2>
                <form onSubmit={handlePasswordSubmit} className="space-y-4 text-xs max-w-lg">
                  <div>
                    <label className="font-medium text-stone-600 block mb-1">Current Password</label>
                    <input
                      type="password"
                      value={passData.currentPassword}
                      onChange={(e) => setPassData({ ...passData, currentPassword: e.target.value })}
                      required
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-gold focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="font-medium text-stone-600 block mb-1">New Password</label>
                    <input
                      type="password"
                      value={passData.newPassword}
                      onChange={(e) => setPassData({ ...passData, newPassword: e.target.value })}
                      required
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-gold focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="font-medium text-stone-600 block mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      value={passData.confirmPassword}
                      onChange={(e) => setPassData({ ...passData, confirmPassword: e.target.value })}
                      required
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-gold focus:bg-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={changingPass}
                    className="px-6 py-2.5 bg-primary hover:bg-primary-light text-white text-xs font-semibold uppercase tracking-wider rounded-lg shadow transition flex items-center space-x-1.5 disabled:opacity-50"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>{changingPass ? 'Updating...' : 'Update Password'}</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

