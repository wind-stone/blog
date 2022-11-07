/**
 * 检查一个 DOM 元素是另一个 DOM 元素的后代
 * @param  {Element} container 待检查的祖先元素
 * @param  {Element} contained 待检查子孙元素
 * @return {Boolean}           是否是后代
 */
export function contains(container, contained) {
    if (contained) {
        while (contained.parentNode) {
            contained = contained.parentNode;
            if (contained === container) {
                return true;
            }
        }
    }
    return false;
}
