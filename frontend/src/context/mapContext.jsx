import { createContext, useContext, useState } from "react";

const MapContext = createContext();

export const MapProvider = ({ children }) => {
    const [showMapModal, setShowMapModal] = useState(false);
    const [markers, setMarkers] = useState([]);
    const [userLocation,setUserLocation]=useState(null)
    


  return (
    <MapContext.Provider value={{
        showMapModal,
        setShowMapModal,
        markers,
        setMarkers,
        userLocation,
        setUserLocation
    }}>
      {children}
    </MapContext.Provider>
  );
};

export const useMapProvider = () => useContext(MapContext);