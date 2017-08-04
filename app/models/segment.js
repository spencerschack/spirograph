import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import get from 'ember-metal/get';

export function load(str, store) {
  const [length, period] = str.split(':');
  return store.createRecord('segment', {
    length: parseFloat(length),
    period: parseFloat(period)
  });
}

export function dump(model) {
  return get(model, 'length') + ':' + get(model, 'period');
}

export default Model.extend({

  length: attr('number', {defaultValue: 1}),
  period: attr('number', {defaultValue: 1})
  
});
