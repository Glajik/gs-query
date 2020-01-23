/**
 * Map operation
 *
 * @param {Function} callback Function, that will be applied to each item in collection
 * @returns Function, that expect list, and apply map with callback to it.
 */
function map(callback) {
  return function(coll) {
    return coll.map(callback);
  };
}

export default map;
