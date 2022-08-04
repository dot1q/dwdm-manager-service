'use strict';
import moment from 'moment';

const wavelengthRepo = (connection, container) => {
  const connectionPromise = connection.promise();
  const dwdmManagerSettings = container.resolve('dwdmManagerSettings');
  const logger = container.resolve('logger');

  const getWavelengths = async (params) => {
    try {
      const [nodesResult] = await connectionPromise.query(`SELECT s.id, s.customer, s.circuit_id, s.status
          FROM ${dwdmManagerSettings.waveLengthTable} s
      `, [params.id]);

      return nodesResult;
    } catch (error) {
      console.log(error);
      throw (error);
    }
  }

  const getWavelength = async (params) => {
    try {
      const [result] = await connectionPromise.query(`SELECT id, customer, status, circuit_id
      FROM ${dwdmManagerSettings.waveLengthTable} WHERE id=? LIMIT 1
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

  const getWavelengthJoins = async (params) => {
    try {
      const [result] = await connectionPromise.query(`SELECT w.*, s.name
      FROM ${dwdmManagerSettings.waveLengthJoinTable} w
      JOIN ${dwdmManagerSettings.spansTable} s ON w.wavelength_span_id = s.id
      WHERE w.wavelength_record_id=?
      `, [params.id]);
     return result;
    } catch (error) {
      console.log(error);
      throw (error);
    }
  };

  const addWavelength = async (params) => {
    try {

      const [result] = await connectionPromise.query(`INSERT INTO
          ${dwdmManagerSettings.waveLengthTable} (customer, status, circuit_id)
          VALUES (?, ?, ?)
      `, [
        params.name,
        params.status,
        params.circuitId,
      ]);

      for (let i = 0; i < params.channels.length; i++) {
        const [joinTableResult] = await connectionPromise.query(`INSERT INTO
            ${dwdmManagerSettings.waveLengthJoinTable} (channel, wavelength_record_id, wavelength_span_id)
            VALUES (?, ?, ?)
        `, [
          params.channels[i].channel,
          result.insertId,
          params.channels[i].spanId,
        ]);
      }

      return result.insertId;
    } catch (error) {
      console.log(error);
      throw (error);
    }
  };

  const updateWavelength = async (params) => {
    try {
      const [result] = await connectionPromise.query(`UPDATE ${dwdmManagerSettings.waveLengthTable} SET
      status=?, customer=?, circuit_id=?
      WHERE id = ?
      `, [
        params.status,
        params.customer,
        params.circuitId,
        params.id,
      ]);

      // Get all wavelength join table for id
      let [wavelengthSpanTable] = await connectionPromise.query(`SELECT *
      FROM ${dwdmManagerSettings.waveLengthJoinTable} WHERE wavelength_record_id=?
      `, [params.id]);

      wavelengthSpanTable.forEach((recSpan, recIdx) => {
        params.channelSpanTable.forEach((cstRec, cstIdx) => {
          if (recSpan.wavelength_span_id === cstRec.spanId) {
            delete wavelengthSpanTable[recIdx];
            delete params.channelSpanTable[cstIdx];
          }
        })
      })

      // Reindex
      wavelengthSpanTable = wavelengthSpanTable.filter(val => val);
      const adjustConst = params.channelSpanTable.filter(val => val);

      console.log(wavelengthSpanTable);
      console.log(adjustConst);

      for (let i = 0; i < wavelengthSpanTable.length; i++) {
        await connectionPromise.query(`
          DELETE FROM ${dwdmManagerSettings.waveLengthJoinTable} WHERE id = ?
        `, [wavelengthSpanTable[i].id]);
      };

      for (let i = 0; i < adjustConst.length; i++) {
        await connectionPromise.query(`
            INSERT INTO
            ${dwdmManagerSettings.waveLengthJoinTable} (channel, wavelength_record_id, wavelength_span_id)
            VALUES (?, ?, ?)
        `, [
          adjustConst[i].channel,
          params.id,
          adjustConst[i].spanId,
        ]);
      };

      return true;
    } catch (error) {
      console.log(error);
      throw (error);
    }
  };


  const deleteWavelength = async (id) => {
    try {
      const [deleteJoins] = await connectionPromise.query(`DELETE FROM
        ${dwdmManagerSettings.waveLengthJoinTable} WHERE wavelength_record_id=?
    `, [id]);

      const [deleteResult] = await connectionPromise.query(`DELETE FROM
          ${dwdmManagerSettings.waveLengthTable} WHERE id=?
      `, [id]);
      return id;
    } catch (error) {
      console.log(error);
      throw (error);
    }
  };

  const getWavelengthsGeom = async (params) => {
    try {
      const [spansResult] = await connectionPromise.query(`SELECT s.id, s.name, s.owner, n.name AS loc_a, m.name AS loc_b, s.status, 
          CAST(ST_AsGeoJSON(n.geom) AS JSON) AS loc_a_geom,
          CAST(ST_AsGeoJSON(m.geom) AS JSON) AS loc_b_geom
          FROM ${dwdmManagerSettings.waveLengthTable} s
          JOIN ${dwdmManagerSettings.nodesTable} n ON s.loc_a = n.id
          JOIN ${dwdmManagerSettings.nodesTable} m ON s.loc_b = m.id
      `, []);

      return spansResult;
    } catch (error) {
      console.log(error);
      throw (error);
    }
  };

  const searchCircuits = async (params) => {
    console.log(params);

    try {
      const [nodesResult] = await connectionPromise.query(`SELECT c.id, c.circuit_id
          FROM ${dwdmManagerSettings.waveLengthTable} c WHERE c.circuit_id LIKE ?
      `, [`%${params.id}%`]);

      return nodesResult;
    } catch (error) {
      console.log(error);
      throw (error);
    }
  };

  const getWavelengthSpanJoins = async (params) => {
    try {
      const [result] = await connectionPromise.query(`SELECT w.*, s.name, n.name AS loc_a_name, m.name AS loc_b_name, s.status, s.loc_a, s.loc_b, n.name AS loc_a_name, m.name AS loc_b_name,
      CAST(ST_AsGeoJSON(n.geom) AS JSON) AS loc_a_geom,
      CAST(ST_AsGeoJSON(m.geom) AS JSON) AS loc_b_geom
      FROM ${dwdmManagerSettings.waveLengthJoinTable} w
      JOIN ${dwdmManagerSettings.spansTable} s ON w.wavelength_span_id = s.id
      JOIN ${dwdmManagerSettings.nodesTable} n ON s.loc_a = n.id
      JOIN ${dwdmManagerSettings.nodesTable} m ON s.loc_b = m.id
      WHERE w.wavelength_record_id=?
      `, [params.id]);
     return result;
    } catch (error) {
      console.log(error);
      throw (error);
    }
  };

  return Object.create({
    getWavelengths,
    addWavelength,
    getWavelength,
    getWavelengthJoins,
    updateWavelength,
    deleteWavelength,
    getWavelengthsGeom,
    searchCircuits,
    getWavelengthSpanJoins,
  });
};


export { wavelengthRepo };