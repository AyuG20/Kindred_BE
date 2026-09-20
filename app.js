import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import authRoutes from './Backend/Routes/auth.routes.js';
import interestRoutes from './Backend/Routes/interest.routes.js';
import discoverRoutes from './Backend/Routes/discovery.routes.js';
import connectionRoutes from './Backend/Routes/connection.routes.js'
import { connectDB, disconnectDB } from './Backend/db/db.js';

dotenv.config();

const { json } = express;
const app = express();

const port = process.env.PORT || 3002;
const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

const corsMiddleware = cors(corsOptions);

app.use(json());
app.use(corsMiddleware);
app.use(cookieParser());

app.use((req, res, next) => {
  console.log("GLOBAL COOKIE HEADER:", req.headers.cookie);
  console.log("GLOBAL PARSED COOKIES:", req.cookies);
  next();
});
app.use('/api/auth', authRoutes);
app.use('/api/interests', interestRoutes);
app.use('/api/discover',discoverRoutes);
app.use('/api/connection',connectionRoutes);

async function startServer() {
  await connectDB();

  const server = app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });

  const shutdown = async () => {
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
