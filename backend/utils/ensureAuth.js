import ERRORS from "../config/errors.js";

const ensureAuth = (req, res, next) => {
  if (!req.user) return res.status(401).json({error:true ,  message: ERRORS.NOT_AUTHENTICATED });
  next();
};

export default ensureAuth