import Route from 'ember-route';
import get from 'ember-metal/get';
import {load, dump} from '../models/segment';

const SEPARATOR = ',';
const PARAM = 's';
const DEFAULT = '100:150,150:150.2,50:150.1,50:5';

export default Route.extend({

  queryParams: {
    [PARAM]: {}
  },

  model(params) {
    const dumps = (params[PARAM] || DEFAULT).split(SEPARATOR);
    const store = get(this, 'store');
    return dumps.map(p => load(p, store));
  },

  actions: {

    create() {
      const segment = this.store.createRecord('segment');
      const segments = this.modelFor(this.routeName).addObject(segment);
      this.send('update');
    },

    update() {
      const segments = this.modelFor(this.routeName);
      const dumps = segments.map(dump);
      return this.transitionTo('application',
        {queryParams: {[PARAM]: dumps.join(SEPARATOR)}});
    },

    delete(index) {
      this.modelFor(this.routeName).removeAt(index);
      this.send('update');
    }

  }

});
