import ERRORS from "../config/errors.js";
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
    return res.status(404).json({ error:true, message: ERRORS.OFFER_NOT_FOUND });
  }

  const offer = result.rows[0];

  // SUPER ADMIN CAN EDIT ANYTHING
  if (user.accountType === 'super_admin') {
    return next();
  }

  // BUSINESS CAN ONLY EDIT THEIR OWN OFFERS
  if (user.accountType==='business' && user.id === offer.business_id) {
    return next();
  }

  return res.status(403).json({ 
    error:true,
    message: ERRORS.YOU_DONT_HAVE_PREMMISSION_TO_EDIT_THIS_OFFER
  });
};

export default B_SA