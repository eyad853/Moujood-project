import dotenv from 'dotenv'
dotenv.config()
import express from 'express';
const appRouter = express.Router();

// This is your "latest version" info
const latestVersion =  process.env.LATEST_VERSION

// GET /api/version
appRouter.get('/version', (req, res) => {
  res.json({
    error:false,
    latestVersion
  });
});

export default appRouter;