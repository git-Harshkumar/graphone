import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config';
import { rateLimiter } from './middleware/rateLimiter';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

import companiesRouter from './routes/companies';
import investorsRouter from './routes/investors';
import foundersRouter from './routes/founders';
import productsRouter from './routes/products';
import newsRouter from './routes/news';
import fundingRouter from './routes/funding';
import statsRouter from './routes/stats';

const app = express();

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
}));
app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'));
app.use(express.json());
app.use(rateLimiter);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/companies', companiesRouter);
app.use('/api/investors', investorsRouter);
app.use('/api/founders', foundersRouter);
app.use('/api/products', productsRouter);
app.use('/api/news', newsRouter);
app.use('/api/funding', fundingRouter);
app.use('/api', statsRouter);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`🚀 GraphOne API running on http://localhost:${config.port}`);
  console.log(`   Environment: ${config.nodeEnv}`);
});

export default app;