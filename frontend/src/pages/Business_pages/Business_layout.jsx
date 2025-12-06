import React, { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { IoHomeOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { FaPlus } from "react-icons/fa6";
import { TbBorderAll } from "react-icons/tb";
import { IoMdSettings } from 'react-icons/io';
import { useOffer } from '../../context/offerContext';


const Business_layout = () => {
  const [activePage , setActivePage]=useState('dashboard')
  const pages = ['dashboard' , 'offers' , 'profile' , 'settings']
  const {isOfferSheetOpen, setIsOfferSheetOpen, selectedOffer, setSelectedOffer} = useOffer()
  
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
        to={`/Business/dashboard`} 
        className={`w-1/4 h-full flex justify-center items-center`}>
          <div className={`h-full w-16 rounded-full ${activePage==="dashboard"?"bg-[#009842] text-white":null} flex transition-all duration-200 justify-center items-center `}>
            <IoHomeOutline size={25}/>
          </div>
        </Link>

        {/* offers */}
        <Link
        onClick={()=>{
          setActivePage(pages[1])
        }} 
        to={`/Business/offers`} 
        className={`w-1/4 h-full flex justify-center items-center`}>
          <div className={`h-full w-16 rounded-full ${activePage==="offers"?"bg-[#009842] text-white":null} flex transition-all duration-200 justify-center items-center `}>
            <TbBorderAll size={25}/>
          </div>
        </Link>

        {/* add an offer */}
        <div onClick={()=>{
          setIsOfferSheetOpen(true)
          setSelectedOffer(null)
        }} className={`w-1/4 h-full flex justify-center items-center`}><FaPlus size={25}/></div>

        {/* profile */}
        <Link
        onClick={()=>{
          setActivePage(pages[2])
        }} 
        to={`/Business/profile`} 
        className={`w-1/4 h-full flex justify-center items-center`}>
          <div className={`h-full w-16 rounded-full ${activePage==="profile"?"bg-[#009842] text-white":null} flex transition-all duration-200 justify-center items-center `}>
            <CgProfile size={25}/>
          </div>
        </Link>

        <Link
        onClick={()=>{
          setActivePage(pages[3])
        }} 
        to={`/Business/settings`} 
        className={`w-1/4 h-full flex justify-center items-center`}>
          <div className={`h-full w-16 rounded-full ${activePage==="settings"?"bg-[#009842] text-white":null} flex transition-all duration-200 justify-center items-center `}>
            <IoMdSettings size={25}/>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default Business_layout