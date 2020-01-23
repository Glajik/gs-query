/**
 * Takes `key` and returns function, that expect plain object,
 * from which will be taken value by that `key`
 *
 * @returns Function
 * @param {String} key
 */
function byKey(key) {
  return function (item) { return item[key]; };
}

export default byKey;
