'use strict';
import moment from 'moment';

const nodesRepo = (connection, container) => {
  const connectionPromise = connection.promise();
  const dwdmManagerSettings = container.resolve('dwdmManagerSettings');
  const logger = container.resolve('logger');

  const getNodes = async (params) => {
    try {
      const [nodesResult] = await connectionPromise.query(`SELECT id, name, status, CAST(ST_AsGeoJSON(geom) AS JSON) AS geom
          FROM ${dwdmManagerSettings.nodesTable}
      `, [params.id]);

      return nodesResult;
    } catch (error) {
      console.log(error);
      throw (error);
    }
  }

  const getNode = async (params) => {
    try {
      const [result] = await connectionPromise.query(`SELECT id, name, status, CAST(ST_AsGeoJSON(geom) AS JSON) AS geom
      FROM ${dwdmManagerSettings.nodesTable} WHERE id=? LIMIT 1
      `, [params.id]);
      if (result.length > 0){
        return result[0];
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
      throw (error);
    }
  };

  const addNode = async (params) => {
    try {

      const [result] = await connectionPromise.query(`INSERT INTO
          ${dwdmManagerSettings.nodesTable} (name, status, geom)
          VALUES (?, ?, ST_GeomFromGeoJSON(?))
      `, [
        params.name,
        params.status,
        JSON.stringify(params.geom),

      ]);
      return result.insertId;
    } catch (error) {
      console.log(error);
      throw (error);
    }
  };

  const updateNode = async (params) => {
    try {
      const [result] = await connectionPromise.query(`UPDATE ${dwdmManagerSettings.nodesTable} SET
      name=?, status=?, geom=ST_GeomFromGeoJSON(?)
      WHERE id = ?
      `, [
        params.name,
        params.status,
        JSON.stringify(params.geom),
        params.id,
      ]);
      return true;
    } catch (error) {
      console.log(error);
      throw (error);
    }
  };


  const deleteNode = async (id) => {
    console.log(id);

    try {
      const [paymentDeleteResult] = await connectionPromise.query(`DELETE FROM
          ${dwdmManagerSettings.nodesTable} WHERE id=?
      `, [
        id,
      ]);
      return id;
    } catch (error) {
      console.log(error);
      throw (error);
    }
  };

  const searchNodes = async (params) => {
    console.log(params);
    let additionalSql = ''
    if (params.exclude.length > 0) {
      additionalSql = `AND id != ${params.exclude * 1}`;
    }

    try {
      const [nodesResult] = await connectionPromise.query(`SELECT id AS value, name as label, CAST(ST_AsGeoJSON(geom) AS JSON) AS geom
          FROM ${dwdmManagerSettings.nodesTable} WHERE name LIKE ? AND status = 1 ${additionalSql};
      `, [`%${params.name}%`, additionalSql]);

      return nodesResult;
    } catch (error) {
      console.log(error);
      throw (error);
    }
  }

  return Object.create({
    getNodes,
    addNode,
    getNode,
    updateNode,
    deleteNode,
    searchNodes,
  });
};


export { nodesRepo };