// Clerk → Convex auth. Set CLERK_JWT_ISSUER_DOMAIN in the Convex dashboard
// (Project Settings → Environment Variables) to your Clerk Frontend API URL.
export default {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN,
      applicationID: "convex",
    },
  ],
};
