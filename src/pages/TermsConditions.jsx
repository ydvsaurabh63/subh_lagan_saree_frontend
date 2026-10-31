import React from 'react';
import Breadcrumb from '../components/common/Breadcrumb.jsx';

const TermsConditions = () => {
  return (
    <div className="bg-cream/20 min-h-screen pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <Breadcrumb items={[{ label: 'Terms & Conditions' }]} />

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200/80 shadow-sm space-y-6 mt-6">
          <h1 className="font-serif text-3xl font-bold text-primary">
            Terms & Conditions
          </h1>
          <p className="text-xs text-stone-500">Effective Date: October 2026</p>
          <div className="w-16 h-0.5 bg-gold"></div>

          <div className="space-y-4 text-xs sm:text-sm text-stone-600 leading-relaxed">
            <h3 className="font-serif text-base font-bold text-brandText">1. Handloom Artisanal Variations</h3>
            <p>
              Because our sarees are authentically handcrafted and hand-dyed by artisans on traditional looms, subtle variations in weaving texture, zari reflections, and slight yarn slubs are natural hallmarks of genuine handloom weaves and are not considered manufacturing defects.
            </p>

            <h3 className="font-serif text-base font-bold text-brandText">2. Cash on Delivery Commitment</h3>
            <p>
              By selecting Cash on Delivery (COD), customers commit to receiving and paying the full invoice value upon delivery. Frivolous order cancellations after dispatch or repeated refusals at the door may lead to restriction of COD privileges.
            </p>

            <h3 className="font-serif text-base font-bold text-brandText">3. Intellectual Property</h3>
            <p>
              All trademarks, product photography, logos, and motifs associated with Subh Lagan Sarees are proprietary intellectual property. Unauthorized commercial duplication is strictly prohibited.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;

