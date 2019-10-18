/**
 * 比较当前版本是否满足给定版本的要求
 * @param {*} curVerion 当前版本号，形如 '6.1.1'
 * @param {*} neededVersion 需要的版本号，形如 `6.1.0`
 */
function isVersionAvailable(curVerion, neededVersion) {
  curVerion = curVerion.split('.');
  neededVersion = neededVersion.split('.');
  for (let i = 0; i < neededVersion.length; i++) {
    const cur = isNaN(curVerion[i]) ? 0 : +curVerion[i];
    const needed = isNaN(neededVersion[i]) ? 0 : +neededVersion[i];
    if (cur > needed) {
      return true;
    } else if (cur < needed) {
      return false;
    }
  }
  return true;
}
