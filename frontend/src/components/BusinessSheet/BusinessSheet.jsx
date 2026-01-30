import { useState } from "react";
import C_Business_Page from "../../pages/Client_pages/C_Business_Page/C_Business_Page";
import Loadiing from '../../components/Loadiing/Loadiing'
import { motion, AnimatePresence } from 'framer-motion';


const BusinessSheet = ({ isOpen, onClose, businessId }) => {
  const [loading, setLoading] = useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 z-40"
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 z-50 bg-white rounded-t-3xl h-[90vh] overflow-y-auto hide-scrollbar w-full left-0 right-0 md:w-[390px] md:right-30 md:left-auto"
          >
            {loading?(
              <Loadiing />
            ):
            (<>
            <C_Business_Page businessId={businessId}/>
            </>)}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BusinessSheet