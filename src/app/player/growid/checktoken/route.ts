import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { refreshToken } = await req.json();

  if (!refreshToken) {
    return NextResponse.json(
      { status: "error", message: "Missing token" },
      { status: 401 }
    );
  }

  return NextResponse.json(
    {
      status: "success",
      message: "Account Validated.",
      token: refreshToken,
      url: "",
      accountType: "growtopia",
    },
    { status: 200 }
  );
}