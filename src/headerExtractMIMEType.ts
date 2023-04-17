function headerExtractMIMEType(this: RequestSync) {
  if (this.headers.has("Content-Type")) {
    const contentType = this.headers.get("Content-Type")!;
    const mimeType = new MIMEType(contentType);
    return mimeType;
  } else if (this.headers.get("X-Content-Type-Options") === "nosniff") {
    return new MIMEType("application/octet-stream");
  } else {
    // TODO: Support MIME sniffing?
    return new MIMEType("application/octet-stream");
  }
}

export default headerExtractMIMEType;
