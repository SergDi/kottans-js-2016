'use strict'
class MyPromise extends Promise {

  constructor(...args) {

    super(...args);
  }

  static map(input, mapper) {

    return new this((resolve, reject) => {

      this.promisify(input).then(iterable => {

        let result = [];
        let pending = 0;

        if (!this.isIterable(iterable)) {
          reject(new TypeError('must be iterable'));
        }

        for (let i of iterable) {
          pending++

          this.promisify(i).then(item => {
            this.promisify(mapper(item)).then(value => {

              result.push(value)

              if (! --pending)
                resolve(result);

            }, reject);
          }, reject);

        }

      }, reject);
    });
  }

  static some(input, count) {

    return new this((resolve, reject) => {

      this.promisify(input).then(iterable => {

        let resultResolved = [];
        let resultRejected = [];
        let pending = 0;

        if (!this.isIterable(iterable))
          reject(new TypeError('must be iterable'));

        if ((count | 0) !== count || count < 0)
          reject(new TypeError('count err'));

        if (iterable.length < count)
          reject(new TypeError('range err'));

        if (count === 0) resolve([]);

        for (let i of iterable) {

          this.promisify(i).then(value => {

            if (resultResolved.length != count)
              resultResolved.push(value);

            if (pending === count)
              resolve(resultResolved);

            pending++
          }, value => {

            if (resultRejected.length != count)
              resultRejected.push(value);

            if (pending === count)
              reject(resultRejected);

            pending++
          });

        }

      }, reject);
    });
  }

  reduce(fn, initialValue) {
    return this.constructor.reduce(this, fn, initialValue);
  }

  static reduce(input, reducer, initialValue) {

    return new this((resolve, reject) => {

      this.promisify(input).then(iterable => {

        if (!this.isIterable(iterable)) {
          reject(new TypeError('must be iterable'));
        }

        if(initialValue == undefined)
        initialValue = iterable.pop();

        let accumulator = this.resolve(initialValue);
        let pending = 0;

        for (let i of iterable) {

          this.promisify(i).then(currentValue => {
            pending++

            accumulator = accumulator.then(previousValue => {           
              return this.resolve(reducer(previousValue, currentValue, pending));
            }, reject);

            if (pending === iterable.length) {
              accumulator.then(resolve, reject);
            }

          }, reject);
        }
        if (iterable.length === 0) {
          resolve(accumulator);
        }

      }, reject);
    });
  }


  static delay(ms, fn) {
    return new MyPromise((resolve, reject) => {
      setTimeout(resolve(fn), ms);
    });
  }

  static promisify(obj) {
    if (typeof obj.then == 'function') return obj;

    return Promise.resolve(obj);
  }

  static isIterable(obj) {
    if (obj == null) return false;

    return typeof obj[Symbol.iterator] === 'function';
  }

}
module.exports = MyPromise;
