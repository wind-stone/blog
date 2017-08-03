# addEventListener() 里 passive 参数

addEventListener(type, listener[, options ]) 里 options 里的 passive 参数，设置为 true 时，浏览器会同时执行 listener 和浏览器的默认行为，且会忽略 listener 里的 preventDefault()，使得滚动更加流畅，详见[passive 的事件监听器](http://www.cnblogs.com/ziyunfei/p/5545439.html)