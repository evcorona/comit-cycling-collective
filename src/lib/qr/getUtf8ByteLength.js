export const getUtf8ByteLength = (value) =>
  new TextEncoder().encode(value).length
