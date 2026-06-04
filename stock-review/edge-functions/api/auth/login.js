/**
 * 登录接口 - 返回 JWT (7天有效)
 */
export default async function(context) {
  const { request, env } = context;

  if (request.method !== 'POST') {
    return json({ code: 405, msg: '仅支持POST' }, 405);
  }

  let body;
  try { body = await request.json(); } catch (e) {
    return json({ code: 400, msg: '请求格式错误' });
  }

  const { username, password } = body;
  if (!username || !password) {
    return json({ code: 400, msg: '请输入用户名和密码' });
  }

  const kv = env.STOCK_REVIEW_KV;
  const userRaw = await kv.get('user:' + username);
  if (!userRaw) {
    return json({ code: 400, msg: '用户名或密码错误' });
  }

  const user = JSON.parse(userRaw);
  const pwHash = await sha256(password);

  if (pwHash !== user.password) {
    return json({ code: 400, msg: '用户名或密码错误' });
  }

  // 签发 JWT
  const secret = env.JWT_SECRET || 'default-secret-change-me';
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    username: user.username,
    role: user.role,
    iat: now,
    exp: now + 7 * 24 * 3600 // 7天
  };

  const token = await signJWT(payload, secret);

  return json({
    code: 0,
    data: {
      token,
      username: user.username,
      role: user.role
    },
    msg: '登录成功'
  });
}

async function sha256(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

async function signJWT(payload, secret) {
  const encoder = new TextEncoder();
  const header = { alg: 'HS256', typ: 'JWT' };
  const headerB64 = base64UrlEncode(JSON.stringify(header));
  const payloadB64 = base64UrlEncode(JSON.stringify(payload));
  const headerPayload = headerB64 + '.' + payloadB64;

  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(headerPayload)
  );

  const sigB64 = base64UrlEncodeRaw(new Uint8Array(signature));
  return headerPayload + '.' + sigB64;
}

function base64UrlEncode(str) {
  return btoa(unescape(encodeURIComponent(str)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function base64UrlEncodeRaw(bytes) {
  let binary = '';
  bytes.forEach(b => binary += String.fromCharCode(b));
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { 'Content-Type': 'application/json;charset=utf-8' }
  });
}