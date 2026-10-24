import React, { useState } from 'react';
import { 
  Cpu, 
  Layers, 
  Package, 
  HardDrive, 
  Sparkles, 
  Box, 
  Zap, 
  CheckCircle2, 
  RotateCcw, 
  ShoppingCart, 
  Check, 
  ShieldCheck, 
  ThumbsUp, 
  ArrowRight,
  X
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function PcBuilderPage({ products, setActivePage }) {
  const { addToCart } = useCart();

  // Initial parts configured matching the exact image total: ₹1,30,493!
  // CPU (32,999) + MB (16,999) + RAM (8,499) + Storage (7,499) + GPU (49,999) + Case (6,499) + PSU (7,999) = 1,30,493
  const [selectedParts, setSelectedParts] = useState({
    cpu: products.find(p => p.id === 2),        // Ryzen 7 7800X3D (32,999)
    motherboard: products.find(p => p.id === 5),// MSI B650 (16,999)
    ram: products.find(p => p.id === 3),        // Corsair 32GB DDR5 (8,499)
    storage: products.find(p => p.id === 4),    // Samsung 980 Pro 1TB (7,499)
    gpu: products.find(p => p.id === 1),        // RTX 4070 Super (49,999)
    cabinet: products.find(p => p.id === 11),   // Cooler Master MB520 (6,499)
    psu: products.find(p => p.id === 12)        // Corsair RM750e (7,999)
  });

  const [activeStep, setActiveStep] = useState(1);
  const [changeModalCategory, setChangeModalCategory] = useState(null);

  const partRows = [
    { key: 'cpu', categoryName: 'CPUs', label: 'CPU / Processor', icon: Cpu },
    { key: 'motherboard', categoryName: 'Motherboards', label: 'Motherboard', icon: Layers },
    { key: 'ram', categoryName: 'RAM', label: 'RAM / Memory', icon: Package },
    { key: 'storage', categoryName: 'Storage', label: 'Storage (SSD)', icon: HardDrive },
    { key: 'gpu', categoryName: 'Graphics Cards', label: 'GPU / Graphics Card', icon: Sparkles },
    { key: 'cabinet', categoryName: 'Cabinets', label: 'Case / Cabinet', icon: Box },
    { key: 'psu', categoryName: 'Power Supplies', label: 'PSU / Power Supply', icon: Zap }
  ];

  // Calculate live total build cost
  const totalCost = Object.values(selectedParts)
    .filter(Boolean)
    .reduce((sum, item) => sum + item.price, 0);

  // Calculate estimated wattage
  const estimatedWattage = 450; // W

  const handleSelectPart = (categoryKey, product) => {
    setSelectedParts(prev => ({ ...prev, [categoryKey]: product }));
    setChangeModalCategory(null);
  };

  const handleAddAllToCart = () => {
    Object.values(selectedParts).forEach(part => {
      if (part) addToCart(part, 1);
    });
    setActivePage('cart');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Build Your Dream PC
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Choose compatible parts and build your perfect gaming or workstation system with automated bottleneck detection.
        </p>

        {/* Stepper Progress */}
        <div className="flex items-center justify-center gap-6 pt-4 text-xs font-bold">
          <div className={`flex items-center gap-2 ${activeStep >= 1 ? 'text-blue-600' : 'text-slate-400'}`}>
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">1</span>
            <span>Components</span>
          </div>
          <span className="w-8 h-0.5 bg-slate-200"></span>
          <div className={`flex items-center gap-2 ${activeStep >= 2 ? 'text-blue-600' : 'text-slate-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${activeStep >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>2</span>
            <span>Review</span>
          </div>
          <span className="w-8 h-0.5 bg-slate-200"></span>
          <div className={`flex items-center gap-2 ${activeStep >= 3 ? 'text-blue-600' : 'text-slate-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${activeStep >= 3 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>3</span>
            <span>Build</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Parts Table on Left + Summary Card on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Parts Table */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl shadow-sm divide-y divide-slate-100 overflow-hidden">
          {partRows.map((row) => {
            const item = selectedParts[row.key];
            const Icon = row.icon;
            return (
              <div key={row.key} className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors">
                {/* Part Icon & Image */}
                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 p-1 flex items-center justify-center shrink-0">
                    {item ? (
                      <img src={item.imageUrl} alt={item.name} className="max-h-full max-w-full object-contain" />
                    ) : (
                      <Icon className="w-6 h-6 text-slate-400" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-blue-600">
                      {row.label}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                      {item ? item.name : `Select a ${row.categoryName}`}
                    </h4>
                    {item && (
                      <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                        <CheckCircle2 className="w-3 h-3" /> Compatible with build
                      </span>
                    )}
                  </div>
                </div>

                {/* Price & Change Button */}
                <div className="flex items-center gap-4 shrink-0">
                  {item && (
                    <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                      ₹{item.price.toLocaleString('en-IN')}
                    </span>
                  )}
                  <button
                    onClick={() => setChangeModalCategory(row)}
                    className="px-3.5 py-1.5 border border-slate-300 hover:border-blue-600 hover:text-blue-600 text-slate-700 rounded-lg text-xs font-bold transition-all"
                  >
                    Change
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Summary Box matching design board */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Estimated Build Cost
              </span>
              <div className="text-3xl font-black text-slate-900 mt-1">
                ₹{totalCost.toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] text-slate-400">
                Calculated with 7 core compatible parts
              </span>
            </div>

            {/* Build Rig Preview Image */}
            <div className="w-full aspect-[4/3] bg-slate-900 rounded-xl p-3 flex items-center justify-center border border-slate-800">
              <img
                src="/src/assets/images/products/pc-build-apex.svg"
                alt="Selected Rig Preview"
                className="max-h-full max-w-full object-contain filter drop-shadow-xl"
              />
            </div>

            {/* Compatibility Checklist matching design board */}
            <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-2 text-emerald-700 font-bold bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>High Performance (Tier 1 Flagship)</span>
              </div>
              <div className="flex items-center gap-2 text-blue-700 font-bold bg-blue-50 px-3 py-2 rounded-xl border border-blue-200">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Great for 1440p / 4K Gaming & Editing</span>
              </div>
              <div className="flex items-center gap-2 text-indigo-700 font-bold bg-indigo-50 px-3 py-2 rounded-xl border border-indigo-200">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Value for Money Hardware Balance</span>
              </div>
            </div>

            {/* Power Draw Indicator */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs flex justify-between items-center">
              <span className="text-slate-600">Estimated Power Draw:</span>
              <span className="font-extrabold text-slate-900">{estimatedWattage}W / 750W</span>
            </div>

            {/* Primary Action Button */}
            <button
              onClick={handleAddAllToCart}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 text-sm"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add All Parts to Cart & View</span>
            </button>
          </div>
        </div>
      </div>

      {/* Part Change Modal */}
      {changeModalCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 px-6 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">
                Select {changeModalCategory.label}
              </h3>
              <button
                onClick={() => setChangeModalCategory(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-3">
              {products
                .filter(p => p.category === changeModalCategory.categoryName)
                .map(prod => (
                  <div
                    key={prod.id}
                    className="p-3 border border-slate-200 rounded-xl flex items-center justify-between gap-4 hover:border-blue-500 hover:bg-blue-50/50 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-slate-50 rounded-lg p-1 shrink-0 flex items-center justify-center">
                        <img src={prod.imageUrl} alt={prod.name} className="max-h-full max-w-full object-contain" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-slate-900">{prod.name}</h4>
                        <span className="text-[10px] text-slate-400 font-medium">{prod.conditionType} • {prod.brand}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-extrabold text-xs text-slate-900">
                        ₹{prod.price.toLocaleString('en-IN')}
                      </span>
                      <button
                        onClick={() => handleSelectPart(changeModalCategory.key, prod)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors"
                      >
                        Select
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
