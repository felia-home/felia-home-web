// middleware.ts
export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/members/mypage/:path*",
    "/members/favorites/:path*",
    "/members/inquiries/:path*",
    "/private-selection/:path*",
  ],
};
