import { pool } from "../index.js"

const getTargetText =async ({ receiver_type, filter_type, filter_value, specific_names }) => {
    const typeText = receiver_type === 'user' ? 'users' : 'businesses';
    if (filter_type === 'all') return `All ${typeText}`;
    if (filter_type === 'gender') return `All ${filter_value}s`;
    if (filter_type === 'governorate') return `All users in ${filter_value}`;
    if (filter_type === 'category') {
    const res = await pool.query(`SELECT name FROM categories WHERE id = $1`, [filter_value]);
    const categoryName = res.rows[0]?.name || 'Unknown';
    return `All ${categoryName} businesses`;
  }
    if (filter_type === 'specific') return `Specific ${typeText}: ${specific_names.join(', ')}`;
    return typeText;
  };

// 1️⃣ Create a new notification
export const createNotification = async (req, res) => {
  const client = await pool.connect();
  try {
    const {
      title,
      message,
      receiver_type,
      filter_type,
      filter_value,
      specific_names = []
    } = req.body;

    
    if (!title || !message || !receiver_type || !filter_type) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    await client.query("BEGIN");

    // 1️⃣ create notification
    const notificationResult = await client.query(
      `INSERT INTO notifications (title, message , filter_type , filter_value , specific_names)
        VALUES ($1, $2 ,$3 ,$4 , $5)
       RETURNING *`,
      [title, message , filter_type , filter_value , specific_names]
    );

    const notification = notificationResult.rows[0];

    // 2️⃣ resolve receivers
    let receiversQuery = "";
    let params = [];

    if (receiver_type === "user") {
      if (filter_type === "all") {
        receiversQuery = `SELECT id FROM users`;
      }

      if (filter_type === "gender") {
        receiversQuery = `SELECT id FROM users WHERE gender = $1`;
        params = [filter_value];
      }

      if (filter_type === "governorate") {
        receiversQuery = `SELECT id FROM users WHERE governorate = $1`;
        params = [filter_value];
      }

      if (filter_type === "specific") {
        receiversQuery = `SELECT id FROM users WHERE name = ANY($1)`;
        params = [specific_names];
      }
    }

    if (receiver_type === "business") {
      if (filter_type === "all") {
        receiversQuery = `SELECT id FROM businesses`;
      }

      if (filter_type === "category") {
        receiversQuery = `SELECT id FROM businesses WHERE category = $1`;
        params = [filter_value];
      }

      if (filter_type === "specific") {
        receiversQuery = `SELECT id FROM businesses WHERE name = ANY($1)`;
        params = [specific_names];
      }
    }

    const receivers = await client.query(receiversQuery, params);

    // 3️⃣ insert notification_targets
    for (const r of receivers.rows) {
      await client.query(
        `INSERT INTO notification_targets 
         (notification_id, receiver_type, receiver_id)
         VALUES ($1, $2, $3)`,
        [notification.id, receiver_type, r.id]
      );
    }

    await client.query("COMMIT");

    const fullNotification = {
      ...notification,
      receivers: receivers.rowCount,
      receiver_type,
      targets: await getTargetText({ receiver_type, filter_type, filter_value, specific_names })
    };

    const io = req.app.get("io");
    for (const r of receivers.rows) {
      console.log(receiver_type);
      console.log(r.id);
      const room = `${receiver_type}_${r.id}`;
      io.to(room).emit("notification_created", {
        type:'notification_created',
        notification
      });
    }

    res.json({
      error: false,
      notification:fullNotification,
    });

  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ message: "Failed to create notification" });
  } finally {
    client.release();
  }
};

