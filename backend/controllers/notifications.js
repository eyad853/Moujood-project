import { pool } from "../index.js"


// 1️⃣ Create a new notification
export const createNotification = async (req, res) => {
  try {
    const { title, content, receiver_type, receiver_id } = req.body;

    if (!title || !content || !receiver_type || !receiver_id) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const result = await pool.query(
      `INSERT INTO notifications(title, content, receiver_type, receiver_id)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [title, content, receiver_type, receiver_id]
    );

    const io = req.app.get("io");
    // Emit to the specific type (you can handle rooms on frontend)
    io.emit("notification_created", result.rows[0]);

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create notification" });
  }
};

// 2️⃣ Edit an existing notification
export const editNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const result = await pool.query(
        `UPDATE notifications 
        SET title = COALESCE($1, title), 
        content = COALESCE($2, content)
        WHERE id = $3
        RETURNING *`,
      [title, content, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Notification not found" });
    }

    const io = req.app.get("io");
    io.emit("notification_updated", result.rows[0]);

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to edit notification" });
  }
};

// 3️⃣ Delete a notification
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM notifications WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Notification not found" });
    }

    const io = req.app.get("io");
    io.emit("notification_deleted", { id });

    res.json({ message: "Notification deleted", id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete notification" });
  }
};

// 4️⃣ Get all notifications
export const getAllNotifications = async (req, res) => {
  try {
    const { receiver_type, receiver_id } = req.query;

    let query = `SELECT * FROM notifications`;
    let params = [];

    if (receiver_type && receiver_id) {
      query += ` WHERE receiver_type = $1 AND receiver_id = $2`;
      params = [receiver_type, receiver_id];
    }

    query += ` ORDER BY created_at DESC`;

    const result = await pool.query(query, params);

    res.json({
        error:false,
        notifications:result.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};