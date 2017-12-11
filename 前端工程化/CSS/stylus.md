### 属性值里拼接参数

#### iPhone X 适配

core.styl
```
safe-area-fn(fn, position)
  s('%s(safe-area-inset-%s)', fn, position)

functions = constant env
safe-area-mixin(property, position, important = false)
  for fn in functions
    {property} safe-area-fn(fn, position) important == true ? !important : unquote('')
```

index.styl
```
@import "./core"
.safe-area-pb
  safe-area-mixin(padding-bottom, bottom, true)
```

兼容 iOS 11.1 的 constant 和 iOS 11.2 的 env
