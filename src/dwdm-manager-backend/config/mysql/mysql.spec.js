'use strict';

import * as mysql from './mysql';
import {createContainer, asValue} from 'awilix';
const {EventEmitter} = require('events');
const mediator = new EventEmitter();

const logger = { error: (err) => {}, info: (inf) => {}, warn: (war) => {} };
process.exit = (code) => {};

describe('MySQL connections test', () => {
  it('shouldn\'t connect to database', (done) => {    
    const testContainer = createContainer();
    const connectionsContainer = createContainer();
    testContainer.register('dbSettings', asValue({host:'asdf', user:'foo', password:'bar', port:'3306', database: 'dummy', connectTimeout: 100}));
    testContainer.register('logger', asValue(logger));
    mysql.connect(mediator);

    mediator.on('db.error', (err) => {
      done();
    });
    
    mediator.on('db.ready', (testContainer, conn) => {
      fail('db connection should fail');
    });
    
    mediator.emit('boot.ready', testContainer, connectionsContainer);
  });
});