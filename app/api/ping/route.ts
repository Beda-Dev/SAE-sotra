export async function HEAD() {
  console.log("🔌 [API] HEAD /api/ping - Vérification de connectivité")
  return new Response(null, { status: 200 })
}

export async function GET() {
  console.log("🔌 [API] GET /api/ping - Vérification de connectivité")
  return new Response("ok", { status: 200 })
}