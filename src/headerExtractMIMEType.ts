import MIMEType from "whatwg-mimetype";

/** @see https://fetch.spec.whatwg.org/#concept-header-extract-mime-type */
function headerExtractMIMEType(headers: Headers): MIMEType | null {
  // To extract a MIME type from a header list headers, run these steps:

  // 1. Let charset be null.
  let charset: string | null = null;

  // 2. Let essence be null.
  let essence: string | null = null;

  // 3. Let mimeType be null.
  let mimeType: MIMEType | null = null;

  // 4. Let values be the result of getting, decoding, and splitting
  //    `Content-Type` from headers.
  let values: string[] | null;
  if (headers.has("Content-Type")) {
    values = headers.get("Content-Type")!.split(",");
  } else {
    values = null;
  }

  // 5. If values is null, then return failure.
  if (values == null) {
    return null;
  }

  // 6. For each value of values:
  for (const value of values) {
    // 1. Let temporaryMimeType be the result of parsing value.
    const temporaryMimeType = MIMEType.parse(value);

    // 2. If temporaryMimeType is failure or its essence is "*/*", then continue.
    if (temporaryMimeType == null || temporaryMimeType.essence === "*/*") {
      continue;
    }

    // 3. Set mimeType to temporaryMimeType.
    mimeType = temporaryMimeType;

    // 4. If mimeType’s essence is not essence, then:
    if (mimeType.essence !== essence) {
      // 1. Set charset to null.
      charset = null;

      // 2. If mimeType’s parameters["charset"] exists, then set charset to
      //    mimeType’s parameters["charset"].
      if (mimeType.parameters.has("charset")) {
        charset = mimeType.parameters.get("charset")!;
      }

      // 3. Set essence to mimeType’s essence.
      essence = mimeType.essence;
    }

    // 5. Otherwise, if mimeType’s parameters["charset"] does not exist, and
    //    charset is non-null, set mimeType’s parameters["charset"] to charset.
    else if (!mimeType.parameters.has("charset") && charset != null) {
      mimeType.parameters.set("charset", charset);
    }
  }

  // 7. If mimeType is null, then return failure.
  if (mimeType == null) {
    return null;
  }

  // 8. Return mimeType.
  return mimeType;

  // Warning: When extract a MIME type returns failure or a MIME type whose
  // essence is incorrect for a given format, treat this as a fatal error.
  // Existing web platform features have not always followed this pattern, which
  // has been a major source of security vulnerabilities in those features over
  // the years. In contrast, a MIME type’s parameters can typically be safely
  // ignored.
}

export default headerExtractMIMEType;
