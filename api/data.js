import Redis from "ioredis";

const KEY = "spending-plan";

let client = null;
function getClient() {
  if (!process.env.REDIS_URL) {
    throw new Error("REDIS_URL env var is not set");
  }
  if (!client) {
    client = new Redis(process.env.REDIS_URL, {
      lazyConnect: true,
      maxRetriesPerRequest: 2,
      enableReadyCheck: false,
    });
  }
  return client;
}

export default async function handler(req, res) {
  try {
    const redis = getClient();
    if (req.method === "GET") {
      const raw = await redis.get(KEY);
      return res.status(200).json(raw ? JSON.parse(raw) : null);
    }
    if (req.method === "POST") {
      await redis.set(KEY, JSON.stringify(req.body));
      return res.status(200).json({ ok: true });
    }
    res.status(405).end();
  } catch (err) {
    console.error("[api/data]", err?.message ?? err);
    res.status(500).json({ error: err?.message ?? "Internal error" });
  }
}
