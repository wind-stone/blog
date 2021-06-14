# event

[[toc]]

该章节讲述在编译阶段如何处理`v-on`指令，以及如何生成`render`函数里`on`/`nativeOn`选项对应的代码。

为了更加方便地描述整个过程，我们先给出一使用示例，基于使用示例来讲述。

```js
// 子组件组件选项对象
const ChildComponent = {
  name: 'ChildComponent',
  template: `
    <div class="child-root" @click="handleClick">请点击这里</div>
  `,
  data: function () {
    return {

    }
  },
  methods: {
    handleClick () {
      console.log('From ChildComponent: child-root click!')
      this.$emit('child-custom-event')
    }
  }
}

// 父组件组件选项对象
const ParentComponent = {
  name: 'ParentComponent',
  template: `
    <div class="parent-root">
      <ChildComponent
        @child-custom-event="handleChildCustomEvent"
        @click.native.prevent="handleChildNativeClick('parent-param', $event)">
      </ChildComponent>
    </div>
  `,
  components: {
    ChildComponent
  }
  methods: {
    handleChildCustomEvent () {
      console.log('From ParentComponent: child component custom event!')
    },
    handleChildNativeClick (param, evt) {
      console.log('From ParentComponent: child component native click event!', param, evt)
    }
  }
}

new Vue({
  el: '#app',
  components: { ParentComponent },
  template: '<ParentComponent></ParentComponent>'
})
```

## parse 阶段

### processAttrs

在`parse`阶段会对元素节点上的所有特性进行处理。`processAttrs`函数里将解析特性的修饰符，当识别出该特性是`v-on`指令时，将调用`addHandler`函数添加事件处理方法。

```js
/**
 * 处理 attributes，包括指令和非指令
 */
function processAttrs (el) {
  const list = el.attrsList
  let i, l, name, rawName, value, modifiers, isProp
  for (i = 0, l = list.length; i < l; i++) {
    name = rawName = list[i].name
    value = list[i].value
    // const dirRE = /^v-|^@|^:/
    if (dirRE.test(name)) {
      // 处理指令

      // mark element as dynamic
      // 标记元素是动态的，在优化 AST 阶段，若 el.hasBindings 为 true，则该元素就不是静态节点
      el.hasBindings = true
      // modifiers
      // 处理修饰符
      modifiers = parseModifiers(name)
      // 移除修饰符
      // modifierRE = /\.[^.]+/g
      if (modifiers) {
        name = name.replace(modifierRE, '')
      }
      if (bindRE.test(name)) { // v-bind
        // ...
      } else if (onRE.test(name)) { // v-on
        // 处理事件监听
        // onRE = /^@|^v-on:/
        name = name.replace(onRE, '')
        addHandler(el, name, value, modifiers, false, warn)
      }
      // ...
    }
    // ...
  }
}

/**
 * 解析指令上的修饰符，比如 v-click.prevent，返回修饰符对象，比如：
 *
 * {
 *   prevent: true
 * }
 */
function parseModifiers (name: string): Object | void {
  // modifierRE = /\.[^.]+/g
  const match = name.match(modifierRE)
  if (match) {
    const ret = {}
    match.forEach(m => { ret[m.slice(1)] = true })
    return ret
  }
}
```

### addHandler

`addHandler`函数是将事件处理方法添加到 AST 元素的`el.nativeEvents/events`上，其主要步骤为：

1. （非生产环境下）对同时使用`prevent`和`passive`修饰符给出警告
2. 若使用到`capture`/`once`/`passive`修饰符，则将修饰符转换为符号，并加入到事件的`name`上
3. 对`click`事件进行特殊处理
    - 鼠标右键点击时，将事件名改为`contextmenu`
    - 鼠标中键点击时，将事件名改为`mouseup`
4. 区分出事件类别
    - `v-on`指令有`native`修饰符，说明是组件节点上的原生事件
    - 否则，说明是 DOM 元素节点上的事件，或者组件节点上的自定义事件
5. 将事件对象挂载到`el.nativeEvents/events`上
    - 若是组件节点上的原生事件，事件处理方法将挂载`el.nativeEvents`上
    - 否则，事件处理方法将挂载`el.events`上

