# 光标跳动问题

## 问题产生

项目里有个巴西 CPF 输入框，输入格式为 ddd.ddd.ddd-dd，其中 d 代表数字。
PM 希望当用户输入数字时，自动格式化，比如用户一次输入 1、2、3、4 时，输入框中显示 123.4

## 初步实现

```js
inputCPF() {
  let cpf = this.value.replace(/\D/g, '').split('')
  for (let i = 3; i < cpf.length; i += 3) {
    if (cpf[i] !== undefined) {
      cpf.splice(i, 0, i === 11 ? '-' : '.')
      i++
    }
  }
  this.value = cpf.join('')
}

let input = document.querySelector('.input')
input.addEventListener('input', inputCPF, false)
```

上面的简单实现，理论上是可以解决问题的，无奈在 Android 某些机型上有问题，格式化结束后光标会移动到最后一位字符的前面。比如 12 输入 3 后，变成 12|3（其中 | 为光标）

## bug 修复

```js
inputCPF() {
  let cpf = this.value.replace(/\D/g, '').split('')
  for (let i = 3; i < cpf.length; i += 3) {
    if (cpf[i] !== undefined) {
      cpf.splice(i, 0, i === 11 ? '-' : '.')
      i++
    }
  }
  this.value = cpf.join('')

  // 添加以下这段代码，强制将光标放到最后
  setTimeout(() => {
    let len = this.value.length
    this.setSelectionRange(len, len)
    this.focus()
  }, 0)
}

let input = document.querySelector('.input')
input.addEventListener('input', inputCPF, false)
```

## 更高级的做法

未添加兼容性代码，Android 可能有兼容问题

```js
let phone = document.querySelector('#phone')
phone.addEventListener('input', formatPhone('***.***.***-**', phone))

/**
  * 格式化 cpf 输入格式
  * @param {String} formatString cpf 格式，形如 '***.***.***-**'
  * @param {HTMLInputElement} 输入框dom节点
  * @return {Function} input 事件监听函数
  */
function formatPhone(formatString, input) {
  // 仅键入 数字键、删除键、左右箭头键 有效
  const digitReg = /^\d$/
  const validKeyList = {
    '8': true,   // BackSpace
    '37': true,  // Left Arrow
    '39': true   // Right Arrow
  }
  input.addEventListener('keydown', function (event) {
    if (!digitReg.test(event.key) && !validKeyList[event.keyCode]) {
      return event.preventDefault()
    }
  })

  input.maxLength = formatString.length       // 设置输入框的最大长度
  const delimiterIndexArray = []                  // 存放格式化字符串里的定界符及其下标
  const formatArray = formatString.split('')  // 将格式化字符串分割成格式化数组

  formatArray.forEach(function (item, index) {
    if (item === '.' || item === '-') {
      delimiterIndexArray.push({
        index: index,
        value: item
      })
    }
  })

  let lastInputLength = 0  // 上次输入的长度，包含定界符
  const reg = /[\.\-]/g

  return function () {
    const isDeleted = lastInputLength > input.value.length     // 是否是删除文字
    let selectionStart = input.selectionStart                  // 输入后的光标位置
    const valueArray = input.value.replace(reg, '').split('')  // 去除定界符后的数字数组

    delimiterIndexArray.forEach(function (delimiterObject, index) {
      // 处理光标位置
      if (isDeleted) {
        // 如果是删除字符，且删除的是定界符，则将定界符前的数字一并删除，光标位置前移一位
        if (selectionStart === delimiterObject.index) {
          valueArray.splice(delimiterObject.index - 1, 1)
          selectionStart -= 1
        }
      } else {
        // 如果是添加数字，且数字添加后要添加定界符进行分隔，则（添加定界符后）光标位置后移一位
        if (selectionStart === delimiterObject.index + 1) {
          selectionStart += 1
        }
      }

      // 添加 定界符
      if (delimiterObject.index < valueArray.length) {
        valueArray.splice(delimiterObject.index, 0, delimiterObject.value)
      }
    })

    input.value = valueArray.join('')
    lastInputLength = valueArray.length
    input.setSelectionRange(selectionStart, selectionStart)
  }
}
```