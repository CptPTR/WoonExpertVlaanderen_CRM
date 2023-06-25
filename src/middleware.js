import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

export const middleware = async (req) => {
  const supabase = createMiddlewareClient({ req, res: NextResponse.next() });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
};

export const config = {
  matcher: ["/keuringen", "/keuringen/nieuw", "/keuringen/:id*"],
};
