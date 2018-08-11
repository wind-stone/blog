import objectAssign from 'object-assign'

/**
 * 解析 url 查询字符串里的参数，返回查询参数对象
 * @param {String} givenUrl 给定的 url 或者 url 片段，形如 ?id=12345&a=b
 * @return {Object} 查询参数对象，形如 {a: '12345', b: 'tgd'}
 */
export function urlParse(givenUrl) {
  const url = givenUrl || window.location.search
  const reg = /[?&][^?&]+=[^?&]+/g
  const queries = url.match(reg)
  let queryHash = {}
  if (queries) {
    queries.forEach((query) => {
      let queryPair = query.substring(1).split('=')
      let queryKey = decodeURIComponent(queryPair[0])
      let queryVal = decodeURIComponent(queryPair[1])
      queryHash[queryKey] = queryVal
    })
  }
  return queryHash
}

/**
 * 给原始 url 添加新的查询参数，返回新 url
 * @param {String} url 原始的 url
 * @param {Object} params 新增的查询参数对象
 * @return {String} 新 url
 */
export function getNewUrlWithGivenParams(url, params) {
  if (!params) {
    return url
  }

  // 获取 hash
  const hashMarkIndex = url.indexOf('#')
  let hash, originAndPath
  if (hashMarkIndex > -1) {
    hash = url.slice(hashMarkIndex)
    originAndPath = url.slice(0, hashMarkIndex)
  } else {
    hash = ''
    originAndPath = url
  }

  // 最终查询串对象
  const finalQuery = {}

  // 获取旧 query，并复制到 finalQuery
  const questionMarkIndex = originAndPath.indexOf('?')
  if (questionMarkIndex > -1) {
    let search = originAndPath.slice(questionMarkIndex)
    originAndPath = originAndPath.slice(0, questionMarkIndex)
    const oldParams = urlParse(search)
    objectAssign(finalQuery, oldParams)
  }

  // 将新增 params 复制到 finalQuery
  objectAssign(finalQuery, params)

  return originAndPath + '?' + urlParams(finalQuery) + hash
}

/**
 * 转换 查询参数对象 为 query string 的形式（不带 ？）
 * @param {Object} queryHash
 * @param {Boolean} ifEncode 可选，是否需要 encodeURIComponent 编码
 * @return {String} 查询字符串 query string
 */
export function urlParams(queryHash, ifEncode) {
  let queryString = ''

  let handleQueryValue = (function(ifEncode) {
    if (ifEncode === false) {
      return function(value) {
        return value
      }
    }
    return function(value) {
      return encodeURIComponent(value)
    }
  })(ifEncode)

  if (Object.prototype.toString.call(queryHash) === '[object Object]') {
    for (let key in queryHash) {
      if (queryHash.hasOwnProperty(key)) {
        let value = queryHash[key] || ''
        queryString += '&' + key + '=' + handleQueryValue(value)
      }
    }
  }
  return queryString ? queryString.substring(1) : ''
}
