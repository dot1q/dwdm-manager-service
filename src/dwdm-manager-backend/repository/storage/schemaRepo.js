'use strict';
import fs from 'fs';
import util from 'util';
import path from 'path';

const readdir = util.promisify(fs.readdir);
const readFile = (fileName) => util.promisify(fs.readFile)(fileName, 'utf8');

const schemaRepo = (connection, container) => {
  const connectionPromise = connection.promise();
  const dwdmManagerSettings = container.resolve('dwdmManagerSettings');
  const dbSettings = container.resolve('dbSettings');
  const logger = container.resolve('logger');

  const bootstrap = async (params) => {
    // Try to connect to table
    try {
      const [tableExists] = await connectionPromise.query(`SELECT EXISTS( SELECT * FROM information_schema.tables WHERE table_schema = '${dbSettings.db}' AND table_name = '${dwdmManagerSettings.attributesTable}') AS tableResult;`, []);
      logger.debug(tableExists);

      if (tableExists.length > 0 && tableExists[0].tableResult === 0) {
        logger.warn('Database exists, but is empty, creating...');
        // CREATE TABLE `attributes` ( `attrib_name` VARCHAR(255) NOT NULL , `attrib_value` VARCHAR(255) NOT NULL ) ENGINE = InnoDB CHARSET=utf32 COLLATE utf32_general_ci;
        const [createTable] = await connectionPromise.query('CREATE TABLE `attributes` ( `attrib_name` VARCHAR(255) NOT NULL , `attrib_value` VARCHAR(255) NOT NULL ) ENGINE = InnoDB CHARSET=utf32 COLLATE utf32_general_ci;', []);
        logger.debug(createTable);
        logger.info('DB Bootstrapped');
      }
    } catch (error) {
      logger.error('error', error);
      process.exit(1);
    }
    


    try {
      let schema = null;
      let retry = false;
      do {
        const [schemaVersion] = await connectionPromise.query(`SELECT attrib_value FROM ${dwdmManagerSettings.attributesTable} WHERE attrib_name='schema_version' LIMIT 1`, []);
        if (schemaVersion.length > 0){
          retry = false;
          schema = schemaVersion[0].attrib_value;
        } else {
          logger.warn('No version found, starting schema at version 000');
          const [schemaResult] = await connectionPromise.query(`INSERT INTO ${dwdmManagerSettings.attributesTable} (attrib_name, attrib_value) VALUES ('schema_version', '000')`, []);
          if (schemaResult.affectedRows === 1) {
            retry = true;
          }
        }
      } while (retry);

      // Read schema files
      const files = await readdir(path.join(__dirname, '../../config/mysql/schema'));
      if(files.length > 0) {
        const regex = new RegExp(/^\d+\.sql$/);
        const filesMatched = files.filter(fileName => fileName.match(regex));
        files.sort();
        for (let i = 0; i < filesMatched.length; i++) {
          const fileVersion = path.basename(filesMatched[i], '.sql');
          if (fileVersion*1 > schema*1) {
            logger.warn(`-- Updating database/file schema to ${filesMatched[i]}`);            
            const file2 = fs.readFileSync(path.join(__dirname, '../../config/mysql/schema/', filesMatched[i]), 'utf8');
            const array = file2.toString().split('\n');
            for (let i in array) {
              if (array[i].length > 0) {
                const [schemaResult] = await connectionPromise.query(array[i], []);
              }
            }
            await connectionPromise.query(`UPDATE ${dwdmManagerSettings.attributesTable} SET attrib_value = ? WHERE attrib_name = 'schema_version'`, [fileVersion.toString()]);
          }
        }
        
        logger.info(`Database is up to date`);
        return true;
      } else {
        throw 'No DB revisions found';
      }

    } catch (error) {
      throw (error);
    }
  }

  return Object.create({
    bootstrap,
  });
};


export { schemaRepo };