'use strict';

const privateApiV1Nodes = (app, container, VERSION) => {
  const storageRepo = container.resolve('storageRepo');
  const logger = container.resolve('logger');

  const PATH = '/'+VERSION+'/nodes';

  app.get(PATH + '/get-nodes', async (req, res, next) => {
    try {
      const responseData = await storageRepo.nodes.getNodes(req.params);
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

  app.get(PATH + '/get-node/:id', async (req, res, next) => {
    try {
      const responseData = await storageRepo.nodes.getNode(req.params);
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

  app.post(PATH + '/add-node', async (req, res, next) => {
    try {
      const responseData = await storageRepo.nodes.addNode(req.body);
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
  
  app.put(PATH + '/update-node', async (req, res, next) => {
    try {
      const responseData = await storageRepo.nodes.updateNode(req.body);
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

  app.delete(PATH + '/del-node/:id', async (req, res, next) => {
    try {
      const responseData = await storageRepo.nodes.deleteNode(req.params.id);
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

  app.get(PATH + '/search-node-filtered', async (req, res, next) => {
    try {
      const responseData = await storageRepo.nodes.searchNodes(req.query);
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


export { privateApiV1Nodes };