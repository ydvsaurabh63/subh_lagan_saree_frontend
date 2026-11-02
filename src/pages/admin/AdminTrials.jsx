import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import {
  Shirt,
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle2,
  Search,
  ShoppingBag,
} from 'lucide-react';
import { formatPrice } from '../../utils/formatters.js';

const mockTrials = [
  {
    id: 'TRL-9841',
    customer: 'Ananya S.',
    sareeName: 'Royal Crimson Banarasi Katan Silk',
    avatar: 'Priya (AI)',
    time: '2m ago',
    duration: '1.2s',
    converted: true,
    price: 19999,
    image: '/models/model-1.png',
  },
  {
    id: 'TRL-9840',
    customer: 'Pooja V.',
    sareeName: 'Maharani Emerald Temple Kanjivaram',
    avatar: 'Gallery Photo',
    time: '8m ago',
    duration: '1.4s',
    converted: true,
    price: 27499,
    image: '/models/model-2.png',
  },
  {
    id: 'TRL-9839',
    customer: 'Ritu G.',
    sareeName: 'Heirloom Red Zardozi Bridal Saree',
    avatar: 'Divya (AI)',
    time: '18m ago',
    duration: '1.1s',
    converted: false,
    price: 38999,
    image: '/models/model-3.png',
  },
  {
    id: 'TRL-9838',
    customer: 'Sneha R.',
    sareeName: 'Gulabi Rani Pure Paithani Silk',
    avatar: 'Gallery Photo',
    time: '34m ago',
    duration: '1.5s',
    converted: true,
    price: 14999,
    image: '/models/model-4.png',
  },
  {
    id: 'TRL-9837',
    customer: 'Meera N.',
    sareeName: 'Royal Sapphire Brocade Silk Saree',
    avatar: 'Priya (AI)',
    time: '52m ago',
    duration: '1.3s',
    converted: false,
    price: 21999,
    image: '/models/model-5.png',
  },
  {
    id: 'TRL-9836',
    customer: 'Kavita J.',
    sareeName: 'Midnight Black Banarasi Brocade Silk',
    avatar: 'Gallery Photo',
    time: '1h ago',
    duration: '1.2s',
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
    <AdminLayout title="Trials">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <div>
            <h1 className="font-serif text-2xl font-bold text-brandText">
              Trials
            </h1>
            <p className="text-xs text-brandText-muted">
              Fitting room sessions
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            AI Active
          </span>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-white border border-stone-200 shadow-sm">
            <div className="flex items-center justify-between text-stone-500 text-xs font-bold uppercase mb-1">
              <span>Try-Ons</span>
              <Shirt className="w-3.5 h-3.5 text-primary" />
            </div>
            <div className="font-serif text-2xl font-bold text-brandText">
              1,428
            </div>
            <p className="text-[11px] text-emerald-600 font-bold mt-0.5">
              +34% this week
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-stone-200 shadow-sm">
            <div className="flex items-center justify-between text-stone-500 text-xs font-bold uppercase mb-1">
              <span>Conversion</span>
              <ShoppingBag className="w-3.5 h-3.5 text-gold" />
            </div>
            <div className="font-serif text-2xl font-bold text-brandText">
              31.8%
            </div>
            <p className="text-[11px] text-stone-500 mt-0.5">
              454 added to bag
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-stone-200 shadow-sm">
            <div className="flex items-center justify-between text-stone-500 text-xs font-bold uppercase mb-1">
              <span>Speed</span>
              <Clock className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <div className="font-serif text-2xl font-bold text-brandText">
              1.3s
            </div>
            <p className="text-[11px] text-emerald-600 font-bold mt-0.5">
              GPU Fast
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-stone-200 shadow-sm">
            <div className="flex items-center justify-between text-stone-500 text-xs font-bold uppercase mb-1">
              <span>Gallery Uploads</span>
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            </div>
            <div className="font-serif text-2xl font-bold text-brandText">
              642
            </div>
            <p className="text-[11px] text-stone-500 mt-0.5">
              45% custom photos
            </p>
          </div>
        </div>

        {/* Live Feed */}
        <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pb-2 border-b border-stone-100">
            <h2 className="font-serif text-sm font-bold text-brandText">
              Recent Trials
            </h2>
            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-stone-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="w-full pl-8 pr-3 py-1 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 uppercase font-bold border-b border-stone-200">
                <tr>
                  <th className="p-2.5">Saree</th>
                  <th className="p-2.5">Customer</th>
                  <th className="p-2.5">Model</th>
                  <th className="p-2.5">Speed</th>
                  <th className="p-2.5">Status</th>
                  <th className="p-2.5 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredTrials.map((t) => (
                  <tr key={t.id} className="hover:bg-cream/30 transition">
                    <td className="p-2.5">
                      <div className="flex items-center gap-2">
                        <img
                          src={t.image}
                          alt={t.sareeName}
                          className="w-8 h-10 object-contain bg-stone-900 rounded border border-stone-700"
                        />
                        <div className="truncate max-w-[160px]">
                          <p className="font-bold text-brandText truncate">
                            {t.sareeName}
                          </p>
                          <p className="text-[10px] text-primary font-bold">
                            {formatPrice(t.price)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-2.5 font-medium text-stone-700">
                      {t.customer}
                    </td>
                    <td className="p-2.5">
                      <span className="px-1.5 py-0.5 rounded bg-stone-100 text-stone-700 text-[10px]">
                        {t.avatar}
                      </span>
                    </td>
                    <td className="p-2.5 font-mono text-[10px] text-stone-500">
                      {t.duration}
                    </td>
                    <td className="p-2.5">
                      {t.converted ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                          Bag (COD)
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-stone-100 text-stone-500 text-[10px]">
                          Preview
                        </span>
                      )}
                    </td>
                    <td className="p-2.5 text-right text-stone-400">
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
