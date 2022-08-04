'use strict';

const logSettings = {
  writeToFile: false
}

import logging from './logging.module';
describe('Logging tests', () => {
  it('should be an function', () => {
    expect(logging).toEqual(jasmine.any(Function))
  });
  
  it('should instantiate to an object', () => {
    let logObj = logging('test-case-service', logSettings);
    expect(logObj).toEqual(jasmine.any(Object))
  });

});