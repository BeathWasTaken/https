import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.text();
  const params = new URLSearchParams(body);

  console.log("Request body:", body);
  console.log("Refresh token:", params.get("refreshToken"));

  return new NextResponse(
    JSON.stringify({
      status: "success",
      message: "Account Validated.",
      token: params.get("refreshToken") || "",
      url: "",
      accountType: "growtopia",
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "text/html",
      },
    }
  );
}
