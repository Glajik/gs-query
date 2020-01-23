import pick from 'lodash/pick';

import map from './map';
import filter from './filter';
import sort from './sort';

import byKey from './byKey';
import byKeyValue from './byKeyValue';
import byObj from './byObj';

export function createMapByFn(fn) {
  return map(fn);
}

export function createMapByKeys(keys) {
  return map(
    function(item) { return pick(item, keys); }
  );
}

export function createMapByKey(key) {
  return map(byKey(key));
}

export function createFilterByFn(predicate) {
  return filter(predicate);
}

export function createFiltersByQueryObject(queryObject) {
  return byObj(queryObject).map(filter);
}

export function createFilterByPair(key, value) {
  return filter(byKeyValue(key, value));
}

export function createSortByFn(fn, direction) {
  return sort(fn, direction);
}

export function createSortByKey(key, direction) {
  return sort(byKey(key), direction);
}
