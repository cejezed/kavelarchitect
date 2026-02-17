export async function GET() {
  return Response.json({
    ok: true,
    service: "kavelarchitect-nextjs",
    ts: Date.now(),
  });
}
