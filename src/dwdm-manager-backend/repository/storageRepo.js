'use strict';

import { nodesRepo } from './storage/nodes';
import { spansRepo } from './storage/spans';
import { schemaRepo } from './storage/schemaRepo';
import { wavelengthRepo } from './storage/wavelength';


const repository = (connection, container) => {
  const logger = container.resolve('logger');
  const nodes = nodesRepo(connection, container);
  const spans = spansRepo(connection, container);
  const wavelength = wavelengthRepo(connection, container);
  const schema = schemaRepo(connection, container);

  return Object.create({
    nodes,
    spans,
    wavelength,
    schema,
  });
};

const connect = (connection, container) => {
  return new Promise((resolve, reject) => {
    if(!connection) {
      reject(new Error('no database connection found'));
    } else if(!container) {
      reject(new Error('no DI found'));
    }
    resolve(repository(connection, container));
  });
};

export {connect};