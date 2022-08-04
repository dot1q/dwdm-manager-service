
const dbSettings = {
  db: process.env.DB || 'dwdm_prod',
  user: process.env.DB_USER || 'dev',
  pass: process.env.DB_PASS || 'password',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || '3306'
};

const dwdmManagerSettings = {
  debug: process.env.DEBUG === "true" ? true : false,    // debug will print more verbose messages
  nowrite: process.env.NOWRITE === "true" ? true : false, // no write will not commit anything to the sql repository or mail system
  attributesTable: 'attributes',
  nodesTable: 'nodes',
  spansTable: 'spans',
  waveLengthTable: 'wavelengths',
  waveLengthJoinTable: 'wavelengths_join_table',

  apiGatewayUri: process.env.GWSERVICEURI || 'api-gateway-service.service.consul',  
  devLocalService: 'http://localhost:8080',
};

const logSettings = {
  writeToFile: false || process.env.WRITETOFILE,
  logColors: process.env.LOGCOLORS === "false" ? 'none': 'all',
};


export {dbSettings, dwdmManagerSettings, logSettings};
