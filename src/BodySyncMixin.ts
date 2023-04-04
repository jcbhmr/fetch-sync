import MIMEType from "whatwg-mimetype";

const body = new WeakMap<typeof BodySyncMixin.prototype, null | Uint8Array>();
const mimeType = new WeakMap<typeof BodySyncMixin, () => MIMEType>();

const BodySyncMixin = {
  prototype: {
    get body(): Uint8Array | null {
      return body.get(this)!;
    },
    get bodyUsed(): false {
      return false;
    },
    arrayBuffer(): ArrayBuffer {
      if (this.body) {
        return this.body.buffer;
      } else {
        return new ArrayBuffer();
      }
    },
    text(): string {
      if (this.body) {
        return new TextDecoder().decode(this.body);
      } else {
        return "";
      }
    },
    blob(): any {
      const type = mimeType.get(Object.getPrototypeOf(this))!.call(this);
      return new Blob([this.body], { type });
    },
    json(): any {
      return JSON.parse(this.text());
    },
    // TODO: Add .formData()
    // formData(): FormData {}
  },
};

export default BodySyncMixin;
export { body, mimeType };
