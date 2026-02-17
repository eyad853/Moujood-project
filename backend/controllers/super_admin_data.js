import { pool } from "../index.js"

// 1️⃣ Get all businesses with total per business
export const getBusinessPageData = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        b.id,
        b.name,
        b.logo,
        b.number,
        b.active,
        b.created_at,
        c.name AS category
      FROM businesses b
      LEFT JOIN categories c ON b.category = c.id 
      ORDER BY b.created_at DESC
    `);

    const rows = result.rows;

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch businesses data" });
  }
};

// 2️⃣ Get all users with male, female and total counts
export const getUserPageData = async (req, res) => {
  try {
    // THIS WEEK
    const totalWeek = await pool.query(`
      SELECT COUNT(*) 
      FROM users 
      WHERE created_at >= NOW() - INTERVAL '7 days'
      AND user_type != 'super_admin'
    `);

    const maleWeek = await pool.query(`
      SELECT COUNT(*) 
      FROM users 
      WHERE gender = 'male' 
      AND created_at >= NOW() - INTERVAL '7 days'
      AND user_type != 'super_admin'
    `);

    const femaleWeek = await pool.query(`
      SELECT COUNT(*) 
      FROM users 
      WHERE gender = 'female' 
      AND created_at >= NOW() - INTERVAL '7 days'
      AND user_type != 'super_admin'
    `);

    // LAST WEEK
    const totalLastWeek = await pool.query(`
      SELECT COUNT(*) 
      FROM users 
      WHERE created_at >= NOW() - INTERVAL '14 days'
      AND created_at < NOW() - INTERVAL '7 days'
      AND user_type != 'super_admin'
    `);

    const maleLastWeek = await pool.query(`
      SELECT COUNT(*) 
      FROM users 
      WHERE gender = 'male'
      AND created_at >= NOW() - INTERVAL '14 days'
      AND created_at < NOW() - INTERVAL '7 days'
      AND user_type != 'super_admin'
    `);

    const femaleLastWeek = await pool.query(`
      SELECT COUNT(*) 
      FROM users 
      WHERE gender = 'female'
      AND created_at >= NOW() - INTERVAL '14 days'
      AND created_at < NOW() - INTERVAL '7 days'
      AND user_type != 'super_admin'
    `);

    // TOTAL USERS (all time)
    const total = await pool.query(`SELECT 
      u.id ,
      u.name ,
      u.email ,
      u.gender ,
      u.avatar,
      u.governorate 
      FROM users AS u
      WHERE u.email != $1
      AND user_type != 'super_admin'
      GROUP BY u.id
      ` , [process.env.SUPER_ADMIN]);

    // PERCENTAGE HELPER
    const calcPercent = (current, previous) => {
      if (previous === 0) {
        return current > 0 ? 100 : 0;
      }
      return ((current - previous) / previous * 100).toFixed(2);
    };
    const total_users=total.rows

    const percentage_total=calcPercent(
      Number(totalWeek.rows[0].count),
      Number(totalLastWeek.rows[0].count)
    )

    const percentage_male=calcPercent(
      Number(maleWeek.rows[0].count),
      Number(maleLastWeek.rows[0].count)
    )

    const percentage_female=calcPercent(
      Number(femaleWeek.rows[0].count),
      Number(femaleLastWeek.rows[0].count)
    )

    console.log(percentage_total);
    console.log(percentage_male);
    console.log(percentage_female);

    res.json({
      total_users,
      percentage_total,
      percentage_male,
      percentage_female
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch users data" });
  }
};

// 3️⃣ Get dashboard data with last month comparison for users, businesses, sales
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
        message: diff >= 0 ? `${Math.round(percentage)}% Up From Last Week` : `${Math.round(Math.abs(percentage))}% Down From Last Week`
      };
    };

    const data = {
      users: calcPercentage(parseInt(totalUsersRes.rows[0].count), parseInt(lastMonthUsersRes.rows[0].count)),
      businesses: calcPercentage(parseInt(totalBusinessesRes.rows[0].count), parseInt(lastMonthBusinessesRes.rows[0].count)),
      sales: calcPercentage(parseFloat(totalSalesRes.rows[0].total), parseFloat(lastMonthSalesRes.rows[0].total))
    };

    res.json({ 
      error:false,
      percentages: data, 
      salesChartData ,
      totalUsers:totalUsersRes.rows[0],
      totalBusinesses:totalBusinessesRes.rows[0],
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

export const getOffersPageData = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        o.offer_id,
        o.title,
        o.description,
        o.image,
        o.created_at,

        b.id AS business_id,
        b.name AS business_name,
        b.logo AS business_logo,

        bc.id AS business_category_id,
        bc.name AS business_category_name,

        sc.id AS offer_category_id,
        sc.name AS offer_category_name
        
      FROM offers o
      JOIN businesses b ON o.business_id = b.id
      LEFT JOIN categories bc ON b.category = bc.id AND bc.parent_id IS NULL
      LEFT JOIN categories sc ON o.category = sc.id AND sc.parent_id IS NOT NULL
      ORDER BY o.created_at DESC
    `);

    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load offers page data' });
  }
};