export const config = { runtime: "edge" };

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const u = (searchParams.get("u") || "").replace(/^@/, "").trim();
  if (!u) {
    return new Response("Missing u", {
      status: 400,
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  }
  const upstream = `https://unavatar.io/instagram/${encodeURIComponent(u)}?fallback=false`;
  const resp = await fetch(upstream, { redirect: "follow" });
  if (!resp.ok) {
    return new Response("Avatar not found", {
      status: 404,
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  }
  const h = new Headers(resp.headers);
  h.set("Access-Control-Allow-Origin", "*");
  h.set("Cache-Control", "public, max-age=86400");
  h.delete("content-security-policy");
  return new Response(resp.body, { status: 200, headers: h });
}
