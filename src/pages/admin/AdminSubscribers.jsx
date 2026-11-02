import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import { adminApi } from '../../services/api.js';
import { formatDate } from '../../utils/formatters.js';
import toast from 'react-hot-toast';
import { Mail, Download } from 'lucide-react';

const AdminSubscribers = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getSubscribers();
      if (res.success) {
        setSubscribers(res.subscribers);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to fetch subscribers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const exportCSV = () => {
    if (!subscribers.length) return;
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Email,Subscribed Date,Status']
        .concat(
          subscribers.map(
            (s) => `"${s.email}","${formatDate(s.createdAt)}","${s.status}"`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `subh_lagan_subscribers_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AdminLayout title="Newsletter Subscribers & Leads">
      <div className="space-y-6">
        <div className="flex items-center justify-between bg-white p-4 sm:p-5 rounded-xl border border-stone-200/80 shadow-sm">
          <div>
            <h3 className="font-serif text-base font-bold text-primary">
              Subscribed Email List ({subscribers.length})
            </h3>
            <p className="text-xs text-stone-500">
              Customers who opted in for royal wedding launches and exclusive discounts
            </p>
          </div>
          <button
            onClick={exportCSV}
            disabled={!subscribers.length}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-stone-800 text-white hover:bg-stone-900 rounded-lg text-xs font-semibold disabled:opacity-50 transition-all"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
        </div>

        <div className="bg-white rounded-xl border border-stone-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 uppercase tracking-wider font-semibold border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Subscriber Email</th>
                  <th className="py-3 px-4">Subscription Date</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {loading ? (
                  <tr>
                    <td colSpan="3" className="py-12 text-center text-stone-400">
                      Loading subscriber list...
                    </td>
                  </tr>
                ) : subscribers.length > 0 ? (
                  subscribers.map((s) => (
                    <tr key={s._id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-medium text-stone-900 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gold shrink-0" />
                        <span>{s.email}</span>
                      </td>
                      <td className="py-3.5 px-4 text-stone-500">
                        {formatDate(s.createdAt)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="py-12 text-center text-stone-400">
                      No newsletter subscribers yet.
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

export default AdminSubscribers;
