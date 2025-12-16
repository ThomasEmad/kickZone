/**
 * Environment Configuration
 * استخدم هذا الملف للوصول إلى المتغيرات البيئية
 */

const config = {
  // API
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  appName: process.env.NEXT_PUBLIC_APP_NAME || "KickZone",

  // Clerk
  clerkPublishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  clerkSecretKey: process.env.CLERK_SECRET_KEY,

  // Environment
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
  isDebug: process.env.DEBUG === "true",
};

export default config;
