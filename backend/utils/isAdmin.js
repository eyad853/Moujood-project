import ERRORS from "../config/errors.js";

const isAdmin = (req, res, next) => {
  console.log(req.user);
  try {
    // Check if user is logged in
    if (!req.user) {
      return res.status(401).json({
        error: true,
        message: ERRORS.UNAUTHORIZED
      });
    }

    // Check admin role
    if (req.user.accountType !== "super_admin") {
      return res.status(403).json({
        error: true,
        message: ERRORS.ACCESS_DENIED_ADMINS_ONLY
      });
    }

    next(); // user is admin → continue
  } catch (err) {
    console.error("isAdmin Error:", err);
    return res.status(500).json({
      error: true,
      message: ERRORS.SERVER_ERROR
    });
  }
};

export default isAdmin