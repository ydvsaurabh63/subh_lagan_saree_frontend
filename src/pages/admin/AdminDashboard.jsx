import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { adminApi } from '../../services/api.js';
import { formatPrice, formatDate } from '../../utils/formatters.js';
import toast from 'react-hot-toast';
import {
  IndianRupee,
  ShoppingBag,
  Package,
  Users,
  AlertTriangle,
  ArrowRight,
  Plus,
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getStats();
      if (res.success) {
        setStats(res.stats);
      }
    } catch (err) {
      toast.error(err.message || 'Error loading dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingOrderId(orderId);
      const res = await adminApi.updateOrderStatus(orderId, newStatus);
      if (res.success) {
        toast.success(`Updated to ${newStatus}`);
        fetchStats();
      }
    } catch (err) {
      toast.error(err.message || 'Update failed');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Placed':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Processing':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Shipped':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Cancelled':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-stone-100 text-stone-800 border-stone-300';
    }
  };

  if (loading && !stats) {
    return (
      <AdminLayout title="Overview">
        <div className="py-20 flex flex-col items-center justify-center">
          <div className="w-8 h-8 border-3 border-gold border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-primary font-serif text-xs uppercase tracking-widest">
            Loading...
          </p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Overview">
      <div className="space-y-5">
        {/* Top Minimal Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
          <div>
            <h1 className="font-serif text-2xl font-bold text-brandText">
              Overview
            </h1>
            <p className="text-xs text-brandText-muted font-medium">
              {user?.storeName || 'Subh Lagan Sarees'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/admin/store"
              className="inline-flex items-center gap-1.5 bg-primary hover:bg-secondary text-white font-bold px-3 py-1.5 rounded-lg text-xs uppercase tracking-wider transition shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 text-gold" />
              <span>Add Saree</span>
            </Link>
            <Link
              to="/admin/sales"
              className="inline-flex items-center gap-1.5 bg-white hover:bg-stone-50 text-brandText px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border border-stone-200 transition"
            >
              <Package className="w-3.5 h-3.5 text-gold" />
              <span>Orders ({stats?.totalOrders || 0})</span>
            </Link>
          </div>
        </div>

        {/* 4 Metric KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Sales */}
          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Sales
              </span>
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center border border-amber-200">
                <IndianRupee className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-bold font-serif text-primary">
              {formatPrice(stats?.totalRevenue || 0)}
            </div>
            <p className="text-[11px] text-stone-500 mt-0.5">
              {stats?.totalOrders || 0} orders
            </p>
          </div>

          {/* Orders */}
          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Orders
              </span>
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center border border-blue-200">
                <Package className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-bold font-serif text-primary">
              {stats?.totalOrders || 0}
            </div>
            <p className="text-[11px] text-amber-700 font-bold mt-0.5">
              {stats?.pendingOrders || 0} pending
            </p>
          </div>

          {/* Sarees */}
          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Sarees
              </span>
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-200">
                <ShoppingBag className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-bold font-serif text-primary">
              {stats?.totalProducts || 0}
            </div>
            <p className="text-[11px] text-stone-500 mt-0.5">
              {stats?.lowStockCount > 0 ? (
                <span className="text-rose-600 font-bold">{stats.lowStockCount} low stock</span>
              ) : (
                <span className="text-emerald-600 font-bold">In stock</span>
              )}
            </p>
          </div>

          {/* Inquiries */}
          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Inquiries
              </span>
              <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-800 flex items-center justify-center border border-purple-200">
                <Users className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-bold font-serif text-primary">
              {stats?.totalEnquiries || 0}
            </div>
            <p className="text-[11px] text-purple-700 font-bold mt-0.5">
              {stats?.newEnquiries || 0} new
            </p>
          </div>
        </div>

        {/* Status Pipeline */}
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="font-serif text-sm font-bold text-stone-900">
              Orders Status
            </h3>
            <Link
              to="/admin/sales"
              className="text-xs text-primary hover:text-gold flex items-center gap-1 font-bold"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-center">
              <p className="text-[10px] font-bold uppercase text-amber-800">Placed</p>
              <p className="text-lg font-bold font-serif text-amber-950 mt-0.5">
                {stats?.ordersByStatus?.Placed || 0}
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-center">
              <p className="text-[10px] font-bold uppercase text-blue-800">Processing</p>
              <p className="text-lg font-bold font-serif text-blue-950 mt-0.5">
                {stats?.ordersByStatus?.Processing || 0}
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-purple-50 border border-purple-200 text-center">
              <p className="text-[10px] font-bold uppercase text-purple-800">Shipped</p>
              <p className="text-lg font-bold font-serif text-purple-950 mt-0.5">
                {stats?.ordersByStatus?.Shipped || 0}
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-center">
              <p className="text-[10px] font-bold uppercase text-emerald-800">Delivered</p>
              <p className="text-lg font-bold font-serif text-emerald-950 mt-0.5">
                {stats?.ordersByStatus?.Delivered || 0}
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-center col-span-2 sm:col-span-1">
              <p className="text-[10px] font-bold uppercase text-rose-800">Cancelled</p>
              <p className="text-lg font-bold font-serif text-rose-950 mt-0.5">
                {stats?.ordersByStatus?.Cancelled || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Low Stock (if any) */}
        {stats?.lowStockAlerts && stats.lowStockAlerts.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-2 text-amber-900 font-bold text-xs">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Low Stock ({stats.lowStockAlerts.length})</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {stats.lowStockAlerts.map((prod) => (
                <div
                  key={prod._id}
                  className="bg-white p-2 rounded-lg border border-amber-200 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <img
                      src={prod.images?.[0] || 'https://via.placeholder.com/50'}
                      alt={prod.name}
                      className="w-8 h-8 object-cover rounded"
                    />
                    <span className="font-semibold text-stone-800 truncate">{prod.name}</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 font-bold text-[10px] shrink-0">
                    {prod.stock} left
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Orders */}
        <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="p-3.5 border-b border-stone-100 flex items-center justify-between">
            <h3 className="font-serif text-sm font-bold text-primary">
              Recent Orders
            </h3>
            <Link
              to="/admin/sales"
              className="text-xs font-semibold text-primary hover:text-gold flex items-center gap-1"
            >
              All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 uppercase font-bold border-b border-stone-200">
                <tr>
                  <th className="py-2.5 px-3">Order</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Item</th>
                  <th className="py-2.5 px-3">Total</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium">
                {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                  stats.recentOrders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="py-2.5 px-3">
                        <span className="font-mono text-primary font-bold">
                          {ord.orderNumber}
                        </span>
                        <p className="text-[10px] text-stone-400">
                          {formatDate(ord.createdAt)}
                        </p>
                      </td>
                      <td className="py-2.5 px-3">
                        <p className="font-bold text-stone-900">
                          {ord.customerDetails?.name || 'Customer'}
                        </p>
                        <p className="text-[10px] text-stone-500">
                          {ord.shippingAddress?.city}
                        </p>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="truncate max-w-[140px] block">
                          {ord.items?.[0]?.name}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-bold text-primary">
                        {formatPrice(ord.totalAmount)}
                      </td>
                      <td className="py-2.5 px-3">
                        <select
                          value={ord.orderStatus}
                          disabled={updatingOrderId === ord._id}
                          onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                          className={`text-xs font-bold py-1 px-2 rounded border focus:outline-none ${getStatusBadge(
                            ord.orderStatus
                          )}`}
                        >
                          <option value="Placed">Placed</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-6 text-center text-stone-400">
                      No orders yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
