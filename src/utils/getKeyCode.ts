import keyMap from '@constants/index';

/**
 * It takes a key code and a boolean value, and returns a key code
 * @param {number} code - The key code of the key that was pressed.
 * @param {number} shift - 0 or 1
 * @returns The keycode of the key pressed.
 */
function getKeyCode(code: number, shift: number): number {
  const keys = keyMap[code];
  if (keys) {
    return keys[shift ? 1 : 0];
  }
  return 0;
}

export default getKeyCode;
