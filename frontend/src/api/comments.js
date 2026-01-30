import axios from "axios";

const API = import.meta.env.VITE_BACKEND_URL;

export const createComment = async (offer_id , content , comments , setComments , setError ,user) => {
  const tempId = Date.now();

  const optimisticComment = {
    id: tempId,
    user_id:user.id,
    userName:user.name,
    offer_id,
    content,
    created_at: new Date().toISOString(),
    optimistic: true,
  };

  console.log('instant update ', optimisticComment);

  // optimistic update
  setComments(prev => [optimisticComment, ...prev]);

  try {
    const { data } = await axios.post(`${API}/comments/create/${offer_id}`, { content } , { withCredentials: true });
    console.log('clg' , data);

    // replace optimistic comment with real one
    setComments(prev =>
      prev.map(c => (c.id === tempId ? data.comment : c))
    );

  } catch (err) {
    // rollback
    setComments(prev => prev.filter(c => c.id !== tempId));

    if (err.response?.data?.message) {
      setError(err.response.data.message);
    } else if (err.message) {
      setError(err.message);
    } else {
      setError("Something went wrong");
    }
  }
};

export const updateComment = async (comment_id, newContent , comments , setComments , setError ) => {
  const oldComments = [...comments];

  // optimistic update
  setComments(prev =>
    prev.map(c =>
      c.id === comment_id ? { ...c, content: newContent } : c
    )
  );

  try {
    await axios.patch(`${API}/comments/update/${comment_id}`,{ content: newContent },{ withCredentials: true });

  } catch (err) {
    // rollback
    setComments(oldComments);

    if (err.response?.data?.message) {
      setError(err.response.data.message);
    } else if (err.message) {
      setError(err.message);
    } else {
      setError("Something went wrong");
    }
  }
};

export const deleteComment = async  (comment_id , comments , setComments , setError ) => {
  const oldComments = [...comments];

  // optimistic remove
  setComments(prev => prev.filter(c => c.id !== comment_id));

  try {
    await axios.delete(`${API}/comments/delete/${comment_id}`,{ withCredentials: true });

  } catch (err) {
    // rollback
    setComments(oldComments);

    if (err.response?.data?.message) {
      setError(err.response.data.message);
    } else if (err.message) {
      setError(err.message);
    } else {
      setError("Something went wrong");
    }
  }
};

export const getOfferComments = async  (offer_id , setComments , setError ) => {
  try {
    const { data } = await axios.get(`${API}/comments/getOfferComments/${offer_id}`);
    console.log(data);

    setComments(data);

  } catch (err) {
    if (err.response?.data?.message) {
      setError(err.response.data.message);
    } else if (err.message) {
      setError(err.message);
    } else {
      setError("Something went wrong");
    }
  }
};