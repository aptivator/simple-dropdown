import {addTrapDefinitions} from 'var-trap';

addTrapDefinitions('callbacks', {
  storeFactory: () => [],
  valueAdder: (callback, callbacks) => callbacks.push(callback),
  methods: {
    clear(callbacks) {
      callbacks.forEach((callback) => callback());
      callbacks.splice(0);
    }
  }
});
