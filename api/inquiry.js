import { put } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const body = req.body;

    if (!body || !body.managerName || !body.phone || !body.orgName) {
      res.status(400).json({ error: '필수 항목이 누락되었습니다.' });
      return;
    }

    const filename = `inquiries/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.json`;

    await put(filename, JSON.stringify(body), {
      access: 'public',
      contentType: 'application/json',
    });

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
}
