/**
 * Sort operation
 *
 * @param {Function} fn Function, that will be applied to compared arguments.
 * For example it can be used to extract values by key from compared objects.
 *
 * @param {String} [direction='asc'] Specifies the direction of sorting.
 * Valid values: `asc | desc`. Optional, default direction - ascendant.
 *
 * @returns Function, that expect list, and apply sort to it.
 */
function sort(fn, direction) {
  return function(coll) {
    return coll.sort(
      function(a, b) {
        if (direction === 'desc') {
          return fn(a) < fn(b) ? 1 : -1;
        }
        return fn(a) > fn(b) ? 1 : -1;
      }
    );
  };
}

export default sort;
