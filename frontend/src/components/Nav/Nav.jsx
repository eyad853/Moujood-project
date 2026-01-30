import React from 'react';
import { Menu, Search, ChevronDown } from 'lucide-react';
import { useUser } from '../../context/userContext';

const SA_Navbar = ({ onMenuToggle }) => {
  const {user} = useUser()

  const getInitials = (name) => {
  if (!name) return '';
  const words = name.trim().split(' ');

  if (words.length === 1) {
    return words[0][0].toUpperCase(); // First letter if single word
  }

  // Take first letter of first and second word
  return (words[0][0] + words[1][0]).toUpperCase();
};
  return (
    <header className="bg-white border-b z-10 border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0">
      {/* Left Section - Menu Toggle & Search */}
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu size={24} className="text-gray-600" />
        </button>

        <div className="text-4xl font-bold">Hello
          <span className='ml-2 text-[#009842]'>
            {user?.name}
          </span>
        </div>
      </div>

      {/* Right Section - User Profile */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors">
          <div className="w-10 h-10 flex justify-center items-center text-white rounded-full bg-[#009842]">
            {getInitials(user?.name)}
          </div>
          <div className="hidden md:block text-right">
            <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
          <ChevronDown size={16} className="text-gray-600" />
        </div>
      </div>
    </header>
  );
};

export default SA_Navbar;