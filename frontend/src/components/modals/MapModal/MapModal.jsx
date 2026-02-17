import React, { useState, useEffect, useRef } from 'react'
import Modal from 'react-modal'
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Eye, EyeOff, Upload, MapPin, X, User2, Search, ExternalLink } from 'lucide-react';
import { useUser } from '../../../context/userContext';

const MapModal = ({showMapModal , setShowMapModal,userLocation , markers , handleSaveLocations , handleAddMarker,handleRemoveMarker}) => {
  const {user}=useUser()
  const [markerAddresses, setMarkerAddresses] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState({});
  const mapRef = useRef(null);

  const isBusiness = user?.accountType === 'business';
  const isSuperAdmin = user?.accountType === 'superAdmin';
  const canOpenGoogleMaps = !isBusiness && (user || isSuperAdmin);

  const getKey = (lat, lng) =>`${Number(lat).toFixed(6)},${Number(lng).toFixed(6)}`;

  // Function to open Google Maps
  const openInGoogleMaps = (lat, lng) => {
    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(url, '_blank');
  };

  // Reverse geocode function to get address from coordinates
  const getAddressFromCoordinates = async (lat, lng) => {
    const key = getKey(lat, lng);

    // Skip if already fetched
    if (markerAddresses[key]) return;

    // Mark as loading
    setLoadingAddresses(prev => ({ ...prev, [key]: true }));

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'YourAppName/1.0 (your@email.com)'
          }
        }
      );

      if (!response.ok) throw new Error(`HTTP error ${response.status}`);

      const data = await response.json();

      setMarkerAddresses(prev => ({
        ...prev,
        [key]: data.display_name || 'Address not found'
      }));
    } catch (error) {
      console.error('Error fetching address:', error);
      setMarkerAddresses(prev => ({
        ...prev,
        [key]: 'Address not available'
      }));
    } finally {
      setLoadingAddresses(prev => ({ ...prev, [key]: false }));
    }
  };

  // Fetch addresses for all markers when modal opens
  useEffect(() => {
    if (!showMapModal) return;
    if (!markers?.length) return;

    const fetchAddresses = async () => {
      for (const marker of markers) {
        const key = getKey(marker.lat, marker.lng);
        // Only fetch if not already fetched or loading
        if (!markerAddresses[key] && !loadingAddresses[key]) {
          await getAddressFromCoordinates(marker.lat, marker.lng);
          // Nominatim rule: 1 request per second
          await new Promise(res => setTimeout(res, 1100));
        }
      }
    };

    fetchAddresses();
  }, [markers, showMapModal, user]);

  // Search for addresses (for business users)
  const searchAddress = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`,
        {
          headers: {
            'User-Agent': 'YourAppName/1.0 (eyadmosa853@email.com)'
          }
        }
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error searching address:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle search result selection
  const handleSelectSearchResult = (result) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    
    // Add marker at the selected location
    handleAddMarker({ lat, lng });
    
    // Zoom to the location
    if (mapRef.current) {
      mapRef.current.flyTo([lat, lng], 16, {
        duration: 1.5,
        easeLinearity: 0.25
      });
    }
    
    // Clear search
    setSearchQuery('');
    setSearchResults([]);
  };

  // Debounce search
  useEffect(() => {
    if (isBusiness && searchQuery) {
      const timer = setTimeout(() => {
        searchAddress(searchQuery);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, isBusiness]);

  // Component to handle map clicks
  const MapClickHandler = ({ onLocationAdd }) => {
    useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;
        onLocationAdd?.({ lat, lng });
      },
    });
    return null;
  };

  // Component to store map reference
  const MapRefHandler = () => {
    const map = useMap();
    mapRef.current = map;
    return null;
  };

  // Function to zoom to a specific marker
  const handleMarkerClick = (marker, index) => {
    if (mapRef.current && !isBusiness) {
      mapRef.current.flyTo([marker.lat, marker.lng], 16, {
        duration: 1.5,
        easeLinearity: 0.25
      });
    }
  };

  return (
    <Modal
      isOpen={showMapModal}
      onRequestClose={() => setShowMapModal(false)}
      className="outline-none"
      overlayClassName="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-0 sm:p-4"
      shouldCloseOnOverlayClick={true}
      style={{
        content: {
          position: 'relative',
          inset: 'auto'
        }
      }}
    >
      <div className="bg-white overflow-auto hide-scrollbar w-screen h-screen sm:w-full sm:h-auto sm:max-h-[95vh] sm:max-w-4xl sm:rounded-2xl flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-5 border-b border-neutral-400 flex-shrink-0">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900">
            {!user || user?.accountType==='business'?"Select Business Locations":"Business Locations"}
          </h3>
          <button
            onClick={() => setShowMapModal(false)}
            className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="sm:w-6 sm:h-6 text-gray-700" />
          </button>
        </div>

        {/* Search Bar for Business */}
        {(!user || isBusiness) && (
          <div className="px-3 sm:px-5 py-3 border-b flex-shrink-0 relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for an address..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009842] focus:border-transparent text-sm"
              />
            </div>
            
            {/* Search Results Dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute left-3 right-3 sm:left-5 sm:right-5 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-[1000] max-h-60 overflow-y-auto">
                {searchResults.map((result, index) => (
                  <div
                    key={index}
                    onClick={() => handleSelectSearchResult(result)}
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                  >
                    <p className="text-sm font-medium text-gray-900">{result.display_name}</p>
                  </div>
                ))}
              </div>
            )}
            
            {isSearching && (
              <div className="absolute left-3 right-3 sm:left-5 sm:right-5 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center">
                <p className="text-sm text-gray-600">Searching...</p>
              </div>
            )}
          </div>
        )}

        {/* Map */}
        {userLocation && (
          <div className="relative flex-1 sm:flex-none h-[350px] z-0">
            <MapContainer
              center={[userLocation.lat, userLocation.lng]}
              zoom={13}
              className="h-full w-full"
              scrollWheelZoom={true}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                maxZoom={19}
              />

              <MapRefHandler />
              
              {(!user || isBusiness) && (
                <MapClickHandler onLocationAdd={handleAddMarker} />
              )}
              {markers?.map((marker, index) => (
                <Marker
                  key={`${marker.lat},${marker.lng}`}
                  position={[Number(marker?.lat), Number(marker?.lng)]}
                />
              ))}
            </MapContainer>
          </div>
        )}

        {/* Markers List */}
        {markers?.length > 0 && (
          <div className="p-3 sm:p-5 border-t border-neutral-400 max-h-[200px] sm:h-[180px] md:h-[200px] overflow-y-auto bg-gray-50 flex-shrink-0">
            <p className="text-xs sm:text-sm font-bold text-gray-900 mb-2 sm:mb-3">
              Selected Locations ({markers?.length}):
            </p>
            <div className="space-y-2">
              {markers?.map((marker, index) => {
                const key = getKey(marker.lat, marker.lng);
                const address = markerAddresses[key];
                const isLoading = loadingAddresses[key];
                
                return (
                  <div
                    key={index}
                    onClick={() => handleMarkerClick(marker, index)}
                    className={`flex items-center justify-between bg-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-gray-200 shadow-sm ${
                      !isBusiness ? 'cursor-pointer hover:bg-gray-50 hover:border-green-300 transition-all' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin size={16} className="sm:w-[18px] sm:h-[18px] text-green-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-xs sm:text-sm font-medium text-gray-900 block">
                          Location {index + 1}
                        </span>
                        <p className="text-[10px] sm:text-xs text-gray-500 truncate">
                          {isLoading 
                            ? 'Loading address...'
                            : address || `${Number(marker.lat).toFixed(6)}, ${Number(marker.lng).toFixed(6)}`
                          }
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                      {/* Google Maps Button - Show for users and super admins */}
                      {canOpenGoogleMaps && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openInGoogleMaps(marker.lat, marker.lng);
                          }}
                          className="p-1.5 sm:p-2 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Open in Google Maps"
                        >
                          <ExternalLink size={16} className="text-blue-600" />
                        </button>
                      )}
                      
                      {/* Remove Button - Show for business users only */}
                      {(!user || isBusiness) && (
                        <button
                          onClick={(e) => { 
                            e.stopPropagation();
                            handleRemoveMarker(index);
                          }}
                          className="p-1.5 sm:p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove location"
                        >
                          <X size={16} className="text-red-600" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer Buttons */}
        {(!user || isBusiness) && (
          <div className="flex gap-2 sm:gap-3 p-3 sm:p-5 border-t bg-white flex-shrink-0">
            <button
              onClick={() => setShowMapModal(false)}
              className="flex-1 py-2.5 sm:py-3 border-2 border-gray-300 text-gray-700 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveLocations}
              disabled={markers?.length === 0}
              className={`flex-1 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold transition-colors ${
                markers?.length === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-[#009842] text-white hover:bg-[#007a36] shadow-md'
              }`}
            >
              Save Locations ({markers?.length})
            </button>
          </div>
        )}
      </div>
    </Modal>
  )
}

export default MapModal