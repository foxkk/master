//下面是一个简单的实现遵循 Promise A+ 规范的 JavaScript Promise：

```javascript
// 定义三种状态常量
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MyPromise {
  constructor(executor) {
    this._status = PENDING; // 初始状态为 pending
    this._value = undefined; // 保存成功的结果
    this._reason = undefined; // 保存失败的原因
    this._onFulfilledCallbacks = []; // 存放成功时的回调函数
    this._onRejectedCallbacks = []; // 存放失败时的回调函数

    // 定义 resolve 函数
    const resolve = (value) => {
      if (this._status === PENDING) {
        this._status = FULFILLED;
        this._value = value;
        this._onFulfilledCallbacks.forEach(fn => fn(this._value));
      }
    };

    // 定义 reject 函数
    const reject = (reason) => {
      if (this._status === PENDING) {
        this._status = REJECTED;
        this._reason = reason;
        this._onRejectedCallbacks.forEach(fn => fn(this._reason));
      }
    };

    // 执行 executor，并传入 resolve 和 reject
    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfilled, onRejected) {
    // 如果不是函数，则使用默认的函数，实现透传
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason; };

    // 返回一个新的 Promise
    return new MyPromise((resolve, reject) => {
      // 封装一个成功时执行的函数
      const fulfilledFn = (value) => {
        try {
          const result = onFulfilled(value);
          if (result instanceof MyPromise) {
            result.then(resolve, reject);
          } else {
            resolve(result);
          }
        } catch (error) {
          reject(error);
        }
      };

      // 封装一个失败时执行的函数
      const rejectedFn = (reason) => {
        try {
          const result = onRejected(reason);
          if (result instanceof MyPromise) {
            result.then(resolve, reject);
          } else {
            resolve(result);
          }
        } catch (error) {
          reject(error);
        }
      };

      // 根据状态执行不同的逻辑
      if (this._status === PENDING) {
        this._onFulfilledCallbacks.push(fulfilledFn);
        this._onRejectedCallbacks.push(rejectedFn);
      } else if (this._status === FULFILLED) {
        fulfilledFn(this._value);
      } else if (this._status === REJECTED) {
        rejectedFn(this._reason);
      }
    });
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }

  static resolve(value) {
    return new MyPromise((resolve) => {
      resolve(value);
    });
  }

  static reject(reason) {
    return new MyPromise((resolve, reject) => {
      reject(reason);
    });
  }

  static all(promises) {
    return new MyPromise((resolve, reject) => {
      let count = 0;
      const results = [];

      for (let i = 0; i < promises.length; i++) {
        promises[i].then(
          (value) => {
            count++;
            results[i] = value;
            if (count === promises.length) {
              resolve(results);
            }
          },
          (reason) => {
            reject(reason);
          }
        );
      }
    });
  }

  static race(promises) {
    return new MyPromise((resolve, reject) => {
      for (let i = 0; i < promises.length; i++) {
        promises[i].then(
          (value) => {
            resolve(value);
          },
          (reason) => {
            reject(reason);
          }
        );
      }
    });
  }
}
```

//实现是一个简单的 Promise，符合 Promise A+ 规范。这个类有 `then`, `catch`, `resolve`, `reject`, `all`, 和 `race` 方法，可以用于 Promise 的基本操作和组合。注意，这个实现并没有考虑到异步情况，真实的 Promise 库会处理异步操作。
