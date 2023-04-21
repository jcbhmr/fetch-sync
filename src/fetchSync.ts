/**
 * Performs a **synchronous** network fetch request using `XMLHttpRequest` as
 * a synchronous backend.
 *
 * ⚠️ This is **not recommended** to be used on the main
 * thread, especially in a realtime browser application!
 *
 * @see https://fetch.spec.whatwg.org/#dom-global-fetch
 */
function fetchSync(
  input: RequestSyncInfo,
  init: RequestSyncInit = {}
): ResponseSync {
  const xhr = new XMLHttpRequest();
  xhr.open(requestSync.method, requestSync.url, false);
  if (requestSync.credentials === "include") {
    xhr.withCredentials = true;
  }
  for (const [name, value] of requestSync.headers) {
    xhr.setRequestHeader(name, value);
  }
  try {
    // Note: You cannot change the value of responseType in a synchronous XMLHttpRequest except when the request belongs to a Worker. This restriction is designed in part to help ensure that synchronous operations aren't used for large transactions that block the browser's main thread, thereby bogging down the user experience.
    xhr.responseType = "arraybuffer";
  } catch {}

  xhr.send(requestSync.body);

  const headers = xhr
    .getAllResponseHeaders()
    .split(/\r?\n/)
    .filter((line) => line.trim())
    .map((line) => line.split(": ", 2));
  const responseSync = new ResponseSync(xhr.body, {
    status: xhr.status,
    statusText: xhr.statusText,
    headers,
  });
  url.set(responseSync, xhr.responseURL);
  redirected.set(responseSync, xhr.responseURL !== requestSync.url);

  return responseSync;
}

export default fetchSync;
