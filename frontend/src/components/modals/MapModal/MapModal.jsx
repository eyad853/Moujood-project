import React from 'react'
import Modal from 'react-modal'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Eye, EyeOff, Upload, MapPin, X } from 'lucide-react';

const MapModal = ({showMapModal , setShowMapModal,userLocation,setUserLocation , markers,setMarkers , handleSaveLocations , handleAddMarker,handleRemoveMarker}) => {

    // Component to handle map clicks
const MapClickHandler = ({ onLocationAdd }) => {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onLocationAdd({ lat, lng });
    },
  });
  return null;
};
  return (
    <Modal
  isOpen={showMapModal}
  onRequestClose={() => setShowMapModal(false)}
  className="outline-none"
  overlayClassName="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4"
  shouldCloseOnOverlayClick={true}
>
  <div className="bg-white overflow-auto rounded-2xl w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl">
    {/* Header */}
    <div className="flex items-center justify-between p-5 border-b flex-shrink-0">
      <h3 className="text-xl font-bold text-gray-900">Select Business Locations</h3>
      <button
        onClick={() => setShowMapModal(false)}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <X size={24} className="text-gray-700" />
      </button>
    </div>

    {/* Info Banner */}
    <div className="px-5 py-4 bg-green-50 border-b flex-shrink-0">
      <p className="text-sm text-gray-800 font-medium">
        📍 Click anywhere on the map to add business location markers
      </p>
      <p className="text-xs text-gray-600 mt-1">
        You can add multiple locations and remove them from the list below
      </p>
    </div>

    {/* Map */}
    {userLocation && (
      <div className="relative h-[450px] flex-shrink-0">
        <MapContainer
          center={[userLocation.lat, userLocation.lng]}
          zoom={13}
          className="h-full w-full"
          scrollWheelZoom={true}
        >
          <TileLayer
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            maxZoom={19}
          />
          <MapClickHandler onLocationAdd={handleAddMarker} />
          {markers.map((marker, index) => (
            <Marker
              key={index}
              position={[marker.lat, marker.lng]}
            />
          ))}
        </MapContainer>
      </div>
    )}

    {/* Markers List */}
    {markers.length > 0 && (
      <div className="p-5 border-t h-[180px] overflow-y-auto bg-gray-50 flex-shrink-0">
        <p className="text-sm font-bold text-gray-900 mb-3">
          Selected Locations ({markers.length}):
        </p>
        <div className="space-y-2">
          {markers.map((marker, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-gray-200 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <MapPin size={18} className="text-green-600" />
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-900">
                    Location {index + 1}
                  </span>
                  <p className="text-xs text-gray-500">
                    {marker.lat.toFixed(6)}, {marker.lng.toFixed(6)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleRemoveMarker(index)}
                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
              >
                <X size={18} className="text-red-600" />
              </button>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Footer Buttons */}
    <div className="flex gap-3 p-5 border-t bg-white flex-shrink-0">
      <button
        onClick={() => setShowMapModal(false)}
        className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
      >
        Cancel
      </button>
      <button
        onClick={handleSaveLocations}
        disabled={markers.length === 0}
        className={`flex-1 py-3 rounded-xl font-semibold transition-colors ${
          markers.length === 0
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-[#009842] text-white hover:bg-[#007a36] shadow-md'
        }`}
      >
        Save Locations ({markers.length})
      </button>
    </div>
  </div>
</Modal>
  )
}

export default MapModal