import { MockMethod, MockConfig } from 'vite-plugin-mock'
console.log('+++ a.ts')
export default [
  {
    url: '/api/a',
    method: 'get',
    response: ({ query }) => {
      return {
        result: 1,
        data: {
          name: 'vben',
        },
      }
    },
  },
  {
    url: '/api/b',
    method: 'post',
    timeout: 2000,
    response: {
      result: 0,
      error_msg: '/api/b 网络错误，请稍微再试',
      data: {
        name: 'vben',
      },
    },
  },
  {
    url: '/api/c',
    method: 'post',
    rawResponse: async (req, res) => {
      let reqbody = ''
      await new Promise((resolve) => {
        req.on('data', (chunk) => {
          reqbody += chunk
        })
        req.on('end', () => resolve(undefined))
      })
      res.setHeader('Content-Type', 'text/plain')
      res.statusCode = 200
      res.end(`hello, ${reqbody}`)
    },
  },
] as MockMethod[]
