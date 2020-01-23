/**
 * Take `key` and `value` and return predicate function
 * @param {String} key
 * @param {*} value
 * @returns Predicate `(item) => item[key] === value`
 */
function byKeyValue(key, value) {
  return function(item) {
    if (!key || typeof item !== 'object') {
      return false;
    }
    return item[key] === value;
  };
}

export default byKeyValue;
