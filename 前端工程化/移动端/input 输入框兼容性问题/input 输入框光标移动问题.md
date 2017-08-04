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

参考[格式化方法/手机号码格式化输入](https://github.com/wind-stone/utility/blob/master/js/%E6%A0%BC%E5%BC%8F%E5%8C%96%E6%96%B9%E6%B3%95/%E6%89%8B%E6%9C%BA%E5%8F%B7%E7%A0%81%E6%A0%BC%E5%BC%8F%E5%8C%96%E8%BE%93%E5%85%A5/index.md)