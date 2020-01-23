/**
 * Filter operation
 *
 * @param {Function} predicate Callback, that return `true | false`
 * @returns Function, that expect list, and apply filter with predicate to it.
 */
function filter(predicate) {
  return function(coll) {
    return coll.filter(predicate);
  };
}

export default filter;
