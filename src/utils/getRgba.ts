/**
 * It takes a buffer of RGB data and returns a buffer of RGBA data
 * @param {Buffer} src - The source buffer
 * @returns A buffer of RGBA values.
 */
function getRgba(src: Buffer): Buffer {
  const rgba = Buffer.allocUnsafe(src.length);
  for (let i = 0; i < src.length; i += 4) {
    rgba[i] = src[i + 2];
    rgba[i + 1] = src[i + 1];
    rgba[i + 2] = src[i];
    rgba[i + 3] = 0xff;
  }
  return rgba;
}

export default getRgba;
