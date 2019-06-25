# 键盘

## Android 键盘 keydown 事件里 keyCode = 229

Android 系统里，keydown 事件的 event 里，keyCode = 229，不是正确的 keyCode

Reference:

- [keyCode on android is always 229](https://stackoverflow.com/questions/36753548/keycode-on-android-is-always-229)
- [keydown and keyup events do not have proper keyCode (it's always 0)](https://bugs.chromium.org/p/chromium/issues/detail?id=118639)

## 键盘的调起和收起

在 iOS 6 之前，当控件获得 focus 的时候，如果不是用户触发的事件，键盘是不会弹起的，在 iOS 6 之后，设置了一个属性可以做到，在 Android 上，只要不是用户触发的事件都无法触发。暂时还没有解决方案。键盘的收起，可以通过 js 的 blur 的方式来实现。
