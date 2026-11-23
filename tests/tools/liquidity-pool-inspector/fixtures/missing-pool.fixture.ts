export const MISSING_POOL_ID = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";

export function missingPoolResponse(): Response {
  return new Response(JSON.stringify({ type: "https://stellar.org/horizon-errors/not_found", title: "Resource Missing", status: 404 }), {
    status: 404,
    headers: { "Content-Type": "application/problem+json" }
  });
}

export function rateLimitedPoolResponse(): Response {
  return new Response("Too Many Requests", { status: 429 });
}

export function serverErrorPoolResponse(): Response {
  return new Response("Internal Server Error", { status: 500 });
}
