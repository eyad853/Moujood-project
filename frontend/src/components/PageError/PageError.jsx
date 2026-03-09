import React from 'react'

const PageError = ({error}) => {
  return (
    <div className='w-full h-full flex flex-col gap-3.5 justify-center items-center text-white bg-red-200'>
        <svg
          width="80"
          height="80"
          viewBox="0 0 20 20"
          fill="none"
        >
        <circle cx="10" cy="10" r="9" stroke="#dc2626" strokeWidth="2" />
        <path
          d="M10 6v4M10 14h.01"
          stroke="#dc2626"
          strokeWidth="2"
          strokeLinecap="round"
        />
        </svg>

        <div className="text-white font-bold">
          {error}
        </div>
    </div>
  )
}

export default PageError