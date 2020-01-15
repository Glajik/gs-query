import isPlainObject from 'lodash/isPlainObject';
import isFunction from 'lodash/isFunction';
import isArray from 'lodash/isArray'
import pick from 'lodash/pick';

/**
 * Takes `key` and returns function, that expect plain object,
 * from which will be taken value by that `key`
 * 
 * @returns Function
 * @param {String} key 
 */
function byKey_(key) {
  return function (item) { return item[key] }
};

/**
 * Take `key` and `value` and return predicate function
 * @param {String} key 
 * @param {*} value 
 * @returns Predicate `(item) => item[key] === value`
 */
export function byKeyValue_(key, value) {
  return function(item) {
    if (!key || typeof item !== 'object') {
      return false;
    }
    return item[key] === value;
  }
};

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
export function byObj_(obj) {
  if (!isPlainObject(obj)) return [];
  return Object.entries(obj).map(
    function(entry) {
      const key = entry[0];
      const value = entry[1];
      return byKeyValue_(key, value);
    }
  )
};

/**
 * Map operation
 * 
 * @param {Function} callback Function, that will be applied to each item in collection
 * @returns Function, that expect list, and apply map with callback to it.
 */
function map_(callback) {
  return function(coll) {
    return coll.map(callback);
  }
}

/**
 * Filter operation
 * 
 * @param {Function} predicate Callback, that return `true | false`
 * @returns Function, that expect list, and apply filter with predicate to it.
 */
function filter_(predicate) {
  return function(coll) {
    return coll.filter(predicate);
  }
}

/**
 * Sort operation
 * 
 * @param {Function} fn Function, that will be applied to compared arguments. For example it can be used to extract values by key from compared objects.
 * @param {String} [direction='asc'] Specifies the direction of sorting. Valid values: `asc | desc`. Optional, default direction - ascendant.
 * @returns Function, that expect list, and apply sort to it.
 */
function sort_(fn, direction) {
  return function(coll) {
    return coll.sort(
      function(a, b) {
        if (direction === 'desc') {
          return fn(a) < fn(b) ? 1 : -1;
        }
        return fn(a) > fn(b) ? 1 : -1;
      }
    )
  }
}

// Operations

export function createMapByFn(fn) {
  return map_(fn);
}

export function createMapByKeys(keys) {
  return map_(
    function(item) { return pick(item, keys) }
  )
}

export function createMapByKey(key) {
  return map_(byKey_(key));
}

export function createFilterByFn(predicate) {
  return filter_(predicate);
}

export function createFiltersByQueryObject(queryObject) {
  return byObj_(queryObject).map(filter_);
}

export function createFilterByPair(key, value) {
  return filter_(byKeyValue_(key, value));
}

export function createSortByFn(fn, direction) {
  return sort_(fn, direction);
}

export function createSortByKey(key, direction) {
  return sort_(byKey_(key), direction);
}

function query(collection, operations) {
  const coll = collection || [];
  const ops = operations || [];

  function isKey(value) { return typeof value === 'string' }
  function isEmpty(value) { return typeof value === undefined }

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
      function(result, operation) { return operation(result) },   collection.slice()
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
        return build(createFiltersByQueryObject(arg));
      }
      if (isFunction(arg)) {
        return build(createFilterByFn(arg));
      }
      if (isKey(arg) && !isEmpty(value)) {
        return build(createFilterByPair(arg, value));
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
        return build(createSortByFn(arg, direction))
      }
      if (isKey(arg)) { 
        return build(createSortByKey(arg, direction));
      }
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
        return build(createMapByFn(arg)).toArray();
      }
      if (isArray(arg)) {
        return build(createMapByKeys(arg)).toArray();
      }
      if (isKey(arg)) {
        return build(createMapByKey(arg)).toArray();
      };
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
