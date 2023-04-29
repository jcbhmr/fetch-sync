![🚧 Under construction 👷‍♂️](https://i.imgur.com/LEP2R3N.png)

# Synchronous `fetch()`

⏱ Synchronous wrapper around the [`fetch()`] API

<div align="center">

![](https://user-images.githubusercontent.com/61068799/233521706-1486b693-2275-4255-ae4d-50ae00abcc86.png)

</div>

🖥️ Works in Node.js and the browser \
👨‍🏭 Works great in web `Worker` threads! \
⚛️ Perfect for WebAssembly \
💻 Works in the browser using [`XMLHttpRequest`]

⚠️ If possible, prefer the native async `fetch()` API. This is a niche package.

## Installation

You can use this with both Node.js and the browser! If you're using a bundler
like [Vite] or [webpack], you can install it using npm. If you're importing it
live in your browser, you can use an npm CDN like [ESM>CDN] or [jsDelivr].

```sh
npm install sync-fetch
```

```js
import {} from "https://esm.sh/@jcbhmr/fetch-sync";
```

## Usage

🛑 It is **not recommended** to use this in a browser on the main UI thread!
`fetchSync()` is great for `Worker` threads, but you don't want to block your
user's click events in the UI.

The API surface is mostly a mirror of the Fetch Standard, just with non-async
things in-place of normally async operations:

1. All `Promise<T>`-returning functions (`.text()`, `.json()`, `.blob()`, etc.)
   are replaced with synchronous versions. These all return the values
   _immediately_.
2. The `.body` value has been replaced with an `IterableIterator<Uint8Array>`
   instead of the normal `ReadableStream<Uint8Array>`. We use this instead of an
   `Array` to better parallel the `ReadableStream`'s interface style. Use
   `.next()` or a for-of loop to read it chunk-by-chunk.

```js
import { fetchSync, RequestSync, ResponseSync } from "@jcbhmr/fetch-sync";

const requestSync = new RequestSync("https://httpbin.org/post", {
  method: "POST",
  headers: {
    "Content-Type": "text/plain",
  },
  body: "Hello world!",
});

const responseSync = fetchSync(requestSync);
console.log(responseSync.status);
//=> 200
console.log(responseSync.bodyUsed);
//=> false

// Remember! This is an IterableIterator<Uint8Array> now.
const chunks = [...responseSync.body];
console.log(chunks);
//=> [ Uint8Array [ ... ], Uint8Array [ ... ] ]

console.log(responseSync.bodyUsed);
//=> true
```

### Limitations

Due to the fact that the API surface must be almost completely synchronous,
there are a few things that are supported by the normal native `fetch()`
function that we cannot support. Those are:

- `ReadableStream` instances as `body` parameters. There's no easy way to read
  them synchronously.
- `Blob` instances as `body` parameters. Same as `ReadableStream`, their async
  nature makes them impossible to reconcile with this.
- Proprietary Node.js-specific options to the `fetchSync()` function. Things
  like Node Fetch's `agent` property are not implemented here.
- `AbortSignal` instances for cancellation. Even `XMLHttpRequest` doesn't let
  you set a `timeout` for synchronous requests. Any provided `AbortSignal` will
  throw an error only if it has already been aborted. They don't work to cancel
  mid-flight requests since there's no way you would even _be able_ to
  `.abort()` one while the thread is blocked.
- The `.formData()` function to get a parsed `FormData` object. This isn't
  implemented yet.
- Proper binary responses in the main thread in the browser. When using
  synchronous XHR, we cannt set the `.responseType` option to `"arraybuffer"`,
  so we have to derive the bytes from the default text-based response using
  `TextEncoder`. This **may not be 100% accurate**.
- `RequestSync` and `ResponseSync` are **not interoperable** with the native
  `Request` and `Response` classes. They are two completely separate "chains"
  with independant backing APIs.

These limitations are unlikely to be a problem for most users. If you're really
interested in what options the `RequestSync` and `ResponseSync` classes support
for options, you can check the (relatively) simple implementation files to see
how they work. More developer information can be found on [the dev wiki].

<!-- prettier-ignore-start -->
[the dev wiki]: https://github.com/jcbhmr/fetch-sync/wiki
[`fetch()`]: https://developer.mozilla.org/en-US/docs/Web/API/fetch
[`xmlhttprequest`]: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
[esm>cdn]: https://esm.sh/
[jsdelivr]: https://www.jsdelivr.com/esm
[vite]: https://vitejs.dev/
[webpack]: https://webpack.js.org/
<!-- prettier-ignore-end -->
