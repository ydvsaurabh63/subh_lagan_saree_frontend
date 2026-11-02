import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
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
  Clock,
  CheckCircle,
  Truck,
  RotateCcw,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

const AdminDashboard = () => {
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
      toast.error(err.message || 'Failed to load dashboard metrics');
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
        toast.success(`Order status updated to ${newStatus}`);
        fetchStats();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update order status');
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
      <AdminLayout title="Dashboard Overview">
        <div className="py-20 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-primary font-serif tracking-widest text-xs uppercase">
            Loading Boutique Insights...
          </p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Dashboard Overview">
      <div className="space-y-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-primary via-secondary to-[#2B0A13] text-cream p-6 sm:p-8 rounded-2xl shadow-xl relative overflow-hidden border border-gold/30">
          <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-10">
            <Sparkles className="w-64 h-64 text-gold" />
          </div>
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gold/20 text-gold border border-gold/40 mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Client Store Administrator
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl text-cream font-bold mb-2">
              Welcome back to Subh Lagan Sarees
            </h1>
            <p className="text-cream/80 text-xs sm:text-sm leading-relaxed mb-5">
              Control your entire boutique website from here — track COD dispatches, update live saree stock, manage catalog categories, and respond to royal bridal inquiries.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/admin/products"
                className="inline-flex items-center gap-2 bg-gold hover:bg-goldHover text-primary font-bold px-4 py-2 rounded-lg text-xs tracking-wider uppercase transition-all shadow-md"
              >
                <Plus className="w-4 h-4" /> Add Saree Product
              </Link>
              <Link
                to="/admin/orders"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-cream px-4 py-2 rounded-lg text-xs tracking-wider uppercase border border-gold/30 transition-all"
              >
                <Package className="w-4 h-4 text-gold" /> View All Orders ({stats?.totalOrders || 0})
              </Link>
            </div>
          </div>
        </div>

        {/* 4 Metric KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Revenue */}
          <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                Gross COD Sales
              </span>
              <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
                <IndianRupee className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-bold font-serif text-primary">
              {formatPrice(stats?.totalRevenue || 0)}
            </div>
            <p className="text-[11px] text-stone-500 mt-1 flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-emerald-600" />
              From {stats?.totalOrders || 0} customer orders
            </p>
          </div>

          {/* Orders */}
          <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                Total Orders
              </span>
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200">
                <Package className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-bold font-serif text-primary">
              {stats?.totalOrders || 0}
            </div>
            <p className="text-[11px] text-stone-500 mt-1 flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-600" />
              <strong className="text-amber-700">{stats?.pendingOrders || 0} pending</strong> dispatch
            </p>
          </div>

          {/* Products */}
          <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                Active Sarees
              </span>
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
                <ShoppingBag className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-bold font-serif text-primary">
              {stats?.totalProducts || 0}
            </div>
            <p className="text-[11px] text-stone-500 mt-1 flex items-center gap-1">
              {stats?.lowStockCount > 0 ? (
                <span className="text-rose-600 font-semibold flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  {stats.lowStockCount} sarees low stock
                </span>
              ) : (
                <span className="text-emerald-600">All inventories healthy</span>
              )}
            </p>
          </div>

          {/* Customers / Leads */}
          <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                Enquiries & Leads
              </span>
              <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-200">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-bold font-serif text-primary">
              {stats?.totalEnquiries || 0}
            </div>
            <p className="text-[11px] text-stone-500 mt-1">
              <strong className="text-purple-700">{stats?.newEnquiries || 0} new</strong> bridal queries
            </p>
          </div>
        </div>

        {/* Order Status Breakdown */}
        <div className="bg-white p-6 rounded-xl border border-stone-200/80 shadow-sm">
          <h3 className="font-serif text-base font-bold text-primary mb-4 flex items-center justify-between">
            <span>Fulfillment Pipeline Status</span>
            <Link
              to="/admin/orders"
              className="text-xs text-primary hover:text-gold flex items-center gap-1 font-sans font-normal"
            >
              Manage all orders <ArrowRight className="w-3 h-3" />
            </Link>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-4 rounded-lg bg-amber-50/70 border border-amber-200 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-800">
                Placed (New)
              </p>
              <p className="text-2xl font-bold font-serif text-amber-900 mt-1">
                {stats?.ordersByStatus?.Placed || 0}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-blue-50/70 border border-blue-200 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-800">
                Processing
              </p>
              <p className="text-2xl font-bold font-serif text-blue-900 mt-1">
                {stats?.ordersByStatus?.Processing || 0}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-purple-50/70 border border-purple-200 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-purple-800">
                Shipped
              </p>
              <p className="text-2xl font-bold font-serif text-purple-900 mt-1">
                {stats?.ordersByStatus?.Shipped || 0}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-emerald-50/70 border border-emerald-200 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-800">
                Delivered
              </p>
              <p className="text-2xl font-bold font-serif text-emerald-900 mt-1">
                {stats?.ordersByStatus?.Delivered || 0}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-rose-50/70 border border-rose-200 text-center col-span-2 sm:col-span-1">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-rose-800">
                Cancelled
              </p>
              <p className="text-2xl font-bold font-serif text-rose-900 mt-1">
                {stats?.ordersByStatus?.Cancelled || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Low Stock Alerts (if any) */}
        {stats?.lowStockAlerts && stats.lowStockAlerts.length > 0 && (
          <div className="bg-amber-50/80 border border-amber-300 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3 text-amber-900 font-semibold text-sm">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Low Inventory Alert ({stats.lowStockAlerts.length} Sarees need restock)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {stats.lowStockAlerts.map((prod) => (
                <div
                  key={prod._id}
                  className="bg-white p-3 rounded-lg border border-amber-200 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <img
                      src={prod.images?.[0] || 'https://via.placeholder.com/50'}
                      alt={prod.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <div className="truncate">
                      <p className="font-semibold text-stone-800 truncate">{prod.name}</p>
                      <p className="text-[10px] text-stone-500">SKU: {prod.sku}</p>
                    </div>
                  </div>
                  <div className="text-right pl-2 shrink-0">
                    <span className="inline-block px-2 py-0.5 rounded bg-rose-100 text-rose-700 font-bold text-[11px]">
                      {prod.stock} left
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Orders Table with Instant Status Selector */}
        <div className="bg-white rounded-xl border border-stone-200/80 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-stone-100 flex items-center justify-between">
            <div>
              <h3 className="font-serif text-base font-bold text-primary">
                Recent Customer Orders
              </h3>
              <p className="text-xs text-stone-500">
                Cash on Delivery orders placed through the website
              </p>
            </div>
            <Link
              to="/admin/orders"
              className="text-xs font-semibold text-primary hover:text-gold flex items-center gap-1"
            >
              All Orders <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 uppercase tracking-wider font-semibold border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Order ID & Date</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">COD Total</th>
                  <th className="py-3 px-4">Status & Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                  stats.recentOrders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-bold font-mono text-primary text-xs">
                          {ord.orderNumber}
                        </span>
                        <p className="text-[10px] text-stone-400 mt-0.5">
                          {formatDate(ord.createdAt)}
                        </p>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-medium text-stone-800">
                          {ord.customerDetails?.name || 'Customer'}
                        </p>
                        <p className="text-[10px] text-stone-500">
                          {ord.customerDetails?.phone} • {ord.shippingAddress?.city}
                        </p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-stone-700">
                          {ord.items?.length || 1} saree(s)
                        </span>
                        <p className="text-[10px] text-stone-400 truncate max-w-[150px]">
                          {ord.items?.[0]?.name}
                        </p>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-primary">
                        {formatPrice(ord.totalAmount)}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <select
                            value={ord.orderStatus}
                            disabled={updatingOrderId === ord._id}
                            onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                            className={`text-[11px] font-semibold py-1 px-2 rounded border focus:outline-none focus:ring-1 focus:ring-primary ${getStatusBadge(
                              ord.orderStatus
                            )}`}
                          >
                            <option value="Placed">Placed</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-stone-400">
                      No customer orders yet.
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
