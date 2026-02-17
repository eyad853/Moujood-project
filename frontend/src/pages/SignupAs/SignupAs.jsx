import React from 'react'
import {Link} from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const SignupAs = () => {
    const {t} = useTranslation()
  return (
    <div className="flex flex-col py-15 h-screen justify-between items-center">
        {/* the logo */}
        <div className="w-full px-24">
            <img src="/logo.svg" className='w-full h-full object-contain'/>
        </div>

        {/* the buttons */}
        <div className="flex flex-col gap-3.5 w-full items-center px-5">
            <h1 className='text-2xl font-bold text-green-900'>{t("title")}</h1>
            <Link 
            to={'/Business_sign_up'}
            className="w-full rounded-md h-10 flex font-bold justify-center items-center transform hover:scale-105 transition-all duration-200 text-white bg-green-700">
                {t("businessBtn")}
            </Link>
            <Link 
            to={'/client_sign_up'}
            className="w-full rounded-md h-10 flex font-bold justify-center items-center transform hover:scale-105 transition-all duration-200 text-white bg-green-700">
                {t("userBtn")}
            </Link>
        </div>
        
        {/* the hashtag */}
        <div className="font-extrabold text-green-900">
            #خليك_دايما_موجود
        </div>
    </div>
  )
}

export default SignupAs