import React, { useEffect, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { IoHomeOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { TbBorderAll } from "react-icons/tb";
import { IoMdSettings } from 'react-icons/io';
import { Bell } from 'lucide-react';
import socket from '../../Socket';


const Business_layout = () => {
  const location = useLocation();
  const [notificationsCount , setNotificationsCount] = useState(0)
  

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
  
  return (
    <div>
      <Outlet />

      {/* the paages buttons */}
      <div className="fixed z-30 bottom-0 w-full border-t bg-white border-neutral-200 h-16 flex justify-around items-center">
        {/* dashboard */}
        <Link
        to={`/business/dashboard`} 
        className={`w-1/4 h-full flex justify-center items-center`}>
          <div className={`h-full w-16 rounded-full ${location.pathname==="/business/dashboard"?"bg-[#009842] text-white":null} flex transition-all duration-200 justify-center items-center `}>
            <IoHomeOutline size={25}/>
          </div>
        </Link>

        {/* offers */}
        <Link
        to={`/business/offers`} 
        className={`w-1/4 h-full flex justify-center items-center`}>
          <div className={`h-full w-16 rounded-full ${location.pathname==="/business/offers"?"bg-[#009842] text-white":null} flex transition-all duration-200 justify-center items-center `}>
            <TbBorderAll size={25}/>
          </div>
        </Link>

        {/* profile */}
        <Link
        to={`/business/profile`} 
        className={`w-1/4 h-full flex justify-center items-center`}>
          <div className={`h-full w-16 rounded-full ${location.pathname==="/business/profile"?"bg-[#009842] text-white":null} flex transition-all duration-200 justify-center items-center `}>
            <CgProfile size={25}/>
          </div>
        </Link>

        <Link
        to={`/business/settings`} 
        className={`w-1/4 h-full flex justify-center items-center`}>
          <div className={`h-full w-16 rounded-full ${location.pathname==="/business/settings"?"bg-[#009842] text-white":null} flex transition-all duration-200 justify-center items-center `}>
            <IoMdSettings size={25}/>
          </div>
        </Link>

        <Link
        to={`/business/notifications`} 
        onClick={()=>{
          setNotificationsCount(0)
        }}
        className={`w-1/4 h-full flex justify-center items-center`}>
          <div className={`h-full w-16 rounded-full ${location.pathname==="/business/notifications"?"bg-[#009842] text-white":null} flex transition-all duration-200 justify-center items-center `}>
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

export default Business_layout