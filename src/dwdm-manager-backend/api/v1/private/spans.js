'use strict';

const privateApiV1Spans = (app, container, VERSION) => {
  const storageRepo = container.resolve('storageRepo');
  const logger = container.resolve('logger');

  const PATH = '/'+VERSION+'/spans';

  app.get(PATH + '/get-spans', async (req, res, next) => {
    try {
      const responseData = await storageRepo.spans.getSpans(req.params);
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

  app.get(PATH + '/get-span/:id', async (req, res, next) => {
    try {
      const responseData = await storageRepo.spans.getSpan(req.params);
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

  app.post(PATH + '/add-span', async (req, res, next) => {
    try {
      const responseData = await storageRepo.spans.addSpan(req.body);
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
  
  app.put(PATH + '/update-span', async (req, res, next) => {
    try {
      const responseData = await storageRepo.spans.updateSpan(req.body);
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

  app.delete(PATH + '/del-span/:id', async (req, res, next) => {
    try {
      const responseData = await storageRepo.spans.deleteSpan(req.params.id);
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

  app.get(PATH + '/get-spans-geom', async (req, res, next) => {
    try {
      const responseData = await storageRepo.spans.getSpansGeom();
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

  app.post(PATH + '/get-spans-filtered', async (req, res, next) => {
    try {
      const responseData = await storageRepo.spans.searchSpans(req.body);
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

};


export { privateApiV1Spans };