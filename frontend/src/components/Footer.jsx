import React from 'react';
import LogoPlaceholder from './LogoPlaceholder';
import { ShieldCheck, Truck, RefreshCw, Headphones, Award } from 'lucide-react';

export default function Footer({ setActivePage }) {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-20">
      {/* Service Highlights Ribbon */}
      <div className="border-b border-slate-800 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-slate-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">100% Genuine</h4>
              <p className="text-slate-400 text-[11px]">Direct brand authorized stock</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Express Shipping</h4>
              <p className="text-slate-400 text-[11px]">Secure padded delivery</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">7 Days Return</h4>
              <p className="text-slate-400 text-[11px]">Hassle-free replacement policy</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Expert Tech Help</h4>
              <p className="text-slate-400 text-[11px]">Gemini AI & live technicians</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-2 md:grid-cols-5 gap-8">
        <div className="col-span-2">
          <div className="bg-white/5 p-2 rounded-xl inline-block mb-3">
            <LogoPlaceholder className="h-8 invert" />
          </div>
          <p className="text-slate-400 text-xs leading-relaxed max-w-sm mb-4">
            Kernel is India's leading PC hardware marketplace, custom rig configurator, and certified refurbishing platform. Buy, sell, upgrade, or repair with complete transparency.
          </p>
          <div className="flex items-center gap-2 text-slate-300 font-semibold text-xs">
            <Award className="w-4 h-4 text-blue-400" />
            <span>Authorized Reseller for AMD, NVIDIA, Corsair & MSI</span>
          </div>
        </div>

        <div>
          <h5 className="font-bold text-white text-sm mb-3">Shop Categories</h5>
          <ul className="space-y-2">
            <li><button onClick={() => setActivePage('catalog')} className="hover:text-blue-400">Processors (CPUs)</button></li>
            <li><button onClick={() => setActivePage('catalog')} className="hover:text-blue-400">Graphics Cards (GPUs)</button></li>
            <li><button onClick={() => setActivePage('catalog')} className="hover:text-blue-400">Motherboards</button></li>
            <li><button onClick={() => setActivePage('catalog')} className="hover:text-blue-400">DDR4 / DDR5 RAM</button></li>
            <li><button onClick={() => setActivePage('catalog')} className="hover:text-blue-400">NVMe M.2 SSDs</button></li>
            <li><button onClick={() => setActivePage('catalog')} className="hover:text-blue-400">Cabinets & PSUs</button></li>
          </ul>
        </div>

        <div>
          <h5 className="font-bold text-white text-sm mb-3">Kernel Services</h5>
          <ul className="space-y-2">
            <li><button onClick={() => setActivePage('builder')} className="hover:text-blue-400 text-blue-400 font-bold">Custom PC Builder</button></li>
            <li><button onClick={() => setActivePage('sell')} className="hover:text-blue-400">Sell Old Hardware</button></li>
            <li><button onClick={() => setActivePage('sell')} className="hover:text-blue-400">Book PC Repair</button></li>
            <li><button onClick={() => setActivePage('catalog')} className="hover:text-blue-400">Certified Refurbished</button></li>
            <li><button onClick={() => setActivePage('dashboard')} className="hover:text-blue-400">B2B Wholesale Agent</button></li>
          </ul>
        </div>

        <div>
          <h5 className="font-bold text-white text-sm mb-3">Customer Support</h5>
          <ul className="space-y-2">
            <li><button onClick={() => setActivePage('orders')} className="hover:text-blue-400">Track My Order</button></li>
            <li><button onClick={() => setActivePage('profile')} className="hover:text-blue-400">Account & Addresses</button></li>
            <li><span className="text-slate-400">Email: support@kernel.in</span></li>
            <li><span className="text-slate-400">Helpline: 1800-419-KERNEL</span></li>
            <li><span className="text-slate-400">Mon - Sat: 10 AM - 8 PM</span></li>
          </ul>
        </div>
      </div>

      {/* Bottom Copyright & Payment Methods */}
      <div className="bg-slate-950 py-4 border-t border-slate-800/80 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} Kernel Tech Marketplace Pvt. Ltd. All rights reserved.
          </div>
          <div className="flex items-center gap-3">
            <span className="text-slate-400">Accepted Payments:</span>
            <span className="px-2 py-0.5 bg-slate-900 border border-slate-700 rounded text-slate-300 font-bold">UPI</span>
            <span className="px-2 py-0.5 bg-slate-900 border border-slate-700 rounded text-slate-300 font-bold">GPay / PhonePe</span>
            <span className="px-2 py-0.5 bg-slate-900 border border-slate-700 rounded text-slate-300 font-bold">Visa / Master</span>
            <span className="px-2 py-0.5 bg-slate-900 border border-slate-700 rounded text-slate-300 font-bold">Cash on Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
