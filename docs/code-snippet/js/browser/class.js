/**
 * @file 简单实现对类名的操作，参考 jQuery 实现
 * @author wind-stone@qq.com
 * @date 2017-01-16 15:00
 */

var rnothtmlwhite = /[^\x20\t\r\n\f]+/g;

function getClass(elem) {
    return (elem.getAttribute && elem.getAttribute('class')) || '';
}

function stripAndCollapse(value) {
    var tokens = value.match(rnothtmlwhite) || [];
    return tokens.join(' ');
}

module.exports = {
    addClass: function(elem, value) {
        var currentValue, currentClasses;
        var i, newClass, newClasses;
        var finalValue;

        if (typeof value === 'string' && value) {
            newClasses = value.match(rnothtmlwhite) || [];
            currentValue = getClass(elem);
            currentClasses =
                elem.nodeType === 1 &&
                ' ' + stripAndCollapse(currentValue) + ' ';

            if (currentClasses) {
                i = 0;
                while ((newClass = newClasses[i++])) {
                    if (currentClasses.indexOf(' ' + newClass + ' ') < 0) {
                        currentClasses += newClass + ' ';
                    }
                }

                finalValue = stripAndCollapse(currentClasses);
                if (finalValue !== currentValue) {
                    elem.setAttribute('class', finalValue);
                }
            }
        }
    },
    removeClass: function(elem, value) {
        var currentValue, currentClasses;
        var i, newClass, newClasses;
        var finalValue;

        if (typeof value === 'string' && value) {
            newClasses = value.match(rnothtmlwhite) || [];
            currentValue = getClass(elem);
            currentClasses =
                elem.nodeType === 1 &&
                ' ' + stripAndCollapse(currentValue) + ' ';

            if (currentClasses) {
                i = 0;
                while ((newClass = newClasses[i++])) {
                    // 如果存在多个同名类名，则一起删除
                    while (currentClasses.indexOf(' ' + newClass + ' ') > -1) {
                        currentClasses = currentClasses.replace(
                            ' ' + newClass + ' ',
                            ' '
                        );
                    }
                }

                finalValue = stripAndCollapse(currentClasses);
                if (finalValue !== currentValue) {
                    elem.setAttribute('class', finalValue);
                }
            }
        }
    },
    hasClass: function(elem, value) {
        var className = ' ' + value + ' ';
        if (
            elem.nodeType === 1 &&
            (' ' + stripAndCollapse(getClass(elem)) + ' ').indexOf(className) >
                -1
        ) {
            return true;
        }
        return false;
    }
};
