import {EventEmitter} from 'events';
import {init} from './';

describe ('DI configuration', () => {
    it('can init dependencies to the container', (done) => {
        const mediator = new EventEmitter();

        mediator.on('boot.ready', (container) => {
            done();
        });

        init(mediator);
        mediator.emit('init');
    });
});