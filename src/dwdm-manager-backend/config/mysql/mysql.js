import mysql from 'mysql2';
import { asValue } from 'awilix';

const connect = (mediator) => {
  mediator.once('boot.ready', (bootstrapContainer, connectionsContainer) => {
    let connection = mysql.createPool({
      connectionLimit : 8,
      host: bootstrapContainer.cradle.dbSettings.host,
      user: bootstrapContainer.cradle.dbSettings.user,
      password: bootstrapContainer.cradle.dbSettings.pass,
      port: bootstrapContainer.cradle.dbSettings.port,
      database: bootstrapContainer.cradle.dbSettings.db,
      connectTimeout: bootstrapContainer.cradle.dbSettings.connectTimeout || 10000,
      typeCast: function (field, next) {
        if (field.type == 'TINY' && field.length == 1) {
          return (field.string() == '1'); // 1 = true, 0 = false
        }
        return next();
      }
    });
   
    mysqlConnect(connection, mediator, bootstrapContainer, connectionsContainer);
  });
};

const mysqlConnect = (connection, mediator, bootstrapContainer, connectionsContainer) => {
  connection.getConnection( (err, db) => {
    if (err) {
      mediator.emit('db.error', 'Database Error - ' + err);
      process.exit(1);
    } else {
      connectionsContainer.register({db: asValue(connection)});
      mediator.emit('db.ready', bootstrapContainer, connectionsContainer);
      db.release();
    }
  });
};

export {connect};