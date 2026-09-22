import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { errorHandler } from './middleware/errorHandler';
import competitionsRouter from './routes/competitions';
import registrationsRouter from './routes/registrations';
import testimonialsRouter from './routes/testimonials';
import demoRouter from './routes/demo';
import { config } from './config';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Images are immutable per file name, so let clients and CDNs cache them
app.use('/assets', express.static(path.join(__dirname, '../../assets'), { maxAge: '7d' }));
app.use('/api/competitions', competitionsRouter);
app.use('/api/registrations', registrationsRouter);
app.use('/api/testimonials', testimonialsRouter);

// Demo-only: lets the app reset to the seeded state when it launches
if (config.demoMode) {
  app.use('/api/demo', demoRouter);
}

app.use(errorHandler);

export default app;
