// // src/routes/index.ts
import express from 'express';
import authRoutes from '../modules/auth/auth.routes';

const router = express.Router();

router.use('/api/auth', authRoutes);

export default router;
