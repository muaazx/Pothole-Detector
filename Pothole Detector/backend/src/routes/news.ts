import express from 'express';
import pool from '../db/index';
import { fetchAllNews } from '../cron/news';

const router = express.Router();

const fetchPotholeNews = async () => {
  const query = `
    SELECT * FROM news_alerts
    WHERE LOWER(headline) LIKE '%pothole%'
       OR LOWER(headline) LIKE '%crater%'
       OR LOWER(headline) LIKE '%road damage%'
    ORDER BY 
      CASE WHEN alarm_level = 'alarming' THEN 0 ELSE 1 END,
      published_at DESC
    LIMIT 25;
  `;
  const result = await pool.query(query);
  return result.rows;
};


// GET /api/news - Fetch latest pothole news alerts
router.get('/', async (req, res) => {
  try {
    const rows = await fetchPotholeNews();
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/news/sync - Trigger on-demand web scraping for latest Al Jazeera & road safety pothole news
router.post('/sync', async (req, res) => {
  try {
    console.log('User triggered live web scrape for pothole news (Al Jazeera & global feeds)...');
    await fetchAllNews();
    const rows = await fetchPotholeNews();
    res.status(200).json({
      message: 'Pothole news synchronized successfully from web scraper',
      data: rows
    });
  } catch (error) {
    console.error('Error syncing news:', error);
    res.status(500).json({ error: 'Failed to scrape live news' });
  }
});

export default router;


