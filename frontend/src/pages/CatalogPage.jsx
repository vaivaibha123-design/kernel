import React, { useState, useMemo } from 'react';
import { 
  Filter, 
  ChevronDown, 
  Star, 
  ShoppingCart, 
  Heart, 
  Check, 
  SlidersHorizontal,
  RotateCcw
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CatalogPage({ 
  products, 
  selectedCategory, 
  setSelectedCategory, 
  setSelectedProduct, 
  setActivePage,
  searchQuery,
  setSearchQuery 
}) {
  const { addToCart, wishlist, toggleWishlist } = useCart();

  const [selectedConditions, setSelectedConditions] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState(150000);
  const [sortBy, setSortBy] = useState('Popularity');
  const [activeTab, setActiveTab] = useState('All'); // All, New, Used, Refurbished

  const allCategories = [
    'All Categories',
    'CPUs',
    'Graphics Cards',
    'Motherboards',
    'RAM',
    'Storage',
    'Cabinets',
    'Power Supplies',
    'PC Builds'
  ];

  const conditions = ['New', 'Used', 'Refurbished'];
  const brands = ['NVIDIA', 'AMD', 'ASUS', 'MSI', 'Gigabyte', 'Corsair', 'Samsung', 'ZOTAC', 'Cooler Master'];

  const handleConditionToggle = (c) => {
    setSelectedConditions(prev => 
      prev.includes(c) ? prev.filter(item => item !== c) : [...prev, c]
    );
  };

  const handleBrandToggle = (b) => {
    setSelectedBrands(prev => 
      prev.includes(b) ? prev.filter(item => item !== b) : [...prev, b]
    );
  };

  const resetFilters = () => {
    setSelectedCategory('All Categories');
    setSelectedConditions([]);
    setSelectedBrands([]);
    setPriceRange(150000);
    setSearchQuery('');
    setActiveTab('All');
  };

  // Filter & Sort
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesBrand = p.brand.toLowerCase().includes(q);
        const matchesCat = p.category.toLowerCase().includes(q);
        if (!matchesName && !matchesBrand && !matchesCat) return false;
      }

      // Category
      if (selectedCategory && selectedCategory !== 'All Categories' && p.category !== selectedCategory) {
        return false;
      }

      // Tab filter
      if (activeTab !== 'All' && p.conditionType !== activeTab) {
        return false;
      }

      // Condition checkboxes
      if (selectedConditions.length > 0 && !selectedConditions.includes(p.conditionType)) {
        return false;
      }

      // Brand
      if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) {
        return false;
      }

      // Price
      if (p.price > priceRange) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'Price: Low to High') return a.price - b.price;
      if (sortBy === 'Price: High to Low') return b.price - a.price;
      if (sortBy === 'Customer Rating') return b.rating - a.rating;
      return b.reviewCount - a.reviewCount; // Popularity default
    });
  }, [products, selectedCategory, selectedConditions, selectedBrands, priceRange, sortBy, activeTab, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title & Active Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="text-xs text-slate-400 mb-1">
            Home &gt; Hardware Marketplace &gt; <span className="text-slate-800 font-semibold">{selectedCategory || 'All Products'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {selectedCategory === 'All Categories' ? 'All Hardware & Components' : selectedCategory}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Showing <span className="font-bold text-slate-800">{filteredProducts.length}</span> verified products
          </p>
        </div>

        {/* Top Filter Tabs & Sort Dropdown */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Condition Tabs matching design board */}
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            {['All', 'New', 'Used', 'Refurbished'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === tab
                    ? 'bg-white text-blue-600 shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
            <span className="text-slate-400 font-medium">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent font-bold text-slate-800 outline-none cursor-pointer"
            >
              <option>Popularity</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Customer Rating</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Layout: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-6">
        {/* Left Filter Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-blue-600" /> Filters
              </span>
              <button
                onClick={resetFilters}
                className="text-[11px] text-blue-600 hover:text-blue-800 flex items-center gap-1 font-semibold"
              >
                <RotateCcw className="w-3 h-3" /> Reset All
              </button>
            </div>

            {/* Category Filter */}
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">Category</h4>
              <div className="space-y-1.5 text-xs">
                {allCategories.map((cat, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
                      selectedCategory === cat
                        ? 'bg-blue-50 text-blue-600 font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{cat}</span>
                    {selectedCategory === cat && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Condition Filter */}
            <div className="pt-3 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">Condition</h4>
              <div className="space-y-2 text-xs">
                {conditions.map((cond, i) => (
                  <label key={i} className="flex items-center gap-2.5 cursor-pointer text-slate-700 hover:text-slate-900">
                    <input
                      type="checkbox"
                      checked={selectedConditions.includes(cond)}
                      onChange={() => handleConditionToggle(cond)}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                    />
                    <span className="font-medium">{cond}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Brand Filter */}
            <div className="pt-3 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">Brand</h4>
              <div className="space-y-2 text-xs max-h-48 overflow-y-auto pr-1">
                {brands.map((b, i) => (
                  <label key={i} className="flex items-center gap-2.5 cursor-pointer text-slate-700 hover:text-slate-900">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(b)}
                      onChange={() => handleBrandToggle(b)}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                    />
                    <span className="font-medium">{b}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range Slider */}
            <div className="pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-slate-800 uppercase tracking-wider">Price Range</span>
                <span className="font-extrabold text-blue-600">Up to ₹{priceRange.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="5000"
                max="200000"
                step="2500"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>₹5,000</span>
                <span>₹2,00,000</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Filter className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">No hardware matches your filters</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try widening your price range or clearing condition checkboxes.
              </p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProducts.map((prod) => {
                const isWishlisted = wishlist.includes(prod.id);
                return (
                  <div
                    key={prod.id}
                    className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between hover:border-blue-500 hover:shadow-xl transition-all relative group"
                  >
                    {/* Wishlist Heart Icon */}
                    <button
                      onClick={() => toggleWishlist(prod.id)}
                      className="absolute right-4 top-4 p-2 bg-white/80 backdrop-blur-sm rounded-full text-slate-400 hover:text-red-500 transition-colors z-10 shadow-sm"
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                    </button>

                    <div>
                      {/* Product Image */}
                      <div
                        onClick={() => {
                          setSelectedProduct(prod);
                          setActivePage('product-detail');
                        }}
                        className="w-full aspect-[4/3] bg-slate-50 rounded-xl mb-3 p-3 flex items-center justify-center cursor-pointer overflow-hidden"
                      >
                        <img
                          src={prod.imageUrl}
                          alt={prod.name}
                          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* Badges */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          prod.conditionType === 'New'
                            ? 'bg-blue-50 text-blue-600'
                            : prod.conditionType === 'Used'
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-amber-50 text-amber-600'
                        }`}>
                          {prod.conditionType}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold">{prod.brand}</span>
                      </div>

                      {/* Product Name */}
                      <h3
                        onClick={() => {
                          setSelectedProduct(prod);
                          setActivePage('product-detail');
                        }}
                        className="font-bold text-xs text-slate-900 line-clamp-2 hover:text-blue-600 cursor-pointer min-h-[34px]"
                      >
                        {prod.name}
                      </h3>

                      {/* Rating */}
                      <div className="flex items-center gap-1.5 mt-2">
                        <div className="flex text-amber-400">
                          <Star className="w-3 h-3 fill-current" />
                        </div>
                        <span className="text-xs font-bold text-slate-700">{prod.rating}</span>
                        <span className="text-[10px] text-slate-400">({prod.reviewCount})</span>
                      </div>
                    </div>

                    {/* Pricing & Add to Cart */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <div className="text-base font-black text-slate-900">
                          ₹{prod.price.toLocaleString('en-IN')}
                        </div>
                        {prod.originalPrice > prod.price && (
                          <div className="text-[10px] text-slate-400 line-through">
                            ₹{prod.originalPrice.toLocaleString('en-IN')}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => addToCart(prod, 1)}
                        className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-blue-600/20 active:scale-95"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>+ Add to Cart</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
