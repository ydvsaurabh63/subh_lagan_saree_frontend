import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import {
  HelpCircle,
  BookOpen,
  MessageCircle,
  FileQuestion,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Package,
  Sparkles,
} from 'lucide-react';

const AdminHelp = () => {
  return (
    <AdminLayout title="Help & Documentation">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-serif text-2xl font-bold text-brandText flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-gold" />
            Help & Knowledge Base
          </h1>
          <p className="text-sm text-brandText-muted">
            Quick guides, tutorials, and assistance for Subh Lagan boutique administration
          </p>
        </div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-base font-bold text-brandText">
              Virtual Try-On Guide
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Learn how the AI draping engine maps sarees onto realistic customer avatars with photorealistic pleating and zari shimmer.
            </p>
            <ul className="text-xs text-stone-600 space-y-1.5 pt-2 border-t border-stone-100">
              <li className="flex items-center gap-1.5">
                <ChevronRight className="w-3.5 h-3.5 text-gold" />
                <span>Uploading clean cutout saree photos</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ChevronRight className="w-3.5 h-3.5 text-gold" />
                <span>Managing female and male realistic models</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ChevronRight className="w-3.5 h-3.5 text-gold" />
                <span>Configuring 1-Click "Add to Bag"</span>
              </li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-gold/15 flex items-center justify-center text-gold-dark font-bold">
              <Package className="w-5 h-5 text-gold-dark" />
            </div>
            <h3 className="font-serif text-base font-bold text-brandText">
              COD Orders & Dispatch
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Step-by-step workflow for verifying Cash on Delivery customer orders, tracking shipments, and handling exchange requests.
            </p>
            <ul className="text-xs text-stone-600 space-y-1.5 pt-2 border-t border-stone-100">
              <li className="flex items-center gap-1.5">
                <ChevronRight className="w-3.5 h-3.5 text-gold" />
                <span>Verifying phone numbers for COD safety</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ChevronRight className="w-3.5 h-3.5 text-gold" />
                <span>Updating tracking number & courier partner</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ChevronRight className="w-3.5 h-3.5 text-gold" />
                <span>Handling 7-day doorstep saree exchanges</span>
              </li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700 font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-base font-bold text-brandText">
              Inventory & Categories
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              How to add new pure silk, organza, or bridal collections, set promotional discounts, and feature items on the live homepage.
            </p>
            <ul className="text-xs text-stone-600 space-y-1.5 pt-2 border-t border-stone-100">
              <li className="flex items-center gap-1.5">
                <ChevronRight className="w-3.5 h-3.5 text-gold" />
                <span>Adding fabrics, blouse details & borders</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ChevronRight className="w-3.5 h-3.5 text-gold" />
                <span>Managing stock alerts for low inventory</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ChevronRight className="w-3.5 h-3.5 text-gold" />
                <span>Arranging homepage category ticker</span>
              </li>
            </ul>
          </div>
        </div>

        {/* FAQ Quick Accordion */}
        <div className="p-6 rounded-2xl bg-white border border-stone-200/80 shadow-sm space-y-4">
          <h2 className="font-serif text-lg font-bold text-brandText">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/60">
              <h4 className="font-serif text-sm font-bold text-brandText">
                How does customer photo privacy work in the Fitting Room?
              </h4>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                Photos uploaded by customers are processed securely in temporary server memory and are never publicly published or retained without explicit customer action.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/60">
              <h4 className="font-serif text-sm font-bold text-brandText">
                Can I test any saree before publishing it to the live store?
              </h4>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                Yes! Use the <strong>Playground</strong> tab to preview how the drape aligns on realistic models before making the saree visible to customers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminHelp;
