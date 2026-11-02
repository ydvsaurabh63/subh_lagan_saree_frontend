import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import { adminApi } from '../../services/api.js';
import { formatDate } from '../../utils/formatters.js';
import toast from 'react-hot-toast';
import {
  MessageSquare,
  Phone,
  Mail,
  Trash2,
  CheckCircle,
  Clock,
  MessageCircle,
} from 'lucide-react';

const AdminEnquiries = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getContacts();
      if (res.success) {
        setContacts(res.contacts);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to fetch customer enquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await adminApi.updateContactStatus(id, newStatus);
      if (res.success) {
        toast.success(`Enquiry marked as ${newStatus}`);
        setContacts((prev) =>
          prev.map((c) => (c._id === id ? { ...c, status: newStatus } : c))
        );
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this inquiry message?')) return;
    try {
      const res = await adminApi.deleteContact(id);
      if (res.success) {
        toast.success('Inquiry deleted');
        setContacts((prev) => prev.filter((c) => c._id !== id));
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete inquiry');
    }
  };

  return (
    <AdminLayout title="Customer Inquiries & Bridal Leads">
      <div className="space-y-6">
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-stone-200/90 shadow-sm flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg font-extrabold text-primary">
              Boutique Inquiries ({contacts.length})
            </h3>
            <p className="text-xs text-stone-600 font-bold">
              Messages submitted from the Contact Us page & wedding consultations
            </p>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl border border-stone-200 p-12 text-center text-stone-400 font-bold">
            <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading messages...
          </div>
        ) : contacts.length > 0 ? (
          <div className="space-y-4">
            {contacts.map((c) => (
              <div
                key={c._id}
                className="bg-white rounded-xl border border-stone-200/90 p-5 shadow-sm space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
                  <div>
                    <h4 className="font-extrabold text-base text-stone-950">
                      {c.name}
                    </h4>
                    <p className="text-xs text-stone-500 font-semibold mt-0.5">
                      Received on {formatDate(c.createdAt)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={c.status}
                      onChange={(e) => handleStatusChange(c._id, e.target.value)}
                      className={`text-xs font-extrabold py-1.5 px-3 rounded-lg border focus:outline-none ${
                        c.status === 'new'
                          ? 'bg-rose-50 text-rose-800 border-rose-300'
                          : c.status === 'read'
                          ? 'bg-amber-50 text-amber-800 border-amber-300'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      }`}
                    >
                      <option value="new">New Inquiry</option>
                      <option value="read">Mark Read</option>
                      <option value="responded">Responded</option>
                    </select>

                    <button
                      onClick={() => handleDelete(c._id)}
                      title="Delete Inquiry"
                      className="p-1.5 text-stone-400 hover:text-rose-600 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Subject & Message */}
                <div>
                  <span className="font-extrabold text-xs text-primary bg-cream p-1.5 rounded border border-gold/40">
                    Subject: {c.subject}
                  </span>
                  <p className="text-xs text-stone-800 font-medium mt-2.5 bg-stone-50 p-3 rounded-lg border border-stone-200 leading-relaxed">
                    {c.message}
                  </p>
                </div>

                {/* Contact Actions */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-stone-600 pt-1">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-stone-400" />
                    <a href={`mailto:${c.email}`} className="hover:text-primary underline">
                      {c.email}
                    </a>
                  </span>

                  {c.phone && (
                    <span className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-stone-400" />
                      <a href={`tel:${c.phone}`} className="hover:text-primary">
                        {c.phone}
                      </a>
                      <a
                        href={`https://wa.me/${c.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1 font-semibold text-[11px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200"
                      >
                        <MessageCircle className="w-3 h-3" /> WhatsApp
                      </a>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-stone-200 p-12 text-center text-stone-400">
            No customer inquiries yet.
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminEnquiries;

