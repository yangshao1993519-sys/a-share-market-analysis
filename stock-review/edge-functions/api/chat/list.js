/**
 * 留言列表 - 时间倒序，分页
 */
export default async function(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const pageSize = parseInt(url.searchParams.get('page_size') || '20');

  const kv = env.STOCK_REVIEW_KV;

  const allKeys = await kv.list({ prefix: 'chat:' });

  let items = [];
  if (allKeys && allKeys.keys) {
    for (const k of allKeys.keys) {
      const raw = await kv.get(k.name);
      if (raw) {
        try {
          const item = JSON.parse(raw);
          items.push({
            id: item.id || k.name.replace('chat:', ''),
            username: item.username || '匿名',
            content: item.content || '',
            time: item.time || ''
          });
        } catch (e) {}
      }
    }
  }

  // 时间倒序（按 id 倒序，因为 id 是时间戳）
  items.sort((a, b) => String(b.id).localeCompare(String(a.id)));

  const total = items.length;
  const start = (page - 1) * pageSize;
  const paged = items.slice(start, start + pageSize);

  return json({
    code: 0,
    data: { list: paged, total, page, page_size: pageSize }
  });
}

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { 'Content-Type': 'application/json;charset=utf-8' }
  });
}