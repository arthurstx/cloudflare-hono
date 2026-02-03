import { Hono } from 'hono';
import { authenticate } from './auth';
import { register } from './register';
import { refresh } from './refresh';

export const authRoutes = new Hono();

authRoutes.post('/register', register);
authRoutes.post('/authenticate', authenticate);
authRoutes.post('/refresh', refresh);
