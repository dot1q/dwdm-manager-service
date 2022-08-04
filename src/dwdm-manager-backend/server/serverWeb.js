import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import * as _api from '../api/v1';

const PORT = 3000;

const start = (container) => {
  return new Promise((resolve, reject) => {
    const storageRepo = container.resolve('storageRepo');
    const logger = container.resolve('logger');
    if (!storageRepo) { 
      reject(new Error('The server must have a connected repository'));
    } else {
      const app = express();
      
      // Only display > 400 errors
      app.use(morgan('dev', {
        //skip: (req, res) => { return res.statusCode < 400 }
      }));

      app.use(express.json());
      app.use(express.urlencoded());
      app.use(cors());
      app.use(helmet());
      app.use(fileUpload());

      app.use((req, res, next) => {
        next();
      });

      _api.apiV1(app, container);
      const server = app.listen(PORT, () => resolve(server));
      logger.info(`HTTP Server is listening on port ${PORT}`);
    }
  });
};

export {start};