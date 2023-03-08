/* eslint-disable no-console */
/* eslint-disable consistent-return */
import { stringify } from 'query-string'
import Axios from '@/configs/Axios'
import { DEBUG } from '@/constants'
import axios from 'axios'

function buildURL(url, query) {
  let _url = url
  if (query) {
    _url += /\?/.test(url) ? '&' : '?'
    if (typeof query === 'object') {
      _url += stringify(query)
    } else {
      _url += query
    }
  }
  return _url
}

// eslint-disable-next-line consistent-return
async function request({ method = 'get', url, query, params, success, failure, headers }) {
  const axiosMethod = Axios[method]
  if (typeof axiosMethod === 'function') {
    try {
      const result =
        method === 'get'
          ? await axiosMethod(buildURL(url, query), { headers })
          : await axiosMethod(buildURL(url, query), params, { headers })

      if (result.status === 200 || result.status === 201) {
        if (typeof success === 'function') {
          return success(result.data)
        }
        return result
      }
      throw result
    } catch (err) {
      if (typeof failure === 'function') {
        return failure({ message: err?.message })
      }
    }
  }
}
async function fetch({ method = 'get', url, query, params, headers, moreOptions = {} }) {
  const axiosMethod = Axios[method]
  if (typeof axiosMethod === 'function') {
    try {
      const response =
        method === `get` || method === `delete`
          ? await axiosMethod(buildURL(url, query), { headers, ...moreOptions })
          : await axiosMethod(buildURL(url, query), params, { headers, ...moreOptions })


      if (response.status === 200 || response.status === 201) {
        return response?.data
      }
      throw new Error(JSON.stringify(response))
    } catch (err) {
      if (err.response?.status === 401) {
        if (DEBUG) {
        }
        const errorMessage = err.response?.data.message
        if (errorMessage === 'UNAUTHORIZED') {
          if (typeof window !== 'undefined') {
            localStorage.clear()
            ;(async () => {
              await axios.post('/api/logout')
            })()
            window.location.replace('/login')
          }
        }
      } else if (err?.response?.data) {
        if (err?.response?.data?.message) throw new Error(err?.response?.data?.message || 'Error')
      } else {
        const result = err?.toJSON?.()
      }
      return err?.response?.data
    }
  }
}

export { buildURL, request, fetch }
