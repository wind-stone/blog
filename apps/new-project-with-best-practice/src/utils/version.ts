/**
 * 版本比较
 * v1 > v2      => +1
 * v1 === v2    => 0
 * v1 < v2      => -1
 * @param v1 string
 * @param v2 string
 * @return {-1 | 1 | 0}
 */
export function compareVersion(v1: string, v2: string): 1 | -1 | 0 {
  const v1Arr = v1.split('.');
  const v2Arr = v2.split('.');
  const len = Math.max(v1.length, v2.length);

  while (v1Arr.length < len) {
    // 长度补齐
    v1Arr.push('0');
  }
  while (v2Arr.length < len) {
    // 长度补齐
    v2Arr.push('0');
  }

  for (let i = 0; i < len; i++) {
    // 单个数字比较
    const num1 = parseInt(v1Arr[i]);
    const num2 = parseInt(v2Arr[i]);

    if (num1 > num2) {
      return 1;
    }
    if (num1 < num2) {
      return -1;
    }
  }

  return 0;
}
