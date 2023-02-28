// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getRgba(src: any[]) {
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
