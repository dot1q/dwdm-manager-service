'use strict';

import { privateApiV1Nodes } from './private/nodes';
import { privateApiV1Spans } from './private/spans';
import { privateApiV1Wavelength } from './private/wavelength';

const VERSION = 'v1';
const PRIVATE_URI = 'secure/' + VERSION;
const PUBLIC_URI = 'public/' + VERSION;
const INTERNAL_URI = 'internal/' + VERSION;

const apiV1 = (app, container) => {

  privateApiV1Nodes(app, container, VERSION);
  privateApiV1Spans(app, container, VERSION);
  privateApiV1Wavelength(app, container, VERSION);
};

export { apiV1 };