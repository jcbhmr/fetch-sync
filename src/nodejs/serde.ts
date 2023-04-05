// JSON.stringify(object, replacer)
function replacer(key: string | undefined, value: any) {
  if (value instanceof RequestSync) {
    return {
      "@type": "RequestSync",
      method: value.method,
      headers: [...value.headers],
      body: value.body ? value.text() : null,
    };
  } else if (value instanceof ResponseSync) {
    return {
      "@type": "ResponseSync",
      url: value.url,
      redirected: value.redirected,
      status: value.status,
      statusText: value.statusText,
      headers: [...value.headers],
      body: value.body ? value.text() : null,
    };
  }

  return value;
}

// JSON.parse(string, reviver)
function reviver(key: string | undefined, value: any) {
  if (value?.["@type"] === "RequestSync") {
    return new RequestSync(value.url, {
      method: value.method,
      headers: value.headers,
      body: value.body,
    });
  } else if (value?.["@type"] === "ResponseSync") {
    const responseSync = new ResponseSync(value.body, {
      status: value.status,
      statusText: value.statusText,
      headers: value.headers,
    });
    url.set(responseSync, value.url);
    redirected.set(responseSync, value.redirected);
  }

  return value;
}

export { replacer, reviver };
