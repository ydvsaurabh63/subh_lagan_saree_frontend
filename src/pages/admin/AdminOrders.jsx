import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import { adminApi } from '../../services/api.js';
import { formatPrice, formatDate } from '../../utils/formatters.js';
import toast from 'react-hot-toast';
import {
  Search,
  Package,
  Phone,
  Mail,
  MapPin,
  Clock,
  Printer,
  ChevronDown,
  CheckCircle,
  Truck,
  RotateCcw,
  MessageCircle,
  X,
  Sparkles,
} from 'lucide-react';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  // Print Receipt Modal
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = { limit: 100 };
      if (statusFilter !== 'all') params.status = statusFilter;
      if (search.trim()) params.search = search.trim();

      const res = await adminApi.getOrders(params);
      if (res.success) {
        setOrders(res.orders);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to fetch customer orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOrders();
    }, 250);
    return () => clearTimeout(timer);
  }, [statusFilter, search]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      const res = await adminApi.updateOrderStatus(orderId, newStatus);
      if (res.success) {
        toast.success(`Order status updated to ${newStatus}`);
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o))
        );
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update order status');
    } finally {
      setUpdatingId(null);
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

  const statuses = [
    { id: 'all', label: 'All Orders' },
    { id: 'Placed', label: 'Placed (New)' },
    { id: 'Processing', label: 'Processing' },
    { id: 'Shipped', label: 'Shipped' },
    { id: 'Delivered', label: 'Delivered' },
    { id: 'Cancelled', label: 'Cancelled' },
  ];

  return (
    <AdminLayout title="Orders & COD Dispatch Management">
      <div className="space-y-6">
        {/* Filter Bar & Search */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-stone-200/80 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search by Order #, Customer Name, Mobile, City..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Status Pills */}
          <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {statuses.map((st) => (
              <button
                key={st.id}
                onClick={() => setStatusFilter(st.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  statusFilter === st.id
                    ? 'bg-primary text-cream shadow-sm'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="bg-white rounded-xl border border-stone-200 p-12 text-center text-stone-400">
            <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading customer orders...
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((ord) => (
              <div
                key={ord._id}
                className="bg-white rounded-xl border border-stone-200/80 shadow-sm overflow-hidden hover:border-gold/50 transition-all"
              >
                {/* Order Top Bar */}
                <div className="bg-stone-50/70 p-4 border-b border-stone-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-sm text-primary tracking-wide">
                      {ord.orderNumber}
                    </span>
                    <span className="text-stone-400">•</span>
                    <span className="text-stone-500">{formatDate(ord.createdAt)}</span>
                    <span className="text-stone-400">•</span>
                    <span className="inline-flex items-center gap-1 font-semibold text-stone-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      Cash on Delivery (COD)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedReceiptOrder(ord)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-stone-300 hover:border-primary text-stone-700 hover:text-primary rounded-lg text-xs font-medium transition-all shadow-2xs"
                    >
                      <Printer className="w-3.5 h-3.5" /> Print Invoice
                    </button>

                    <select
                      value={ord.orderStatus}
                      disabled={updatingId === ord._id}
                      onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                      className={`text-xs font-bold py-1.5 px-2.5 rounded-lg border focus:outline-none focus:ring-1 focus:ring-primary ${getStatusBadge(
                        ord.orderStatus
                      )}`}
                    >
                      <option value="Placed">Placed (New)</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered (Paid)</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* Order Details Body */}
                <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                  {/* Column 1: Customer Contact & Shipping Address */}
                  <div>
                    <p className="font-semibold text-stone-800 uppercase tracking-wider text-[10px] mb-2 text-gold">
                      Customer & Shipping Details
                    </p>
                    <p className="font-bold text-sm text-stone-900 mb-1">
                      {ord.customerDetails?.name}
                    </p>
                    <div className="space-y-1 text-stone-600">
                      <p className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-stone-400" />
                        <span>{ord.customerDetails?.phone}</span>
                        <a
                          href={`https://wa.me/${ord.customerDetails?.phone?.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-600 hover:underline inline-flex items-center gap-0.5 font-semibold text-[11px]"
                        >
                          <MessageCircle className="w-3 h-3" /> WhatsApp
                        </a>
                      </p>
                      <p className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-stone-400" />
                        <span>{ord.customerDetails?.email}</span>
                      </p>
                      <div className="flex items-start gap-2 pt-1 border-t border-stone-100 mt-2">
                        <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                        <span>
                          {ord.shippingAddress?.houseNo}, {ord.shippingAddress?.street},{' '}
                          {ord.shippingAddress?.city}, {ord.shippingAddress?.state} -{' '}
                          <strong>{ord.shippingAddress?.pincode}</strong>
                        </span>
                      </div>
                      {ord.shippingAddress?.orderNotes && (
                        <p className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded mt-2 border border-amber-200">
                          <strong>Note:</strong> {ord.shippingAddress.orderNotes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Column 2: Saree Items */}
                  <div className="md:col-span-2 flex flex-col justify-between">
                    <div>
                      <p className="font-semibold text-stone-800 uppercase tracking-wider text-[10px] mb-2 text-gold">
                        Ordered Saree Items ({ord.items?.length || 0})
                      </p>
                      <div className="divide-y divide-stone-100">
                        {ord.items?.map((it, idx) => (
                          <div key={idx} className="py-2 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={it.image || 'https://via.placeholder.com/50'}
                                alt={it.name}
                                className="w-10 h-12 object-cover rounded border border-stone-200"
                              />
                              <div>
                                <p className="font-semibold text-stone-800">{it.name}</p>
                                <p className="text-[11px] text-stone-500">
                                  Qty: {it.quantity} × {formatPrice(it.price)}
                                </p>
                              </div>
                            </div>
                            <div className="font-bold text-stone-900">
                              {formatPrice(it.price * it.quantity)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Financials Footer */}
                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs mt-3 bg-stone-50/50 p-2.5 rounded-lg">
                      <div className="text-stone-500">
                        Subtotal: {formatPrice(ord.subtotal)} | Delivery: {ord.shippingCharges === 0 ? 'FREE' : formatPrice(ord.shippingCharges)}
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] text-stone-500 uppercase mr-2">
                          COD Payable:
                        </span>
                        <span className="font-serif font-bold text-base text-primary">
                          {formatPrice(ord.totalAmount)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-stone-200 p-12 text-center text-stone-400">
            No customer orders found for this filter.
          </div>
        )}
      </div>

      {/* Branded Packing Slip & Invoice Modal */}
      {selectedReceiptOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden border border-gold/40 my-8">
            <div className="p-4 bg-primary text-cream flex items-center justify-between">
              <h3 className="font-serif text-base font-bold text-cream flex items-center gap-2">
                <Printer className="w-4 h-4 text-gold" /> Packing Slip & COD Invoice
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1 bg-gold text-primary font-bold rounded text-xs hover:bg-goldHover transition-colors"
                >
                  Print
                </button>
                <button
                  onClick={() => setSelectedReceiptOrder(null)}
                  className="text-cream/70 hover:text-white p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Invoice Sheet */}
            <div className="p-8 text-xs text-stone-800 space-y-6" id="printable-invoice">
              {/* Header */}
              <div className="flex items-center justify-between border-b pb-4 border-stone-200">
                <div>
                  <h1 className="font-serif text-2xl font-bold text-primary tracking-wide">
                    SUBH LAGAN SAREES
                  </h1>
                  <p className="text-[10px] text-gold uppercase tracking-widest font-semibold mt-0.5">
                    Heirloom Silk & Bridal Drapes
                  </p>
                  <p className="text-[10px] text-stone-500 mt-1">
                    support@subhlagansarees.com • +91 98765 00000
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-base text-primary">
                    {selectedReceiptOrder.orderNumber}
                  </div>
                  <p className="text-[10px] text-stone-500">
                    Date: {formatDate(selectedReceiptOrder.createdAt)}
                  </p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-amber-100 text-amber-800 font-bold rounded text-[10px]">
                    PAYMENT: CASH ON DELIVERY
                  </span>
                </div>
              </div>

              {/* Shipping Details */}
              <div className="grid grid-cols-2 gap-6 bg-cream/40 p-4 rounded-xl border border-stone-200">
                <div>
                  <p className="font-semibold text-stone-500 uppercase tracking-wider text-[10px] mb-1">
                    Ship To Customer:
                  </p>
                  <p className="font-bold text-stone-900 text-sm">
                    {selectedReceiptOrder.customerDetails?.name}
                  </p>
                  <p className="text-stone-600 mt-0.5">
                    {selectedReceiptOrder.shippingAddress?.houseNo},{' '}
                    {selectedReceiptOrder.shippingAddress?.street}
                  </p>
                  <p className="text-stone-600">
                    {selectedReceiptOrder.shippingAddress?.city},{' '}
                    {selectedReceiptOrder.shippingAddress?.state} -{' '}
                    <strong>{selectedReceiptOrder.shippingAddress?.pincode}</strong>
                  </p>
                  <p className="text-stone-600 mt-1 font-semibold">
                    Phone: {selectedReceiptOrder.customerDetails?.phone}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-stone-500 uppercase tracking-wider text-[10px] mb-1">
                    Dispatch Instructions:
                  </p>
                  <p className="text-stone-600">
                    {selectedReceiptOrder.shippingAddress?.orderNotes ||
                      'Standard luxury fragrance packaging with protective sari box.'}
                  </p>
                  <div className="mt-3 p-2 bg-emerald-50 rounded border border-emerald-200 text-emerald-800 text-[11px]">
                    <strong>Collect Cash at Delivery:</strong>{' '}
                    {formatPrice(selectedReceiptOrder.totalAmount)}
                  </div>
                </div>
              </div>

              {/* Table of items */}
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-stone-300 text-stone-600 uppercase text-[10px] tracking-wider">
                    <th className="py-2">Item Description</th>
                    <th className="py-2 text-center">Qty</th>
                    <th className="py-2 text-right">Unit Price</th>
                    <th className="py-2 text-right">Total Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {selectedReceiptOrder.items?.map((it, i) => (
                    <tr key={i}>
                      <td className="py-2.5 font-medium text-stone-800">{it.name}</td>
                      <td className="py-2.5 text-center">{it.quantity}</td>
                      <td className="py-2.5 text-right">{formatPrice(it.price)}</td>
                      <td className="py-2.5 text-right font-bold text-stone-900">
                        {formatPrice(it.price * it.quantity)}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan="3" className="py-2 text-right text-stone-500 pt-3">
                      Subtotal:
                    </td>
                    <td className="py-2 text-right font-semibold pt-3">
                      {formatPrice(selectedReceiptOrder.subtotal)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="py-1 text-right text-stone-500">
                      Shipping / Delivery:
                    </td>
                    <td className="py-1 text-right font-semibold">
                      {selectedReceiptOrder.shippingCharges === 0
                        ? 'FREE'
                        : formatPrice(selectedReceiptOrder.shippingCharges)}
                    </td>
                  </tr>
                  <tr className="border-t border-stone-300 font-bold text-sm text-primary">
                    <td colSpan="3" className="py-3 text-right">
                      Total Payable (COD):
                    </td>
                    <td className="py-3 text-right">
                      {formatPrice(selectedReceiptOrder.totalAmount)}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="border-t border-stone-200 pt-4 text-center text-stone-400 text-[10px]">
                Thank you for choosing Subh Lagan Sarees. Heirloom silk craftsmanship preserved for generations.
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminOrders;
