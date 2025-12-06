import React from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BarcodeScanner,
  BarcodeFormat,
  LensFacing,
} from '@capacitor-mlkit/barcode-scanning';
import { useEffect } from 'react';

const startScan = async () => {
  const listener = await BarcodeScanner.addListener(
    'barcodeScanned',
    async result => {
      if (result.barcode.displayValue.startsWith("http://192.168.1.5:5173/")) {
        await stopScan();
        window.location.href = result.barcode.displayValue;
      }
    },
  );

  await BarcodeScanner.startScan();
};

const stopScan = async () => {
  await BarcodeScanner.removeAllListeners();
  await BarcodeScanner.stopScan();
};

const C_Camera = () => {
  const navigate = useNavigate();
  useEffect(() => {
    startScan();
  })
  return (
    <div className="fixed inset-0  flex flex-col">
      {/* Camera View */}
      <div className="flex-1 relative">
        {/* Camera placeholder - Replace with actual camera stream */}
        <div className="w-full h-full  flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 text-lg font-semibold">Camera View</p>
            <p className="text-gray-600 text-sm mt-2">Position QR code in the frame</p>
          </div>
        </div>

        {/* Close Button */}
        <div 
        onClick={() => navigate(-1)}
        className="absolute z-10 top-5 left-5">
          <button
            className="w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
          >
            <X size={24} className="text-white" />
          </button>
        </div>

        {/* Scanning Frame */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-72 h-72">
            {/* Corner borders */}
            <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-[#009842] rounded-tl-3xl"></div>
            <div className="absolute top-0 right-0 w-20 h-20 border-t-4 border-r-4 border-[#009842] rounded-tr-3xl"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 border-b-4 border-l-4 border-[#009842] rounded-bl-3xl"></div>
            <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-[#009842] rounded-br-3xl"></div>
            
            {/* Scanning line animation with framer-motion */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                className="w-full h-0.5 bg-[#009842] shadow-[0_0_10px_#009842]"
                animate={{
                  y: [0, 288, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="absolute bottom-20 left-0 right-0 px-8">
          <div className="bg-black/60 backdrop-blur-md rounded-2xl px-6 py-4 text-center">
            <p className="text-white font-semibold text-lg mb-1">Scan QR Code</p>
            <p className="text-gray-300 text-sm">Align the QR code within the frame to scan</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default C_Camera;