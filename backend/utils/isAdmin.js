const isAdmin = (req, res, next) => {
  try {
    // Check if user is logged in
    if (!req.session.user) {
      return res.status(401).json({
        error: true,
        message: "You must be logged in"
      });
    }

    // Check admin role
    if (req.session.user.user_type !== "super_admin") {
      return res.status(403).json({
        error: true,
        message: "Access denied. Admins only"
      });
    }

    next(); // user is admin → continue
  } catch (err) {
    console.error("isAdmin Error:", err);
    return res.status(500).json({
      error: true,
      message: "Server error"
    });
  }
};

export default isAdmin