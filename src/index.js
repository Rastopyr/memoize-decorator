/**
 * @copyright 2015, Andrey Popp <8mayday@gmail.com>
 */

const SENTINEL = {};

export default function memoize() {
  return arguments.length > 1 ?  _memoize.apply(this, arguments) : _computedMemoize(arguments[0]);
}

function _computedMemoize(propName) {
  const props = propName instanceof Array ? propName : [propName];

  return function(target, name, descriptor) {
    return _memoize(target, name, descriptor, props);
  }
}

function _memoize(target, name, descriptor, props) {
  if (typeof descriptor.value === 'function') {
    return _memoizeMethod(target, name, descriptor, props);
  } else if (typeof descriptor.get === 'function') {
    return _memoizeGetter(target, name, descriptor, props);
  } else {
    throw new Error('@memoize decorator can be applied to methods or getters, got ' + String(descriptor.value) + ' instead');
  }
}

function _memoizeGetter(target, name, descriptor, props = []) {
  let memoizedName = `_memoized_${name}`;
  let memoizedPropName = `_memoized_props_${name}`;
  let get = descriptor.get;
  let shouldUpdate = false;
  target[memoizedName] = SENTINEL;
  target[memoizedPropName] = SENTINEL;
  return {
    ...descriptor,
    get() {
      shouldUpdate = false;

      if (props.some((p, i) => this[p] !== this[memoizedPropName][i])) {
        this[memoizedPropName] = props.map(p => this[p])
        shouldUpdate = true;
      }

      if (shouldUpdate || this[memoizedName] === SENTINEL) {
        this[memoizedName] = get.call(this);
      }

      return this[memoizedName];
    }
  };
}

function _memoizeMethod(target, name, descriptor, props = []) {
  let memoizedName = `_memoized_${name}`;
  let memoizedPropName = `_memoized_props_${name}`;
  let value = descriptor.value;
  let shouldUpdate = false;
  target[memoizedName] = SENTINEL;
  target[memoizedPropName] = SENTINEL;
  return {
    ...descriptor,
    value() {
      shouldUpdate = false;

      if (props.some((p, i) => {
        return this[p] !== this[memoizedPropName][i];
      })) {
        this[memoizedPropName] = props.map(p => this[p])
        shouldUpdate = true;
      }


      if (shouldUpdate || this[memoizedName] === SENTINEL) {
        this[memoizedName] = value.call(this);
      }
      return this[memoizedName];
    }
  };
}
