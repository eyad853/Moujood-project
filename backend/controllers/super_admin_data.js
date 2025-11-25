import { pool } from "../index.js"

// 1️⃣ Get all businesses with total scans per business
export const getBusinessPageData = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT b.*, COUNT(s.id) AS total_scans
      FROM businesses b
      LEFT JOIN scans s ON b.id = s.business_id
      GROUP BY b.id
      ORDER BY b.created_at DESC
    `);

    const rows = result.rows

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch businesses data" });
  }
};

// 2️⃣ Get all users with male, female and total counts
export const getUserPageData = async (req, res) => {
  try {
    const total = await pool.query(`SELECT COUNT(*) FROM users`);
    const male = await pool.query(`SELECT COUNT(*) FROM users WHERE gender = 'male'`);
    const female = await pool.query(`SELECT COUNT(*) FROM users WHERE gender = 'female'`);

    res.json({
      total_users: parseInt(total.rows[0].count),
      male_users: parseInt(male.rows[0].count),
      female_users: parseInt(female.rows[0].count),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch users data" });
  }
};

// 3️⃣ Get dashboard data with last month comparison for users, scans, businesses, sales
export const getDashboardPageData = async (req, res) => {
  try {
    const now = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(now.getMonth() - 1);

    // Total users
    const totalUsersRes = await pool.query(`SELECT COUNT(*) FROM users`);
    const lastMonthUsersRes = await pool.query(
      `SELECT COUNT(*) FROM users WHERE created_at >= $1 AND created_at < $2`,
      [lastMonth, now]
    );

    // Total scans
    const totalScansRes = await pool.query(`SELECT COUNT(*) FROM scans`);
    const lastMonthScansRes = await pool.query(
      `SELECT COUNT(*) FROM scans WHERE scanned_at >= $1 AND scanned_at < $2`,
      [lastMonth, now]
    );

    // Total businesses
    const totalBusinessesRes = await pool.query(`SELECT COUNT(*) FROM businesses`);
    const lastMonthBusinessesRes = await pool.query(
      `SELECT COUNT(*) FROM businesses WHERE created_at >= $1 AND created_at < $2`,
      [lastMonth, now]
    );

    // Total sales
    const totalSalesRes = await pool.query(`SELECT COALESCE(SUM(amount),0) AS total FROM sales`);
    const lastMonthSalesRes = await pool.query(
      `SELECT COALESCE(SUM(amount),0) AS total FROM sales WHERE created_at >= $1 AND created_at < $2`,
      [lastMonth, now]
    );

    const calcPercentage = (current, previous) => {
      const diff = current - previous;
      const percentage = previous === 0 ? 100 : (diff / previous) * 100;
      return {
        current,
        previous,
        diff,
        percentage: Math.round(percentage),
        message: diff >= 0 ? `${Math.round(percentage)}% increase` : `${Math.round(Math.abs(percentage))}% decrease`
      };
    };

    const data = {
      users: calcPercentage(parseInt(totalUsersRes.rows[0].count), parseInt(lastMonthUsersRes.rows[0].count)),
      scans: calcPercentage(parseInt(totalScansRes.rows[0].count), parseInt(lastMonthScansRes.rows[0].count)),
      businesses: calcPercentage(parseInt(totalBusinessesRes.rows[0].count), parseInt(lastMonthBusinessesRes.rows[0].count)),
      sales: calcPercentage(parseFloat(totalSalesRes.rows[0].total), parseFloat(lastMonthSalesRes.rows[0].total))
    };

    // Also prepare sales details for visualization (daily sales last 30 days)
    const salesChartRes = await pool.query(`
      SELECT DATE(created_at) AS date, COALESCE(SUM(amount),0) AS total
      FROM sales
      WHERE created_at >= NOW() - INTERVAL '30 days'
      GROUP BY DATE(created_at)
      ORDER BY DATE(created_at)
    `);

    const salesChartData = salesChartRes.rows.map(row => ({
      date: row.date.toISOString().split('T')[0],
      total: parseFloat(row.total)
    }));

    res.json({ 
      error:false,
      percentages: data, 
      salesChartData ,
      totalUsers:totalUsersRes.rows,
      totalBusinesses:totalBusinessesRes.rows,
      totalScans:totalSalesRes.rows,
      totalSalesRes:totalSalesRes.rows
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch dashboard data" });
  }
};

// 4️⃣ Toggle business active/inactive
export const editBusinessActivity = async (req, res) => {
  try {
    const { businessId } = req.params;
    // get current status
    const businessRes = await pool.query(`SELECT active FROM businesses WHERE id=$1`, [businessId]);
    if (businessRes.rows.length === 0)
      return res.status(404).json({ message: "Business not found" });

    const currentStatus = businessRes.rows[0].active;
    const newStatus = !currentStatus;

    await pool.query(`UPDATE businesses SET active=$1 WHERE id=$2`, [newStatus, businessId]);

    res.json({ message: `Business is now ${newStatus ? "active" : "inactive"}`, active: newStatus });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update business activity" });
  }
};

export const getCategoriesPageData = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        c.*,

        CASE 
          WHEN c.parent_id IS NULL THEN (
              SELECT COUNT(*) 
              FROM businesses b 
              WHERE b.category = c.id
          )
          ELSE 0
        END AS category_usage,

        CASE 
          WHEN c.parent_id IS NOT NULL THEN (
              SELECT COUNT(DISTINCT o.business_id) 
              FROM offers o 
              WHERE o.category = c.id
          )
          ELSE 0
        END AS subcategory_usage

      FROM categories c
      ORDER BY c.id DESC;
    `);

    res.status(200).json({
      error: false,
      categories: result.rows
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: true,
      message: "Failed to load categories page"
    });
  }
};

