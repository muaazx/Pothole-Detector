import express from 'express';
import pool from '../db/index';
import authMiddleware, { AuthRequest } from '../middlewares/auth';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// POST /api/reports - Create a new report
router.post('/', authMiddleware, upload.single('image'), async (req: AuthRequest, res: express.Response) => {
  try {
    const { lat, lng, description, severity, ward_id, confirmDuplicate } = req.body;
    const userId = req.user?.uid;

    if (!lat || !lng || !severity) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // 1. Duplicate Check using PostGIS ST_DWithin (30 meters = approx 0.00027 degrees, but using geography cast for meters)
    // PostGIS SRID 4326 uses degrees, so we cast to geography for meters
    const duplicateQuery = `
      SELECT * FROM reports 
      WHERE status != 'Resolved' 
      AND ST_DWithin(location::geography, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography, 30)
      LIMIT 1;
    `;
    const duplicateResult = await pool.query(duplicateQuery, [lng, lat]);

    if (duplicateResult.rows.length > 0 && confirmDuplicate !== 'true') {
      // Found a possible duplicate
      return res.status(409).json({ 
        message: 'Possible duplicate found', 
        duplicate: duplicateResult.rows[0] 
      });
    }

    // If confirmDuplicate === 'true', we should instead upvote the existing report.
    if (duplicateResult.rows.length > 0 && confirmDuplicate === 'true') {
      const existingReportId = duplicateResult.rows[0].id;
      // Register upvote
      try {
        await pool.query(
          'INSERT INTO upvotes (report_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
          [existingReportId, userId]
        );
        // Recalculate priority score (simple version)
        await pool.query(
          'UPDATE reports SET priority_score = priority_score + 2 WHERE id = $1',
          [existingReportId]
        );
      } catch (err) {
        console.error('Upvote error', err);
      }
      return res.status(200).json({ message: 'Upvoted existing report', reportId: existingReportId });
    }

    // 2. Upload image to Cloudinary if exists
    let imageUrl = null;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, { folder: 'pothole-reporter' });
      imageUrl = result.secure_url;
    }

    // 3. Insert new report
    let severityScore = 1;
    if (severity === 'moderate') severityScore = 3;
    if (severity === 'severe') severityScore = 6;

    const insertQuery = `
      INSERT INTO reports (user_id, location, lat, lng, description, severity, image_url, ward_id, priority_score)
      VALUES ($1, ST_SetSRID(ST_MakePoint($2, $3), 4326), $4, $5, $6, $7, $8, $9, $10)
      RETURNING *;
    `;
    const newReport = await pool.query(insertQuery, [
      userId, lng, lat, lat, lng, description, severity, imageUrl, ward_id, severityScore
    ]);

    res.status(201).json(newReport.rows[0]);
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/reports - Fetch all reports
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT r.*, 
        (SELECT COUNT(*) FROM upvotes u WHERE u.report_id = r.id) as upvotes_count
      FROM reports r
      ORDER BY r.priority_score DESC, r.created_at DESC;
    `;
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/reports/:id/upvote
router.post('/:id/upvote', authMiddleware, async (req: AuthRequest, res: express.Response) => {
  try {
    const reportId = req.params.id;
    const userId = req.user?.uid;

    const insertResult = await pool.query(
      'INSERT INTO upvotes (report_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING id',
      [reportId, userId]
    );

    if (insertResult.rows.length > 0) {
      // Update priority score
      await pool.query(
        'UPDATE reports SET priority_score = priority_score + 2 WHERE id = $1',
        [reportId]
      );
      res.status(200).json({ message: 'Upvoted successfully' });
    } else {
      res.status(400).json({ message: 'Already upvoted' });
    }
  } catch (error) {
    console.error('Error upvoting:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/reports/:id/status (admin only ideally, skipping role check for MVP)
router.put('/:id/status', authMiddleware, async (req: AuthRequest, res: express.Response) => {
  try {
    const reportId = req.params.id;
    const { status } = req.body;
    
    // In a real app, verify req.user.role === 'admin' or 'officer'

    const updateQuery = `
      UPDATE reports 
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *;
    `;
    const result = await pool.query(updateQuery, [status, reportId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }

    // Optional: Insert into status_history

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
