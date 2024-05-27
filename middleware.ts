import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const publicRoutes = [
  "/",
  "/api/webhook",
  "/question/:id",
  "/tags",
  "/tags/:id",
  "/profile/:id",
  "/community",
  "/jobs",
];

const isProtectedRoute = createRouteMatcher(["/ask-question"]);
const isPublicRoute = createRouteMatcher(publicRoutes);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req) && !isPublicRoute(req)) {
    auth().protect();
  }
});

export const config = {
  matcher: [
    "/((?!.*\\..*|_next|api/webhook|api/chatgpt).*)", // Ignore static files, _next, api/webhook, and api/chatgpt
    "/",
    "/(api|trpc)(.*)",
  ],
};
