/**
 * 留言列表（支持无 KV 降级）
 */
const DEMO_POSTS = [
  { id: '1', username: 'admin', content: '欢迎来到Stock Review复盘交流区！这里是大家交流交易心得的地方。', time: '2026-06-03 21:00' },
  { id: '2', username: 'admin', content: '今日市场三连阳修复，光通信板块爆发。大家怎么看后续走势？', time: '2026-06-03 21:05' }
];

export default async function(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const pageSize = 20;
  let allPosts = [];

  try {
    const kv = env.STOCK_REVIEW_KV;
    if (kv) {
      const keys = await kv.list({ prefix: 'chat:' });
      if (keys && keys.keys) {
        for (const k of keys.keys) {
          const raw = await kv.get(k.name);
          if (raw) allPosts.push(JSON.parse(raw));
        }
      }
    }
  } catch(e) { /* KV not available */ }

  if (allPosts.length === 0) {
    allPosts = DEMO_POSTS;
  }

  allPosts.sort((a, b) => b.time.localeCompare(a.time));
  const total = allPosts.length;
  const start = (page - 1) * pageSize;
  const list = allPosts.slice(start, start + pageSize);

  return json({ code: 0, data: { list, total, page, pageSize, hasMore: start + pageSize < total } });
}

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { 'Content-Type': 'application/json;charset=utf-8' }
  });
}
