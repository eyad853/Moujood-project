import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Trash2, Edit2, Check } from 'lucide-react';
import Loadiing from '../Loadiing/Loadiing'
import { getOfferComments , createComment , updateComment , deleteComment } from '../../api/comments';
import { useUser } from '../../context/userContext';


const CommentSheet = ({ isOpen, onClose, offerId , setOffers }) => {
    const [content, setContent] = useState('');
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingText, setEditingText] = useState('');
    const [error ,setError]=useState('')
    const [loading , setLoading]=useState(false)
    const [comments, setComments] = useState([]);
    const {user} = useUser() 

  useEffect(()=>{
    const get = async ()=>{
      try{
        setLoading(true)
        await getOfferComments(offerId , setComments , setError)
      }catch(error){
        setError(error)
      }finally{
        setLoading(false)
      }
    }

    get()
  },[])

  const handleEditComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditingText(comment.content);
  };

  const handleSaveEdit = () => {
        updateComment(editingCommentId , editingText , comments , setComments , setError)
        setEditingCommentId(null);
        setEditingText('');
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingText('');
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now - date;
    const diffInMins = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    if (diffInMins < 1) return 'Just now';
    if (diffInMins < 60) return `${diffInMins}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

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
            className="fixed inset-0 bg-black/5  z-40"
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 h-[85vh] flex flex-col"
          >
            {loading?(
              <Loadiing />
            ):(
              <>
            {/* Header */}
            <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-5 py-4 flex items-center justify-between rounded-t-3xl">
              <h2 className="text-xl font-semibold text-gray-900">
                Comments ({comments.length})
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} className="text-gray-700" />
              </button>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {comments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 font-medium">No comments yet</p>
                  <p className="text-sm text-gray-400 mt-1">Be the first to comment!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      {/* Avatar */}
                      <div>
                        <div className="w-10 h-10 bg-gradient-to-br from-[#009842] to-[#007a36] rounded-full flex items-center justify-center text-white font-semibold">
                          {comment?.userName?.charAt(0)}
                        </div>
                      </div>

                      {/* Comment Content */}
                      <div className="flex-1 min-w-0">
                        {editingCommentId === comment.id ? (
                          // Edit Mode
                          <div className="space-y-2">
                            <textarea
                              value={editingText}
                              onChange={(e) => setEditingText(e.target.value)}
                              className="w-full px-4 py-3 bg-white border-2 border-[#009842] rounded-2xl outline-none resize-none text-sm"
                              rows="2"
                              autoFocus
                            />
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={handleCancelEdit}
                                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={handleSaveEdit}
                                className="px-4 py-2 text-sm font-medium text-white bg-[#009842] hover:bg-[#007a36] rounded-lg transition-colors flex items-center gap-1"
                              >
                                <Check size={16} />
                                Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          // View Mode
                          <>
                            <div className="bg-gray-50 rounded-2xl rounded-tl-none px-4 py-3">
                              <div className="flex items-center justify-between mb-1">
                                <p className="font-semibold text-gray-900 text-sm">
                                  {comment.userName}
                                </p>
                                {comment.user_id === user.id && (
                                  <div className="flex gap-1">
                                    <button
                                      onClick={() => handleEditComment(comment)}
                                      className="p-1 hover:bg-blue-50 rounded transition-colors"
                                      title="Edit comment"
                                    >
                                      <Edit2 size={16} className="text-blue-600" />
                                    </button>
                                    <button
                                      onClick={() => {
                                        deleteComment(comment.id , comments , setComments , setError)
                                        setOffers(prev => prev.map(o => 
                                          o.offer_id === offerId ? { ...o, comments_count: Number(o.comments_count) - 1 } : o
                                        ));
                                      }}
                                      className="p-1 hover:bg-red-50 rounded transition-colors"
                                      title="Delete comment"
                                    >
                                      <Trash2 size={16} className="text-red-600" />
                                    </button>
                                  </div>
                                )}
                              </div>
                              <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
                                {comment?.content}
                              </p>
                            </div>
                            <p className="text-xs text-gray-400 mt-1 ml-1">
                              {formatTimestamp(comment?.created_at)}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Fixed Input Section */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-5 py-4">
              <div className="flex gap-3 items-end">
                {/* User Avatar */}
                <div className="flex-shrink-0 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#009842] to-[#007a36] rounded-full flex items-center justify-center text-white font-semibold">
                    Y
                  </div>
                </div>

                {/* Input and Send Button */}
                <div className="flex-1 flex gap-2">
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        createComment(offerId , content , comments , setComments , setError , user)
                        setOffers(prev => prev.map(o => 
                          o.offer_id === offerId ? { ...o, comments_count: Number(o.comments_count) + 1 } : o
                        ));
                        setContent('')
                      }
                    }}
                    placeholder="Write a comment..."
                    rows="1"
                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-[#009842] focus:ring-1 focus:ring-[#009842] resize-none text-sm"
                    style={{ minHeight: '44px', maxHeight: '120px' }}
                  />
                  <button
                    onClick={()=>{
                        createComment(offerId , content , comments , setComments , setError , user)
                        setOffers(prev => prev.map(o => 
                          o.offer_id === offerId ? { ...o, comments_count: Number(o.comments_count) + 1 } : o
                        ));
                        setContent('')
                    }}
                    disabled={!content.trim()}
                    className="flex-shrink-0 w-11 h-11 bg-[#009842] text-white rounded-full flex items-center justify-center hover:bg-[#007a36] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </div>
          </>)}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CommentSheet;