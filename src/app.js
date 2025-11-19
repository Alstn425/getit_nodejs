import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.use(cors());
app.use(express.json());

app.use('/', router);

app.get('/health', (req, res) => res.json({ ok: true, env: NODE_ENV }));

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`API server running http://localhost:${PORT}`);
});
