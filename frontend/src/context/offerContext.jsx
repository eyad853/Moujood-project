import { createContext, useContext, useState } from "react";

const OfferContext = createContext();

export const OfferProvider = ({ children }) => {
  const [isOfferSheetOpen, setIsOfferSheetOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);

  return (
    <OfferContext.Provider value={{
      isOfferSheetOpen,
      setIsOfferSheetOpen,
      selectedOffer,
      setSelectedOffer
    }}>
      {children}
    </OfferContext.Provider>
  );
};

export const useOffer = () => useContext(OfferContext);