```js
/**
 * 将事件添加到 el.nativeEvents/events 对象里
 *
 * @param {AST} el 元素
 * @param {String} name 事件名称，已去除 v-on/@ 和修饰符，比如 click
 * @param {String} value 事件处理方法，可以是
 *   - 方法名，比如：handleClick
 *   - 内联处理器中的方法，比如 handleClick('hello', $event)
 * @param {Object} modifiers 事件的修饰符，形如 { prevent: true, native, true }
 * @param {Boolean} important
 * @param {Function} warn 警告函数
 */
export function addHandler (
  el: ASTElement,
  name: string,
  value: string,
  // 修饰符对象
  modifiers: ?ASTModifiers,
  important?: boolean,
  warn?: Function
) {
  modifiers = modifiers || emptyObject
  // warn prevent and passive modifier
  /* istanbul ignore if */
  if (
    process.env.NODE_ENV !== 'production' && warn &&
    modifiers.prevent && modifiers.passive
  ) {
    warn(
      'passive and prevent can\'t be used together. ' +
      'Passive handler can\'t prevent default event.'
    )
  }

  // check capture modifier
  if (modifiers.capture) {
    // 事件是在捕获阶段触发
    delete modifiers.capture
    name = '!' + name // mark the event as captured
  }
  if (modifiers.once) {
    // 事件只触发一次
    delete modifiers.once
    name = '~' + name // mark the event as once
  }
  /* istanbul ignore if */
  if (modifiers.passive) {
    delete modifiers.passive
    name = '&' + name // mark the event as passive
  }

  // normalize click.right and click.middle since they don't actually fire
  // this is technically browser-specific, but at least for now browsers are
  // the only target envs that have right/middle clicks.
  // 标准化 click 事件
  if (name === 'click') {
    if (modifiers.right) {
      name = 'contextmenu'
      delete modifiers.right
    } else if (modifiers.middle) {
      name = 'mouseup'
    }
  }

  let events
  if (modifiers.native) {
    // 组件节点上的原生事件
    delete modifiers.native
    events = el.nativeEvents || (el.nativeEvents = {})
  } else {
    // DOM 元素节点上的事件、组件节点上的自定义事件
    events = el.events || (el.events = {})
  }

  const newHandler: any = {
    value: value.trim()
  }
  if (modifiers !== emptyObject) {
    newHandler.modifiers = modifiers
  }

  const handlers = events[name]
  /* istanbul ignore if */
  if (Array.isArray(handlers)) {
    important ? handlers.unshift(newHandler) : handlers.push(newHandler)
  } else if (handlers) {
    events[name] = important ? [newHandler, handlers] : [handlers, newHandler]
  } else {
    events[name] = newHandler
  }

  el.plain = false
}
```

经过`addHandler`的处理之后，父组件里的`ChildComponent`节点和子组件里的`.child-root`节点的 AST 里`nativeEvents`/`events`数据大概如下：

```js
// 父组件里的`ChildComponent`节点的 AST
ast = {
  // ...
  nativeEvents: {
    'child-custom-event': {
      value: 'handleChildCustomEvent'
      modifiers: undefined
    }
  },
  events: {
    click: {
      value: 'handleChildNativeClick('parent-param', $event)',
      modifiers: {
        native: true,
        prevent: true
      }
    }
  }
  // ...
}
```

```js
// 子组件里的`.child-root`节点的 AST
ast = {
  // ...
  events: {
    click: {
      value: 'handleClick',
      modifiers: undefined
    }
  }
  // ...
}
```

## generate 阶段

### genData

在生成代码阶段，将调用`genData`函数生成节点的数据对象，在其中调用`genHandlers`生成事件相关的代码。

```js
/**
 * 生成 createElement(name, data, children) 中的 data 数据对象（字符串形式）
 */
export function genData (el: ASTElement, state: CodegenState): string {
  let data = '{'
  // ...
  // event handlers
  if (el.events) {
    // 生成组件节点上的自定义事件、DOM 元素节点上的事件的代码
    data += `${genHandlers(el.events, false, state.warn)},`
  }
  if (el.nativeEvents) {
    // 生成组件节点上的原生事件的代码
    data += `${genHandlers(el.nativeEvents, true, state.warn)},`
  }
  // ...
  return data
}
```

### genHandlers

`genHandlers`函数里会调用`genHandler`生成节点最终的数据对象`data.nativeOn/on`的代码。

- 若是组件节点上的原生事件，最终生成的代码将挂载在`data.nativeOn`上
- 若是组件节点上的自定义事件/DOM 元素节点上的事件，将挂载在`data.on`上

```js
/**
 * 生成最终的 data.nativeOn/on 代码
 * @param {*} events el.nativeEvents/events
 * @param {*} isNative 是否是原生事件
 * @param {*} warn 警告函数
 */
export function genHandlers (
  events: ASTElementHandlers,
  isNative: boolean,
  warn: Function
): string {
  let res = isNative ? 'nativeOn:{' : 'on:{'
  for (const name in events) {
    res += `"${name}":${genHandler(name, events[name])},`
  }
  return res.slice(0, -1) + '}'
}
```

`genHandler`里生成代码的步骤为：

