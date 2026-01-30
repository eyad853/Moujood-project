import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Grid3x3, Bell, FileText, Building2 ,Megaphone} from 'lucide-react';
import { RiLogoutBoxLine } from "react-icons/ri";
import { logout } from '../../api/auth';
import { useUser } from '../../context/userContext';

const SA_Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate()
  const [error , setError]=useState('')
  const [loading , setLoading]=useState(false)
  const {setUser}=useUser()

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/super_admin/dashboard',
      icon: LayoutDashboard
    },
    {
      name: 'Users',
      path: '/super_admin/users',
      icon: Users
    },
    {
      name: 'Categories',
      path: '/super_admin/categories',
      icon: Grid3x3
    },
    {
      name: 'Notifications',
      path: '/super_admin/notifications',
      icon: Bell
    },
    {
      name: 'Offers',
      path: '/super_admin/offers',
      icon: FileText
    },
    {
      name: 'Businesses',
      path: '/super_admin/businesses',
      icon: Building2
    },
    {
      name: 'Ads',
      path: '/super_admin/ads',
      icon: Megaphone
    },
    {
      name: 'LogOut',
      icon: RiLogoutBoxLine
    }
  ];

  return (
    <aside className="fixed w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <img src="/logo.svg" className="h-10 object-contain" />
      </div>

          {/* Menu Items */}
          <nav className="flex-1 px-4 py-6 space-y-2 flex flex-col">
            <div className="flex-1 space-y-2">
              {menuItems.slice(0, -1).map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-[#009842] text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </div>
            
            {/* Logout Button - at bottom */}
            <button
              onClick={() => {
                logout(setError , navigate , setUser , setLoading)
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-400 text-red-600 hover:bg-red-500 cursor-pointer hover:text-white mt-auto"
            >
              <RiLogoutBoxLine size={20} />
              <span className="font-medium">LogOut</span>
            </button>
          </nav>
    </aside>
  );
};

export default SA_Sidebar;