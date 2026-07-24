import { Router } from 'express';
import pool from '../db/index';
import { authMiddleware, AuthRequest } from '../middlewares/auth';

const router = Router();

const ADMIN_EMAIL = 'hassanx3022@gmail.com';

// Sync user details to Postgres DB on login
router.post('/sync', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { uid, email, name, role } = req.user!;
    const userEmail = email || `${uid}@placeholder.com`;
    const isUserAdmin = email && email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
    const finalRole = isUserAdmin ? 'admin' : (role || 'citizen');
    
    await pool.query(
      `INSERT INTO users (id, email, name, role) 
       VALUES ($1, $2, $3, $4) 
       ON CONFLICT (id) DO UPDATE 
       SET email = EXCLUDED.email, name = COALESCE(EXCLUDED.name, users.name), role = $4`,
      [uid, userEmail, name || 'User', finalRole]
    );

    res.status(200).json({ message: 'User synced successfully', role: finalRole });
  } catch (error) {
    console.error('Error syncing user:', error);
    res.status(500).json({ error: 'Failed to sync user to database' });
  }
});



export default router;
