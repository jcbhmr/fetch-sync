## Node.js

For Node.js, we use a `SharedArrayBuffer` polling buffer loop to transfer data
from the response that we `await` asynchronously on the main thread.

1. The user calls `fetch()` synchronously.
2. Inside `fetch()`, we `.postMessage()` to our delegated worker thread, then we
   wait for a response using `SharedArrayBuffer` and `Atomics.wait()`.
3. When we recieve a response, we use a `while (Atomics.wait())` loop to
   continue pulling information out of the `SharedArrayBuffer` while there's
   data to recieve from the worker.
4. We bundle that data into a custom `Response` object that has no async
   methods, then we give you that object.

Note that all of this magic is **synchronously waited for** on the main thread
even though the non-main thread is doing `async` and `await` things.

We could, if we chose, do this in an `execSync()` call instead which would take
care of all the heavy lifting for us. We don't do that though, because this way
is more "pure" in the sense that it doesn't rely on the underlying OS as much.

## Browser

For the browser side, we just take advantage of the existing `XMLHttpRequest`
API that, crucially, **allows sycnhronous requests inside web `Worker`
threads**!

It's basically just a clone of the [github/fetch/fetch.js] polfyill (well, all
the good parts anyway) but restructured to be completely `Promise`-free.

[github/fetch/fetch.js]: https://github.com/github/fetch/blob/master/fetch.js
