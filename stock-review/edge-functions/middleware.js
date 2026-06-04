/**
 * 全局鉴权中间件 - 路由分发 + JWT 验证 + 权限控制
 */

// 路由权限配置
const ROUTE_CONFIG = {
  '/api/auth/register':      { auth: false },
  '/api/auth/login':         { auth: false },
  '/api/auth/forgot-question': { auth: false },
  '/api/auth/forgot-reset':  { auth: false },
  '/api/market/today':       { auth: false },
  '/api/chat/list':          { auth: false },
  '/api/chat/write':         { auth: true },
  '/api/chat/delete':        { auth: true, role: 'admin' },
  '/api/daily/list':         { auth: false },
  '/api/daily/detail':       { auth: false },
  '/api/weekly/list':        { auth: false },
  '/api/weekly/detail':      { auth: false },
  '/api/thoughts/list':      { auth: true },
  '/api/thoughts/detail':    { auth: true },
  '/api/admin/init-data':    { auth: true, role: 'admin' },
};

async function verifyJWT(token, secret) {
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  );

  const headerPayload = parts[0] + '.' + parts[1];
  const signature = base64UrlDecode(parts[2]);

  const valid = await crypto.subtle.verify(
    'HMAC',
    key,
    signature,
    encoder.encode(headerPayload)
  );

  if (!valid) return null;

  const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
  if (payload.exp && payload.exp * 1000 < Date.now()) return null;
  return payload;
}

function base64UrlDecode(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  return Uint8Array.from(atob(str), c => c.charCodeAt(0));
}

async function jsonResponse(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { 'Content-Type': 'application/json;charset=utf-8' }
  });
}

export default async function(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname;

  // 路由匹配
  const routeCfg = ROUTE_CONFIG[path];

  if (routeCfg) {
    // 需要认证
    if (routeCfg.auth) {
      const authHeader = request.headers.get('Authorization') || '';
      const tokenMatch = authHeader.match(/^Bearer\s+(.+)$/i);
      if (!tokenMatch) {
        return jsonResponse({ code: 401, msg: '请先登录' }, 401);
      }

      const payload = await verifyJWT(tokenMatch[1], env.JWT_SECRET || 'default-secret-change-me');
      if (!payload) {
        return jsonResponse({ code: 401, msg: '登录已过期，请重新登录' }, 401);
      }

      // 角色检查
      if (routeCfg.role && payload.role !== routeCfg.role) {
        return jsonResponse({ code: 403, msg: '权限不足' }, 403);
      }

      // 注入用户信息到环境
      env.user = payload;
    }

    // 分发到具体处理器
    const moduleName = path.replace('/api/', '').replace(/\//g, '_');
    try {
      // Edge Functions 静态导入
      let handler;
      switch (path) {
        case '/api/auth/register':
          handler = (await import('./api/auth/register.js')).default;
          break;
        case '/api/auth/login':
          handler = (await import('./api/auth/login.js')).default;
          break;
        case '/api/auth/forgot-question':
          handler = (await import('./api/auth/forgot-question.js')).default;
          break;
        case '/api/auth/forgot-reset':
          handler = (await import('./api/auth/forgot-reset.js')).default;
          break;
        case '/api/market/today':
          handler = (await import('./api/market/today.js')).default;
          break;
        case '/api/daily/list':
          handler = (await import('./api/daily/list.js')).default;
          break;
        case '/api/daily/detail':
          handler = (await import('./api/daily/detail.js')).default;
          break;
        case '/api/weekly/list':
          handler = (await import('./api/weekly/list.js')).default;
          break;
        case '/api/weekly/detail':
          handler = (await import('./api/weekly/detail.js')).default;
          break;
        case '/api/thoughts/list':
          handler = (await import('./api/thoughts/list.js')).default;
          break;
        case '/api/thoughts/detail':
          handler = (await import('./api/thoughts/detail.js')).default;
          break;
        case '/api/chat/list':
          handler = (await import('./api/chat/list.js')).default;
          break;
        case '/api/chat/write':
          handler = (await import('./api/chat/write.js')).default;
          break;
        case '/api/chat/delete':
          handler = (await import('./api/chat/delete.js')).default;
          break;
        case '/api/admin/init-data':
          handler = (await import('./api/admin/init-data.js')).default;
          break;
        default:
          handler = null;
      }

      if (handler) {
        return handler(context);
      }
    } catch (err) {
      return jsonResponse({ code: 500, msg: '服务器内部错误: ' + err.message }, 500);
    }
  }

  return jsonResponse({ code: 404, msg: '接口不存在' }, 404);
}