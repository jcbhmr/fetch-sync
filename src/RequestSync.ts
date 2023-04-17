import MIMEType from "whatwg-mimetype";
import BodySyncMixin, { body, mimeType } from "./BodySyncMixin.ts";
import headerExtractMIMEType from "./headerExtractMIMEType.ts";

class RequestSync implements BodySyncMixin {
  #url: string;
  #method: string;
  #headers: Headers;
  constructor(input: RequestInfo, init: RequestInitSync = {}) {}

  get method(): string {
    return this.#method;
  }
  get url(): string {
    return this.#url;
  }
  get headers(): Headers {
    return this.#headers;
  }

  clone(): Request {
    return new Request(this);
  }
}
includesMixin.call(Request, BodySyncMixin);
mimeType.set(Request);

export default RequestSync;
