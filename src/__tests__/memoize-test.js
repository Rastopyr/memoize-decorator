import assert from 'assert';
import memoize from '../';

describe('memoize getter/method decorator', function() {

  class A {
    constructor(value = 42) {
      this.computedCount = 0;
      this.value = value;
    }

    @memoize
    get expensiveValue() {
      this.computedCount += 1;
      return this.value;
    }

    @memoize
    expensiveMethod() {
      this.computedCount += 1;
      return this.value + 1;
    }
  }

  it('computes class getter only once and memoizes result for future access', function() {
    let a = new A();
    assert(a.computedCount === 0);
    assert(a.expensiveValue === 42);
    assert(a.computedCount === 1);
    assert(a.expensiveValue === 42);
    assert(a.computedCount === 1);
  });

  it('computes class method only once and memoizes result for future access', function() {
    let a = new A();
    assert(a.computedCount === 0);
    assert(a.expensiveMethod() === 43);
    assert(a.computedCount === 1);
    assert(a.expensiveMethod() === 43);
    assert(a.computedCount === 1);
  });

  it('does not override memoized values from different methods', function() {
    let a = new A(41);
    assert(a.expensiveValue, 41);
    let b = new A(42);
    assert(b.expensiveValue, 42);
    assert(a.expensiveValue, 41);
    assert(b.expensiveValue, 42);
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

  describe('computed memoize getter/method decorator', function() {
    class A {
      constructor(value = 42) {
        this.computedValue = 0;
        this.value = value;
      }

      @memoize('value')
      get expensiveValue() {
        this.computedValue += this.value;
        return this.value;
      }

      @memoize('value')
      expensiveMethod() {
        this.computedValue += this.value;
        return this.value;
      }
    }

    class B {
      constructor(value = 42) {
        this.computedValue = 0;
        this.value = value;
      }

      @memoize(['value', 'computedValue'])
      get expensiveValue() {
        this.computedValue += this.value;
        return this.value;
      }

      @memoize(['value', 'computedValue'])
      expensiveMethod() {
        this.computedValue += this.value;
        return this.value;
      }
    }

    it('computes class getter twice and memoizes result for future access', function() {
      let a = new A();
      assert(a.computedValue === 0);
      assert(a.expensiveValue === 42);
      assert(a.computedValue === 42);
      assert(a.expensiveValue === 42);
      assert(a.computedValue === 42);
      a.value = 5;
      assert(a.expensiveValue === 5);
      assert(a.computedValue === 47);
    });

    it('computes class method only once and memoizes result for future access', function() {
      let a = new A();
      assert(a.computedValue === 0);
      assert(a.expensiveMethod() === 42);
      assert(a.computedValue === 42);
      a.value = 40;
      assert(a.expensiveMethod() === 40);
      assert(a.computedValue === 82);
    });

    it('computes class method only once and memoizes result for future access by Array of props', function() {
      let b = new B();
      assert(b.computedValue === 0);
      assert(b.expensiveMethod() === 42);
      assert(b.computedValue === 42);
      b.value = 5;
      assert(b.expensiveMethod() === 5);
      assert(b.computedValue === 47);
    });

    it('computes class getter twice and memoizes result for future access by Array of props', function() {
      let b = new B();
      assert(b.computedValue === 0);
      assert(b.expensiveValue === 42);
      assert(b.computedValue === 42);
      assert(b.expensiveValue === 42);
      assert(b.computedValue === 84);
    });
  });
});
