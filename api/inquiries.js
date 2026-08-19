import { list } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const password = req.headers['x-admin-password'];

  if (!process.env.ADMIN_PASSWORD) {
    res.status(500).json({ error: '관리자 비밀번호가 서버에 설정되지 않았습니다.' });
    return;
  }

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    res.status(401).json({ error: '비밀번호가 올바르지 않습니다.' });
    return;
  }

  try {
    const { blobs } = await list({ prefix: 'inquiries/' });

    const items = await Promise.all(
      blobs.map(async (b) => {
        const r = await fetch(b.url);
        const data = await r.json();
        return { ...data, uploadedAt: b.uploadedAt };
      })
    );

    items.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

    res.status(200).json({ items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
}
