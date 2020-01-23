import isPlainObject from 'lodash/isPlainObject';
import isFunction from 'lodash/isFunction';
import isArray from 'lodash/isArray';

import * as $ from './operations';

function query(collection, operations) {
  const coll = collection || [];
  const ops = operations || [];

  function isKey(value) { return typeof value === 'string' }
  function isEmpty(value) { return typeof value === 'undefined' }

  /**
   * Build list with operations, by adding one or several operations.
   *
   * @param {Array | Function} operations Type `Array | Function`
   * @returns Query function for chaining
   */
  function build(operations) {
    if (isArray(operations)) {
      return query(coll, ops.concat(operations));
    }
    return query(coll, ops.concat([operations]));
  }

  /**
   * Apply all operations to collection
   * @param {Array} collection
   * @param {Array} operations
   */
  function apply(collection, operations) {
    return operations.reduce(
      function(result, operation) { return operation(result); },
      collection.slice()
    );
  }

  return {
    /**
     * Add collection for query
     * @param {Array} collection
     */
    from: function(collection) {
      return query(coll.concat(collection), ops);
    },

    /**
     * Query
     * @param {*} arg Plain object, function or key
     * @param {String} value Optional, if first argument used as `key`
     */
    where: function(arg, value) {
      if (isPlainObject(arg)) {
        return build($.createFiltersByQueryObject(arg));
      }
      if (isFunction(arg)) {
        return build($.createFilterByFn(arg));
      }
      if (isKey(arg) && !isEmpty(value)) {
        return build($.createFilterByPair(arg, value));
      }
      return query(coll, ops);
    },

    /**
     * Order by
     * @param {*} arg Function, or String as `key`
     * @param {String} [direction='asc'] String value: `asc | desc`
     */
    orderBy: function(arg, direction) {
      if (isFunction(arg)) {
        return build($.createSortByFn(arg, direction));
      }
      if (isKey(arg)) {
        return build($.createSortByKey(arg, direction));
      }
      return apply(coll, ops);
    },

    /**
     * Selects values from the collection, after applying clauses `where` and `orderBy`.
     * Depending on the argument, it returns:
     * - a list of objects with the entire fields, if it calls without arguments
     * - a list of objects with selected fields, for argument, that contains list of keys
     * - a list of values, if argument contains `key`
     *
     * This should be the last operation in the chain.
     *
     * @param {*} [arg] Key, array of keys, function. Optional.
     * @returns List with query results.
     */
    select: function(arg) {
      if (isFunction(arg)) {
        return build($.createMapByFn(arg)).toArray();
      }
      if (isArray(arg)) {
        return build($.createMapByKeys(arg)).toArray();
      }
      if (isKey(arg)) {
        return build($.createMapByKey(arg)).toArray();
      }
      return apply(coll, ops);
    },

    /**
     * Applies all operations and returns results
     * @returns Array with query result
     */
    toArray: function() {
      return apply(coll, ops);
    }
  };
}

export default query;
