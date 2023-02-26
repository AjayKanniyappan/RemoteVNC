import keyMap from '@constants/index';

function getKeyCode(code: number, shift: number): number {
  const keys = keyMap[code];
  if (keys) {
    return keys[shift ? 1 : 0];
  }
  return 0;
}

export default getKeyCode;
