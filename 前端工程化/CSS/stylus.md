### 属性值里拼接参数

#### iPhone X 适配

core.styl
```
/*
 * 核心函数
 */
safe-area(position)
  s('constant(safe-area-inset-%s)', position)
  // 或者 'constant(safe-area-inset-%s)' % position
  // 或者 unquote( 'constant(safe-area-inset-' + position + ')')

/*
 * mixins
 */
safe-area-mixins(property, position, important = false)
  {property} safe-area(position) important == true ? unquote('!important') : unquote('')
```

index.styl
```
@import "./core"
.safe-area-pb
  safe-area-mixins(padding-bottom, bottom, true)
```

