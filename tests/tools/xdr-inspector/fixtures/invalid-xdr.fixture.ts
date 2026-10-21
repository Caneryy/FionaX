export const malformedBase64 = "not/base64?";
export const unsupportedXdr = "/////w=="; // valid XDR word, unknown discriminant
export const trailingBytes = "AAAAAA=="; // one word followed by incomplete data for most types
