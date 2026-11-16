import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const requiresCustomer = createRouteMatcher(['/admin(.*)', '/checkout(.*)', '/auth/continue(.*)', '/account(.*)']);
export default clerkMiddleware(async (auth, request) => {
  if (request.nextUrl.pathname === '/account/sign-in' || request.nextUrl.pathname === '/account/sign-up') return;
  if (requiresCustomer(request)) await auth.protect();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
