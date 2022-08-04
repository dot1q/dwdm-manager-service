import { createContainer, asValue } from 'awilix';

const initDi = ({dbSettings, dwdmManagerSettings, logSettings, db }, mediator) => {
    mediator.once('init', (logger) => {
        const bootstrapContainer = createContainer();
        const connectionsContainer = createContainer();

        bootstrapContainer.register({
            dbSettings: asValue(dbSettings),
            dwdmManagerSettings: asValue(dwdmManagerSettings),
            logSettings: asValue(logSettings),
            db: asValue(db),
            logger: asValue(logger)
        });

        bootstrapContainer.cradle.db.connect(mediator);

        mediator.emit('boot.ready', bootstrapContainer, connectionsContainer);
    });
};

export default initDi;