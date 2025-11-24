import React from 'react';
import { Menu, Search, ChevronDown } from 'lucide-react';

const SA_Navbar = ({ onMenuToggle }) => {
  return (
    <header className="bg-white border-b z-50 border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0">
      {/* Left Section - Menu Toggle & Search */}
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu size={24} className="text-gray-600" />
        </button>

        <div className="relative max-w-md w-full">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#009842] focus:ring-1 focus:ring-[#009842] transition-colors"
          />
        </div>
      </div>

      {/* Right Section - User Profile */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors">
          <img
            src="https://ui-avatars.com/api/?name=Moni+Roy&background=009842&color=fff"
            alt="Admin Avatar"
            className="w-10 h-10 rounded-full"
          />
          <div className="hidden md:block text-right">
            <p className="text-sm font-semibold text-gray-900">ُEyad mosa</p>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
          <ChevronDown size={16} className="text-gray-600" />
        </div>
      </div>
    </header>
  );
};

export default SA_Navbar;