// 2️⃣ Edit an existing notification
export const editNotification = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const {
      title,
      message,
      receiver_type,
      filter_type,
      filter_value,
      specific_names
    } = req.body;

    if (!receiver_type || !filter_type) {
      return res.status(400).json({ message: "receiver_type and filter_type are required" });
    }

    await client.query("BEGIN");

    // 1️⃣ Update the notification
    const updateResult = await client.query(
      `UPDATE notifications
       SET title = COALESCE($1, title),
           message = COALESCE($2, message),
           filter_type = $3,
           filter_value = $4,
           specific_names = $5
       WHERE id = $6
       RETURNING *`,
      [title, message, filter_type, filter_value, specific_names, id]
    );

    const notification = updateResult.rows[0];

    if (!notification) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Notification not found" });
    }

    // 2️⃣ Delete old targets
    await client.query(
      `DELETE FROM notification_targets WHERE notification_id = $1`,
      [id]
    );

    // 3️⃣ Recalculate receivers
    let receiversQuery = "";
    let params = [];

    if (receiver_type === "user") {
      if (filter_type === "all") {
        receiversQuery = `SELECT id FROM users`;
      }
      if (filter_type === "gender") {
        receiversQuery = `SELECT id FROM users WHERE gender = $1`;
        params = [filter_value];
      }
      if (filter_type === "governorate") {
        receiversQuery = `SELECT id FROM users WHERE governorate = $1`;
        params = [filter_value];
      }
      if (filter_type === "specific") {
        receiversQuery = `SELECT id FROM users WHERE name = ANY($1)`;
        params = [specific_names];
      }
    }

    if (receiver_type === "business") {
      if (filter_type === "all") {
        receiversQuery = `SELECT id FROM businesses`;
      }
      if (filter_type === "category") {
        receiversQuery = `SELECT id FROM businesses WHERE category = $1`;
        params = [filter_value];
      }
      if (filter_type === "specific") {
        receiversQuery = `SELECT id FROM businesses WHERE name = ANY($1)`;
        params = [specific_names];
      }
    }

    const receivers = await client.query(receiversQuery, params);

    // 4️⃣ Insert new targets
    for (const r of receivers.rows) {
      await client.query(
        `INSERT INTO notification_targets (notification_id, receiver_type, receiver_id)
         VALUES ($1, $2, $3)`,
        [notification.id, receiver_type, r.id]
      );
    }

    await client.query("COMMIT");

    // 5️⃣ Prepare response
    const fullNotification = {
      ...notification,
      receivers: receivers.rowCount,
      receiver_type,
      targets: await getTargetText({ receiver_type, filter_type, filter_value, specific_names })
    };

    const io = req.app.get("io");
    for (const r of receivers.rows) {
      const room = `${receiver_type}_${r.id}`;
      io.to(room).emit("notification_edited", {
        type:'notification_edited',
        notification
      });
    }

    res.json({
      error: false,
      notification: fullNotification,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ message: "Failed to edit notification" });
  } finally {
    client.release();
  }
};


// 3️⃣ Delete a notification
export const deleteNotification = async (req, res) => {
  const client = await pool.connect();

  const { id: notification_id } = req.params;
  const { id: receiver_id, accountType } = req.user;

  try {
    await client.query("BEGIN");

    // 🔴 SUPER ADMIN → delete notification (receivers auto-deleted by CASCADE)
    if (accountType === "super_admin") {

      const result = await client.query(
        `DELETE FROM notifications
         WHERE id = $1
         RETURNING id`,
        [notification_id]
      );

      const targetsResult = await client.query(
      `DELETE FROM notification_targets
       WHERE notification_id = $1
       RETURNING id`,
      [notification_id]
    );

      if (!result.rows.length) {
        await client.query("ROLLBACK");
        return res.status(404).json({ message: "Notification not found" });
      }

      await client.query("COMMIT");

      // broadcast to everyone
      const io = req.app.get("io");
      io.emit("notification_deleted", { type:'notification_deleted', id: notification_id });

      return res.json({ error: false, id: notification_id });
    }

    // 🟢 USER / BUSINESS → delete ONLY their receiver row
    const result = await client.query(
      `DELETE FROM notification_targets
       WHERE notification_id = $1
         AND receiver_type = $2
         AND receiver_id = $3
       RETURNING id`,
      [notification_id, accountType, receiver_id]
    );

    if (!result.rows.length) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Notification not found for this account" });
    }

    await client.query("COMMIT");
    res.json({ error: false, id: notification_id });

  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ message: "Failed to delete notification" });
  } finally {
    client.release();
  }
};


