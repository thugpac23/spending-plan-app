import { kv } from "@vercel/kv";

const KEY = "spending-plan";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const data = await kv.get(KEY);
      return res.status(200).json(data ?? null);
    }
    if (req.method === "POST") {
      await kv.set(KEY, req.body);
      return res.status(200).json({ ok: true });
    }
    res.status(405).end();
  } catch (err) {
    console.error("[api/data]", err?.message ?? err);
    res.status(500).json({ error: err?.message ?? "Internal error" });
  }
}
