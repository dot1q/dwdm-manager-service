
import {dbSettings, dwdmManagerSettings, logSettings} from './config';
import {initDi} from './di';
import * as db from './mysql/mysql';

const init = initDi.bind(null, {dbSettings, dwdmManagerSettings, logSettings, db});

export {init, logSettings};