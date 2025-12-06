import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllCategories } from '../../../api/categories';
import { addUserCategory , updateUserCategories , getUserCategories } from '../../../api/lovedTopics';

const C_Topics = () => {
    const [selectedTopics, setSelectedTopics] = useState([]);
    const [categories , setCategoies]=useState([])
    const [error , setError]=useState(false)
    const [loading , setLoading]=useState(false)
    
    useEffect(()=>{
        const getCategoreies = async()=>{
            try{
                setLoading(true)
                await getAllCategories(setError , setCategoies)
            }catch(error){
                if (err.response?.data?.message) {
                    setError(err.response.data.message)
                } else if (err.message) {
                    setError(err.message)
                } else {
                    setError('Something went wrong')
                }
            }finally{
                setLoading(false)
            }
        }

        getCategoreies()
    },[])

  const toggleTopic = (topicId) => {
    if (selectedTopics.includes(topicId)) {
      setSelectedTopics(selectedTopics.filter(id => id !== topicId));
    } else {
      setSelectedTopics([...selectedTopics, topicId]);
    }
  };

  const handleContinue = () => {
    // Handle backend request here
    console.log('Selected topics:', selectedTopics);
  };

  return (
    <div className="min-h-screen bg-white pb-8">
      {/* Status Bar Space */}
      <div className="h-11"></div>

      {/* Header */}
      <div className="px-5 pt-8 pb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Select topics you'll love to see
        </h1>
        <p className="text-gray-500 text-sm leading-relaxed">
          Choose 4 or more topics that interests you so we can tailor your connects to match it
        </p>
      </div>

      {/* Topics Grid */}
      <div className="px-5 mb-20">
        <div className="flex flex-wrap gap-2.5">
          {categories.map((category) => {
            const isSelected = selectedTopics.includes(category.id);
            return (
              <button
                key={category.id}
                onClick={() => toggleTopic(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                  isSelected
                    ? 'bg-[#009842] text-white shadow-md'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                <div className="w-8 h-8">
                    <img src={category.image} className='w-full h-full object-cover'/>
                </div>
                <span className="font-medium text-sm">{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="px-5">
        <Link
          to="/client/feed"
          onClick={handleContinue}
          className={`w-full py-4 rounded-full font-semibold text-base mb-3 transition-all flex items-center justify-center ${
            selectedTopics.length >= 4
              ? 'bg-[#009842] text-white hover:bg-[#007a36] shadow-lg'
              : 'bg-gray-200 text-gray-400 pointer-events-none'
          }`}
        >
          Continue
        </Link>
        <Link
          to="/client/feed"
          className="w-full text-gray-900 font-semibold text-base py-2 hover:text-gray-700 transition-colors block text-center"
        >
          Skip this Part
        </Link>
      </div>
    </div>
  );
};

export default C_Topics;