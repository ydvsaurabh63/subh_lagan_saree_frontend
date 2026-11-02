import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import {
  Wand2,
  Camera,
  Sparkles,
  Check,
  Upload,
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
  const [isRendering, setIsRendering] = useState(false);
  const [customPhoto, setCustomPhoto] = useState(null);

  const handleRunDrape = () => {
    setIsRendering(true);
    toast.loading('Draping...', { id: 'drape' });

    setTimeout(() => {
      setIsRendering(false);
      toast.success('Draped successfully!', { id: 'drape' });
    }, 1000);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomPhoto(event.target.result);
        toast.success('Photo loaded');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <AdminLayout title="Playground">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <div>
            <h1 className="font-serif text-2xl font-bold text-brandText flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-gold" />
              Playground
            </h1>
            <p className="text-xs text-brandText-muted">
              Test AI draping on sarees & models
            </p>
          </div>
          <button
            onClick={handleRunDrape}
            disabled={isRendering}
            className="px-3.5 py-1.5 rounded-lg bg-gold hover:bg-gold-dark text-primary font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isRendering ? 'Draping...' : 'Run Test'}</span>
          </button>
        </div>

        {/* Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Output Display */}
          <div className="lg:col-span-7 bg-[#161618] rounded-xl border border-stone-800 p-4 flex flex-col items-center justify-center min-h-[400px] relative text-white">
            <div className="relative w-full max-w-xs h-80 rounded-lg overflow-hidden flex items-center justify-center bg-stone-900">
              <img
                src={customPhoto || selectedSaree.image}
                alt={selectedSaree.name}
                className={`max-h-full max-w-full object-contain transition-all duration-300 ${
                  isRendering ? 'scale-95 opacity-50 blur-sm' : 'scale-100 opacity-100'
                }`}
              />

              {isRendering && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60">
                  <div className="w-8 h-8 rounded-full border-2 border-gold border-t-transparent animate-spin"></div>
                </div>
              )}
            </div>

            <p className="font-serif text-sm font-bold text-gold mt-3 truncate max-w-xs">
              {selectedSaree.name}
            </p>
          </div>

          {/* Controls */}
          <div className="lg:col-span-5 space-y-3">
            {/* Upload Model */}
            <div className="p-3.5 rounded-xl bg-white border border-stone-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-brandText">Upload Model</span>
                <Camera className="w-3.5 h-3.5 text-gold" />
              </div>
              <label className="flex flex-col items-center justify-center p-3 border border-dashed border-stone-300 rounded-lg cursor-pointer hover:border-gold hover:bg-cream/20 transition">
                <Upload className="w-5 h-5 text-stone-400 mb-0.5" />
                <span className="text-xs font-semibold text-brandText">Select Photo</span>
                <input type="file" onChange={handleFileUpload} accept="image/*" className="hidden" />
              </label>
              {customPhoto && (
                <button
                  onClick={() => setCustomPhoto(null)}
                  className="w-full py-1 text-xs text-red-600 hover:bg-red-50 rounded transition font-bold"
                >
                  Clear Photo
                </button>
              )}
            </div>

            {/* Select Saree */}
            <div className="p-3.5 rounded-xl bg-white border border-stone-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-brandText">
                <span>Select Saree</span>
                <span className="text-gold">10 items</span>
              </div>

              <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                {presetSarees.map((saree) => {
                  const isSelected = selectedSaree.id === saree.id;
                  return (
                    <button
                      key={saree.id}
                      onClick={() => setSelectedSaree(saree)}
                      className={`w-full flex items-center gap-2.5 p-1.5 rounded-lg border text-left transition ${
                        isSelected
                          ? 'border-gold bg-cream/40'
                          : 'border-stone-200 hover:border-gold/60 bg-white'
                      }`}
                    >
                      <img
                        src={saree.image}
                        alt={saree.name}
                        className="w-8 h-10 object-contain bg-stone-900 rounded border border-stone-700"
                      />
                      <span className="font-serif text-xs font-bold text-brandText truncate flex-1">
                        {saree.name}
                      </span>
                      {isSelected && (
                        <div className="w-4 h-4 rounded-full bg-gold text-white flex items-center justify-center shrink-0">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
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
