import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import {
  Wand2,
  Camera,
  RotateCcw,
  Sparkles,
  Layers,
  Check,
  Upload,
  User,
  Sliders,
} from 'lucide-react';
import toast from 'react-hot-toast';

const presetSarees = [
  { id: 'p-1', name: 'Royal Crimson Banarasi Katan Silk', image: '/models/model-1.png' },
  { id: 'p-2', name: 'Maharani Emerald Temple Kanjivaram', image: '/models/model-2.png' },
  { id: 'p-3', name: 'Heirloom Red Zardozi Bridal Saree', image: '/models/model-3.png' },
  { id: 'p-4', name: 'Gulabi Rani Pure Paithani Silk', image: '/models/model-4.png' },
  { id: 'p-5', name: 'Royal Sapphire Brocade Silk Saree', image: '/models/model-5.png' },
  { id: 'p-6', name: 'Sunshine Yellow Chanderi Silk Saree', image: '/models/model-6.png' },
  { id: 'p-7', name: 'Royal Plum Purple Kanjivaram Silk', image: '/models/model-7.png' },
  { id: 'p-8', name: 'Pastel Peach Floral Organza Saree', image: '/models/model-8.png' },
  { id: 'p-9', name: 'Midnight Black Banarasi Brocade Silk', image: '/models/model-9.png' },
  { id: 'p-10', name: 'Peacock Teal Heritage Mulberry Silk', image: '/models/model-10.png' },
];

const AdminPlayground = () => {
  const [selectedSaree, setSelectedSaree] = useState(presetSarees[0]);
  const [modelType, setModelType] = useState('female');
  const [isRendering, setIsRendering] = useState(false);
  const [customPhoto, setCustomPhoto] = useState(null);

  const handleRunDrape = () => {
    setIsRendering(true);
    toast.loading('Simulating GPU cloth physics & zari highlights...', { id: 'drape' });

    setTimeout(() => {
      setIsRendering(false);
      toast.success('AI Draping Completed! 99.4% Silhouette Alignment', { id: 'drape' });
    }, 1200);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomPhoto(event.target.result);
        toast.success('Custom model uploaded to playground!');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <AdminLayout title="AI Try-On Playground">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl font-bold text-brandText flex items-center gap-2">
              <Wand2 className="w-6 h-6 text-gold" />
              AI Try-On Playground
            </h1>
            <p className="text-sm text-brandText-muted">
              Interactive studio sandbox for boutique staff to test saree cloth draping, avatars & lighting
            </p>
          </div>
          <button
            onClick={handleRunDrape}
            disabled={isRendering}
            className="px-4 py-2 rounded-xl bg-gold hover:bg-gold-dark text-primary font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isRendering ? 'Processing Drape...' : 'Run Drape Test'}</span>
          </button>
        </div>

        {/* Playground Studio Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Canvas: Live Drape Output */}
          <div className="lg:col-span-7 bg-[#161618] rounded-2xl border border-stone-800 p-6 flex flex-col items-center justify-center min-h-[460px] relative text-white shadow-2xl">
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-black/60 border border-white/10 text-[11px] font-bold text-stone-200">
                Playground Studio View
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono">
                1080p Neural Fit
              </span>
            </div>

            <div className="relative w-full max-w-sm h-96 rounded-xl overflow-hidden flex items-center justify-center bg-gradient-to-b from-stone-900 to-[#1d1d22]">
              <img
                src={customPhoto || selectedSaree.image}
                alt={selectedSaree.name}
                className={`max-h-full max-w-full object-contain transition-all duration-500 ${
                  isRendering ? 'scale-95 opacity-50 blur-sm' : 'scale-100 opacity-100'
                }`}
              />

              {isRendering && (
                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2 bg-black/60">
                  <div className="w-10 h-10 rounded-full border-2 border-gold border-t-transparent animate-spin"></div>
                  <span className="text-xs font-mono text-gold font-bold">
                    Neural Alignment...
                  </span>
                </div>
              )}
            </div>

            <div className="mt-4 text-center">
              <h4 className="font-serif text-base font-bold text-gold">
                {selectedSaree.name}
              </h4>
              <p className="text-xs text-stone-400 mt-0.5">
                Target Model: {customPhoto ? 'Custom Uploaded Photo' : 'Standard Boutique Mannequin'}
              </p>
            </div>
          </div>

          {/* Right Controls: Model & Saree Selectors */}
          <div className="lg:col-span-5 space-y-4">
            {/* Custom Photo Upload Card */}
            <div className="p-4 rounded-xl bg-white border border-stone-200/80 shadow-sm space-y-3">
              <h3 className="font-serif text-sm font-bold text-brandText flex items-center justify-between">
                <span>Upload Custom Model</span>
                <Camera className="w-4 h-4 text-gold" />
              </h3>
              <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-stone-200 rounded-xl cursor-pointer hover:border-gold hover:bg-cream/20 transition">
                <Upload className="w-6 h-6 text-stone-400 mb-1" />
                <span className="text-xs font-bold text-brandText">Click to upload photo</span>
                <span className="text-[10px] text-brandText-muted">JPG, PNG or WEBP (Standing pose)</span>
                <input type="file" onChange={handleFileUpload} accept="image/*" className="hidden" />
              </label>
              {customPhoto && (
                <button
                  onClick={() => setCustomPhoto(null)}
                  className="w-full py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg transition font-bold"
                >
                  Reset Custom Model
                </button>
              )}
            </div>

            {/* Saree Look Selection */}
            <div className="p-4 rounded-xl bg-white border border-stone-200/80 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-sm font-bold text-brandText">
                  Select Saree from Inventory
                </h3>
                <span className="text-[11px] font-bold text-gold">
                  10 Looks Ready
                </span>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {presetSarees.map((saree) => {
                  const isSelected = selectedSaree.id === saree.id;
                  return (
                    <button
                      key={saree.id}
                      onClick={() => setSelectedSaree(saree)}
                      className={`w-full flex items-center gap-3 p-2 rounded-xl border text-left transition ${
                        isSelected
                          ? 'border-gold bg-cream/40 shadow-sm'
                          : 'border-stone-200 hover:border-gold/60 bg-white'
                      }`}
                    >
                      <img
                        src={saree.image}
                        alt={saree.name}
                        className="w-10 h-12 object-contain bg-stone-900 rounded border border-stone-700"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-serif text-xs font-bold text-brandText truncate">
                          {saree.name}
                        </p>
                        <p className="text-[10px] text-emerald-700 font-bold">
                          Pure Handloom Silk
                        </p>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-gold text-white flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPlayground;
