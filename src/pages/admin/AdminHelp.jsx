import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import {
  HelpCircle,
  ChevronRight,
  ShieldCheck,
  Package,
  Sparkles,
} from 'lucide-react';

const AdminHelp = () => {
  return (
    <AdminLayout title="Help">
      <div className="space-y-5">
        {/* Header */}
        <div className="pb-3 border-b border-stone-200">
          <h1 className="font-serif text-2xl font-bold text-brandText flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-gold" />
            Help
          </h1>
          <p className="text-xs text-brandText-muted">
            Quick guides for Subh Lagan
          </p>
        </div>

        {/* Guides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-sm space-y-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="font-serif text-sm font-bold text-brandText">
              Virtual Try-On
            </h3>
            <p className="text-xs text-stone-500">
              AI draping mapping on customer avatars with photorealistic zari shimmer.
            </p>
            <ul className="text-xs text-stone-600 space-y-1 pt-2 border-t border-stone-100">
              <li className="flex items-center gap-1">
                <ChevronRight className="w-3 h-3 text-gold" />
                <span>Upload clean cutout photos</span>
              </li>
              <li className="flex items-center gap-1">
                <ChevronRight className="w-3 h-3 text-gold" />
                <span>Manage model avatars</span>
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-sm space-y-2">
            <div className="w-8 h-8 rounded-lg bg-gold/15 flex items-center justify-center text-gold-dark font-bold">
              <Package className="w-4 h-4 text-gold-dark" />
            </div>
            <h3 className="font-serif text-sm font-bold text-brandText">
              COD Orders
            </h3>
            <p className="text-xs text-stone-500">
              Workflow for verifying Cash on Delivery orders and tracking delivery.
            </p>
            <ul className="text-xs text-stone-600 space-y-1 pt-2 border-t border-stone-100">
              <li className="flex items-center gap-1">
                <ChevronRight className="w-3 h-3 text-gold" />
                <span>Verify phone numbers</span>
              </li>
              <li className="flex items-center gap-1">
                <ChevronRight className="w-3 h-3 text-gold" />
                <span>Update courier tracking</span>
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-sm space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700 font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="font-serif text-sm font-bold text-brandText">
              Inventory
            </h3>
            <p className="text-xs text-stone-500">
              Adding new silk sarees, promotional discounts, and stock management.
            </p>
            <ul className="text-xs text-stone-600 space-y-1 pt-2 border-t border-stone-100">
              <li className="flex items-center gap-1">
                <ChevronRight className="w-3 h-3 text-gold" />
                <span>Add fabrics & blouse details</span>
              </li>
              <li className="flex items-center gap-1">
                <ChevronRight className="w-3 h-3 text-gold" />
                <span>Manage low stock alerts</span>
              </li>
            </ul>
          </div>
        </div>

        {/* FAQs */}
        <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-sm space-y-2">
          <h2 className="font-serif text-sm font-bold text-brandText">
            FAQs
          </h2>
          <div className="space-y-2">
            <div className="p-3 rounded-lg bg-stone-50 border border-stone-200/60">
              <h4 className="font-serif text-xs font-bold text-brandText">
                Are customer photos stored?
              </h4>
              <p className="text-xs text-stone-500 mt-0.5">
                No, customer photos are processed securely in temporary server memory and not stored permanently.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-stone-50 border border-stone-200/60">
              <h4 className="font-serif text-xs font-bold text-brandText">
                Can I test sarees before publishing?
              </h4>
              <p className="text-xs text-stone-500 mt-0.5">
                Yes, use the Playground tab to preview drapes on models anytime.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminHelp;
