
# props 检验
- 即使在 require = true 时，仍然可以添加 default 函数
- 如果 type 类型为其他类型（除了null，undefined，空字符串之外，见下一条）即校验type错误时，vue在控制台报错
- 当校验的值为 null, undefined 时，default 函数会用上