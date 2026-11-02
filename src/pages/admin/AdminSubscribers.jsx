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
        <div className="flex items-center justify-between bg-white p-4 sm:p-5 rounded-xl border border-stone-200/90 shadow-sm">
          <div>
            <h3 className="font-serif text-lg font-extrabold text-primary">
              Subscribed Email List ({subscribers.length})
            </h3>
            <p className="text-xs text-stone-600 font-bold">
              Customers who opted in for royal wedding launches and exclusive discounts
            </p>
          </div>
          <button
            onClick={exportCSV}
            disabled={!subscribers.length}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-stone-900 text-white hover:bg-black rounded-lg text-xs font-extrabold disabled:opacity-50 transition-all shadow-xs"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" /> Export CSV
          </button>
        </div>

        <div className="bg-white rounded-xl border border-stone-200/90 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-700 uppercase tracking-wider font-extrabold border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4 font-extrabold">Subscriber Email</th>
                  <th className="py-3 px-4 font-extrabold">Subscription Date</th>
                  <th className="py-3 px-4 font-extrabold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium">
                {loading ? (
                  <tr>
                    <td colSpan="3" className="py-12 text-center text-stone-400 font-bold">
                      Loading subscriber list...
                    </td>
                  </tr>
                ) : subscribers.length > 0 ? (
                  subscribers.map((s) => (
                    <tr key={s._id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-stone-950 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gold shrink-0 stroke-[2.5]" />
                        <span>{s.email}</span>
                      </td>
                      <td className="py-3.5 px-4 text-stone-600 font-semibold">
                        {formatDate(s.createdAt)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-300 uppercase">
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