// 4️⃣ Get all notifications
export const getAllNotifications = async (req, res) => {
  try {
    const { receiver_type } = req.params; // 'user' or 'business'

    if (!receiver_type) {
      return res.status(400).json({ message: "receiver_type is required" });
    }

    // Fetch notifications and count receivers from notification_targets
    const result = await pool.query(
      `
      SELECT 
        n.id,
        n.title,
        n.message,
        n.filter_type,
        n.filter_value,
        n.specific_names,
        n.created_at,
        COUNT(nt.id)::int AS receivers
      FROM notifications n
      LEFT JOIN notification_targets nt
        ON n.id = nt.notification_id AND nt.receiver_type = $1
        WHERE nt.receiver_type = $1
      GROUP BY n.id
      ORDER BY n.created_at DESC
      `,
      [receiver_type]
    );

    const notifications = await Promise.all(
      result.rows.map(async n => ({
      id: n.id,
      title: n.title,
      message: n.message,
      created_at: n.created_at,
      receiver_type,
      receivers: n.receivers,
      targets: await getTargetText({
        receiver_type,
        filter_type: n.filter_type,
        filter_value: n.filter_value,
        specific_names: n.specific_names || []
      }),
      filter_type: n.filter_type,
      filter_value: n.filter_value,
      specific_names: n.specific_names
    }))
    );

    res.json({
      error: false,
      notifications
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id,
        name,
        email,
        avatar,
        gender,
        governorate,
        user_type,
        is_verified,
        created_at
      FROM users
      WHERE email != $1
      ORDER BY created_at DESC
    `, [process.env.SUPER_ADMIN]);

    res.status(200).json({
      error: false,
      users: result.rows
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message
    });
  }
};

export const getAllBusinesses = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        b.id,
        b.name,
        b.email,
        b.logo,
        b.description,
        b.number,
        b.qr_code,
        b.active,
        b.is_verified,
        b.created_at,
        c.id AS category_id,
        c.name AS category_name
      FROM businesses b
      LEFT JOIN categories c ON b.category = c.id
      ORDER BY b.created_at DESC
    `);

    res.status(200).json({
      error: false,
      businesses: result.rows
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message
    });
  }
};

export const getMyNotifications = async (req, res) => {
  try {
    const { receiver_type} = req.params;
    const receiver_id = req.user.id

    if (!receiver_type || !receiver_id) {
      return res.status(400).json({ message: "receiver_type and receiver_id are required" });
    }

    // get account creation date
    const accountTable = receiver_type === "user" ? "users" : "businesses";

    const accountResult = await pool.query(
      `SELECT created_at FROM ${accountTable} WHERE id = $1`,
      [receiver_id]
    );

    if (!accountResult.rows.length) {
      return res.status(404).json({ message: "Account not found" });
    }

    const createdAt = accountResult.rows[0].created_at;

    // fetch notifications
    const result = await pool.query(
      `
      SELECT 
        n.id,
        n.title,
        n.message,
        n.created_at,
        nt.is_read
      FROM notification_targets nt
      JOIN notifications n ON n.id = nt.notification_id
      WHERE nt.receiver_type = $1
        AND nt.receiver_id = $2
        AND n.created_at >= $3
      ORDER BY n.created_at DESC
      `,
      [receiver_type, receiver_id, createdAt]
    );

    res.json({
      error: false,
      notifications: result.rows
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};


export const getNotificationDetails = async (req, res) => {
  try {
    const { notification_id } = req.params;

    const result = await pool.query(
      `
      SELECT 
        n.title,
        n.message,
        n.created_at
      FROM notifications n
      WHERE n.id = $1
      `,
      [notification_id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json({
      error: false,
      notification: result.rows[0]
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch notification details" });
  }
};

export const getNotificationCount = async (req, res) => {
  const client = await pool.connect();

  try {
    const { receiver_type } = req.params;
    const receiver_id = req.user.id;

    if (!receiver_type || !receiver_id) {
      return res.status(400).json({ message: "Missing receiver data" });
    }

    // 1️⃣ Get account creation date
    const accountTable = receiver_type === "user" ? "users" : "businesses";
    const accountResult = await client.query(
      `SELECT created_at FROM ${accountTable} WHERE id = $1`,
      [receiver_id]
    );

    if (!accountResult.rows.length) {
      return res.status(404).json({ message: "Account not found" });
    }

    const accountCreatedAt = accountResult.rows[0].created_at;

    // 2️⃣ Count notifications created after account creation
    const { rows } = await client.query(
      `
      SELECT COUNT(*)::int AS total
      FROM notification_targets nt
      JOIN notifications n ON nt.notification_id = n.id
      WHERE nt.receiver_type = $1
        AND nt.receiver_id = $2
        AND nt.is_read = false
        AND n.created_at >= $3
      `,
      [receiver_type, receiver_id, accountCreatedAt]
    );

    res.json({
      error: false,
      count: rows[0].total
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, message: "Server error" });
  } finally {
    client.release();
  }
};

export const markAllNotificationsAsRead = async (req, res) => {
  const client = await pool.connect();

  try {
    const { receiver_type} = req.params;
    const receiver_id = req.user.id

    if (!receiver_type || !receiver_id) {
      return res.status(400).json({ message: "Missing receiver data" });
    }

    const result = await client.query(
      `
      UPDATE notification_targets
      SET is_read = true
      WHERE receiver_type = $1
        AND receiver_id = $2
        AND is_read = false
      `,
      [receiver_type, receiver_id]
    );

    res.json({
      error: false,
      updated: result.rowCount
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, message: "Server error" });
  } finally {
    client.release();
  }
};