'use strict';
import moment from 'moment';

const spansRepo = (connection, container) => {
  const connectionPromise = connection.promise();
  const dwdmManagerSettings = container.resolve('dwdmManagerSettings');
  const logger = container.resolve('logger');

  const getSpans = async (params) => {
    try {
      const [nodesResult] = await connectionPromise.query(`SELECT s.id, s.name, s.owner, n.name AS loc_a, m.name AS loc_b, s.status
          FROM ${dwdmManagerSettings.spansTable} s
          JOIN ${dwdmManagerSettings.nodesTable} n ON s.loc_a = n.id
          JOIN ${dwdmManagerSettings.nodesTable} m ON s.loc_b = m.id
      `, [params.id]);

      return nodesResult;
    } catch (error) {
      console.log(error);
      throw (error);
    }
  }

  const getSpan = async (params) => {
    try {
      const [result] = await connectionPromise.query(`SELECT id, name, status, owner, loc_a, loc_b
      FROM ${dwdmManagerSettings.spansTable} WHERE id=? LIMIT 1
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

  const addSpan = async (params) => {
    try {

      const [result] = await connectionPromise.query(`INSERT INTO
          ${dwdmManagerSettings.spansTable} (name, status, owner, loc_a, loc_b)
          VALUES (?, ?, ?, ?, ?)
      `, [
        params.name,
        params.status,
        params.owner,
        params.locationa,
        params.locationb,
      ]);
      return result.insertId;
    } catch (error) {
      console.log(error);
      throw (error);
    }
  };

  const updateSpan = async (params) => {
    try {
      const [result] = await connectionPromise.query(`UPDATE ${dwdmManagerSettings.spansTable} SET
      name=?, status=?, owner=?, loc_a=?, loc_b=?
      WHERE id = ?
      `, [
        params.name,
        params.status,
        params.owner,
        params.locationa,
        params.locationb,
        params.id,
      ]);
      return true;
    } catch (error) {
      console.log(error);
      throw (error);
    }
  };


  const deleteSpan = async (id) => {
    try {
      const [paymentDeleteResult] = await connectionPromise.query(`DELETE FROM
          ${dwdmManagerSettings.spansTable} WHERE id=?
      `, [
        id,
      ]);
      return id;
    } catch (error) {
      console.log(error);
      throw (error);
    }
  };

  const getSpansGeom = async (params) => {
    try {
      const [spansResult] = await connectionPromise.query(`SELECT s.id, s.name, s.owner, n.name AS loc_a, m.name AS loc_b, s.status, 
          CAST(ST_AsGeoJSON(n.geom) AS JSON) AS loc_a_geom,
          CAST(ST_AsGeoJSON(m.geom) AS JSON) AS loc_b_geom
          FROM ${dwdmManagerSettings.spansTable} s
          JOIN ${dwdmManagerSettings.nodesTable} n ON s.loc_a = n.id
          JOIN ${dwdmManagerSettings.nodesTable} m ON s.loc_b = m.id
      `, []);

      return spansResult;
    } catch (error) {
      console.log(error);
      throw (error);
    }
  }

  const searchSpans = async (params) => {
    console.log(params);
    let additionalSql = ''
    if (params.exclude.length > 0) {
      params.exclude.forEach(exclude => {
        additionalSql += ` AND id != ${exclude * 1}`;
      })
      
    }

    try {
      const [nodesResult] = await connectionPromise.query(`SELECT id AS value, name AS label
          FROM ${dwdmManagerSettings.spansTable} WHERE name LIKE ? AND status = 1 ${additionalSql};
      `, [`%${params.name}%`, additionalSql]);

      return nodesResult;
    } catch (error) {
      console.log(error);
      throw (error);
    }
  }

  return Object.create({
    getSpans,
    addSpan,
    getSpan,
    updateSpan,
    deleteSpan,
    getSpansGeom,
    searchSpans
  });
};


export { spansRepo };