import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectDatabase } from './config/database.js';
import businessRoutes from './routes/businesses.js';
import advertisementRoutes from './routes/advertisements.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

// Health check
app.get('/health', (_req, res) => res.json({ ok: true, timestamp: new Date() }));

// API Routes
app.use('/api/businesses', businessRoutes);
app.use('/api/advertisements', advertisementRoutes);

// Backward compatibility with old /ads endpoint (deprecated)
app.use('/ads', advertisementRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Connect to database and start server
const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    await connectDatabase();

    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
      console.log(`📂 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  const { closeDatabase } = await import('./config/database.js');
  await closeDatabase();
  process.exit(0);
});

startServer();

export default app;
