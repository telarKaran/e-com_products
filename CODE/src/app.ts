import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError } from '@shopmaster360/shared';

import { currentUserRouter } from './routes/current-user';
import { productRouter } from './routes/productRoutes';
import path from 'path';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);

app.use(currentUserRouter);
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use('/api/products', productRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
});

export { app };
