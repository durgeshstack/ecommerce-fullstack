import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import csrf from 'csurf';
import { env } from './config/env';
import routes from './routes';

const app = express();

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
  }),
);
app.use(cookieParser());
app.use(express.json());
const csrfProtection = csrf({
  cookie: true,
});

app.get('/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});
app.get('/', (req, res) => {
  res.send('API running 🚀');
});
app.use(routes)

export default app;
