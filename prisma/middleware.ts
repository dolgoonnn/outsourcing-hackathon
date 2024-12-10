import withAuth from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/",
    error: "/",
    // newUser: '/signup',
  },
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - static (static files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|static|favicon.ico|.*\\..*|_next).*)",
  ],
};
