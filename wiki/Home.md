## Node.js vs. browser

For the browser side, we just take advantage of the existing `XMLHttpRequest`
API that allows synchronous HTTP requests and wrap that in a `fetch()` function.

In Node.js, however, we bypass the need for wrapping XHR and instead go straight
to delegating to a worker thread. We use [synckit] to stringify an `async`
function and run it in a Node.js `Worker` thread and use `SharedArrayBuffer` to
signal that the function has completed.

## Relation to the Fetch Standard

This package tries to emulate the WHATWG [Fetch Standard], but to replace all
instances if `Promise<T>` with `T` instead. That means things like `.text()` are
now `string` instead of `Promise<string>`.

But as we peel away the `fetch()` function and associated APIs' abstractions, we
can't always just delegate back to them but synchronously. For instance, the
`.blob()` function needs to return a `Blob` instance that has the proper `.type`
attribute. To figure this out, normally we could just delegate to the async
`(await response.blob()).type` algorithm. Instead, we need to re-implement parts
of the spec to cover areas that were exposed only asynchronously. These specific
algorithms are exposed in individual files to replicate as closely as possible
the structure of the spec.

## Naming conventions

Here's some examples of other JavaScript synchronous-explicit APIs that we have
used to derive the names of things in this project:

- [`FileReaderSync`] vs async [`FileReader`]
- [`FileSystemSyncAccessHandle`] which is unique
- Sync [`SourceBuffer#remove()`] vs [`SourceBuffer#removeAsync()`]
- [`FileSystemDirectoryReaderSync`] vs async [`FileSystemDirectoryReader`]
- [`CSSStyleSheet#replaceSync()`] vs async [`CSSStyleSheet#replace()`]

All of these (with the exception of the `*Handle` suffix) seem to indicate that
there is a strong preference towards suffixing APIs with `*Sync` (and/or
`*Async`) to indicate or differentiate a function from its siblings. To that
end, we have chosen to use `RequestSync`, `ResponseSync`, and `fetchSync()` as
the names for the functions in this package.

## Project name

Imagine that there's a `fetch-sync.spec.whatwg.org` specification. We are using
`fetch-sync` as the name for this repo because it matches that short URL slug.

ℹ The name **isn't** because the main export is a function named `fetchSync()`,
that's just a side-effect.

<!-- prettier-ignore-start -->
[synckit]: https://github.com/un-ts/synckit#readme
[fetch standard]: https://fetch.spec.whatwg.org/
[`FileReaderSync`]: https://developer.mozilla.org/en-US/docs/Web/API/FileReaderSync
[`FileReader`]: https://developer.mozilla.org/en-US/docs/Web/API/FileReader
[`FileSystemSyncAccessHandle`]: https://developer.mozilla.org/en-US/docs/Web/API/FileSystemSyncAccessHandle
[`SourceBuffer#remove()`]: https://developer.mozilla.org/en-US/docs/Web/API/SourceBuffer/remove
[`SourceBuffer#removeAsync()`]: https://developer.mozilla.org/en-US/docs/Web/API/SourceBuffer/removeAsync
[`FileSystemDirectoryReader`]: https://developer.mozilla.org/en-US/docs/Web/API/File_and_Directory_Entries_API/Firefox_support#chrome_deviations_from_the_specification
[`FileSystemDirectoryReaderSync`]: https://developer.mozilla.org/en-US/docs/Web/API/File_and_Directory_Entries_API/Firefox_support#chrome_deviations_from_the_specification
[`CSSStyleSheet#replaceSync()`]: https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet/replaceSync
[`CSSStyleSheet#replace()`]: https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet/replace
<!-- prettier-ignore-end -->