1. 若事件处理器不存在，则返回空函数
2. 针对同一事件存在多个处理器的情况，遍历每个事件处理器，递归调用`genHandler`处理，直接返回
3. 判断事件处理器是否是组件上的方法路径、是否是函数表达式
4. 根据是否存在修饰符对象，进行不同处理
    - 不存在修饰符对象
      - 若事件处理器是方法路径和函数表达式，则返回方法路径和函数表达式作为事件处理方法
      - 若事件处理器是内联 JavaScript 语句，则将其封装成函数返回
    - 存在修饰符对象
      - 针对每一个修饰符，匹配并生成修饰符对应的代码
      - 针对没匹配到修饰符，生成对象的代码，包括查找用户配置的自定义键位
      - 生成事件处理方法的函数体
        - 对于事件处理器是方法路径/函数表达式的情况，将函数体处理成函数调用的形式
        - 对于事件处理器是内联 JavaScript 语句的形式，将函数体即为该内联 JavaScript 语句
      - 将事件处理方法的函数体包裹一层，返回事件处理方法

```js
/**
 * 函数表达式
 * /
 *   ^(                 情况一：匹配箭头函数，param => { ... } 或 () => { ... }
 *     [\w$_]+|
 *     \([^)]*?\)
 *   )\s*=>|
 *   ^function\s*\(     情况二：匹配常规函数，function () { ... }
 * /
 */
const fnExpRE = /^([\w$_]+|\([^)]*?\))\s*=>|^function\s*\(/

/**
 * 组件方法的路径
 *
 * 可能有如下情况：
 * - 情况 1：方法，比如 abc
 * - 情况 2：对象方法，比如 abc.def
 * - 情况 3：对象方法，比如 abc['def']
 * - 情况 4：对象方法，比如 abc["def"]
 * - 情况 5：数组元素，比如 abc[2]
 * - 情况 6：对象方法，但是 key 为变量名，比如 abc[def]
 *
 * 其中，
 * 情况 1 里的 abc 方法可能来自于：
 *   - 组件选项对象 methods 选项里定义的方法
 *   - 组件选项对象 data 选项里定义的方法
 *   - 组件选项对象 props 选项里定义的方法，由父组件传入
 *   - 组件选项对象 computed 选项里定义的计算属性返回的方法
 *
 * 情况 2~6 里的对象 abc，可能来自于 data、props、computed 选项
 *
 * /^
 *   [A-Za-z_$][\w$]*         情况 1：变量名，以 [A-Za-z_$] 中任意一个单字字符开头，后面跟着任意个 \w 或 $，其中 \w 代表 [A-Za-z0-9_]
 *   (?:
 *     \.[A-Za-z_$][\w$]*|    情况 2
 *     \['[^']*?']|           情况 3
 *     \["[^"]*?"]|           情况 4
 *     \[\d+]|                情况 5
 *     \[[A-Za-z_$][\w$]*]    情况 6
 *   )*
 * $/
 */
const simplePathRE = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['[^']*?']|\["[^"]*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*$/

// KeyboardEvent.keyCode aliases
const keyCodes: { [key: string]: number | Array<number> } = {
  esc: 27,
  tab: 9,
  enter: 13,
  space: 32,
  up: 38,
  left: 37,
  right: 39,
  down: 40,
  'delete': [8, 46]
}

// KeyboardEvent.key aliases
const keyNames: { [key: string]: string | Array<string> } = {
  // #7880: IE11 and Edge use `Esc` for Escape key name.
  esc: ['Esc', 'Escape'],
  tab: 'Tab',
  enter: 'Enter',
  space: ' ',
  // #7806: IE11 uses key names without `Arrow` prefix for arrow keys.
  up: ['Up', 'ArrowUp'],
  left: ['Left', 'ArrowLeft'],
  right: ['Right', 'ArrowRight'],
  down: ['Down', 'ArrowDown'],
  'delete': ['Backspace', 'Delete']
}

// #4868: modifiers that prevent the execution of the listener
// need to explicitly return null so that we can determine whether to remove
// the listener for .once
const genGuard = condition => `if(${condition})return null;`

// 内置固定的修饰符及对应代码
const modifierCode: { [key: string]: string } = {
  stop: '$event.stopPropagation();',
  prevent: '$event.preventDefault();',
  self: genGuard(`$event.target !== $event.currentTarget`),
  ctrl: genGuard(`!$event.ctrlKey`),
  shift: genGuard(`!$event.shiftKey`),
  alt: genGuard(`!$event.altKey`),
  meta: genGuard(`!$event.metaKey`),
  left: genGuard(`'button' in $event && $event.button !== 0`),
  middle: genGuard(`'button' in $event && $event.button !== 1`),
  right: genGuard(`'button' in $event && $event.button !== 2`)
}

/**
 * 生成最终的事件处理方法，可能是方法路径、函数表达式
 * @param {*} name 事件名称
 * @param {*} handler 事件处理器，可以是方法路径、函数表达式、内联 JavaScript 语句
 */
function genHandler (
  name: string,
  handler: ASTElementHandler | Array<ASTElementHandler>
): string {
  if (!handler) {
    return 'function(){}'
  }

  if (Array.isArray(handler)) {
    return `[${handler.map(handler => genHandler(name, handler)).join(',')}]`
  }

  // 指令的表达式是父组件（可能是嵌套）的方法路径
  const isMethodPath = simplePathRE.test(handler.value)
  // 指令的表达式是函数表达式（箭头函数或常规函数定义）
  const isFunctionExpression = fnExpRE.test(handler.value)

  if (!handler.modifiers) {
    // 没有修饰符
    // PS: 组件节点上的自定义事件是没有任何修饰符的
    if (isMethodPath || isFunctionExpression) {
      // 针对指令的表达式是方法路径和函数表达式，直接返回 value
      return handler.value
    }
    /* istanbul ignore if */
    if (__WEEX__ && handler.params) {
      return genWeexHandler(handler.params, handler.value)
    }
    // 针对指令的表达式是内联 JavaScript 语句，要封装成函数表达式
    // 比如  v-click="handleClick('hello', $event)"
    return `function($event){${handler.value}}` // inline statement
  } else {
    // 有修饰符
    let code = ''
    let genModifierCode = ''
    const keys = []
    for (const key in handler.modifiers) {
      if (modifierCode[key]) {
        // 生成特定的修饰符的代码
        genModifierCode += modifierCode[key]
        // left/right
        // left/right 修饰符，需要再进行另外的处理
        if (keyCodes[key]) {
          keys.push(key)
        }
      } else if (key === 'exact') {
        // exact 修饰符：https://cn.vuejs.org/v2/guide/events.html#exact-%E4%BF%AE%E9%A5%B0%E7%AC%A6
        // 有且只有指定的修饰符，事件才会触发
        const modifiers: ASTModifiers = (handler.modifiers: any)
        genModifierCode += genGuard(
          ['ctrl', 'shift', 'alt', 'meta']
            .filter(keyModifier => !modifiers[keyModifier])
            .map(keyModifier => `$event.${keyModifier}Key`)
            .join('||')
        )
      } else {
        // 不在内置的修饰符名单里，且不是 exact 修饰符，统统推入数组里
        keys.push(key)
      }
    }
    // 针对没匹配到内置固定的修饰符或 left/right 修饰符，判断是否满足条件
    // 若非数字的修饰符，还需要在运行时检查是否匹配到自定义的键位
    if (keys.length) {
      code += genKeyFilter(keys)
    }
    // Make sure modifiers like prevent and stop get executed after key filtering
    if (genModifierCode) {
      code += genModifierCode
    }
    // 对于指令的表达式是方法路径/函数表达式的情况，处理成函数调用的形式
    // 对于指令的表达式是内联 JavaScript 语句的形式，直接返回该语句
    const handlerCode = isMethodPath
      ? `return ${handler.value}($event)`
      : isFunctionExpression
        ? `return (${handler.value})($event)`
        : handler.value
    /* istanbul ignore if */
    if (__WEEX__ && handler.params) {
      return genWeexHandler(handler.params, code + handlerCode)
    }
    return `function($event){${code}${handlerCode}}`
  }
}

function genKeyFilter (keys: Array<string>): string {
  return `if(!('button' in $event)&&${keys.map(genFilterCode).join('&&')})return null;`
}

function genFilterCode (key: string): string {
  const keyVal = parseInt(key, 10)
  if (keyVal) {
    // 数字修饰符
    return `$event.keyCode!==${keyVal}`
  }
  const keyCode = keyCodes[key]
  const keyName = keyNames[key]
  return (
    `_k($event.keyCode,` +
    `${JSON.stringify(key)},` +
    `${JSON.stringify(keyCode)},` +
    `$event.key,` +
    `${JSON.stringify(keyName)}` +
    `)`
  )
}
```

经过`genHandlers`的处理，父组件里的`ChildComponent`节点和子组件里的`.child-root`节点最终生成的数据对象大概如下：

```js
// 父组件里的`ChildComponent`节点的 render 函数
(function anonymous() {
    with (this) {
        return _c('div', {
            staticClass: "parent-root"
        }, [_c('ChildComponent', {
            // 数据对象里的 on/nativeOn
            on: {
                "child-custom-event": handleChildCustomEvent
            },
            nativeOn: {
                "click": function($event) {
                    $event.preventDefault();
                    handleChildNativeClick('parent-param', $event)
                }
            }
        })], 1)
    }
})
```

```js
// `.child-root`节点的 render 函数
(function anonymous() {
    with (this) {
        return _c('div', {
            staticClass: "child-root",
            // 数据对象里的 on
            on: {
                "click": handleClick
            }
        }, [_v("请点击这里")])
    }
})
```
