import React, { useState } from 'react';
import { 
  Sparkles, 
  Cpu, 
  Layers, 
  Package, 
  HardDrive, 
  Tv, 
  Wrench, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight,
  Truck,
  IndianRupee,
  Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../api';

export default function SellHardwarePage({ setActivePage }) {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('sell'); // 'sell' or 'repair'
  const [selectedCategory, setSelectedCategory] = useState('Graphics Cards');
  const [condition, setCondition] = useState('Gently Used');
  const [brand, setBrand] = useState('NVIDIA');
  const [modelName, setModelName] = useState('GeForce RTX 3070 8GB');
  const [purchaseYear, setPurchaseYear] = useState('2022');
  const [hasBox, setHasBox] = useState(true);
  const [expectedPrice, setExpectedPrice] = useState('22000');
  const [savedQuote, setSavedQuote] = useState(null);
  const [pincode, setPincode] = useState('400101');
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Repair State
  const [deviceType, setDeviceType] = useState('Custom Desktop PC');
  const [issueDescription, setIssueDescription] = useState('PC powers on with fan spin but displays no signal to monitor and DRAM debug LED stays orange.');
  const [repairSubmitted, setRepairSubmitted] = useState(false);
  const [repairError, setRepairError] = useState('');
  const [repairTicketNumber, setRepairTicketNumber] = useState('');

  const categories = [
    { name: 'CPUs', icon: Cpu },
    { name: 'Graphics Cards', icon: Sparkles },
    { name: 'RAM', icon: Package },
    { name: 'Motherboards', icon: Layers },
    { name: 'Storage', icon: HardDrive },
    { name: 'Complete PC', icon: Cpu }
  ];

  // Estimated automated quote based on expected price
  const estimatedQuote = expectedPrice ? Math.round(Number(expectedPrice) * 0.92) : 18500;

  const handleSellSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    if (!currentUser?.id) {
      setSubmitError('Sign in before submitting a resale request.');
      return;
    }
    try {
      const request = await apiRequest('/api/resell', {
        method: 'POST',
        body: JSON.stringify({
          userId: currentUser.id,
          category: selectedCategory,
          brand,
          modelName,
          hardwareCondition: condition,
          purchaseYear: Number(purchaseYear),
          hasBillAndBox: hasBox,
          expectedPrice: Number(expectedPrice),
          locationPincode: pincode,
          city: 'Mumbai'
        })
      });
      setSavedQuote(request.estimatedQuote);
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err.message);
    }
  };

  const handleRepairSubmit = async (e) => {
    e.preventDefault();
    setRepairError('');
    if (!currentUser?.id) {
      setRepairError('Sign in before booking a repair.');
      return;
    }
    try {
      const ticket = await apiRequest('/api/repair', {
        method: 'POST',
        body: JSON.stringify({
          userId: currentUser.id,
          deviceType,
          issueDescription,
          locationPincode: pincode,
          serviceAddress: currentUser?.addressLine1 || 'Thakur College Road, Kandivali (E), Mumbai'
        })
      });
      setRepairTicketNumber(ticket.ticketNumber);
      setRepairSubmitted(true);
    } catch (err) {
      setRepairError(err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="max-w-2xl space-y-3 relative z-10">
          <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-bold uppercase tracking-wider">
            Kernel Hardware Exchange & Care
          </span>
          <h1 className="text-3xl sm:text-4xl font-black">
            Give Your Hardware A New Life. <br />
            <span className="text-blue-400">Instant Valuation & Doorstep Repair</span>
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm">
            Upgrade your rig effortlessly. Sell old graphics cards and components for instant cash, or get authorized doorstep repair inspection.
          </p>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex justify-center">
        <div className="bg-slate-100 p-1.5 rounded-2xl flex gap-2 text-sm font-bold shadow-inner">
          <button
            onClick={() => setActiveTab('sell')}
            className={`px-6 py-2.5 rounded-xl transition-all ${
              activeTab === 'sell' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sell Your Hardware
          </button>
          <button
            onClick={() => setActiveTab('repair')}
            className={`px-6 py-2.5 rounded-xl transition-all ${
              activeTab === 'repair' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Book PC Repair Service
          </button>
        </div>
      </div>

      {/* TAB 1: SELL HARDWARE */}
      {activeTab === 'sell' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm max-w-4xl mx-auto space-y-8">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-black text-slate-900">Resale Request Submitted!</h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Our hardware evaluation team has received your submission. An estimated offer of <strong className="text-slate-900">₹{Number(savedQuote || 0).toLocaleString('en-IN')}</strong> is ready. Our technician will verify and collect the part from pincode {pincode}.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors"
              >
                Submit Another Component
              </button>
            </div>
          ) : (
            <>
            {submitError && <div className="mb-4 text-sm text-red-700" role="alert">{submitError}</div>}
            <form onSubmit={handleSellSubmit} className="space-y-6">
              {/* Category Tiles */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                  1. Select Component Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  {categories.map((cat, idx) => {
                    const Icon = cat.icon;
                    const isSelected = selectedCategory === cat.name;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedCategory(cat.name)}
                        className={`p-3.5 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/50 text-blue-600 shadow-sm'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-xs font-bold">{cat.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Specs & Model Form */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Brand Manufacturer</label>
                  <input
                    type="text"
                    required
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="e.g., NVIDIA / ASUS / ZOTAC"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Model Name / VRAM</label>
                  <input
                    type="text"
                    required
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
                    placeholder="e.g., GeForce RTX 3070 8GB Twin Edge"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Physical & Operational Condition</label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
                  >
                    <option>Brand New Sealed</option>
                    <option>Like New</option>
                    <option>Gently Used</option>
                    <option>Heavy Used / Minor Flaw</option>
                    <option>Faulty / For Parts</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Purchase Year</label>
                  <input
                    type="number"
                    value={purchaseYear}
                    onChange={(e) => setPurchaseYear(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              {/* Bill & Box Checkbox */}
              <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                <input
                  type="checkbox"
                  id="hasBox"
                  checked={hasBox}
                  onChange={(e) => setHasBox(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <label htmlFor="hasBox" className="font-semibold text-slate-700 cursor-pointer">
                  Original Invoice / Bill and Original Retail Packaging Box Available (+5% valuation boost)
                </label>
              </div>

              {/* Valuation & Expected Price Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div className="text-xs">
                  <label className="block font-bold text-slate-700 mb-1">Your Expected Price (₹)</label>
                  <input
                    type="number"
                    value={expectedPrice}
                    onChange={(e) => setExpectedPrice(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-sm font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 text-xs">
                  <span className="text-[10px] uppercase font-bold text-emerald-700">Estimated Kernel Instant Cash Quote:</span>
                  <div className="text-xl font-black text-emerald-900 mt-0.5">
                    ₹{estimatedQuote.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[10px] text-emerald-600">Immediate payout upon doorstep inspection</span>
                </div>
              </div>

              {/* Location Check */}
              <div className="text-xs">
                <label className="block font-bold text-slate-700 mb-1">Pickup Location Pincode</label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full sm:w-1/2 bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-lg shadow-blue-600/30 transition-all text-sm flex items-center justify-center gap-2"
              >
                <span>Start Listing & Get Paid</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
            </>
          )}
        </div>
      )}

      {/* TAB 2: REPAIR SERVICE */}
      {activeTab === 'repair' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm max-w-4xl mx-auto space-y-6">
          {repairSubmitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-black text-slate-900">Repair Ticket Booked!</h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Ticket #{repairTicketNumber} has been generated. A certified hardware technician will contact you to arrange doorstep diagnostic inspection.
              </p>
              <button
                onClick={() => setRepairSubmitted(false)}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors"
              >
                Book Another Service
              </button>
            </div>
          ) : (
            <>
            {repairError && <div className="text-sm text-red-700" role="alert">{repairError}</div>}
            <form onSubmit={handleRepairSubmit} className="space-y-5 text-xs">
              <div>
                <label className="block font-bold text-slate-800 uppercase tracking-wider mb-2">Device Type</label>
                <select
                  value={deviceType}
                  onChange={(e) => setDeviceType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-medium"
                >
                  <option>Custom Desktop PC</option>
                  <option>Laptop</option>
                  <option>GPU Card</option>
                  <option>Motherboard</option>
                  <option>PSU / Other</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 uppercase tracking-wider mb-2">Issue Description</label>
                <textarea
                  rows={4}
                  value={issueDescription}
                  onChange={(e) => setIssueDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">Standard Diagnostic Inspection Fee</h4>
                  <p className="text-[11px] text-slate-500">Waived if repair work is authorized with Kernel</p>
                </div>
                <span className="text-lg font-black text-blue-600">₹499</span>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-lg transition-all text-sm"
              >
                Schedule Doorstep Technician
              </button>
            </form>
            </>
          )}
        </div>
      )}
    </div>
  );
}
