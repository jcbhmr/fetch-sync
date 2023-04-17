function fetchSync(): ResponseSync {
  let error: Error | null = null;
  let returnValue: ResponseSync | null = null;

  const xhr = new XMLHttpRequest();

  if (requestSync.credentials === "include") {
    xhr.withCredentials = true;
  }
  for (const [name, value] of requestSync.headers) {
    xhr.setRequestHeader(name, value);
  }
  try {
    xhr.responseType = "arraybuffer";
  } catch {}

  xhr.open(requestSync.method, requestSync.url, false);
  xhr.send(requestSync.body);

  const headers = xhr
    .getAllResponseHeaders()
    .trim()
    .split(/(?:\r?\n)+/)
    .map((line) => line.split(": ", 2));

  const responseSync = new ResponseSync(xhr.body, {
    status: xhr.status,
    statusText: xhr.statusText,
    headers: headers,
  });
  url.set(responseSync, xhr.responseURL);
  redirected.set(responseSync, xhr.responseURL !== request.url);

  return responseSync;
}

export default fetchSync;
