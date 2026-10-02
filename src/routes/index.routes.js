import { Router } from 'express';
import taskRoutes from './task.routes.js';
import authRoutes from './auth.routes.js';
import projectRoutes from './project.routes.js';

const router = Router();

router.get('/', (req, res) => {
  res.send('Welcome to ProjectTaskFlow API');
});

router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
  });
});

router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);
router.use('/tasks', taskRoutes);

export default router;
