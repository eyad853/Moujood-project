import axios from "axios";
// -----------------------------
// LIKE OFFER (optimistic update)
// -----------------------------
export const likeOffer = async (
  offerId,
  offers,
  setOffers,
  setError
) => {
  // 🔹 Save previous state for rollback
  const prevOffers = structuredClone(offers);

  // 🔹 Optimistic update
  setOffers(prev =>
    prev.map(offer =>
      offer.offer_id === offerId
        ? {
            ...offer,
            is_liked: true,
            likes_count: Number(offer.likes_count) + 1
          }
        : offer
    )
  );

  try {
    const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/likes/create/${offerId}` , {} , {
      withCredentials:true
    });
    console.log(res);

    // If backend says already liked → rollback count increase
    if (res.data.message === "already_liked") {
      setOffers(prevOffers);
    }

  } catch (err) {
    // 🔁 Rollback on error
    setOffers(prevOffers);

    if (err.response?.data?.message) {
      setError(err.response.data.message);
    } else if (err.message) {
      setError(err.message);
    } else {
      setError("Something went wrong");
    }
  }
};

// --------------------------------
// UNLIKE OFFER (optimistic update)
// --------------------------------
export const unlikeOffer = async (
  offerId,
  offers,
  setOffers,
  setError
) => {
  // 🔹 Save previous state
  const prevOffers = structuredClone(offers);

  // 🔹 Optimistic update
  setOffers(prev =>
    prev.map(offer =>
      offer.offer_id === offerId
        ? {
            ...offer,
            is_liked: false,
            likes_count: Math.max(
              Number(offer.likes_count) - 1,
              0
            )
          }
        : offer
    )
  );

  try {
    const res =await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/likes/delete/${offerId}` , {withCredentials:true});
    console.log(res);


  } catch (err) {
    // 🔁 Rollback
    setOffers(prevOffers);

    if (err.response?.data?.message) {
      setError(err.response.data.message);
    } else if (err.message) {
      setError(err.message);
    } else {
      setError("Something went wrong");
    }
  }
}