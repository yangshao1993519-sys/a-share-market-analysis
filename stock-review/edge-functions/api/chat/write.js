/**
 * 发表留言 - 需登录 + 敏感词过滤
 */

const SENSITIVE_WORDS = [
  '傻逼', '操你妈', '妈的', '草泥马', '煞笔', '脑残', '白痴', '弱智',
  '废物', '垃圾人', '狗日的', '他妈的', '滚蛋', '去死', '贱人', '婊子',
  '蠢货', '笨蛋', '龟儿子', '日你妈', '你妈的', '操蛋', '靠', '草',
  '狗屎', '屁话', '放屁', '王八蛋', '畜生', '渣滓', '烂货', '该死的',
  '见鬼', '混账', '饭桶', '蠢猪', '二货', '坑爹', '掉毛', '死全家'
];

// 构建正则
const buildRegex = () => {
  const escaped = SENSITIVE_WORDS.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  return new RegExp(escaped.join('|'), 'i');
};

const sensitiveRegex = buildRegex();

export default async function(context) {
  const { request, env } = context;

  if (request.method !== 'POST') {
    return json({ code: 405, msg: '仅支持POST' }, 405);
  }

  let body;
  try { body = await request.json(); } catch (e) {
    return json({ code: 400, msg: '请求格式错误' });
  }

  const user = env.user;
  if (!user) {
    return json({ code: 401, msg: '请先登录' }, 401);
  }

  const { content } = body;
  if (!content || !content.trim()) {
    return json({ code: 400, msg: '内容不能为空' });
  }

  if (content.length > 2000) {
    return json({ code: 400, msg: '内容超过2000字限制' });
  }

  // 敏感词过滤
  if (sensitiveRegex.test(content)) {
    return json({ code: 400, msg: '内容包含敏感词汇，请修改后重试' });
  }

  const kv = env.STOCK_REVIEW_KV;
  const id = Date.now().toString();
  const comment = {
    id,
    username: user.username,
    content: content.trim(),
    time: formatTime(new Date())
  };

  await kv.put('chat:' + id, JSON.stringify(comment));

  return json({
    code: 0,
    data: { id, username: user.username, time: comment.time },
    msg: '发表成功'
  });
}

function formatTime(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return y + '-' + m + '-' + d + ' ' + h + ':' + min;
}

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { 'Content-Type': 'application/json;charset=utf-8' }
  });
}