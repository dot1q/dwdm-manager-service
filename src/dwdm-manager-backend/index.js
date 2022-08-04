'use strict';

const {EventEmitter} = require('events');
import * as di from './config';
import { asValue } from 'awilix';
import * as storageRepository from './repository/storageRepo';
import * as webServer from './server/serverWeb';

import logging from '../logger/logging.module';

const mediator = new EventEmitter();
let logger = logging('dwdm-manager-backend', di.logSettings);

logger.info(`--- DWDM Manager Backend (${process.env.npm_package_version}) ---`);
logger.info('Loading connection to db repository...');

process.on('uncaughtException', (err) => {
  logger.error('Unhandled Exception ', err);
});

process.on('uncaughtRejection ', (err, promise) => {
  logger.error('Uncaught Rejection ', err);
});

process.on('unhandledRejection', (err, promise) => {
  logger.error('Unhandled Rejection ', err);
});

mediator.on('db.ready', (bootstrapContainer, connectionsContainer) => {
  if (bootstrapContainer.cradle.dwdmManagerSettings.nowrite) {
    logger.warn("No writing enabled -- No writing to db systems");
  }

  if (bootstrapContainer.cradle.dwdmManagerSettings.debug) {
    logger.warn("Debug mode enabled -- Log messages will be more verbose");
  }

  // load db storageRepository
  storageRepository.connect(connectionsContainer.resolve('db'), bootstrapContainer)
    .then(storageRepo => {
      bootstrapContainer.register('storageRepo', asValue(storageRepo));
      logger.info("DB repository functions connected");

      storageRepo.schema.bootstrap().then(schemaSuccess => {
        console.log(schemaSuccess);
        webServer.start(bootstrapContainer);
      }, schemaFailed => {
        logger.error('Schema bootstrap failed ', schemaFailed);
      });

      
    });
});

mediator.on('db.error', (err) => {
  logger.error(err);
});

mediator.on('s3.error', (err) => {
  logger.error(err);
});

mediator.on('generic.log', (msg, level = 'info') => {
  if(logger.levels[level]){
    logger[level](msg);
  } else {
    logger.info(msg);
  }
});

// emit that the service stript has finished
di.init(mediator);
mediator.emit('init', logger);
