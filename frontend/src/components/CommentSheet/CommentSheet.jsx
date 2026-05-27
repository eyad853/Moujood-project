import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Loadiing from '../Loadiing/Loadiing'
import { getOfferComments } from '../../api/comments';
import {useError} from '../../context/error'
import PageError from '../PageError/PageError'
import CommentList from '../CommentList/CommentList';
import { useTranslation } from 'react-i18next';



const CommentSheet = ({ isOpen, onClose, offerId , setOffers }) => {
    const [loading , setLoading]=useState(true)
    const [comments, setComments] = useState([]);
    const {setSmallError}=useError()
    const [pageError , setPageError]=useState()
    const {t}=useTranslation('commentsSheet')
  
    

  useEffect(()=>{
    const get = async ()=>{
      try{
        setLoading(true)
        await getOfferComments(offerId , setComments , setPageError , t)
      }catch(err){
        if (err.response?.data?.message) {
            setPageError(t(`errors:${err.response.data.message}`))
        } else if (err.message === "Network Error") {
            setPageError(t("errors:NETWORK_ERROR"))
        } else if (err.message) {
            setPageError(t(`errors:${err.message}`))
        } else {
            setPageError(t("errors:SOMETHING_WENT_WRONG"))
        }
      }finally{
        setLoading(false)
      }
    }

    get()
  },[offerId])

  

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - More transparent */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/5 z-40"
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 h-[85vh] flex flex-col"
          >
            {loading ? (
              <div className="flex-1 flex items-center justify-center pb-[env(safe-area-inset-bottom)]">
                <Loadiing />
              </div>
            ) : pageError ? (
              <div className="flex-1 flex items-center justify-center pb-[env(safe-area-inset-bottom)]">
                <PageError error={pageError} />
              </div>
            ) : (
              <CommentList 
              comments={comments}
              setComments={setComments}
              onClose={onClose}
              setOffers={setOffers}
              offerId={offerId}
              isCommentsSheet={true}
              />
              )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CommentSheet;