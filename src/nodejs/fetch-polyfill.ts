if (typeof fetch === "undefined") {
  const undici = await import("undici");
  globalThis.fetch = undici.fetch;
  globalThis.Request = undici.Request;
  globalThis.Response = undici.Response;
  globalThis.Headers = undici.Headers;
  globalThis.FormData = undici.FormData;
}
