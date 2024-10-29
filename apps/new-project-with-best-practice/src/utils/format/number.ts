/**
 * 移除字符串里的非数字部分
 * @param {string} phone
 * @returns {string}
 */
export function removeNonNumericalCharacter(phone: string) {
  return phone.replace(/[^\d]/g, '');
}

/**
 * 格式化手机号码为 3 4 4 格式
 * @example 12345678900 -> 123 4567 8900
 * @param val {string}
 * @returns
 */
export function formatPhoneNumber(val: string) {
  const value = removeNonNumericalCharacter(val);
  const { length } = val;
  if (length <= 3) return value;
  if (length <= 7) return value.replace(/^(\d{3})(\d{0,4})/, '$1 $2');
  return value.replace(/^(\d{3})(\d{4})(\d{0,4})/, '$1 $2 $3');
}
