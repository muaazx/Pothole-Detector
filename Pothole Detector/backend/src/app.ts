import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import reportRoutes from './routes/reports';
import newsRoutes from './routes/news';
import usersRoutes from './routes/users';
import { startNewsCron } from './cron/news';

dotenv.config();

const app = express();

// Start cron job only in non-serverless local environments
if (process.env.VERCEL !== '1') {
  try {
    startNewsCron();
  } catch (err) {
    console.warn('Cron scheduler skipped in serverless environment:', err);
  }
}

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));


app.use(express.json());

// API Routes
app.use('/api/reports', reportRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/users', usersRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Pothole Radar API is running' });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Pothole Radar API is running' });
});

export default app;
