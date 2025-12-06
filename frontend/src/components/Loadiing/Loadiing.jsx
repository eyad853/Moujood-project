import React from 'react'

const Loading = () => {
  return (
    <div className="w-full h-full bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="relative w-16 h-16">
          {/* Outer ring */}
          <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
          {/* Spinning ring */}
          <div className="absolute inset-0 border-4 border-transparent border-t-[#009842] border-r-[#009842] rounded-full animate-spin"></div>
          {/* Inner dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 bg-[#009842] rounded-full animate-pulse"></div>
          </div>
        </div>
        
        {/* Loading text */}
        <div className="flex items-center gap-1">
          <span className="text-lg font-semibold text-gray-700">Loading</span>
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 bg-[#009842] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
            <span className="w-1.5 h-1.5 bg-[#009842] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
            <span className="w-1.5 h-1.5 bg-[#009842] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Loading