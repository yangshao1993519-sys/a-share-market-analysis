/**
 * API 模块 - 统一请求封装
 */
const api = (() => {
  const BASE = '';

  async function request(method, path, body) {
    const headers = { 'Content-Type': 'application/json' };
    const token = Auth.getToken();
    if (token) {
      headers['Authorization'] = 'Bearer ' + token;
    }

    const opts = { method, headers };
    if (body && (method === 'POST' || method === 'DELETE' || method === 'PUT' || method === 'PATCH')) {
      opts.body = JSON.stringify(body);
    }

    try {
      const resp = await fetch(BASE + path, opts);
      const data = await resp.json().catch(() => ({}));

      if (resp.status === 401) {
        Auth.clearToken();
        const current = encodeURIComponent(window.location.pathname + window.location.search);
        window.location.href = '/login.html?redirect=' + current;
        throw new Error('登录已过期，请重新登录');
      }

      return data;
    } catch (err) {
      if (typeof showToast === 'function' && err.message !== '登录已过期，请重新登录') {
        showToast(err.message || '网络错误', 'error');
      }
      throw err;
    }
  }

  function get(path) {
    return request('GET', path);
  }

  function post(path, body) {
    return request('POST', path, body || {});
  }

  function del(path, body) {
    return request('DELETE', path, body || {});
  }

  return { request, get, post, delete: del };
})();