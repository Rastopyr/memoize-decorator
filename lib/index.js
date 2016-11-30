/**
 * @copyright 2015, Andrey Popp <8mayday@gmail.com>
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports['default'] = memoize;
var SENTINEL = {};

function memoize() {
  return arguments.length > 1 ? _memoize.apply(this, arguments) : _computedMemoize(arguments[0]);
}

function _computedMemoize(propName) {
  var props = propName instanceof Array ? propName : [propName];

  return function (target, name, descriptor) {
    return _memoize(target, name, descriptor, props);
  };
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

function _memoizeGetter(target, name, descriptor) {
  var props = arguments.length <= 3 || arguments[3] === undefined ? [] : arguments[3];

  var memoizedName = '_memoized_' + name;
  var memoizedPropName = '_memoized_props_' + name;
  var _get = descriptor.get;
  var shouldUpdate = false;
  target[memoizedName] = SENTINEL;
  target[memoizedPropName] = SENTINEL;
  return _extends({}, descriptor, {
    get: function get() {
      var _this = this;

      shouldUpdate = false;

      if (props.some(function (p, i) {
        return _this[p] !== _this[memoizedPropName][i];
      })) {
        this[memoizedPropName] = props.map(function (p) {
          return _this[p];
        });
        shouldUpdate = true;
      }

      if (shouldUpdate || this[memoizedName] === SENTINEL) {
        this[memoizedName] = _get.call(this);
      }

      return this[memoizedName];
    }
  });
}

function _memoizeMethod(target, name, descriptor) {
  var props = arguments.length <= 3 || arguments[3] === undefined ? [] : arguments[3];

  var memoizedName = '_memoized_' + name;
  var memoizedPropName = '_memoized_props_' + name;
  var _value = descriptor.value;
  var shouldUpdate = false;
  target[memoizedName] = SENTINEL;
  target[memoizedPropName] = SENTINEL;
  return _extends({}, descriptor, {
    value: function value() {
      var _this2 = this;

      shouldUpdate = false;

      if (props.some(function (p, i) {
        return _this2[p] !== _this2[memoizedPropName][i];
      })) {
        this[memoizedPropName] = props.map(function (p) {
          return _this2[p];
        });
        shouldUpdate = true;
      }

      if (shouldUpdate || this[memoizedName] === SENTINEL) {
        this[memoizedName] = _value.call(this);
      }
      return this[memoizedName];
    }
  });
}
module.exports = exports['default'];
