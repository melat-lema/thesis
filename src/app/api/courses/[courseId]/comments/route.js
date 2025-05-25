export async function GET(req, { params }) {
  // TODO: Replace with actual comment fetching logic
  return new Response(JSON.stringify([]), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
