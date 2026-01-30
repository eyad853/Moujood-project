import React, { useEffect, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { IoHomeOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { FaPlus } from "react-icons/fa6";
import { TbBorderAll } from "react-icons/tb";
import { LuScanLine } from "react-icons/lu";
import { IoMdSettings } from "react-icons/io";
import { Bell } from 'lucide-react';
import { useUser } from '../../context/userContext';
import { fetchNotificationCount } from '../../api/notifications';
import socket from '../../Socket';

const C_Layout = () => {
  const {user}=useUser()
  const [error , setError]=useState([])
  const [notificationsCount , setNotificationsCount] = useState(0)
  const location = useLocation();
  const isActive =
  location.pathname === "/client/categories" ||
  location.pathname === "/client/all_categories" ||
  location.pathname.startsWith("/client/sub_categories/") ||
  location.pathname.startsWith("/client/businesses_of_category/") ||
  location.pathname.startsWith("/client/business_page/");


  useEffect(() => {
    const onNotificationCreated = () => {
          setNotificationsCount(prev=>prev+1)
        };
      
        // 🗑️ Notification deleted
        const onNotificationDeleted = () => {
          setNotificationsCount(prev=>prev-1)
        };

    socket.on("notification_created", onNotificationCreated);
    socket.on("notification_deleted", onNotificationDeleted);
  
    // 🔹 Cleanup
    return () => {
      socket.off("notification_created", onNotificationCreated);
      socket.off("notification_deleted", onNotificationDeleted);
    };
  }, [socket]);

  useEffect(()=>{
      if (!user) return;
      const get = async ()=>{
        try{
          await fetchNotificationCount(user?.accountType , setNotificationsCount , setError)
        }catch(error){
          setError(error)
        }
      }
  
      get()
    },[user])
  return (
    <div>
      <Outlet />

      {/* the paages buttons */}
      <div className="fixed z-30 bottom-0 w-full border-t bg-white border-neutral-200 h-16 flex justify-around items-center">
        {/* dashboard */}
        <Link
        to={`/client/feed`} 
        className={`w-1/4 h-full flex justify-center items-center`}>
          <div className={`h-full w-16 rounded-full ${location.pathname==="/client/feed"?"bg-[#009842] text-white":null} flex transition-all duration-200 justify-center items-center `}>
            <IoHomeOutline size={25}/>
          </div>
        </Link>

        {/* offers */}
        <Link
        to={`/client/categories`} 
        className={`w-1/4 h-full flex justify-center items-center`}>
          <div className={`h-full w-16 rounded-full ${  isActive ? "bg-[#009842] text-white" : ""} flex transition-all duration-200 justify-center items-center`}>
            <TbBorderAll size={25}/>
          </div>
        </Link>

        {/* profile */}
        <Link
        to={`/client/profile`} 
        className={`w-1/4 h-full flex justify-center items-center`}>
          <div className={`h-full w-16 rounded-full ${location.pathname==="/client/profile"?"bg-[#009842] text-white":null} flex transition-all duration-200 justify-center items-center `}>
            <CgProfile size={25}/>
          </div>
        </Link>

        <Link
        to={`/client/settings`} 
        className={`w-1/4 h-full flex justify-center items-center`}>
          <div className={`h-full w-16 rounded-full ${location.pathname==="/client/settings"?"bg-[#009842] text-white":null} flex transition-all duration-200 justify-center items-center `}>
            <IoMdSettings  size={25}/>
          </div>
        </Link>

        <Link
        to={`/client/notifications`} 
        className={`w-1/4 h-full flex justify-center items-center`}
        onClick={()=>{
          setNotificationsCount(0)
        }}
        >
          <div className={`h-full w-16 rounded-full ${location.pathname==="/client/notifications"?"bg-[#009842] text-white":null} flex transition-all duration-200 justify-center items-center `}>
          <div className="relative">
            <Bell  size={25}/>
            {notificationsCount>0&&
            (<span className={`absolute -top-1.5 -right-1.5 w-5 h-5 
            ${location.pathname==="/client/notifications"?'bg-white text-[#009842]':"bg-[#009842] text-white"} text-xs rounded-full flex items-center justify-center`}>
              {notificationsCount}
            </span>)}
          </div>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default C_Layout