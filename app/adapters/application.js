import LSAdapter from 'ember-localstorage-adapter';
import ENV from '../config/environment';

export default LSAdapter.extend({
  namespace: ENV.appName
});
