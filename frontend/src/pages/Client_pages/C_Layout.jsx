import React, { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { IoHomeOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { FaPlus } from "react-icons/fa6";
import { TbBorderAll } from "react-icons/tb";
import { LuScanLine } from "react-icons/lu";
import { IoMdSettings } from "react-icons/io";

const C_Layout = () => {
  const [activePage , setActivePage]=useState('feed')
  const pages = ['feed' , 'categories' , 'profile' , 'settings' , 'scans']
  return (
    <div>
      <Outlet />

      {/* the paages buttons */}
      <div className="fixed z-30 bottom-0 w-full border-t bg-white border-neutral-200 h-16 flex justify-around items-center">
        {/* dashboard */}
        <Link
        onClick={()=>{
          setActivePage(pages[0])
        }} 
        to={`/client/feed`} 
        className={`w-1/4 h-full flex justify-center items-center`}>
          <div className={`h-full w-16 rounded-full ${activePage==="feed"?"bg-[#009842] text-white":null} flex transition-all duration-200 justify-center items-center `}>
            <IoHomeOutline size={25}/>
          </div>
        </Link>

        {/* offers */}
        <Link
        onClick={()=>{
          setActivePage(pages[1])
        }} 
        to={`/client/categories`} 
        className={`w-1/4 h-full flex justify-center items-center`}>
          <div className={`h-full w-16 rounded-full ${activePage==="categories"?"bg-[#009842] text-white":null} flex transition-all duration-200 justify-center items-center `}>
            <TbBorderAll size={25}/>
          </div>
        </Link>

        {/* profile */}
        <Link
        onClick={()=>{
          setActivePage(pages[2])
        }} 
        to={`/client/profile`} 
        className={`w-1/4 h-full flex justify-center items-center`}>
          <div className={`h-full w-16 rounded-full ${activePage==="profile"?"bg-[#009842] text-white":null} flex transition-all duration-200 justify-center items-center `}>
            <CgProfile size={25}/>
          </div>
        </Link>

        <Link
        onClick={()=>{
          setActivePage(pages[3])
        }} 
        to={`/client/settings`} 
        className={`w-1/4 h-full flex justify-center items-center`}>
          <div className={`h-full w-16 rounded-full ${activePage==="settings"?"bg-[#009842] text-white":null} flex transition-all duration-200 justify-center items-center `}>
            <IoMdSettings  size={25}/>
          </div>
        </Link>

        <Link
        onClick={()=>{
          setActivePage(pages[4])
        }} 
        to={`/client/scan`} 
        className={`w-1/4 h-full flex justify-center items-center`}>
          <div className={`h-full w-16 rounded-full ${activePage==="scans"?"bg-[#009842] text-white":null} flex transition-all duration-200 justify-center items-center `}>
            <LuScanLine  size={25}/>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default C_Layout