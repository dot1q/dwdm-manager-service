'use strict';

const privateApiV1Wavelength = (app, container, VERSION) => {
  const storageRepo = container.resolve('storageRepo');
  const logger = container.resolve('logger');

  const PATH = '/'+VERSION+'/wavelength';

  app.get(PATH + '/get-wavelengths', async (req, res, next) => {
    try {
      const responseData = await storageRepo.wavelength.getWavelengths(req.params);
      res.status(200).json({
        result: 'success',
        message: null,
        data: responseData,
      });
    } catch (error) {
      logger.error(error);
      res.status(500).json({
        result: 'failed',
        message: error,
        data: null,
      });
    }
  });

  app.get(PATH + '/get-wavelength/:id', async (req, res, next) => {
    try {
      const responseData = await storageRepo.wavelength.getWavelength(req.params);
      res.status(200).json({
        result: 'success',
        message: null,
        data: responseData,
      });
    } catch (error) {
      logger.error(error);
      res.status(500).json({
        result: 'failed',
        message: error,
        data: null,
      });
    }
  });

  app.get(PATH + '/get-wavelength-joins/:id', async (req, res, next) => {
    try {
      const responseData = await storageRepo.wavelength.getWavelengthJoins(req.params);
      res.status(200).json({
        result: 'success',
        message: null,
        data: responseData,
      });
    } catch (error) {
      logger.error(error);
      res.status(500).json({
        result: 'failed',
        message: error,
        data: null,
      });
    }
  });

  app.post(PATH + '/add-wavelength', async (req, res, next) => {
    try {
      const responseData = await storageRepo.wavelength.addWavelength(req.body);
      res.status(200).json({
        result: 'success',
        message: null,
        data: responseData,
      });
    } catch (error) {
      logger.error(error);
      res.status(500).json({
        result: 'failed',
        message: error,
        data: null,
      });
    }
  });
  
  app.put(PATH + '/update-wavelength', async (req, res, next) => {
    try {
      const responseData = await storageRepo.wavelength.updateWavelength(req.body);
      res.status(200).json({
        result: 'success',
        message: null,
        data: responseData,
      });
    } catch (error) {
      logger.error(error);
      res.status(500).json({
        result: 'failed',
        message: error,
        data: null,
      });
    }
  });

  app.delete(PATH + '/del-wavelength/:id', async (req, res, next) => {
    try {
      const responseData = await storageRepo.wavelength.deleteWavelength(req.params.id);
      res.status(200).json({
        result: 'success',
        message: null,
        data: responseData,
      });
    } catch (error) {
      logger.error(error);
      res.status(500).json({
        result: 'failed',
        message: error,
        data: null,
      });
    }
  });

  app.get(PATH + '/get-wavelength-geom', async (req, res, next) => {
    try {
      const responseData = await storageRepo.wavelength.getSpansGeom();
      res.status(200).json({
        result: 'success',
        message: null,
        data: responseData,
      });
    } catch (error) {
      logger.error(error);
      res.status(500).json({
        result: 'failed',
        message: error,
        data: null,
      });
    }
  });

  app.get(PATH + '/search-circuits', async (req, res, next) => {
    try {
      const responseData = await storageRepo.wavelength.searchCircuits(req.query);
      res.status(200).json({
        result: 'success',
        message: null,
        data: responseData,
      });
    } catch (error) {
      logger.error(error);
      res.status(500).json({
        result: 'failed',
        message: error,
        data: null,
      });
    }
  });

  app.get(PATH + '/get-wavelength-span-joins/:id', async (req, res, next) => {
    try {
      const responseDataTableData = await storageRepo.wavelength.getWavelengthSpanJoins(req.params);
      // const nodes = await storageRepo.wavelength.getWavelengthNodes(req.params);
      res.status(200).json({
        result: 'success',
        message: null,
        data: {
          tableData: responseDataTableData,
        },
      });
    } catch (error) {
      logger.error(error);
      res.status(500).json({
        result: 'failed',
        message: error,
        data: null,
      });
    }
  });


};


export { privateApiV1Wavelength };