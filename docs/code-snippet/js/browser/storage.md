# 简单封装 localStorage/sessionStorage

## 背景

```js
localStorage.setItem(key, value)
sesstionStorage.setItem(key, value)

localStorage.getItem(key)
sesstionStorage.getItem(key)
```

调用`localStorage/sessionStorage.setItem`时，`value`需要是`String`类型，如果不是，将强制转换成`String`类型。

调用`localStorage/sessionStorage.getItem`时，返回值是`String`类型。

因此，将出现以下情况，以`localStorage`为例：

```js
localStorage.setItem('key', '1')
localStorage.getItem('key')  // '1'

localStorage.setItem('key', 2)
localStorage.getItem('key')  // '2'

localStorage.setItem('key', 'null')
localStorage.getItem('key')  // 'null'

localStorage.setItem('key', null)
localStorage.getItem('key')  // 'null'

localStorage.setItem('key', 'undefined')
localStorage.getItem('key')  // 'undefined'

localStorage.setItem('key', undefined)
localStorage.getItem('key')  // 'undefined'

localStorage.setItem('key', {a: 1})
localStorage.getItem('key')  // '[object Object]'


localStorage.getItem('keykey')  // null（键名为'keykey'的存储不存在，返回 null）
```

## 设计

针对以上这些情况，经过简单封装`localStorage/sessionStorage`，实现存储前后类型保持一致。

localStorage 为例，调用方式如下：

```js
store.local.set(key, value)
const result = store.local.get(key)
```

存储前后的值如下所示。

value 取值 | result 返回值 | 说明
--- | --- | ---
String 类型 | String 类型 |
Number 类型 | Number 类型 |
Object 类型 | Object 类型 |
null | null | 将键名从存储中移除，最终返回 null
undefined | null | 将键名从存储中移除，最终返回 null
'null' | 'null' |
'undefined' | 'undefined' |

需要注意的是，

- 调用`get(key)`时，如果键名不存在，将返回`null`。
- 调用`set(key, value)`时，如果 value 取值`null`、`undefined`时，会将该键名从存储中移除，因此再调用`get(key)`时，会返回`null`

## 实现

```js
const store = {
  local: {
    disable: false,
    storage: window.localStorage
  },
  session: {
    disable: false,
    storage: window.sessionStorage
  },
  stringify(val) {
    return JSON.stringify(val)
  },
  parse(val) {
    try {
      return JSON.parse(val)
    } catch (e) {
      return val || undefined
    }
  },
  disable() {
    this.local.disabled = this.session.disabled = true
  },
  check() {
    try {
      const enableFlag = '__if_storage_is_enable__'
      this.local.set(enableFlag, enableFlag)
      if (this.local.get(enableFlag) !== enableFlag) {
        this.disable()
      }
      this.local.remove(enableFlag)
    } catch (e) {
      this.disable()
    }
  }
}
const api = {
  set(key, val) {
    if (this.disabled) {
      return
    }
    if (val === null || val === undefined) {
      this.remove(key)
      return
    }
    this.storage.setItem(key, store.stringify(val))
  },

  get(key) {
    if (this.disabled) {
      return
    }
    const val = this.storage.getItem(key)
    return val === null ? null : store.parse(val)
  },

  has(key) {
    if (this.disabled) {
      return false
    }
    return this.get(key) !== null
  },

  remove(key) {
    if (this.disabled) {
      return
    }
    this.storage.removeItem(key)
  },

  clear() {
    if (this.disabled) {
      return
    }
    this.storage.clear()
  },

  getAll() {
    if (this.disabled) {
      return
    }
    const ret = {}
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i)
      ret[key] = this.get(key)
    }
    return ret
  }
}
Object.assign(store.local, api)
Object.assign(store.session, api)
store.check()
export default store
```
