import { pool } from "../index.js";

const B_SA =  async (req, res, next) => {
  const user = req.user;
  const offerId = req.params.offer_id;

  // Get offer data
  const result = await pool.query(
    'SELECT * FROM offers WHERE offer_id = $1',
    [offerId]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ message: "Offer not found" });
  }

  const offer = result.rows[0];

  // SUPER ADMIN CAN EDIT ANYTHING
  if (user.user_type === 'super_admin') {
    return next();
  }

  // BUSINESS CAN ONLY EDIT THEIR OWN OFFERS
  if (user.id === offer.business_id) {
    return next();
  }

  return res.status(403).json({ 
    message: "You do not have permission to edit this offer" 
  });
};

export default B_SA