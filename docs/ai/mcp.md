# MCP

## 疑问

- MCP 工具注册好之后，大模型如何知道在何时调用这些工具？

由 MCP Client 将用户输入和 MCP Server 的信息发送给大模型，大模型推理并选出能够解决用户问题的最合适的 MCP Server 和 MCP Tool，返回给 MCP Client 并由其发起调用。

Q：MCP Client 是把所有的 MCP Server 的信息发送给大模型吗？还是只发送自己对应的 MCP Server ？

- MCP Server 可以部署在本地？prompt-server 就是在本地部署的？
