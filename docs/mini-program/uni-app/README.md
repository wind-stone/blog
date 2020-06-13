# uni-app

## uni-app 学习记录

### 为什么在 uni-app 的项目里可以直接使用 HTML 标签

老的 HTML 标签也可以在`uni-app`里使用，`uni-app`编译器会在编译时把老标签转为新标签，比如把`div`编译成`view`。但不推荐这种用法，调试 H5 端时容易混乱。

| HTML 标签                                              | uni-app 标签 | 转换说明                    |
| ------------------------------------------------------ | ------------ | --------------------------- |
| div/ul/li                                              | view         | -                           |
| span/font                                              | text         | -                           |
| a                                                      | navigator    | -                           |
| img                                                    | image        | -                           |
| select                                                 | picker       | -                           |
| iframe                                                 | web-view     | -                           |
| input                                                  | 没变化       | type 属性改成了 confirmtype |
| audio                                                  | 没变化       | 不再推荐使用，改成 API 方式 |
| form/button/checkbox/radio/label/textarea/canvas/video | 没变化       | -                           |

参考: [白话uni-app 【也是html、vue、小程序的区别】](https://ask.dcloud.net.cn/article/id-35657)
