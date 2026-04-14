// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// トークンがある場合は認証チェックをスキップ
export default withAuth(
  function middleware(req: NextRequest) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const pathname = req.nextUrl.pathname;

        // /private-selection はトークンがあれば認証不要
        if (pathname.startsWith("/private-selection")) {
          const searchToken = req.nextUrl.searchParams.get("token");
          const cookieToken = req.cookies.get("ps_token")?.value;
          if (searchToken || cookieToken) return true;
          return !!token;
        }

        // それ以外の保護ルートはログイン必須
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    "/members/mypage/:path*",
    "/members/favorites/:path*",
    "/members/inquiries/:path*",
    "/members/profile/:path*",
    "/members/profile",
    "/private-selection/:path*",
  ],
};
