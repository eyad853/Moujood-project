import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import {createComment , updateComment , deleteComment } from '../../api/comments'
import { useUser } from '../../context/userContext';
import { FaUser } from 'react-icons/fa6';
import { X, Send, Trash2, Edit2, Check } from 'lucide-react';
import { useError } from '../../context/error';



const CommentList = ({comments , setComments , onClose , setOffers , offerId , isCommentsSheet}) => {
    const {t , i18n}=useTranslation('commentsSheet')
    const isRTL = i18n.language==='ar'
    const {user} = useUser() 
    const [content, setContent] = useState('');
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingText, setEditingText] = useState('');

    const [replyingTo, setReplyingTo] = useState(null); 
    const [openReplies, setOpenReplies] = useState(new Set());
    const [activeReplyInputs, setActiveReplyInputs] = useState(new Set());
    const [replyTexts, setReplyTexts] = useState({});
    const {setSmallError}=useError()
    
    
    const getReplies = (parentId) => comments.filter(c => c.parent_id === parentId);
    const getTopLevel = () => comments.filter(c => !c.parent_id);

    const toggleReplies = (commentId) => {
      setOpenReplies(prev => {
        const next = new Set(prev);
        next.has(commentId) ? next.delete(commentId) : next.add(commentId);
        return next;
      });
    };

    const openReplyInput = (commentId) => {
      setActiveReplyInputs(prev => new Set([...prev, commentId]));
      setOpenReplies(prev => new Set([...prev, commentId]));
    };

    const closeReplyInput = (commentId) => {
      setActiveReplyInputs(prev => { const n = new Set(prev); n.delete(commentId); return n; });
      setReplyTexts(prev => ({ ...prev, [commentId]: '' }));
    };

    const handleEditComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditingText(comment.content);
  };

  const handleSaveEdit = () => {
        updateComment(editingCommentId , editingText , comments , setComments , setSmallError , t)
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
    <>
            {/* Header */}
            <div className={`sticky top-0 ${isCommentsSheet?"z-20":"z-0"} bg-white border-b border-gray-200 px-5 py-4 flex items-center justify-between rounded-t-3xl`}>
              <h2 className="text-xl font-semibold text-gray-900">
                {t('title')} ({comments.length})
              </h2>
              {isCommentsSheet&&(
                <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} className="text-gray-700" />
              </button>
            )}
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
                  <p className="text-gray-500 font-medium">{t('noComments')}</p>
                  <p className="text-sm text-gray-400 mt-1">{t('beTheFirstComment')}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {getTopLevel().map((comment) => (
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
                                        deleteComment(comment.id , comments , setComments , setOffers , offerId , setSmallError , t)
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

                            {/* Reply button + replies count toggle */}
                            <div className="flex items-center gap-3 mt-1 ml-1">
                              <button
                                onClick={() => openReplyInput(comment.id)}
                                className="text-xs text-[#009842] font-medium hover:underline"
                              >
                                {t('reply')}
                              </button>
                              {getReplies(comment.id).length > 0 && (
                                <button
                                  onClick={() => toggleReplies(comment.id)}
                                  className="text-xs text-gray-400 hover:underline"
                                >
                                  {openReplies.has(comment.id)
                                    ? t('hide_replies')
                                    : `${getReplies(comment.id).length} ${t('replies')}`}
                                </button>
                              )}
                            </div>
                            
                            {/* Nested replies */}
                            {openReplies.has(comment.id) && (
                              <div className="mt-3 pl-5 border-l-2 border-gray-100 flex flex-col gap-3">
                                {getReplies(comment.id).map(reply => (
                                  <div key={reply.id} className="flex gap-2">
                                    <div className="w-8 h-8 bg-gradient-to-br from-[#009842] to-[#007a36] rounded-full flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
                                      {reply.userName?.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="bg-gray-50 rounded-2xl rounded-tl-none px-3 py-2">
                                        <div className="flex items-center justify-between mb-1">
                                          <p className="font-semibold text-gray-900 text-xs">{reply.userName}</p>
                                          {reply.user_id === user.id && (
                                            <div className="flex gap-1">
                                              <button onClick={() => handleEditComment(reply)} className="p-1 hover:bg-blue-50 rounded">
                                                <Edit2 size={13} className="text-blue-600" />
                                              </button>
                                              <button onClick={() => deleteComment(reply.id, comments, setComments , setOffers , offerId, setSmallError, t)} className="p-1 hover:bg-red-50 rounded">
                                                <Trash2 size={13} className="text-red-600" />
                                              </button>
                                            </div>
                                          )}
                                        </div>
                                        <p className="text-gray-700 text-xs leading-relaxed whitespace-pre-wrap">{reply.content}</p>
                                      </div>
                                      <p className="text-xs text-gray-400 mt-1 ml-1">{formatTimestamp(reply.created_at)}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Inline reply input */}
                            {activeReplyInputs.has(comment.id) && (
                              <div className="mt-2 pl-5 flex gap-2 items-start">
                                <div className="w-8 h-8 border border-neutral-300 rounded-full flex justify-center items-end overflow-hidden flex-shrink-0">
                                  {user?.avatar
                                    ? <img src={user.avatar} className="w-8 h-8 rounded-full object-cover" />
                                    : <FaUser className="text-[#009842]" size={26} />}
                                </div>
                                <div className="flex-1 flex gap-2 items-center">
                                  <textarea
                                    value={replyTexts[comment.id] || ''}
                                    onChange={(e) => setReplyTexts(prev => ({ ...prev, [comment.id]: e.target.value }))}
                                    placeholder={t('reply_placeholder')}
                                    rows="1"
                                    dir={isRTL ? 'rtl' : 'ltr'}
                                    autoFocus
                                    className="flex-1 px-3 py-2 bg-gray-50 border-2 border-[#009842] rounded-2xl outline-none resize-none text-xs"
                                    style={{ minHeight: '36px', maxHeight: '80px' }}
                                  />
                                  <button
                                    onClick={() => {
                                      const text = replyTexts[comment.id];
                                      if (!text?.trim()) return;
                                      createComment(offerId, text, comment.id, comments, setComments, setSmallError, user, t);
                                      setOffers(prev => prev.map(o =>
                                        o.offer_id === offerId ? { ...o, comments_count: Number(o.comments_count) + 1 } : o
                                      ));
                                      closeReplyInput(comment.id);
                                      setOpenReplies(prev => new Set([...prev, comment.id]));
                                    }}
                                    disabled={!replyTexts[comment.id]?.trim()}
                                    className="w-9 h-9 bg-[#009842] text-white rounded-full flex items-center justify-center hover:bg-[#007a36] disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    <Send size={16} />
                                  </button>
                                </div>
                                <button onClick={() => closeReplyInput(comment.id)} className="text-xs text-gray-400 hover:text-gray-600 mt-2">
                                  {t('cancel')}
                                </button>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Fixed Input Section */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-5 py-4 pb-[calc(env(safe-area-inset-bottom)+12px)]">
              <div className="flex gap-3  items-center">
                {/* User Avatar */}
                <div className="flex-shrink-0">
                  {user?.avatar?(
                    <img
                    src={user?.avatar}
                    className="w-11 h-11 rounded-full object-cover"
                  />):(
                    <div className="w-11 h-11 border border-neutral-300  overflow-hidden rounded-full flex justify-center items-end">
                        <FaUser className='text-[#009842]' size={35}/>
                    </div>
                  )}
                </div>

                {/* Input and Send Button */}
                <div className="flex-1 flex gap-2">
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={t("placeholder")}
                    rows="1"
                    dir={isRTL?"rtl":"ltr"}
                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-[#009842] focus:ring-1 focus:ring-[#009842] resize-none text-sm"
                    style={{ minHeight: '44px', maxHeight: '120px' }}
                  />
                  <button
                    onClick={()=>{
                        createComment(offerId , content , null , comments , setComments , setSmallError , user , t)
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
          </>
  )
}

export default CommentList