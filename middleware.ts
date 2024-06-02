import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define protected and public routes
const publicRoutes = [
  "/",
  "/api/webhook", // Ensure webhook route is public
  "/question/:id",
  "/tags",
  "/tags/:id",
  "/profile/:id",
  "/community",
  "/jobs",
];

// Matchers for protected routes
const isProtectedRoute = createRouteMatcher(["/ask-question", "/collection"]);
const isPublicRoute = createRouteMatcher(publicRoutes);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req) && !isPublicRoute(req)) {
    auth().protect();
  }
});

// Configuring matcher to ignore static files, _next, and specific API routes
export const config = {
  matcher: [
    "/((?!.*\\..*|_next|api/webhook|api/chatgpt).*)", // Exclude static files, _next, api/webhook, and api/chatgpt
    "/",
    "/(api|trpc)(.*)",
  ],
};
