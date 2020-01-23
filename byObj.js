import isPlainObject from 'lodash/isPlainObject';
import byKeyValue from './byKeyValue';

/**
 * Allow to define your search terms as plain object.
 *
 * @example
 * ```
 * const list = byObj_({ id: 123, name: 'Joe' });
 *
 * // list will contain:
 * [
 *  (item) => item['id'] === 123,
 *  (item) => item['name'] === 'Joe'
 * ]
 * ```
 * @param {Object} obj Plain query object
 * @returns Array of predicates: [`(item) => item[key] === value`, ... ]
 */
function byObj(obj) {
  if (!isPlainObject(obj)) return [];
  return Object.entries(obj).map(
    function(entry) {
      const key = entry[0];
      const value = entry[1];
      return byKeyValue(key, value);
    }
  );
}

export default byObj;
