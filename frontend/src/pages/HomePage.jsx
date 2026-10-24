import React from 'react';
import { 
  Cpu, 
  Sparkles, 
  Layers, 
  Package, 
  HardDrive, 
  Tv, 
  Wrench, 
  ArrowRight, 
  CheckCircle, 
  Star, 
  ShoppingCart, 
  Flame, 
  ShieldCheck,
  Zap,
  Tag
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function HomePage({ products, setActivePage, setSelectedProduct, setSelectedCategory }) {
  const { addToCart } = useCart();

  const categories = [
    { name: 'CPUs', label: 'Processors', icon: Cpu, count: '48 items' },
    { name: 'Graphics Cards', label: 'GPU', icon: Sparkles, count: '64 items' },
    { name: 'Motherboards', label: 'MB', icon: Layers, count: '32 items' },
    { name: 'RAM', label: 'Memory', icon: Package, count: '55 items' },
    { name: 'Storage', label: 'SSD / HDD', icon: HardDrive, count: '42 items' },
    { name: 'Monitors', label: 'Display', icon: Tv, count: '28 items' },
    { name: 'PC Builds', label: 'Complete Systems', icon: Cpu, count: '16 rigs' },
    { name: 'Accessories', label: 'Peripherals', icon: Wrench, count: '89 items' }
  ];

  const featuredDeals = products.filter(p => p.isFeatured).slice(0, 5);
  const trendingItems = products.filter(p => p.isTrending || p.conditionType !== 'New').slice(0, 4);

  return (
    <div className="space-y-12 pb-16">
      {/* 1. Hero Banner matching design board */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="relative rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 border border-slate-800 text-white overflow-hidden shadow-2xl">
          {/* Neon Background Accents */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-20 right-10 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 sm:p-12 lg:p-16">
            <div className="lg:col-span-7 space-y-6">
              {/* Trust Badges Row */}
              <div className="flex flex-wrap items-center gap-2.5 text-[11px] font-semibold">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> Brand New With Warranty
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300">
                  <Tag className="w-3.5 h-3.5 text-emerald-400" /> Used Products At Great Deals
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300">
                  <Zap className="w-3.5 h-3.5 text-amber-400" /> Refurbished Tested & Trusted
                </span>
              </div>

              <div className="space-y-2">
                <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                  Your One Stop <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300">
                    Hardware Marketplace
                  </span>
                </h1>
                <p className="text-slate-300 text-sm sm:text-base font-medium tracking-wide">
                  Buy | Sell | Upgrade | Build
                </p>
              </div>

              <p className="text-slate-400 text-xs sm:text-sm max-w-xl leading-relaxed">
                India's verified destination for high-end gaming components, pre-tested used GPUs, custom PC builds, and doorstep repair service. Real-time pricing with live market charts.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => setActivePage('catalog')}
                  className="px-7 py-3.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 transition-all flex items-center gap-2 group"
                >
                  <span>Shop Now</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => setActivePage('builder')}
                  className="px-6 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-semibold rounded-xl backdrop-blur-md transition-all flex items-center gap-2"
                >
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <span>Build Your PC</span>
                </button>
              </div>
            </div>

            {/* Visual Hero Showcase */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm aspect-square bg-slate-900/80 rounded-2xl p-4 border border-slate-700/60 shadow-2xl flex items-center justify-center group">
                <img 
                  src="/src/assets/images/products/pc-build-apex.svg" 
                  alt="Custom Gaming Rig" 
                  className="w-full h-full object-contain filter drop-shadow-2xl group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute bottom-4 left-4 right-4 bg-slate-950/90 border border-slate-700/80 rounded-xl p-3 backdrop-blur-md flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">Featured Pre-built</span>
                    <h4 className="text-xs font-bold text-white">Kernel Apex Beast Rig</h4>
                  </div>
                  <span className="text-sm font-extrabold text-white">₹1,89,999</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Category Icon Pills Row */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {categories.map((cat, idx) => {
            const IconComponent = cat.icon;
            return (
              <button
                key={idx}
                onClick={() => {
                  setSelectedCategory(cat.name);
                  setActivePage('catalog');
                }}
                className="group flex flex-col items-center justify-center p-3.5 bg-white border border-slate-200 rounded-2xl hover:border-blue-500 hover:shadow-md transition-all text-center"
              >
                <div className="w-11 h-11 rounded-xl bg-slate-50 group-hover:bg-blue-50 text-slate-700 group-hover:text-blue-600 flex items-center justify-center transition-colors mb-2">
                  <IconComponent className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {cat.name}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Featured Deals matching design board */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-extrabold text-slate-900">Featured Deals</h2>
            <span className="px-2 py-0.5 bg-red-100 text-red-600 font-bold text-[10px] rounded-full uppercase tracking-wider">
              Limited Time
            </span>
          </div>
          <button
            onClick={() => setActivePage('catalog')}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 group"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {featuredDeals.map((prod) => (
            <div
              key={prod.id}
              className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between hover:border-blue-400 hover:shadow-lg transition-all group"
            >
              <div>
                {/* Image */}
                <div 
                  onClick={() => {
                    setSelectedProduct(prod);
                    setActivePage('product-detail');
                  }}
                  className="w-full aspect-square bg-slate-50 rounded-xl mb-3 p-3 flex items-center justify-center cursor-pointer overflow-hidden"
                >
                  <img
                    src={prod.imageUrl}
                    alt={prod.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                  />
                </div>

                {/* Condition Tag */}
                <span className="inline-block text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md mb-2">
                  {prod.conditionType}
                </span>

                {/* Title */}
                <h3 
                  onClick={() => {
                    setSelectedProduct(prod);
                    setActivePage('product-detail');
                  }}
                  className="font-bold text-xs text-slate-900 line-clamp-2 hover:text-blue-600 cursor-pointer min-h-[32px]"
                >
                  {prod.name}
                </h3>
              </div>

              {/* Price & Action */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-sm font-extrabold text-slate-900">
                    ₹{prod.price.toLocaleString('en-IN')}
                  </div>
                  {prod.originalPrice > prod.price && (
                    <div className="text-[10px] text-slate-400 line-through">
                      ₹{prod.originalPrice.toLocaleString('en-IN')}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => {
                    setSelectedProduct(prod);
                    setActivePage('product-detail');
                  }}
                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white rounded-lg text-xs font-bold transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Trending & Refurbished / Used Deals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-extrabold text-slate-900">Trending Refurbished & Used Deals</h2>
          </div>
          <button
            onClick={() => setActivePage('catalog')}
            className="text-xs font-bold text-blue-600 hover:text-blue-800"
          >
            Explore Pre-Owned
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {trendingItems.map((prod) => (
            <div
              key={prod.id}
              className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between hover:shadow-md transition-all"
            >
              <div>
                <div 
                  onClick={() => {
                    setSelectedProduct(prod);
                    setActivePage('product-detail');
                  }}
                  className="w-full aspect-[4/3] bg-slate-50 rounded-xl mb-3 p-3 flex items-center justify-center cursor-pointer"
                >
                  <img src={prod.imageUrl} alt={prod.name} className="max-h-full max-w-full object-contain" />
                </div>

                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    prod.conditionType === 'Refurbished' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {prod.conditionType}
                  </span>
                  <div className="flex items-center text-amber-400 text-xs">
                    <Star className="w-3 h-3 fill-current" />
                    <span className="text-slate-600 text-[11px] font-semibold ml-1">{prod.rating}</span>
                  </div>
                </div>

                <h3 
                  onClick={() => {
                    setSelectedProduct(prod);
                    setActivePage('product-detail');
                  }}
                  className="font-bold text-xs text-slate-900 line-clamp-2 cursor-pointer hover:text-blue-600"
                >
                  {prod.name}
                </h3>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-sm font-extrabold text-slate-900">
                    ₹{prod.price.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[10px] text-emerald-600 font-bold">{prod.discountPct}% OFF</span>
                </div>

                <button
                  onClick={() => addToCart(prod, 1)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>+ Add to Cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Interactive PC Builder Callout Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-blue-700 to-indigo-800 p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs uppercase tracking-widest font-black text-blue-200">
              Kernel Precision Configurator
            </span>
            <h3 className="text-2xl sm:text-3xl font-black">
              Build Your Dream PC With Real-Time Compatibility Checks
            </h3>
            <p className="text-blue-100 text-xs sm:text-sm">
              Pick your CPU, GPU, RAM, Motherboard, and PSU. Our automated engine calculates estimated build cost, bottlenecks, and power wattage on the fly.
            </p>
          </div>

          <button
            onClick={() => setActivePage('builder')}
            className="px-8 py-3.5 bg-white text-blue-700 hover:bg-blue-50 font-extrabold rounded-xl text-sm shadow-md transition-all shrink-0"
          >
            Start PC Builder Now
          </button>
        </div>
      </section>
    </div>
  );
}
