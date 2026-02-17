import {pool} from '../index.js'
import ERRORS from '../config/errors.js';

export const addAd = async (req, res) => {
  try {
    const image = req.file
      ? `${process.env.backendURL}/${req.file.path.replace(/\\/g, '/')}`
      : null;

    if (!image) return res.status(400).json({
      error:true, 
      message: ERRORS.IMAGE_NOT_FOUND 
    });

    const query = 'INSERT INTO ads (image) VALUES ($1) RETURNING *';
    const result = await pool.query(query, [image]);
    const ad = result.rows[0]

    res.json(ad);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const getAds = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ads ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const editAd = async (req, res) => {
  try {
    const { id } = req.params;

    const image = req.file
      ? `${process.env.backendURL}/${req.file.path.replace(/\\/g, '/')}`
      : null;

    if (!image) return res.status(400).json({ 
      error:true,
      message: ERRORS.NEW_IMAGE_REQUIRED
    });

    const query = 'UPDATE ads SET image = $1 WHERE id = $2 RETURNING *';
    const result = await pool.query(query, [image, id]);
    const ad = result.rows[0]

    if (result.rowCount === 0) return res.status(404).json({
      error:true, 
      message: ERRORS.AD_NOT_FOUND
    });

    res.json(result.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteAd = async (req, res) => {
  try {
    const { id } = req.params;

    const query = 'DELETE FROM ads WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);

    if (result.rowCount === 0) return res.status(404).json({
      error:true, 
      message: ERRORS.AD_NOT_FOUND
    });

    res.json({ message: 'Ad deleted' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};