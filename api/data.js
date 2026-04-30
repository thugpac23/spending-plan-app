import Redis from "ioredis";

const KEY = "spending-plan";
const client = new Redis(process.env.REDIS_URL);

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const raw = await client.get(KEY);
      return res.status(200).json(raw ? JSON.parse(raw) : null);
    }
    if (req.method === "POST") {
      await client.set(KEY, JSON.stringify(req.body));
      return res.status(200).json({ ok: true });
    }
    res.status(405).end();
  } catch (err) {
    console.error("[api/data]", err?.message ?? err);
    res.status(500).json({ error: err?.message ?? "Internal error" });
  }
}
