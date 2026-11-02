import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import {
  Shirt,
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle2,
  Eye,
  Filter,
  Search,
  ArrowUpRight,
  ShoppingBag,
} from 'lucide-react';
import { formatPrice } from '../../utils/formatters.js';

const mockTrials = [
  {
    id: 'TRL-9841',
    customer: 'Ananya S. (Mumbai)',
    sareeName: 'Royal Crimson Banarasi Katan Silk',
    avatar: 'Priya Sharma (AI)',
    time: '2 mins ago',
    duration: '1.2s AI Fit',
    converted: true,
    price: 19999,
    image: '/models/model-1.png',
  },
  {
    id: 'TRL-9840',
    customer: 'Pooja Verma (Delhi)',
    sareeName: 'Maharani Emerald Temple Kanjivaram',
    avatar: 'Uploaded User Photo',
    time: '8 mins ago',
    duration: '1.4s AI Fit',
    converted: true,
    price: 27499,
    image: '/models/model-2.png',
  },
  {
    id: 'TRL-9839',
    customer: 'Ritu Gupta (Bengaluru)',
    sareeName: 'Heirloom Red Zardozi Bridal Saree',
    avatar: 'Divya Patel (AI)',
    time: '18 mins ago',
    duration: '1.1s AI Fit',
    converted: false,
    price: 38999,
    image: '/models/model-3.png',
  },
  {
    id: 'TRL-9838',
    customer: 'Sneha Rao (Hyderabad)',
    sareeName: 'Gulabi Rani Pure Paithani Silk',
    avatar: 'Uploaded User Photo',
    time: '34 mins ago',
    duration: '1.5s AI Fit',
    converted: true,
    price: 14999,
    image: '/models/model-4.png',
  },
  {
    id: 'TRL-9837',
    customer: 'Meera Nair (Kochi)',
    sareeName: 'Royal Sapphire Brocade Silk Saree',
    avatar: 'Priya Sharma (AI)',
    time: '52 mins ago',
    duration: '1.3s AI Fit',
    converted: false,
    price: 21999,
    image: '/models/model-5.png',
  },
  {
    id: 'TRL-9836',
    customer: 'Kavita Joshi (Ahmedabad)',
    sareeName: 'Midnight Black Banarasi Brocade Silk',
    avatar: 'Uploaded User Photo',
    time: '1 hr ago',
    duration: '1.2s AI Fit',
    converted: true,
    price: 22499,
    image: '/models/model-9.png',
  },
];

const AdminTrials = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTrials = mockTrials.filter(
    (t) =>
      t.sareeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout title="Virtual Fitting Trials">
      <div className="space-y-6">
        {/* Header & Stats Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl font-bold text-brandText">
              Virtual Fitting Trials
            </h1>
            <p className="text-sm text-brandText-muted">
              Live customer fitting room sessions & AI saree try-on conversions
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              LightX AI Try-On Active
            </span>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-white border border-stone-200/80 shadow-sm">
            <div className="flex items-center justify-between text-stone-500 text-xs font-bold uppercase tracking-wider mb-2">
              <span>Total Try-Ons</span>
              <Shirt className="w-4 h-4 text-primary" />
            </div>
            <div className="font-serif text-2xl font-black text-brandText">
              1,428
            </div>
            <div className="flex items-center text-xs text-emerald-600 font-bold mt-1">
              <TrendingUp className="w-3.5 h-3.5 mr-1" />
              <span>+34.2% this week</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-stone-200/80 shadow-sm">
            <div className="flex items-center justify-between text-stone-500 text-xs font-bold uppercase tracking-wider mb-2">
              <span>Try-to-Bag Conversion</span>
              <ShoppingBag className="w-4 h-4 text-gold" />
            </div>
            <div className="font-serif text-2xl font-black text-brandText">
              31.8%
            </div>
            <div className="text-xs text-brandText-muted mt-1 font-medium">
              454 sarees added to bag directly
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-stone-200/80 shadow-sm">
            <div className="flex items-center justify-between text-stone-500 text-xs font-bold uppercase tracking-wider mb-2">
              <span>Average Draping Speed</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="font-serif text-2xl font-black text-brandText">
              1.3 sec
            </div>
            <div className="text-xs text-emerald-600 font-bold mt-1">
              Ultra-fast GPU acceleration
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-stone-200/80 shadow-sm">
            <div className="flex items-center justify-between text-stone-500 text-xs font-bold uppercase tracking-wider mb-2">
              <span>User Photo Uploads</span>
              <Sparkles className="w-4 h-4 text-purple-600" />
            </div>
            <div className="font-serif text-2xl font-black text-brandText">
              642
            </div>
            <div className="text-xs text-brandText-muted mt-1 font-medium">
              45% used personal gallery photo
            </div>
          </div>
        </div>

        {/* Live Try-On Feed */}
        <div className="p-5 rounded-xl bg-white border border-stone-200/80 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-stone-100">
            <h2 className="font-serif text-lg font-bold text-brandText">
              Recent Fitting Room Activity
            </h2>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search trial by saree or customer..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 uppercase font-bold border-b border-stone-200">
                <tr>
                  <th className="p-3">Saree / Draped Look</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Avatar Used</th>
                  <th className="p-3">Latency</th>
                  <th className="p-3">Conversion Status</th>
                  <th className="p-3 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredTrials.map((t) => (
                  <tr key={t.id} className="hover:bg-cream/30 transition">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={t.image}
                          alt={t.sareeName}
                          className="w-10 h-12 object-contain bg-stone-900 rounded border border-stone-700"
                        />
                        <div>
                          <p className="font-bold text-brandText font-serif">
                            {t.sareeName}
                          </p>
                          <p className="text-[10px] text-primary font-extrabold">
                            {formatPrice(t.price)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 font-medium text-stone-700">
                      {t.customer}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-semibold text-[10px]">
                        {t.avatar}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-[11px] text-stone-600">
                      {t.duration}
                    </td>
                    <td className="p-3">
                      {t.converted ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Added to Bag (COD)
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-600 text-[10px] font-medium">
                          Preview Only
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right text-stone-400 font-medium">
                      {t.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminTrials;
