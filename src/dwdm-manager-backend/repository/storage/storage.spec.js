'use strict';
import {createContainer, asValue} from 'awilix';
import * as storageRepo from '../storageRepo';

let logger = { error: (err) => {}, info: (inf) => {}, debug: (inf) => {} };

describe('Storage repo connection', () => {
    const container = createContainer();
    container.register('logger', asValue(logger));
    container.register('dwdmManagerSettings', asValue({SFTP: 'dmca_set', debug: true}));

    it('should reject promise due to no DI', (done) => {
      storageRepo.connect({}).then((success) => {
        fail('should not be resolved');
        done();
      }, (err) => {
        expect(() => {throw err;}).toThrowError('no DI found');
        done();
      });
    });

    it('should reject promise due to null DI', (done) => {
      storageRepo.connect({}, null).then((success) => {
        fail('should not be resolved');
        done();
      }, (err) => {
        expect(() => {throw err;}).toThrowError('no DI found');
        done();
      });
    });

    it('should reject promise due to invalid DI', (done) => {
      storageRepo.connect({}, false).then((success) => {
        fail('should not be resolved');
        done();
      }, (err) => {
        expect(() => {throw err;}).toThrowError('no DI found');
        done();
      });
    });

    it('should reject promise due to no db connection obj supplied', (done) => {
      storageRepo.connect( null, container).then((success) => {
        fail('should not be resolved');
        done();
      }, (err) => {
        expect(() => {throw err;}).toThrowError('no database connection found');
        done();
      });
    });
});