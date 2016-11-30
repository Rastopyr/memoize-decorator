'use strict';

var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === 'function') { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError('The decorator for method ' + descriptor.key + ' is of the invalid type ' + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _ = require('../');

var _2 = _interopRequireDefault(_);

describe('memoize getter/method decorator', function () {
  var A = (function () {
    function A() {
      var value = arguments.length <= 0 || arguments[0] === undefined ? 42 : arguments[0];

      _classCallCheck(this, A);

      this.computedCount = 0;
      this.value = value;
    }

    _createDecoratedClass(A, [{
      key: 'expensiveMethod',
      decorators: [_2['default']],
      value: function expensiveMethod() {
        this.computedCount += 1;
        return this.value + 1;
      }
    }, {
      key: 'expensiveValue',
      decorators: [_2['default']],
      get: function get() {
        this.computedCount += 1;
        return this.value;
      }
    }]);

    return A;
  })();

  it('computes class getter only once and memoizes result for future access', function () {
    var a = new A();
    (0, _assert2['default'])(a.computedCount === 0);
    (0, _assert2['default'])(a.expensiveValue === 42);
    (0, _assert2['default'])(a.computedCount === 1);
    (0, _assert2['default'])(a.expensiveValue === 42);
    (0, _assert2['default'])(a.computedCount === 1);
  });

  it('computes class method only once and memoizes result for future access', function () {
    var a = new A();
    (0, _assert2['default'])(a.computedCount === 0);
    (0, _assert2['default'])(a.expensiveMethod() === 43);
    (0, _assert2['default'])(a.computedCount === 1);
    (0, _assert2['default'])(a.expensiveMethod() === 43);
    (0, _assert2['default'])(a.computedCount === 1);
  });

  it('does not override memoized values from different methods', function () {
    var a = new A(41);
    (0, _assert2['default'])(a.expensiveValue, 41);
    var b = new A(42);
    (0, _assert2['default'])(b.expensiveValue, 42);
    (0, _assert2['default'])(a.expensiveValue, 41);
    (0, _assert2['default'])(b.expensiveValue, 42);
  });

  // it('throws if applied on a method of more than zero arguments', function() {
  //   assert.throws(() => {
  //     class A {
  //       @memoize
  //       method(a) {
  //
  //       }
  //     }
  //   }, /@memoize decorator can only be applied to methods of zero arguments/);
  // });

  describe('computed memoize getter/method decorator', function () {
    var A = (function () {
      function A() {
        var value = arguments.length <= 0 || arguments[0] === undefined ? 42 : arguments[0];

        _classCallCheck(this, A);

        this.computedValue = 0;
        this.value = value;
      }

      _createDecoratedClass(A, [{
        key: 'expensiveMethod',
        decorators: [(0, _2['default'])('value')],
        value: function expensiveMethod() {
          this.computedValue += this.value;
          return this.value;
        }
      }, {
        key: 'expensiveValue',
        decorators: [(0, _2['default'])('value')],
        get: function get() {
          this.computedValue += this.value;
          return this.value;
        }
      }]);

      return A;
    })();

    var B = (function () {
      function B() {
        var value = arguments.length <= 0 || arguments[0] === undefined ? 42 : arguments[0];

        _classCallCheck(this, B);

        this.computedValue = 0;
        this.value = value;
      }

      _createDecoratedClass(B, [{
        key: 'expensiveMethod',
        decorators: [(0, _2['default'])(['value', 'computedValue'])],
        value: function expensiveMethod() {
          this.computedValue += this.value;
          return this.value;
        }
      }, {
        key: 'expensiveValue',
        decorators: [(0, _2['default'])(['value', 'computedValue'])],
        get: function get() {
          this.computedValue += this.value;
          return this.value;
        }
      }]);

      return B;
    })();

    it('computes class getter twice and memoizes result for future access', function () {
      var a = new A();
      (0, _assert2['default'])(a.computedValue === 0);
      (0, _assert2['default'])(a.expensiveValue === 42);
      (0, _assert2['default'])(a.computedValue === 42);
      (0, _assert2['default'])(a.expensiveValue === 42);
      (0, _assert2['default'])(a.computedValue === 42);
      a.value = 5;
      (0, _assert2['default'])(a.expensiveValue === 5);
      (0, _assert2['default'])(a.computedValue === 47);
    });

    it('computes class method only once and memoizes result for future access', function () {
      var a = new A();
      (0, _assert2['default'])(a.computedValue === 0);
      (0, _assert2['default'])(a.expensiveMethod() === 42);
      (0, _assert2['default'])(a.computedValue === 42);
      a.value = 40;
      (0, _assert2['default'])(a.expensiveMethod() === 40);
      (0, _assert2['default'])(a.computedValue === 82);
    });

    it('computes class method only once and memoizes result for future access by Array of props', function () {
      var b = new B();
      (0, _assert2['default'])(b.computedValue === 0);
      (0, _assert2['default'])(b.expensiveMethod() === 42);
      (0, _assert2['default'])(b.computedValue === 42);
      b.value = 5;
      (0, _assert2['default'])(b.expensiveMethod() === 5);
      (0, _assert2['default'])(b.computedValue === 47);
    });

    it('computes class getter twice and memoizes result for future access by Array of props', function () {
      var b = new B();
      (0, _assert2['default'])(b.computedValue === 0);
      (0, _assert2['default'])(b.expensiveValue === 42);
      (0, _assert2['default'])(b.computedValue === 42);
      (0, _assert2['default'])(b.expensiveValue === 42);
      (0, _assert2['default'])(b.computedValue === 84);
    });
  });
});
