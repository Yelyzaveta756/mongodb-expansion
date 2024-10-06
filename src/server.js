// src/server.js

import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { studentsRouter } from './routers/students.js';
import { authRouter } from './routers/auth.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { env } from './utils/env.js';
import { UPLOAD_DIR } from './constants/index.js';
import { swaggerDocs } from './middlewares/swaggerDocs.js';

const PORT = Number(env('PORT', '3001'));

export const setupServer = () => {
  const app = express();

  app.use(express.json());

  // app.use(
  //   express.json({
  //     type: ['application/json', 'application/vnd.api+json'],
  //     limit: '100kb',
  //   }),
  // );
  app.use(cors());
  app.use(cookieParser());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  // app.get('/', (req, res) => {
  //   res.json({
  //     message: 'Hello World!',
  //   });
  // });
  app.use('/auth', authRouter);
  app.use(studentsRouter); // Додаємо роутер до app як middleware

  app.use('/uploads', express.static(UPLOAD_DIR));
  app.use('/api-docs', swaggerDocs());

  app.use('*', notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
