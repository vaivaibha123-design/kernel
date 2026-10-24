import React, { useEffect, useState } from 'react';
import { 
  Star, 
  ShoppingCart, 
  Zap, 
  ShieldCheck, 
  RefreshCw, 
  Lock, 
  Check, 
  TrendingDown, 
  Info,
  ChevronRight,
  Share2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../api';

export default function ProductDetailPage({ product, setActivePage }) {
  const { addToCart } = useCart();
  const { currentUser } = useAuth();
  const [activeImage, setActiveImage] = useState(product.imageUrl);
  const [activeTab, setActiveTab] = useState('price-history'); // 'price-history', 'specs', 'description', 'reviews'
  const [priceData, setPriceData] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const displayedRating = reviews.length
    ? reviews.reduce((total, review) => total + review.rating, 0) / reviews.length
    : product.rating || 0;
  const currentPriceIsLowest = priceData.length > 0
    && Number(priceData[priceData.length - 1].price) <= Math.min(...priceData.map(entry => Number(entry.price)));

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      apiRequest(`/api/products/${product.id}/price-history`),
      apiRequest(`/api/products/${product.id}/reviews`)
    ]).then(([history, productReviews]) => {
      if (!cancelled) {
        setPriceData(history.map(entry => ({
          month: new Date(entry.recordedAt).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }),
          price: Number(entry.price)
        })));
        setReviews(productReviews);
      }
    }).catch(error => {
      if (!cancelled) setReviewError(error.message);
    });
    return () => { cancelled = true; };
  }, [product.id]);

  const handleSubmitReview = async (event) => {
    event.preventDefault();
    if (!currentUser?.id) {
      setReviewError('Sign in to submit a review.');
      return;
    }
    try {
      const review = await apiRequest(`/api/products/${product.id}/reviews`, {
        method: 'POST',
        body: JSON.stringify({ userId: currentUser.id, rating: Number(reviewRating), comment: reviewComment })
      });
      setReviews(prev => [review, ...prev]);
      setReviewComment('');
      setReviewError('');
    } catch (error) {
      setReviewError(error.message);
    }
  };

  const handleBuyNow = async () => {
    if (await addToCart(product, 1)) setActivePage('checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Breadcrumb */}
      <nav className="text-xs text-slate-400 flex items-center gap-1.5">
        <button onClick={() => setActivePage('home')} className="hover:text-blue-600">Home</button>
        <ChevronRight className="w-3.5 h-3.5" />
        <button onClick={() => setActivePage('catalog')} className="hover:text-blue-600">{product.category}</button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-800 font-semibold truncate max-w-sm">{product.name}</span>
      </nav>

      {/* Top Section: Gallery + Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm">
        {/* Left: Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="w-full aspect-square bg-slate-50 border border-slate-100 rounded-2xl p-6 flex items-center justify-center overflow-hidden">
            <img
              src={activeImage}
              alt={product.name}
              className="max-h-full max-w-full object-contain hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Thumbnails */}
          <div className="flex items-center gap-3">
            {[product.imageUrl, ...(product.additionalImages || [])].map((imgUrl, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(imgUrl)}
                className={`w-18 h-18 rounded-xl p-2 bg-slate-50 border-2 transition-all flex items-center justify-center ${
                  activeImage === imgUrl ? 'border-blue-600 shadow-md' : 'border-slate-200 hover:border-slate-400'
                }`}
              >
                <img src={imgUrl} alt="Thumbnail" className="max-h-12 max-w-12 object-contain" />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Product Info & Buy Box */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                product.conditionType === 'New'
                  ? 'bg-blue-100 text-blue-700'
                  : product.conditionType === 'Used'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-amber-100 text-amber-700'
              }`}>
                {product.conditionType}
              </span>
              <span className="text-xs text-slate-500 font-semibold">Brand: <strong className="text-slate-900">{product.brand}</strong></span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
              {product.name}
            </h1>

            {/* Ratings & Reviews */}
            <div className="flex items-center gap-3 mt-2.5">
              <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 text-xs">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="font-bold text-amber-900">{displayedRating.toFixed(1)}</span>
              </div>
              <span className="text-xs text-slate-500 font-medium">({reviews.length} reviews)</span>
              <span className="text-slate-300">|</span>
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> In Stock ({product.stock} units)
              </span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-slate-900">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-base text-slate-400 line-through">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-md">
                    {product.discountPct}% OFF
                  </span>
                </>
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              Inclusive of all taxes. Free express insured shipping across India.
            </p>
          </div>

          {/* Specs Highlights */}
          {product.specsJson && (
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">Key Specifications:</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                {Object.entries(product.specsJson).slice(0, 4).map(([key, value], idx) => (
                  <li key={idx} className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                    <strong className="capitalize">{key.replace(/([A-Z])/g, ' $1')}:</strong> {String(value)}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <button
              onClick={() => addToCart(product, 1)}
              className="py-3.5 px-6 bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>

            <button
              onClick={handleBuyNow}
              className="py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Buy Now</span>
            </button>
          </div>

          {/* Trust Guarantees Row */}
          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-200 text-center text-[11px] text-slate-600">
            <div className="flex flex-col items-center gap-1">
              <RefreshCw className="w-4 h-4 text-blue-600" />
              <span className="font-semibold">7 Days Replacement</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span className="font-semibold">{product.warrantyInfo || 'Brand Warranty'}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Lock className="w-4 h-4 text-blue-600" />
              <span className="font-semibold">Secure Payment</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Tabs with Price Graph, Specs, Reviews */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 gap-6 text-sm font-bold">
          <button
            onClick={() => setActiveTab('price-history')}
            className={`pb-3.5 border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'price-history'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <TrendingDown className="w-4 h-4" />
            <span>Price Tracking Graph</span>
          </button>

          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-3.5 border-b-2 transition-all ${
              activeTab === 'specs'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Full Specifications
          </button>

          <button
            onClick={() => setActiveTab('description')}
            className={`pb-3.5 border-b-2 transition-all ${
              activeTab === 'description'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Product Overview
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3.5 border-b-2 transition-all ${
              activeTab === 'reviews'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Reviews ({product.reviewCount || 120})
          </button>
        </div>

        {/* Tab 1: Recharts Price History Graph */}
        {activeTab === 'price-history' && (
          <div className="pt-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Historical Price Fluctuation (Last 6 Months)</h3>
                <p className="text-xs text-slate-500">
                  Prices recorded in Kernel's database.
                </p>
              </div>
              {currentPriceIsLowest && (
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <TrendingDown className="w-4 h-4" />
                <span>Current price is the lowest recorded</span>
              </div>
              )}
            </div>

            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={priceData} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis 
                    stroke="#64748b" 
                    fontSize={11} 
                    tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`} 
                    domain={['dataMin - 2000', 'dataMax + 2000']}
                    tickLine={false}
                  />
                  <Tooltip 
                    formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Market Price']}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#2563eb" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#priceGradient)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Tab 2: Full Specifications */}
        {activeTab === 'specs' && (
          <div className="pt-6">
            <table className="w-full text-xs text-left text-slate-700">
              <tbody>
                {product.specsJson && Object.entries(product.specsJson).map(([key, val], idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                    <td className="py-2.5 px-4 font-bold text-slate-900 w-1/3 capitalize">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </td>
                    <td className="py-2.5 px-4">{String(val)}</td>
                  </tr>
                ))}
                <tr className="bg-slate-50">
                  <td className="py-2.5 px-4 font-bold text-slate-900">Warranty</td>
                  <td className="py-2.5 px-4">{product.warrantyInfo || '3 Years Brand Warranty'}</td>
                </tr>
                <tr className="bg-white">
                  <td className="py-2.5 px-4 font-bold text-slate-900">Condition</td>
                  <td className="py-2.5 px-4">{product.conditionType}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Description */}
        {activeTab === 'description' && (
          <div className="pt-6 space-y-4 text-xs text-slate-700 leading-relaxed max-w-3xl">
            <p>{product.description}</p>
            <p>
              Each item sold on Kernel undergoes comprehensive diagnostic benchmarks including VRAM stress testing, Furmark thermal stability, and PCIe bandwidth verification before shipment.
            </p>
          </div>
        )}

        {/* Tab 4: Reviews */}
        {activeTab === 'reviews' && (
          <div className="pt-6 space-y-4">
            {reviewError && <p className="text-sm text-red-700" role="alert">{reviewError}</p>}
            {reviews.map(review => (
              <div key={review.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900 text-xs">{review.userName || 'Verified Buyer'}</span>
                  <span className="text-[11px] text-slate-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex text-amber-400 mb-1">
                  {[...Array(review.rating)].map((_, index) => <Star key={index} className="w-3.5 h-3.5 fill-current" />)}
                </div>
                <p className="text-xs text-slate-700">{review.comment}</p>
              </div>
            ))}
            {reviews.length === 0 && !reviewError && <p className="text-xs text-slate-500">No reviews yet.</p>}
            <form onSubmit={handleSubmitReview} className="space-y-3 rounded-xl border border-slate-200 p-4">
              <label className="block text-xs font-bold text-slate-700">
                Your rating
                <select value={reviewRating} onChange={event => setReviewRating(event.target.value)} className="ml-3 rounded border border-slate-300 p-1">
                  {[5, 4, 3, 2, 1].map(rating => <option key={rating} value={rating}>{rating} star{rating > 1 ? 's' : ''}</option>)}
                </select>
              </label>
              <textarea value={reviewComment} onChange={event => setReviewComment(event.target.value)} required rows={3} className="w-full rounded-lg border border-slate-300 p-2 text-xs" placeholder="Share your experience" />
              <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700">Submit review</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
