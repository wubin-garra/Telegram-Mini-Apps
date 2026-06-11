import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    stage: "skeleton",
    items: [],
    nextStep: "Back this route with a database and game session model.",
  });
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => ({}));

  return NextResponse.json({
    ok: false,
    stage: "skeleton",
    message: "Score writes are not connected yet.",
    payload,
  });
}
