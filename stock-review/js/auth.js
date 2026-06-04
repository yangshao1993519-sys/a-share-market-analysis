/**
 * Auth 模块 - Token管理、登录状态检查
 */
const Auth = (() => {
  const TOKEN_KEY = 'stock_review_token';

  function getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  function setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  function clearToken() {
    localStorage.removeItem(TOKEN_KEY);
  }

  function isLoggedIn() {
    const token = getToken();
    if (!token) return false;
    try {
      const payload = parsePayload(token);
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        clearToken();
        return false;
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  function parsePayload(token) {
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Invalid token');
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  }

  function getUser() {
    const token = getToken();
    if (!token) return null;
    try {
      return parsePayload(token);
    } catch (e) {
      return null;
    }
  }

  function requireLogin() {
    if (!isLoggedIn()) {
      const current = encodeURIComponent(window.location.pathname + window.location.search);
      window.location.href = '/login.html?redirect=' + current;
      return false;
    }
    return true;
  }

  function requireAdmin() {
    if (!requireLogin()) return false;
    const user = getUser();
    if (user && user.role !== 'admin') {
      if (typeof showToast === 'function') {
        showToast('此操作仅限管理员', 'error');
      }
      return false;
    }
    return true;
  }

  function logout() {
    clearToken();
    window.location.href = '/';
  }

  return { getToken, setToken, clearToken, isLoggedIn, getUser, requireLogin, requireAdmin, logout };
})();